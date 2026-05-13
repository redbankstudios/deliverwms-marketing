---
title: "Three things every WMS should get right — and most don't"
description: "Your data stays separate from every other tenant. You can sign up and be working in two minutes. Every billable event becomes an invoice line you can defend."
author: michael
publishDate: 2026-04-25
pillar: commentary
tags: ["multi-tenant", "onboarding", "billing", "trust"]
readingMinutes: 6
draft: false
featured: false
faq:
  - q: "What does 'your data stays separate' actually mean?"
    a: "If you run a 3PL with twenty clients, every report, every search, every export, and every API call is locked to one client at a time. There is no path — accidental or otherwise — for one client to see another's data. Most WMS vendors enforce this in application code, where developers can forget the rule. We enforce it at the database itself, where it can't be forgotten."
  - q: "How fast can I be working in the platform?"
    a: "Under two minutes from filling out the signup form to seeing your dashboard. A self-serve checklist walks you through the four things you need to do first: set up billing, add a warehouse, add your first client, invite a teammate."
  - q: "What's a 'billable event'?"
    a: "Anything you charge a client for: a stop on a delivery route, a label printed, a pallet position used for a day of storage, a pick completed. Every one of those is captured the moment it happens, with the rate that was in effect at that moment. When the client questions a line on their invoice, you point at the event behind it."
  - q: "Will switching to Deliver WMS mean a six-week implementation?"
    a: "No. Most mid-size 3PLs are operational on Deliver WMS within a week. Bring your existing data through the CSV import flow with smart field mapping. There's no SOW and no consulting engagement to opt in to."
---

There are three things every WMS needs to get right. None of them show up in a feature list. All of them show up in your operation every day. Most WMS vendors get one or two of them right and quietly compromise on the third. We built Deliver WMS to get all three.

This post is about what those three things are, why they matter to you, and how we handle each one.

## One — your data stays separate from every other tenant

If you're running a 3PL with multiple clients, the most important promise the WMS makes is that one client's data never crosses with another's. A picker handling SKUs for client A and client B in adjacent bins shouldn't see B's order list when they're working on A's. A report you run for client A shouldn't accidentally include numbers from client B. An export you send to client A shouldn't have stray rows from anyone else.

This sounds obvious. It's also the place where most WMS vendors quietly cut corners.

The cheap way to enforce data separation is to add a "client ID" filter on every query and remember to include it. That works until a developer forgets the filter, or a new feature ships with the filter missing on one query, or a report aggregates across clients by accident. Each of those is a quiet leak that doesn't fail loudly until a client notices their data showed up in a report they shouldn't have seen. By then the damage is done.

The right way to enforce data separation is to make it a database-level guarantee that can't be bypassed. Every table knows which client every row belongs to. Every query the system runs is automatically locked to the calling user's client. The database itself rejects any read that crosses client boundaries — even by accident, even if the application code is buggy.

We chose the right way. Across our platform, that protection is enforced through dozens of database-level policies, every one of which we verified by logging in as a test client account and confirming we couldn't see any other client's data — through the UI, through search, through any API call.

For you as an operator, this means: when you tell a client "your data is isolated from every other client we serve," it's a promise the database itself will keep, not just a promise your team has to remember.

## Two — you can sign up and be working in two minutes

Onboarding is the part of any business platform where most operators stick or don't. The bar isn't elegance. The bar is whether you can sign up, get to a working dashboard, and start doing real work without a phone call.

We built signup to clear that bar.

A prospect visits the marketing site, fills in email, password, company name, and a preferred subdomain. Submit. The system creates the account, sets up your tenant, gives you a default warehouse, logs you in, and lands you on the dashboard. Total elapsed time: about two minutes.

The dashboard shows a checklist of the four things you need to do first: set up billing, add a real warehouse if you want one different from the default, add your first client, invite a teammate. The checklist disappears the moment all four are done. No hand-holding wizard, no forced tour, just a short list of next steps you can knock out at your own pace.

If you sign up at midnight, you're in your dashboard at 12:02 AM. No demo call required. No salesperson required. If you want a walkthrough, you can book one — but the platform doesn't gate access behind it.

For warehouse owners who've sat through eight-week WMS implementations with consulting fees attached, this is the difference between trying the product over a weekend and waiting two months to find out if it fits.

## Three — every billable event becomes an invoice line you can defend

The single biggest hidden cost in 3PL operations is billing reconciliation. Most operators reconstruct invoices at month-end from operational data scattered across three to five systems — a spreadsheet of storage charges, a dispatcher's notes, the WMS report, the returns log. The process is slow, error-prone, and produces invoices that clients dispute because they can't tell what they're being charged for.

We built billing the other way around. Every billable event — a stop completed on a route, a label printed, a pallet stored for a day, a pick completed, a return processed — is captured the moment the operational action happens. The event records the exact rate in effect at that moment, the client it belongs to, and a reference back to the originating action.

When a client questions a line on their invoice, the answer is concrete: "This $4.50 charge is for the 38 picks completed for your account between 9:14 and 11:32 on March 14th. Here's the picker, here's the bin, here's each order they belonged to."

Most disputes evaporate at that level of specificity, because the work is real and the operator can point at it. The remaining disputes are real disagreements about rates, which are productive conversations.

For you as an operator, this means three things:

**Faster billing close.** Most operations on the platform close their month-end billing in an hour, not a day, because the invoices are already written by the time the month ends.

**Cleaner DSO.** Fewer disputes mean faster collection. Invoices that don't get questioned get paid on time.

**Real-time cost-to-serve per client.** You can see this minute whether a client is profitable, not three weeks after the period closes.

## What this foundation enables

These three pieces — data separation, fast onboarding, defensible billing — are the foundation everything else builds on. They're the work most WMS vendors skip because they don't show up in a demo. We built them first because every report, every dashboard, and every feature you'll use on Deliver WMS depends on them being right.

If you want to see the platform with your operation's actual numbers — your monthly volume, your client count, your typical cost-to-serve — [book a 30-minute walkthrough](/contact). Fastest path: a screen-share where we plug in your numbers and you see what changes.

— Michael
