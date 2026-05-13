---
title: "Automated invoice reminders, plus full client billing in the portal"
description: "Three things shipped today: automatic nudges for overdue clients, AR aging inside the client portal, and the full billing surface clients can self-serve."
author: michael
publishDate: 2026-05-13
pillar: commentary
tags: ["billing", "AR aging", "B2B portal", "operator updates"]
readingMinutes: 5
draft: false
featured: true
faq:
  - q: "How do automated reminders work?"
    a: "Pick the schedule once — say, three days before due, on the due date, and again at seven days past due. The system sends each reminder automatically from your account, with the invoice details and a link to pay. You see the full reminder history on each invoice. No more manually drafting follow-up emails."
  - q: "Can my clients see their own AR aging?"
    a: "Yes. Inside the portal, each client now sees their own open invoices bucketed by age — 0-30, 31-60, 61-90, 90+. They know what they owe and how late they are without asking your team. Most operators find this alone cuts inbound billing questions by 60 to 70 percent."
  - q: "What's in the client billing page?"
    a: "Stat cards for the totals, a filterable invoice table, and an inline drilldown into each invoice showing line items, payment status, the reminder history, and dispute information. Your client can answer any question about their own billing without involving you."
  - q: "Will my account managers still need to talk to clients about billing?"
    a: "About the strategic stuff, yes. About 'where is my invoice' and 'how much do I owe' and 'when is this due,' no. Those questions are now self-serve."
---

Three things shipped on the platform today. Each one solves a billing problem that's quietly costing warehouse operators time and money. Here's what they are.

## Stop drafting reminder emails

The most underrated thing you can automate in a 3PL is the polite-but-firm follow-up to a client whose invoice is past due. Most operators draft those emails by hand, one at a time, and either forget to send them or send them inconsistently. The polite ones get paid. The inconsistent ones get treated as optional.

We shipped **automated invoice reminders**. Set the schedule once — a typical setup is three days before the due date as a heads-up, on the due date itself, and again at seven days past due. From then on, the system sends each reminder automatically from your account when the moment arrives. The reminder email goes to the client contact you have on file, with the invoice details and a link to view it in their portal.

Every reminder is captured against the invoice. You see the full timeline on the invoice screen — who got the reminder, when it went out, and whether the client opened it. If a client claims they never got an invoice, you point at the record.

The compound effect over a quarter is meaningful. Most mid-size 3PLs running this kind of automated cadence collect 4–7 days faster on overdue invoices than the same operations doing manual follow-up — not because the reminder is more persuasive, but because it actually goes out every time.

## Your clients see their own AR aging

The new **AR Aging report in the client portal** shows each of your clients their own open invoices, bucketed by age. Same buckets as the operator-side AR Aging report — 0-30 days, 31-60, 61-90, 90+ — but scoped strictly to that client's own invoices.

This sounds like a small thing. It isn't. The biggest single category of inbound billing email at most 3PLs is "what do I owe you?" Your client's controller is reconciling their own AP and they want to see their open balance with you on their schedule, not on yours. Before, that meant emailing your team and waiting for a screenshot.

Now they log in and see it. If they have questions about a specific invoice, they drill down (see below) and answer their own questions. If they don't have questions, they reconcile their books and move on.

Most operators we've talked to estimate this single feature eliminates 60 to 70 percent of their inbound billing inquiries. Your account managers stop being a switchboard for status questions.

## The full client billing page

The bigger of the two portal additions is the **B2B Billing page** — a full billing surface inside the client portal that gives each client end-to-end visibility into their own activity with you.

What's in it:

**Stat cards** at the top summarizing total outstanding, paid year-to-date, count of disputed invoices, and a couple of other useful headline numbers.

**A filterable invoice table** with sortable columns — date, due date, status, amount. Filter by status, by date range, or by free-text search.

**An inline drilldown** on every invoice. Click a row and the line items expand, with each line traced back to the underlying operational event (the stop, the storage day, the pick, the label) so the client can see exactly what they're being charged for. Payment metadata for any payments received. The full reminder timeline (when reminders went out, what they said). Any dispute conversation that's been recorded against the invoice.

Worth noting: certain operator-internal notes (the disposition notes your team writes when resolving a dispute) are excluded from the client view by design — at the data query layer, not at the display layer, so there's no path for a future bug to leak them. Clients see the dispute conversation that involves them; they don't see your team's internal notes about how you decided to handle it.

For the client, this is the equivalent of giving them a fully self-serve view into their account with you. For your operations, it's the difference between handling 20 billing questions a week and handling two.

## The smaller stuff worth mentioning

Two smaller items also landed today:

**Better error messages on billing actions.** When something goes wrong during a billing operation — an invoice that can't transition to a state because of a precondition, a stale browser tab clicking an action that's already happened — you now see a specific message explaining what's going on, not a generic system error. The kind of thing you don't notice when it's working and you absolutely notice when the previous version was making you guess.

**Security work behind the scenes** that hardens the platform against a category of misconfiguration that affects multi-tenant systems. Not customer-facing, not something you'll see in the UI, but worth knowing the work is being done.

## Why these three together

Take the three operator-facing items in sequence and the shape of the win is clear:

The reminders mean your overdue invoices get followed up on without your team drafting emails. The AR aging in the portal means your clients can answer "what do I owe" without asking. The full billing page means they can answer "what is this charge" without asking either.

The combined effect is your billing operation getting smaller — not because you have less billing volume, but because each billing transaction generates fewer inbound questions and less manual follow-up. Your finance person spends their time on the things that actually need human judgment (large disputes, contract renegotiations, special arrangements) and stops drafting status emails.

Three changes. Today. Live on the platform.

## What's next

The shape of the next round of work is being driven by what operators on the platform actually need most — the next set of features will reflect that. The forward-looking sequence is published on the [roadmap page](/roadmap), with each item described in operator language and tied back to a build-log post where applicable.

If you want to see automated reminders running on your typical billing cycle, or the client portal running with your client list, [book a 30-minute walkthrough](/contact). Fastest path: a screen-share where we plug in your numbers and show you exactly what changes.

— Michael
