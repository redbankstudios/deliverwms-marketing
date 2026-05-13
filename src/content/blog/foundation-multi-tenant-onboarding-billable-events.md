---
title: "The foundation: multi-tenant hierarchy, onboarding, billable events"
description: "Three load-bearing layers in two weeks: multi-tenant hierarchy with row-level security, the invite-and-onboard flow, and the billable events ledger."
author: michael
publishDate: 2026-04-25
pillar: commentary
tags: ["multi-tenant", "RLS", "onboarding", "billing ledger", "build log"]
readingMinutes: 9
draft: false
featured: false
faq:
  - q: "What does 'multi-tenant from day one' actually mean?"
    a: "Every table has a tenant column. Every query is tenant-scoped at the database layer via row-level security policies. New features inherit the scoping automatically because there is no application-level filter to forget. Compare with retrofitted tenancy where some tables have the column, some don't, and the filter lives in application code that developers have to remember to include."
  - q: "How many RLS policies are running across the platform today?"
    a: "Across Pillar 1 we landed 24 RESTRICTIVE business_isolation policies across 23 tables, plus the underlying tenant_isolation set. Two tiers — Tier 1 covers tables with a direct business_id column; Tier 2 covers tables that needed a column added and backfilled before the policy could engage."
  - q: "What's in the billable events ledger?"
    a: "Fourteen event types covering receiving, storage, picking, packing, shipping, returns, dispatch stops, labels, and a handful of accessorial fees. Each event captures its tenant, business, rate, quantity, and reference back to the originating operational record. The ledger is append-only — corrections are reversing entries, not edits."
  - q: "Can a self-serve operator actually sign up and use the platform without a sales call?"
    a: "Yes. The signup flow takes about two minutes from form submit to dashboard, including Cloudflare Turnstile bot protection and an idempotent provisioning function. Once they're in, an in-dashboard checklist walks them through the four prerequisites: set up billing, add a warehouse, add a client, invite a teammate."
---

Two weeks of work. Three load-bearing layers. None of it would be visible to an operator on the surface, but together they're the reason every subsequent feature can be shipped quickly without breaking anything.

This is the post about the foundation: the multi-tenant hierarchy that isolates one 3PL's data from another's, the onboarding flow that gets a self-serve customer to a working dashboard in under two minutes, and the billable events ledger that captures every dollar's worth of operational work the moment it happens.

## Layer one: multi-tenancy that holds up

The early decision that mattered most was treating multi-tenancy as a database-level guarantee, not an application-level convention.

Two patterns were available. The convention is to add a `tenant_id` column to every table and remember to filter by it in every query. That works until a developer forgets the filter, or a new feature ships with the filter missing on one query path, or a report aggregates across tenants by accident. Each of those is a quiet data leak that doesn't fail loudly until a customer notices.

The discipline is to enforce the scoping at the database itself, using row-level security policies. Once a connection is bound to a tenant context, no query — application code, ad-hoc admin SQL, or otherwise — can return rows from another tenant. The database itself rejects them.

We chose the discipline. The pillar landed in three pieces:

