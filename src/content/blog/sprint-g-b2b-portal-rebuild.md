---
title: "Sprint G — B2B portal rebuild and the leak we caught at the DB"
description: "Rebuilding the B2B client portal across five days, plus the cross-tenant data leak the audit caught before any client could see it. Inventory, orders, outbound."
author: michael
publishDate: 2026-05-10
pillar: commentary
tags: ["B2B portal", "RLS", "build log", "multi-tenant", "data isolation"]
readingMinutes: 9
draft: false
featured: false
faq:
  - q: "What's the B2B portal?"
    a: "The customer-facing surface inside Deliver WMS where a 3PL's clients can self-serve: check inventory, request outbound shipments, track shipments, see order history. The point is that account managers stop being a switchboard for routine inventory questions."
  - q: "What was the data leak?"
    a: "The b2b-reports queries had no business_id filter, which meant a B2B client logging in to see their own reports could in principle have seen tenant-wide data — every business under that 3PL, not just their own. Caught by audit, fixed in one chunk, verified cross-actor before shipping."
  - q: "Did any customer ever see leaked data?"
    a: "No. The platform is pre-launch. The leak existed in code that hadn't been exercised by a real customer. The fix shipped before any production traffic could have triggered it. The reason we could be sure: the B2B portal had only one test user, and the audit's verification ran as that user against every other business in the seed data."
  - q: "Why ship five planned chunks plus seven hotfixes?"
    a: "Because the audit-build-verify cycle catches things you didn't predict. The hotfixes weren't backtracking — they were the audits doing their job. Each hotfix had its own audit-build-verify loop. We bank the discipline, not the tally."
---

Sprint G ran from May 6 to May 10. The headline arc was the B2B client portal rebuild — the surface a 3PL's clients see when they log in to check inventory, request shipments, track orders, and review their own activity. Five originally-planned chunks landed. Seven unplanned hotfixes also landed because each chunk's audit cycle caught a problem that hadn't been on the original list.

I want to walk through what shipped, what the audit caught, and one specific finding that justified the entire sprint's discipline: a cross-tenant data leak in the B2B reports surface that would have been visible to clients the first day a real B2B user logged in. We caught it. It never reached production.

## What an operator's clients can do now

Five operator-facing surfaces shipped in Sprint G:

**Schema foundation.** Five new columns added across the data layer to support the B2B portal flows: client-side product references, inbound shipment metadata, denormalized customer text for display performance, and a few smaller pieces. Plus a hotfix that converted the `unit_cost` and `price` columns from text to `numeric(12,2)` so financial math doesn't quietly truncate.

**Navigation restructure plus dashboard real-data StatCards.** The B2B dashboard previously showed placeholder counts. After this chunk, the StatCards read from the actual data — open orders, in-transit shipments, total inventory units, last-30-day order count. The numbers are correct, scoped to the user's business via the junction table, and refresh on every page load.

**B2B Inventory page.** Self-serve inventory view scoped to the B2B client's business. Filterable by SKU, by warehouse, by stock status. Shows on-hand, reserved, available — the same trio operators see internally. Eliminates a major class of "what do I have at your warehouse" emails that account managers used to field.

**B2B Orders page.** Order history for the B2B client's business. Filterable by status, date range, and (where applicable) end-customer. Drilldown to line items. Shipment tracking links where the carrier supports them. The client sees what they've shipped, when, and what's still in flight.

**B2B Outbound transactional safety.** This is where we transition from "show the data" to "let the client write data." The outbound request flow lets a B2B client submit an outbound shipment request — pick this many of these SKUs, ship to this address. The transactional safety chunk wrapped the request submission in a Postgres function so all the writes (the order, the line items, the reservation, the shipment record) happen atomically or none of them happen. A client can't submit a request that ends up half-created if a write fails mid-flight.

A hotfix in the same arc: backfilling a default warehouse for the legacy outbound flow so existing tenants without an explicit per-request warehouse selection still get a valid destination.

## The leak we caught before it became a customer-facing incident

