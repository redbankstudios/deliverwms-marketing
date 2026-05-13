---
title: "The integrity sweep — building the audit before the report"
description: "Six chunks of pure integrity work before any feature shipped. Why we did it, and the audit-first discipline that caught four wrong diagnoses out of six."
author: michael
publishDate: 2026-04-26
pillar: commentary
tags: ["integrity", "ledger", "audit-first", "build log", "pre-launch"]
readingMinutes: 8
draft: false
featured: true
faq:
  - q: "Why integrity work before features?"
    a: "Because billing or reporting on top of a broken inventory ledger destroys trust the first time a customer audits their own invoice. Once an operator catches you with a number that doesn't match reality, you don't get that trust back. The integrity layer is the part of the product nobody sees and everybody depends on."
  - q: "What's a 3-way reconciliation?"
    a: "Inventory has three places it lives in a WMS: the immutable movement history, the per-item quantity column, and the per-bin balance summary. A 3-way reconciliation confirms all three agree. If they disagree, the system has been silently lying to somebody."
  - q: "What does 'audit-first' actually mean as a discipline?"
    a: "Before writing the fix, an audit prompt enumerates what's actually true in the database, code, and seed data. Across six chunks of integrity work, four of our initial diagnoses were partly wrong. The audit caught it every time. The pattern banked: cheap to run, expensive to skip."
  - q: "Is this kind of thing visible to customers?"
    a: "Mostly no — and that's the point. The 3PL that uses the platform should never need to know about the integrity layer. They notice when their invoices reconcile, when their inventory counts are right, when no number on a report needs an asterisk. That's the deliverable."
---

Before any billing feature shipped on the platform, we spent six chunks of work on something nobody asked for: making sure the inventory ledger was actually correct. Not adding features. Not improving UI. Just confirming that the numbers a future invoice would be built on top of agreed with reality, and fixing the ones that didn't.

This is the kind of work that's invisible if you do it right and catastrophic if you skip it. I want to walk through what we did and, more importantly, why doing it before the visible features mattered.

## What we found

The first audit pass turned up six categories of work, organized roughly worst-to-tightest:

1. **Ledger integrity detector** — automated daily check that the immutable movement history, the per-item quantity, and the per-bin balance summary all agree. Plus a 10/10 self-test screen that exercises the same checks on demand. Without this, drift goes unnoticed until somebody tries to ship something and discovers the number on the screen doesn't match what's on the shelf.

2. **Quarantine for uninvited signups** — anyone who hits the signup page without a valid invitation now lands in a quarantined state (`tenant_id=NULL`, role=`pending_invitation`) until an operator clears them. Closes a path where a stranger could land in someone else's tenant by accident.

3. **Five missing domain events** — events the system was supposed to emit on key operational actions (received, putaway, picked, packed, shipped) that weren't being emitted. Future billing, reporting, and notification rules depend on these events firing. Adding them after the fact would have meant rebuilding rule chains that were already in production.

4. **Demo data provenance** — 13 seed-asserted rows that didn't trace back to any operational handler. Three orders that needed to be replayed through the real shipping pipeline so their movement history would exist. Twenty `opening_balance` movements backfilled. A synthetic seed actor (`USR-SEED-SYSTEM`) created so historical seed writes have a defensible attribution.

5. **Application-layer bypass guard** — a guard on `updateOrderStatus` preventing direct status writes that would skip the ledger. Closes the door on the kind of "quick fix" code change that creates a movement-less status transition. The pattern banked: never let an operational action update state without going through the handler that owns the corresponding ledger writes.

6. **3-way ledger reconciliation** — the math that backs item #1, with richer exception detail when something disagrees. Daily cron, scoped per tenant, surfaces problems the same day they happen instead of the same week.

When we were done, every item in tenant-1 reconciled across all three sides. Zero open integrity exceptions. Clean slate.

## The audit-first track record

The actually interesting part of the work isn't the list of fixes. It's that **four of the six initial diagnoses turned out to be wrong**. The pattern is worth describing because it informs how every subsequent feature ships.

