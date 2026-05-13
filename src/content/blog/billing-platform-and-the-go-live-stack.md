---
title: "Stripe, Sentry, Turnstile — the go-live stack we wired in two weeks"
description: "Stripe billing, full Sentry observability with source maps, Cloudflare Turnstile bot protection. The unglamorous infrastructure that makes a SaaS launchable."
author: michael
publishDate: 2026-05-04
pillar: commentary
tags: ["Stripe", "Sentry", "Turnstile", "observability", "build log", "GTM"]
readingMinutes: 8
draft: false
featured: false
faq:
  - q: "Why does the platform need its own billing system if it has a billable events ledger for clients?"
    a: "Two completely separate things. The billable events ledger is how 3PL operators bill their clients for warehouse work. The platform billing system is how Deliver WMS bills the operators for their subscription to the platform. Different schemas, different flows, different invoice formats."
  - q: "Are the Stripe integrations live in production?"
    a: "Stripe webhook handling, subscription dialog, tenant billing status, and the dunning emails are all wired and tested in test mode. The production switchover (live API keys, live webhook signing secret, real customer charges) ships when the first paying customer is ready to onboard. Until then, test-mode events flow through the same code paths as production will."
  - q: "Why instrument with Sentry pre-launch?"
    a: "Because the alternative is finding out a critical bug exists from a customer email instead of a Sentry alert. Bounce-path observability and source-mapped stack traces are 100x more valuable when something goes wrong than they are after the fact. Cheaper to wire when there's no traffic than when there is."
  - q: "Cloudflare Turnstile vs reCAPTCHA?"
    a: "Turnstile because it's privacy-preserving (no cross-site tracking), works without third-party cookies, and degrades gracefully. Same product, less surveillance footprint. Wired on the signup form and the sales lead form."
---

There's a category of work that doesn't show up in product demos but determines whether a SaaS can actually serve customers. Billing infrastructure that handles failures gracefully. Observability that surfaces bugs before customers email about them. Bot protection that works without breaking real users. Source-mapped stack traces so a 3 AM error tells you what file and line broke.

We landed all of that across about two weeks of focused work in late April and early May. None of it is the glamour reel. All of it is the difference between a platform that's launchable and one that isn't.

## Platform-to-tenant billing through Stripe

The billable events ledger I wrote about in the foundation post handles how 3PL operators bill their own clients. This is the other side: how Deliver WMS bills the operators for their subscription. Two completely different systems. Different schemas, different flows, different invoice templates.

The platform billing chunk landed across the back half of April. The shape:

A **`tenants.billing_status`** field that mirrors Stripe-conventional values: `active`, `incomplete`, `past_due`, `canceled`. New tenants on a paid plan land in `incomplete` until their first payment confirms — Stripe-conventional, no migration drama.

A **`subscription-dialog.tsx`** screen that lets a tenant owner enter card details, switch plans, view invoices, and cancel. Plan switches are pro-rated through Stripe's standard subscription mechanics; cancellations take effect at the end of the current billing cycle.

A **Stripe webhook handler** that listens for `invoice.paid`, `invoice.payment_failed`, `customer.subscription.updated`, `customer.subscription.deleted`, and a handful of related events. Webhook signing verified on every request. Idempotent on Stripe event ID — if Stripe re-sends an event (which they do, by design, on transient failures), we don't double-process it.

A **dunning flow** for failed payments. Three retries on a Stripe-default schedule, then the tenant's `billing_status` flips to `past_due` and the dashboard shows a payment-required banner. After a grace period, the account moves to `canceled` and read-only mode.

A **`platform_invoices`** table that records every invoice the platform issues to a tenant, with the same line-item discipline as the billable events ledger has for tenant-to-business invoices. The audit trail is symmetric — when an operator asks why their bill is what it is, we point at the events the same way we'd want them to point at events for their own clients.

What's left before the first paying customer: switching from test-mode Stripe keys to production keys, swapping the webhook endpoint to the live Stripe environment, and rotating the webhook signing secret. The code path doesn't change — the secrets do. That's the point of building it test-first; production switchover is a configuration change, not a code change.

## Sentry observability — wired pre-launch on purpose

The temptation with observability is to wire it after you have traffic. The case for wiring it before is straightforward: when the first paying customer hits a bug, you want a stack trace, not an email.

The Sentry rollout landed in three pieces:

**The base instrumentation.** The browser SDK initialized in `lib/observability/sentry.ts`, scoped per environment, with user identification wired. Every captured event tags the tenant, the user, the URL, and the build release. Validation rejections are explicitly excluded from capture (a 400 response on a malformed input isn't a bug — it's the system working). The principle banked: distinguish between "exceptions caused by user error" and "exceptions caused by system error" at the capture layer, not in the alert filter.