Late in Sprint G, the audit for the next chunk surfaced a problem that wasn't on the planned agenda. The B2B reports surface — the analytics view a B2B client sees of their own activity — was running queries that filtered by tenant but not by business.

In a multi-tenant 3PL, a single tenant has many businesses. The intent was that a B2B client logging in should see only their own business's data, not the data of other businesses under the same 3PL. The queries were filtering by `tenant_id` (correctly), but missing the second filter on `business_id`. A B2B client seeing the B2B reports surface would have, in principle, seen data from every business under their 3PL — including their competitors.

This is the exact failure mode I wrote about in our [What is a multi-tenant WMS?](/learn/what-is-multi-tenant-wms) explainer: a tenant filter that lives in application code is the kind of filter developers can forget. Here, it had been forgotten on the b2b-reports queries — though caught by the row-level security audit before any real client could trigger it.

The fix was a single chunk. Every b2b-reports query joined through `business_users` on `business_id` to scope strictly to the calling user's business. Cross-actor verification ran as our one B2B test user against every other business in the seed data — every query that should return zero rows did return zero rows; every query that should return the test user's own business's rows did. The fix shipped, the leak closed.

A small follow-up cosmetic fix landed the next session: stale denormalized customer text in some order rows. We resolved this at the display layer rather than backfilling the data, on the principle that display-layer resolution is more durable — it handles future stale data automatically, where a one-time backfill doesn't.

The principle banked: structural-correctness verification (reading the RLS policy table) is necessary but not sufficient. Empirical verification — actually logging in as the user whose access you're worried about and trying to see other tenants' data — is what catches role-gate bugs and false positives.

## Why the hotfix count isn't a bad sign

Five originally-planned chunks shipped in Sprint G. Seven unplanned hotfixes also shipped. The total is twelve effective closures.

The hotfix-to-planned ratio looks rough on paper. It isn't. Every hotfix came from an audit catching a specific problem before the chunk it was paired with shipped — a column type that needed to change before the financial math went live, an RLS gap that needed to close before the new B2B view exposed it, a denormalized field that needed display-time resolution.

The alternative — shipping the planned chunks without the hotfixes — would have meant shipping five well-scoped features on top of seven undiscovered foundation problems. Each undiscovered problem becomes a customer-facing bug some weeks later, each requiring its own escalation, each costing more than the audit-and-fix cost would have.

This is the discipline pattern that's now banked across multiple sprints: when an audit surfaces a precursor problem, split it off as its own chunk with its own audit-build-verify loop. Ship the precursor first. Then ship the planned chunk on top of clean ground.

## A specific principle worth restating

One pattern emerged sharply during Sprint G's hotfix arc and is now banked as a default for any future work: **"Match pattern X" guidance is conditional on X being sound.** Falsified four times in 36 hours during the sprint.

What it means in practice: when an audit prompt says "follow the convention used at file Y line N," the prompt is implicitly assuming that the convention at file Y is correct. Sometimes the convention itself has the structural gap you're trying to close in the new code. The audit needs to verify file Y, not just imitate it.

Concrete instances during Sprint G: a "match the existing RLS pattern" instruction matched a missing-business-id pattern; a "mirror the existing edge function's input parsing" instruction mirrored a missing-required-field pattern; a "follow the existing dialog's validation" instruction extended a dialog that didn't validate the field we needed validated.

Each was caught. The pattern banked for future work: when an audit instruction says "match X," include "and verify X is correct as part of this audit."

## What's next on the B2B portal

Pillar 6 still has four chunks remaining: the B2B reports rewrite (the analytics surface the b2b-reports leak fix protected), the B2B billing page (clients see their own billing inside the portal), and the storefront work in two chunks (a public-facing surface for a 3PL's end customers to track orders without an account).

The locked sequence puts the operator-billing depth chunk first, then the B2B remainder in client-priority order. That's the path to "Pillar 6 complete + Pillar 8 complete," which is the platform-completeness milestone for a 3PL operator.

We don't have a paying customer yet. We have a B2B portal that, when the first design-partner customer onboards their clients to it, won't leak data across business boundaries. That's the work Sprint G was for.

— Michael
