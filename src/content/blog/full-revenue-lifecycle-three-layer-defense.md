---
title: "Sprint F — full invoice lifecycle, with three-layer defense"
description: "Eight invoice states, every transition gated by UI, API, and database constraints in lockstep. The full revenue lifecycle, shipped with zero asterisks."
author: michael
publishDate: 2026-05-04
pillar: commentary
tags: ["billing", "invoices", "build log", "three-layer defense"]
readingMinutes: 8
draft: false
featured: false
faq:
  - q: "What is 'three-layer defense' in this context?"
    a: "Every state transition on an invoice is gated three times: the UI prevents the wrong action from being available to click, the API endpoint validates the action before processing it, and the database has a constraint that rejects the resulting state if it's invalid. Three independent gates. Any one of them failing alone doesn't compromise the data."
  - q: "What states can an invoice be in?"
    a: "Draft, sent, paid, overdue, disputed, resolved, void, and cancelled. Each transition is constrained — paid can't go back to draft, void is terminal, dispute resolution requires a non-empty reason, and the timestamp columns (sent_at, paid_at, voided_at, cancelled_at) are gated by a CHECK constraint that ties them to the corresponding status."
  - q: "How does dispute resolution work?"
    a: "An invoice can be marked disputed with a reason. A dispute can be resolved with an outcome — either the original amount stands, or the invoice is reissued with adjustments, or the invoice is voided. Every disposition is recorded in the invoice history with the user, timestamp, and reason. The audit trail is recoverable end-to-end."
  - q: "Why call it 'zero asterisks'?"
    a: "Most pillar closeouts come with a list of small things that didn't quite land — known caveats, follow-up items, edge cases not covered. Sprint F shipped without any of those for the lifecycle features. Every state transition works as documented; every constraint is enforced at all three layers; nothing is deferred for cleanup."
---

Sprint F was the close-out of the tenant-to-business billing pillar. Six chunks across two days. The headline outcome: every state transition on an invoice — from creation through dispute resolution to terminal void or cancel — is now gated by three independent layers, with every transition timestamp captured and every reason field required at the API level.

This is the kind of work where the visible feature is small (a button gets a confirm dialog; a status badge shows the right color) and the invisible work is enormous (the data model, the constraints, the audit trail, the recovery paths). Worth walking through because it's a good operator-facing illustration of what production-grade billing actually looks like.

## What an invoice can be

An invoice in Deliver WMS lives in one of eight states. Each has a meaning, a precondition for entering it, and a set of transitions out.

**Draft** — the invoice exists but has not been sent. The 3PL operator can edit line items, adjust the customer-visible memo, change the due date, or delete the invoice entirely. Nothing about a draft is visible to the customer.

**Sent** — the invoice has been issued to the customer. `sent_at` timestamp is captured. The invoice is now visible to the B2B client in their portal. Line items are frozen — the operator can't silently change a sent invoice.

**Paid** — the customer has paid. `paid_at` timestamp captured. Payment record links back to the invoice. Terminal state under normal flow, but a paid invoice can be voided by the operator with a reason if there's a refund situation.

**Overdue** — the invoice's due date has passed and it hasn't been paid. Today this is decorative — the status flag is set by seed data and the report logic computes overdue dynamically from due_date. A status-transition trigger to flip sent → overdue automatically when due_date crosses is on the deferred backlog.

**Disputed** — the customer has disputed a line item, with a non-empty reason. The invoice is frozen pending resolution. Disputed invoices show in their own column on the AR Aging report — they don't roll into aging buckets, because disputed AR isn't aged AR, it's frozen AR.

**Resolved** — a previously disputed invoice has been settled. The resolution captures who resolved it, when, and the disposition (original amount stands / reissue / void). After resolution, the invoice continues forward (back to sent, or to paid, or to void).

**Void** — the invoice has been retracted by the operator with a non-empty reason. `voided_at` captured. Terminal state.

**Cancelled** — the invoice has been cancelled before being sent, with a reason. `cancelled_at` captured. Used for the case where a draft invoice was created in error.

Eight states, well-defined transitions between them, every entry timestamped, every reason field captured.

## What "three-layer defense" actually means

The principle banked from Sprint F is straightforward: every state transition on a high-stakes object is gated three times. The UI doesn't make the wrong action available. The API rejects an invalid action even if it gets called directly. The database constraint rejects the resulting state even if the API gates fail.

Each layer is independent. Any one of them passing while the others fail is a bug we'd want to catch. None of them is sufficient on its own.

In practice for the invoice lifecycle:

**UI gating.** The terminal-action dialog (cancel, void, dispute, dispute-resolve) doesn't enable the Submit button until the reason field has non-empty text. The dropdown of available actions is filtered to actions valid for the current state. A paid invoice doesn't show "Send" in the action menu; a draft invoice doesn't show "Mark Paid."

**API guards.** The cancel-invoice, void-invoice, dispute-invoice, and resolve-dispute edge functions each validate the request payload before doing anything. Empty reason returns a 400 with a structured error code (`cancel_reason_required`, `void_reason_required`, etc.). State precondition failures return a 409 with a structured error explaining which state was required for the transition. The frontend can map these to user-friendly messages.

**Database CHECK constraints.** The `invoices_status_timestamp_consistency` CHECK enforces that `paid` requires `paid_at`, `sent` and `overdue` require `sent_at`, `void` requires `voided_at`, `cancelled` requires `cancelled_at`. The `invoices_dispute_resolved_consistency` CHECK enforces the dispute-resolution shape. If any path through the system tries to write an invalid combination, the database rejects the insert or update.

The discipline pays off when something goes wrong. A user reports an invoice that says "paid" but has no payment date — under three-layer defense, that combination cannot exist in the database. The bug is somewhere upstream of the writes, not in the data itself. You can debug from the events instead of from the result.

## What we caught during the work

Two bugs shipped fixed during Sprint F because the audit cycle surfaced them before the constraint engaged.

The **cancel-invoice edge function** had a lax parse pattern — it accepted the cancellation request without validating the reason field. The new database CHECK would have caused 500 errors on any cancel-without-reason call from any caller (including legitimate ones if the UI ever shipped with a missing required-field validation). The audit caught this before the migration ran. Fix shipped in the same window: the edge function now returns a 400 with `cancel_reason_required` for empty inputs.

The **void-invoice edge function** had the same lax parse pattern. The audit's framing was "mirror void-invoice's gating pattern when adding cancel-invoice's." That was wrong — void-invoice itself had the gap. Same fix, separate chunk, banked principle: "Mirror X" guidance assumes X is correct. When the convention itself might have the same structural gap, audit X explicitly rather than trusting the framing.

A third smaller catch: the close-out for the cancel-invoice fix claimed the dispute dialog already required a reason for void actions. It didn't — it gated cancel and dispute but not void. Added `void` to the reason-required set in the dialog. Banked principle: close-out claims aren't verified facts. They're authored summaries that can be wrong about details the author didn't actually check.

## The invoice history record

Every state transition writes to an `invoice_history` table — the actor (user ID), the action (string), the timestamp, the reason if applicable, the previous and new state. End-to-end, you can replay the lifecycle of any invoice from creation to current state and see exactly who did what when.

This is the table you point at when a customer disputes an action that happened weeks ago. "On May 3rd at 14:22, this invoice was marked disputed by user X with the reason 'incorrect storage rate for April.' On May 5th at 09:15, the dispute was resolved by user Y with the disposition 'reissue with corrected rate' and the reason 'rate sheet was updated retroactively for April per contract amendment.'" The audit trail is what makes the system defensible in front of a customer.

## What "zero asterisks" means

Most pillar close-outs come with a list of small things that didn't quite land — known caveats, follow-up items, edge cases not covered. The deferred backlog is real and growing.

Sprint F shipped without any of those for the lifecycle features. Every state transition works as documented. Every constraint is enforced at all three layers. The audit trail captures actor, timestamp, and reason on every write. Nothing was punted to "we'll fix that later." The pillar is closed.

The closest thing to a follow-up item is the status-transition trigger that would flip `sent → overdue` automatically when `due_date` crosses without payment. Currently the overdue status is decorative — the AR Aging report computes overdue dynamically. Adding the trigger is a deferred polish item, not a missing feature.

## What this enables for an operator

Three things, concretely:

**Invoices are defensible.** When a B2B client disputes a charge or a state, the answer is to point at the originating event and the history record. No reconstruction, no "let me check," no "I'll get back to you." The data is there.

**Operations and finance are coherent.** The same status field that drives the operator's billing dashboard drives the AR Aging report, the revenue reports, and the client-facing portal. They can't disagree because they read from the same constraint-protected source.

**Audit prep doesn't require a project.** The history table answers compliance and audit questions in queries instead of in PDF reconstructions. SOC 2 prep, financial audits, contract disputes — all answerable from the data.

We don't have a paying customer yet. The lifecycle layer is in place to ensure the first one's billing is defensible from day one. That's the point.

— Michael