**The edge function instrumentation.** Every Supabase edge function gets the same Sentry wrapper, which captures uncaught exceptions and tags them with the function name and run ID. Email-pipeline functions in particular needed this — they're invisible by design when working, and silently broken when not. The Sprint D/E backlog included a related closure: trusting Sentry to surface dispatcher failures from real traffic instead of synthesizing a test event.

**The source-map upload.** This is the difference between a stack trace that says `at <anonymous>:1:26` and one that says `at handleConfirmPutaway in src/data/providers/supabase/index.ts:271`. The Sentry Vite plugin uploads source maps as part of every production build, scoped to a release name that's a deterministic build timestamp.

The architectural choice worth naming: a single computed `sentryRelease` JS constant feeds **both** the plugin's `release.name` AND the runtime SDK's `import.meta.env.VITE_SENTRY_RELEASE`. They're guaranteed to match because they're literally the same in-memory value. The most common silent failure mode for Sentry in production is a release-name mismatch between the uploaded source maps and the runtime events that reference them — when that happens, you have source maps Sentry never associates with your errors, and stack traces stay anonymized. Building it so a mismatch is impossible by construction is cheap and saves you from a debugging session you'd otherwise have months later.

A two-condition `disable` gate (`!isProdBuild || !hasSentryUploadCreds`) means the plugin degrades gracefully if the secrets aren't present in an unexpected environment. The build doesn't break; you just don't get source maps. The principle banked: graceful degradation everywhere there's a build-time third-party dependency.

End-to-end verification took about thirty minutes of focused work. A test exception fired from production console showed up in Sentry with the right release tag, the right environment, and the right user identification. Source maps confirmed associated. Done.

## Cloudflare Turnstile — bot protection that doesn't surveil real users

Two public-facing forms needed bot protection: the signup flow and the sales lead form on the pricing page. The choice was between Cloudflare Turnstile and Google reCAPTCHA. Turnstile won for three reasons: it works without cross-site tracking, it doesn't require third-party cookies, and it degrades to a single click for legitimate users instead of asking people to identify motorcycles.

The integration shape:

**Site key** lives in `vite.config.ts` as a hardcoded literal — Vite environment variables compile at build time, and Lovable Cloud's secret store rejects `VITE_*` prefixes. **Secret key** lives in Lovable Secrets and is consumed by the edge functions that verify the token.

**Server-side verification** sits in two edge functions. The signup flow's `provision-tenant` function POSTs the token to Cloudflare's siteverify API and rejects the request if it fails. The `submit-sales-lead` function does the same with the same shape. Both fail closed — a Turnstile failure returns a 400, the form re-renders with an error, the user retries.

**Frontend** uses `@marsidev/react-turnstile` (already installed for signup; reused for the sales lead form). Submit button gates on token presence. Token resets after submit (single-use semantics — a stolen token from a successful submission can't be replayed).

A bug worth describing: the first production republish surfaced Cloudflare error 400020 on both forms. The widget didn't render — just a "Please complete the CAPTCHA" placeholder. Cloudflare's docs describe 400020 as "invalid widget size," which is misleading; a community-flagged GitHub issue confirmed it actually fires for invalid sitekeys. Root cause: a one-character drop in the sitekey when transcribing from clipboard to build prompt (`0x4AAAAADJC7vdjNTw1emvY` instead of `0x4AAAAAADJC7vdjNTw1emvY` — four A's vs five). One-line fix, second republish, both forms working.

The lesson banked, and worth restating because it'll come up for any team working with long opaque strings: when passing API keys, secrets, or IDs through any human transcription step, errors happen at exactly the moments you're not paying attention. Better pattern: paste secrets directly into the destination, never through a build-prompt intermediary.

## What this stack adds up to

The platform now has the unsexy parts of a real SaaS: billing that handles its own subscription lifecycle, observability that surfaces bugs before customers report them, bot protection that doesn't antagonize legitimate users, and source-mapped stack traces that make 3 AM debugging tractable.

None of this would be visible to a 3PL operator browsing the marketing site. All of it is what makes the platform safe to use the moment they sign up. Wiring it before the first customer was deliberate — it's an order-of-magnitude cheaper to instrument an empty production than a busy one, and the operational discipline you need (secrets management, webhook signing, idempotency, graceful degradation) is the same shape regardless of whether anyone is using the system yet.

The locked next-arc work for this layer: switching Stripe from test-mode to live keys when the first paying customer is ready to onboard. Code path doesn't change; secrets and webhook endpoints do. That switchover is on the first-paying-customer critical path.

— Michael
