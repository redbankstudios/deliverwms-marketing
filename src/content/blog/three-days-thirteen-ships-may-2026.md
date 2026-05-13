---
title: "Five new ways to run your warehouse better — what shipped this week"
description: "AR aging, real throughput numbers, defensible invoices, and a settings page that actually saves. Five new things you can do in your warehouse this week."
author: michael
publishDate: 2026-05-12
pillar: commentary
tags: ["AR aging", "throughput", "billing", "operator updates"]
readingMinutes: 5
draft: false
featured: true
faq:
  - q: "What does the AR Aging report do for me?"
    a: "It tells you exactly how much each customer owes you and how late they are, so you can prioritize collections instead of chasing the wrong accounts. Backdate it to any month-end and your books match the report."
  - q: "Why does cycle time matter?"
    a: "Because most warehouse owners think they ship fast and have no proof. Real cycle-time data shows you the slowest 10% of your orders — the ones that hurt your reputation — so you can fix the bottleneck instead of guessing."
  - q: "How does this make my invoices defensible?"
    a: "Every billable event is captured the second it happens — every stop, every label, every storage day. When a client questions a line on their invoice, you point at the event behind it. Disputes drop to almost zero."
  - q: "How do I see this in action?"
    a: "Book a 30-minute walkthrough through the contact form. The fastest version is a screen-share where we plug in your numbers and show you exactly what changes."
---

Five new things landed in your warehouse this week. Each one solves a problem most warehouse owners are dealing with right now, whether they realize it or not. Here's what they are and why they matter.

## Know exactly who owes you what

The new **AR Aging report** shows every customer's open balance, bucketed into 0–30 days, 31–60, 61–90, 90+, and a separate column for disputed invoices. Click any row to drill into the specific invoices that make up the balance.

Two things make this useful instead of just pretty:

You can backdate it. Pick any past date and the report shows what your AR looked like that day — sent invoices that hadn't been paid yet, in the buckets they would have been in. Useful when you're reconciling against a client's month-end statement and the numbers don't match.

Disputed invoices get their own column. They don't roll into the aging buckets because disputed AR isn't aged AR — it's frozen pending resolution. Treating them the same hides the fact that some of your "90+" balance is stuck in conversation, not unpaid.

If you're chasing collections by gut feel today, this report tells you exactly which accounts to call first.

## See your real warehouse throughput

The new **Throughput Report** shows what's actually happening on the floor: orders shipped per day, pallets received, picks completed, packs completed, and cycle time — how long it takes between an order arriving and shipping out — broken into a median and a "slowest 10%" line.

The cycle-time chart is the one most warehouse owners should look at first. Every operator has a sense that they ship "same-day or next-day for most orders." Most are wrong about how often that breaks down. The slowest-10% line tells you exactly how often, and whether it's getting worse or better. That's the number you can actually act on.

Toggle the whole report between Day and Week views with one click. Filter to a date range. Done.

## Send invoices you can defend line by line

We made a four-part pass on the integrity of invoice data. The result: when a client questions a line on their bill, you can point at the exact event behind it — the pick, the stop, the storage day — instead of going back to recompute from scratch.

What that looks like in practice:

Every invoice now has a real due date computed from your net terms (overridable per client, defaults to 30 days). The AR Aging report uses these to bucket invoices accurately.

Status and timestamps can't disagree anymore. If an invoice says "paid," there's a payment date on it. If an invoice says "sent," there's a sent date on it. The system rejects any combination that doesn't add up — accidentally or otherwise.

Critical actions like canceling or voiding an invoice now require a written reason. Three layers of protection — the form, the system that processes it, the database underneath — all check the reason is there before the action goes through. No silent edits to invoices a client might dispute later.

This is the kind of work that's invisible until you need it. The first time a client emails saying "this invoice is wrong," you'll be glad it's there.

## Stop losing data when you save settings

The Settings page used to show fields that looked saveable but weren't actually wired to anywhere in your data. Edit your facility name, click Save — nothing happened.

Now every input maps to a real field on the right table. Save persists what you typed. The Users tab — which used to dead-end at a placeholder — redirects to the actual employee management screen. The Integrations tab is hidden until we have something real to put there.

Honest UI is part of the product. If a tab is decorative, it shouldn't be on screen.

## See revenue by customer

The new **Revenue by Customer** report lets you slice your revenue by client over any date range. Sort, filter, export. It's the report you pull up when a client asks for a quarterly summary, or when you're deciding which accounts are actually carrying your operation.

## Why the order matters

Five new features. The order they shipped in matters more than the individual changes.

We built the data underneath each report before we built the report. Due dates exist before AR aging is calculated. Shipped-at timestamps exist before cycle time is charted. Status-versus-timestamp consistency is enforced before invoices change state.

Most warehouse software gets shipped the other way around — feature first, fix the underlying data when a customer notices something's wrong. That's how reports earn the reputation for being "directional" instead of authoritative. We chose the slower order on purpose, so the reports you'll act on this week aren't quietly lying to you.

## What's next

The next round of work focuses on billing depth — line-item drilldown, dispute workflow polish, and connecting the operational record to a clean exportable invoice. After that, completing the B2B client portal so your clients can self-serve their own billing and inventory questions.

If you want to see any of this running on your operation's numbers, [book a 30-minute walkthrough](/contact). The fastest version is a screen-share where we plug in your monthly volumes and you see exactly what changes.

— Michael
