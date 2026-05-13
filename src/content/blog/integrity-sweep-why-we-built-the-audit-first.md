---
title: "Inventory you can trust — the work most WMS vendors skip"
description: "Why your inventory counts disagree with reality, why most WMS vendors never fix it, and the work that makes our numbers match your shelves."
author: michael
publishDate: 2026-04-26
pillar: commentary
tags: ["inventory", "integrity", "ledger", "trust"]
readingMinutes: 6
draft: false
featured: true
faq:
  - q: "Why do my inventory counts disagree with my shelves?"
    a: "Three reasons: a cycle count gets keyed in wrong, a status update happens without a corresponding stock movement, or a backfill 'fix' silently overwrites real data. Each of these creates drift. Most WMS platforms don't surface that drift until you trip over it. Deliver WMS surfaces it the same day it happens."
  - q: "What's a 3-way reconciliation?"
    a: "Inventory lives in three places in a WMS: the running history of every movement, the per-item quantity, and the per-bin total. They should always agree. If they don't, somebody's been lying to somebody. Our system checks that all three agree, every night."
  - q: "What happens if I find a discrepancy?"
    a: "You see it on a dashboard the day it happens, with the specific item, quantity, and the most likely cause. You decide how to fix it. Compare with the alternative — finding out three weeks later when an order can't be filled."
  - q: "How is this different from cycle counting?"
    a: "Cycle counting is the operator's tool for confirming reality matches the system. The reconciliation we do is the system's tool for confirming itself. Both matter — and our cycle count workflow now feeds the reconciliation, so a discrepancy you find in the warehouse is captured in the audit trail with who, when, and why."
---

If you've run a warehouse for any length of time, you've had this conversation: a picker can't find an SKU the system says is there. Or you ship an order and discover the inventory you promised a client doesn't actually exist. Or month-end rolls around, you do a cycle count, and somehow you're 8 units short of what the system claims.

Inventory drift is the quiet problem in warehouse operations. Every operator deals with it. Most WMS vendors don't have a real answer for it. We built ours around making sure the numbers on your screen match the numbers on your shelves — every day, not just at month-end.

This post is about the work we did to get there, and why it matters more than any feature on top of it.

## Where inventory drift comes from

Three causes account for almost every inventory discrepancy:

**Cycle count entries that never make it to the ledger.** A worker counts a bin, writes the number on a piece of paper, types it into a screen — and the system updates the quantity directly without recording who, when, or why. Three months later when the number's wrong, there's no audit trail to figure out where it diverged.

**Status updates that skip the stock movement.** An order is marked "shipped" but no inventory movement is recorded. The status field says one thing, the stock ledger says another. Reports built on top of either can disagree.

**Silent backfills.** A developer fixes a "bug" by editing inventory directly. The system accepts the change. The original problem is now hidden by the fix, and the fix becomes the new source of truth.

In a typical WMS, none of these surface as errors at the time they happen. They surface weeks later when an operator trips over the consequences — a missed shipment, a billing dispute, a client phone call. By then the cost is real and the cause is hard to find.

## What we built so this doesn't happen

We invested an entire phase of the platform — six chunks of work — in making sure the underlying inventory data could be trusted before we shipped a single feature on top of it.

**A daily reconciliation check.** Every night, the system compares three independent records of inventory: the immutable history of every movement, the per-item quantity, and the per-bin total. They should always agree. If they don't, an exception is created with the specific item, the discrepancy size, and the most likely cause. You see it on a dashboard the next morning, not three weeks later when an order can't be filled.

**An on-demand self-test.** Same checks the daily reconciliation runs, but you can fire it any time. Useful before a month-end close. Useful when you've just made a big inventory adjustment and want to confirm it landed cleanly.

**A protected stock ledger.** Every inventory movement is captured as an immutable entry — never edited, never silently overwritten. Adjustments are explicit additional entries, not deletions of the original. If a quantity changes, the system has a record of who, when, and why.

**Quarantine for stranger signups.** Anyone who reaches the signup screen without a valid invitation lands in a quarantined state until you clear them. Closes a path where someone could end up with access to your warehouse data by accident.

**Five missing system events restored.** Five operational actions — receive, putaway, pick, pack, ship — were either not emitting their corresponding system events, or were emitting them inconsistently. Without those events, the daily reconciliation has gaps. We added the missing emissions and verified each one fires when it should.

**Real audit trail for legacy data.** Every demo and historical record now traces back to a real handler that wrote it. No more "this row exists but nothing in the system explains why." That discipline applies forward too — once you're using the platform, every entry in your inventory ledger has an originating action you can point at.

When this work was finished, every inventory item in our test environment reconciled across all three sides. Zero open exceptions. Clean slate.

## Why most WMS vendors don't do this

Honest answer: it's not the work that wins demos. A reconciliation dashboard is invisible until you need it. A daily integrity cron is something you'd never click on during a sales call. The investment is real and the visible payoff is delayed.

Most WMS vendors prioritize the visible features and patch the underlying integrity layer when a customer notices something wrong. That works for products where being wrong is annoying but not consequential. It doesn't work for warehouse software, because in warehouse software:

- Wrong inventory counts mean either operating with shrink you don't see, or promising stock to a client that you can't ship.
- Wrong billable events mean invoices that disagree with operational reality, which is the reputational issue that loses you accounts.
- Wrong tenant scoping (a column missing from a security policy, an audit gap nobody caught) is the kind of headline a 3PL never recovers from.

We chose to do the integrity work first. The features you see now — AR aging, throughput reporting, billing automation — are all built on top of a stock ledger you can defend.

## What this means for your operation

Three things you'll notice from day one on the platform:

**Inventory counts you can trust.** When the dashboard says you have 412 units of an SKU, you have 412 units. If reality and the system disagree, the system tells you so before a picker finds out the hard way.

**An audit trail that defends itself.** Every adjustment, every cycle count, every transfer is captured with who and when. Compliance audits, billing disputes, and client questions all answer from the record instead of from memory.

**A platform that catches its own mistakes.** When something does go wrong — and over years of operations, things go wrong — the system surfaces it the same day. No quiet drift accumulating until it costs you a client.

If you want to see the integrity layer in action — the daily reconciliation dashboard, the on-demand self-test, the stock ledger drilldown — [book a 30-minute walkthrough](/contact). The fastest version is a screen-share where we run the checks against demo data so you see the shape of the report.

— Michael