The discipline goes like this: before a fix gets written, an audit pass enumerates what is actually true in the database, the code, and the seed data. The audit doesn't propose a fix — it just answers the question "what does the system currently look like?" Then the fix is built against that answer.

Across the six chunks of integrity work:

- Two of the "ledger bugs" we'd flagged were false positives. The guards were already in place; the audit confirmed it before any wrong fix landed.
- A schema-constraint change (allow `users.tenant_id` to be NULL for the quarantine state) was missed by the original plan and only surfaced during self-testing. Audit-first wouldn't have caught this one — but the self-test pass that ran against the audit's findings did.
- Two of the "missing" event emissions were already wired. The discovery doc that flagged them was stale. Audit-first reframed the work from "add five emissions" to "add three emissions and remove the false-positives from the doc."
- The headline finding of one audit ("the handlers don't write inventory movements") was wrong. The handlers were correct. The zero-row counts were seed-asserted rows that real handlers had never produced. The chunk pivoted from "fix the handlers" (which would have been a rewrite of working code) to "fix the demo-data provenance" (which was the actual problem).
- A late audit caught that one item's apparent "cycle-count propagation bug" was self-inflicted by an earlier chunk's snapshot logic. Fix collapsed from a multi-table investigation to four UPDATE statements.

Almost every time we were confident we knew where the bug lived, we were wrong. Audit-first is cheap and catches this reliably. We've banked it as the default for any structural change to data, RLS, or rule wiring.

## What this means in practice

A lot of B2B SaaS teams ship features fast and patch the integrity layer later when a customer notices something wrong. That works for products where being wrong is annoying but not consequential. It does not work for warehouse software, because in warehouse software:

- Wrong inventory counts mean either operating with shrink you don't see, or operating with phantom stock that you promise to a customer and then can't ship.
- Wrong billable events mean invoices that disagree with operational reality, which in 3PL especially is the reputational issue that loses you accounts.
- Wrong tenant scoping (a column missing from an RLS policy, an audit gap nobody caught) is the headline a startup never recovers from.

We don't have customers yet. Building the integrity layer first while the only data on the platform is seed data is significantly cheaper than building it later under live operational pressure. So we did.

## The tools that came out of the sweep

A few specific things landed during this work that will keep paying back across the rest of the build:

The **integrity check screen** — a one-click self-test that runs the same 3-way reconciliation the daily cron does, but with the full report in your face. Useful for me as a developer; arguably more useful for an operator as a confidence check before a month-end close.

The **`USR-SEED-SYSTEM` synthetic actor pattern** — a clean way to attribute historical writes to "the system" instead of leaving them attributed to nobody. Reusable for any future seed work or data-import flow.

The **application-layer bypass guard pattern** — once you've established that operational actions update state through specific handlers and never directly, you can put a guard at the API layer that rejects any attempt to write the same state field through any other path. Cheap, defensible, and catches the kind of bug that would otherwise sit dormant until a junior developer added a "quick" admin tool.

The **audit-first checklist** — explicitly: don't propose a fix until you've enumerated what's actually true. The discipline is what's now banked, more than any specific tool or schema change.

## What this lays the groundwork for

Every billing feature, every report, every dashboard you'll see ship from here is being built on the integrity layer this sweep produced. The AR Aging report we shipped three weeks later is correct because the underlying ledger is correct. The Throughput Report's cycle-time chart is correct because the timestamps it reads were never silently wrong. The invoice line items that go to a 3PL's clients are defensible because the events behind them were captured at the moment they happened, not reconstructed at month-end from a spreadsheet.

If you're a 3PL operator evaluating WMS platforms, the way to test this kind of work is to ask the vendor to show you their integrity check screen and their reconciliation logic. If they don't have one, the math behind the screens you're being shown is unverified. If they do, ask how often it runs and what happens when it surfaces an exception.

We don't have a paying customer yet. We do have a foundation that, when the first customer's data lands on it, will reconcile. That's what this sweep was for.

— Michael