The **business hierarchy rename and structure** got every entity onto consistent naming (`businesses`, not `clients` — too many platforms call their own customers' customers "clients" and the term collapses on itself). Added the missing structural columns (address with Mapbox autocomplete, validated via Zod). Replaced free-form fields with proper records.

The **`business_users` junction table** explicitly links users to the business they belong to. Every existing B2B user got a junction row; every B2B portal screen now auto-selects the user's primary business. Eighteen rows backfilled, zero coverage gap.

The **two-tier RLS rollout** locked the data layer down. Tier 1 covered ten tables that already had a `business_id` column — ten Template A policies and three Template B policies that walked transitive joins where the column wasn't direct. Tier 2 added a `business_id` column to `orders` and `inventory_items` (plus eight transitive children), backfilled it from the SKU → product → business relationship, then added eleven more RESTRICTIVE policies and locked the column to NOT NULL.

Across the pillar: **24 RESTRICTIVE business_isolation policies across 23 tables**, all using a short-circuit pattern that lets non-B2B roles (platform owner, operator owner, warehouse manager, etc.) pass through unaffected while strictly scoping B2B users to their own business.

One specific finding worth naming: the original audit thought the application layer was passing `businessId` through to the order-creation provider correctly. The pre-build verification pass found it wasn't — the provider signature accepted `businessId` but the insert payload dropped it on the floor. If we'd added the NOT NULL constraint without the fix, every order creation would have failed silently the moment the constraint engaged. The fix landed in the same migration window. Audit-first caught it.

## Layer two: getting an operator to a working dashboard in two minutes

Onboarding is the part of the platform where a self-serve customer either sticks or doesn't. The bar isn't elegance — it's whether they can sign up, get to a working dashboard, and start doing real work without a phone call. We landed it across four chunks.

The **invitations system** had been in place at the backend for a while. The polish chunk lifted the inline edge-function calls into a typed provider, added a one-hour rolling cooldown on resends with friendly error messages ("you can resend it again in N minutes"), and added expired-pending display so the UI never offers a Resend button for an invitation that would 410 anyway. Three smoke tests, all green.

The **welcome page** that appears after first login is role-aware for all eight invitable roles. A `business_owner` lands on "Welcome to {tenantName}, {name}" with an Open Dashboard CTA; a `warehouse_employee` lands on "Welcome, {name}" with an Open Worker App CTA. A B2B client lands on the actual business name pulled from the junction table. Every role gets the right next-step button. Click it, the database flips `onboarded_at`, the user navigates to the right default tab. If the user has been onboarded already, the welcome page short-circuits to the dashboard.

The **self-serve signup flow** is what makes the rest of this matter. A prospect visits the marketing site, fills in email + password + company name + preferred subdomain, submits. The provisioning edge function does everything atomically: creates the auth user, creates the tenant with `plan_id='starter'` and `billing_status='incomplete'` (Stripe-conventional, no migration needed), creates the user with role `business_owner`, creates a default warehouse, fires `tenant.created`, and returns. Total time from submit to event emission: ~150 milliseconds.

Cloudflare Turnstile sits in front of the form to keep bots out, with a dev-bypass sentinel for local development. The signup draft persists in localStorage for 24 hours so a partial signup doesn't lose the operator's work if they navigate away.

The **first-dashboard checklist** — a `<CompletionCard />` mounted above the operations row — surfaces the four prerequisites a self-serve tenant needs to be productive: set up billing, add a warehouse, add a client, invite a teammate. The card renders nothing once all four are done. Persistent (not dismissible — the work needs to get done), passive data refresh through the existing webhook chain.

The pillar shipped across about a week of focused work. A test signup goes from form submit to dashboard in well under two minutes. The shape of every subsequent customer interaction with the platform — whether they came from organic, a referral, or a sales conversation — is now self-serve by default.

## Layer three: every billable event captured at the moment it happens

The billable events ledger is the most commercially important thing on the platform. The competitive analysis is straightforward: 10–15% of manual 3PL invoices have errors, costing the operator $30–80K per year per warehouse. Most legacy WMS platforms bill by reconstructing the invoice at month-end from operational data scattered across three to five systems. We bill by writing a billable event the moment the operational action happens.

The pillar landed in four chunks.

**The foundation** added three tables. `billable_events` captures the event itself: tenant, business, warehouse, event type (one of 14 enumerated values, CHECK constraint enforced), quantity, unit rate, amount (a generated column — `quantity * unit_rate`), reference type and ID back to the originating record, occurred-at timestamp, billed flag, invoice ID. `business_rate_cards` and `tenant_default_rate_cards` use a versioned-row pattern: updates create a new row, the old row gets `effective_to = now()`. A partial unique index enforces "exactly one current rate per (business, event_type)." A helper function `get_rate_for_business(business, event_type, at_time)` picks the rate effective at any given moment — important because invoices generated against historical events need to use the rate that was in effect at the time the event happened, not the rate in effect today.

A trigger on the `businesses` table seeds 14 rate cards from the tenant's current default template every time a new business is created. RLS policies cover all three new tables — nine policies total. Forty-two default rate cards and 126 business rate cards backfilled at seed time.

**The rules engine wiring** connects the rest of the operational system to the ledger. An `apply_create_billable_event_action` function maps domain events to billable events. Per-event-type business and warehouse lookup. Quantity derivation per event type. Rate lookup via the versioned helper. NULL rate raises a descriptive exception that the dispatcher catches and logs to `rule_execution_failures` instead of failing silently. A partial unique index on `(reference_type, reference_id, event_type)` prevents duplicate billable events even if a domain event re-fires — the executor uses `INSERT ... ON CONFLICT DO NOTHING`.

Four production rules wired: outbound shipped (per shipment), pick completed (per picked line), inbound received (per pallet), return processed (per return, flat fee). Nine other event types are scaffolded in the schema but await the upstream features that fire them.

**The pallet lifecycle** got a six-state model so storage billing is correct: `expected → arrived → receiving → putaway → emptied → removed`. Four timestamp columns, a CHECK constraint, a partial billable index that excludes pallets that are emptied or removed (you don't bill storage on a pallet you don't have anymore). A junction table linking pallets to inventory. Four domain events. A trigger that auto-marks a pallet as emptied when its last inventory balance goes to zero. An integrity check with eleven assertions, daily cron, and exception auto-resolve.

The thing the audit caught — a multi-pallet dual-receive bug where two pallets sharing an inventory item silently failed to transition the second one — got fixed in the same chunk via a PostgREST embedded join with strict ordering. Production-grade fix, regression test added.

**The storage cron** runs daily and writes a `storage.daily_accrual` event for every occupied pallet position. Tenant-1 sees about $5.95/day in accrual events, which means by the end of a 30-day month the storage line of an invoice has been incrementally accruing instead of being reconstructed. If a client disputes a storage charge, the answer is to point at the daily events. Same shape as everything else in the ledger.

## What this foundation enables

These three layers are the reason the rest of the platform can be built quickly. Multi-tenancy means new features ship with isolation already enforced — there's no "remember to add the filter" tax on every PR. Onboarding means a customer signing up at midnight is in their dashboard by 12:02 AM without a sales call. The billable events ledger means every invoice we ever generate can be defended line by line against the originating event, with the right rate, at the moment it happened.

If you're a 3PL operator evaluating WMS platforms, the diagnostic question for each of these is the same: ask to see it. Show me the RLS policies. Show me the signup flow with a real test email. Show me a billable event log filtered to one client over one month. Vendors who built these foundations will show you in five minutes. Vendors who reconstruct billing at month-end will tell you it's "in the roadmap."

We don't have a customer yet. The foundation is in place to ensure the first one — when they land — has nothing to discover that's broken underneath them.

— Michael
