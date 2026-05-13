---

title: "Three days, 13 ships: AR aging, throughput, and an integrity sweep"  
description: "What we shipped over three days in May: AR aging, warehouse throughput reporting, and a defense-in-depth pass on invoice integrity. A founder's build log."  
author: michael  
publishDate: 2026-05-12  
pillar: commentary  
tags: ["build log", "AR aging", "throughput", "billing", "operator updates"]  
readingMinutes: 8  
draft: false  
featured: false  
faq:

- q: "Is the platform live for customers right now?"
a: "We're in pre-launch and lining up our first design-partner customers. Everything described in this post is shipped and running on the platform. If you're a mid-size 3PL interested in being an early customer, the contact form is the right next step."
- q: "How can a small team ship this much in three days?"
a: "Two things: tight scope per chunk (each piece does one thing), and an explicit habit of splitting data-integrity work out as its own precursor before building the report or screen on top of it. The data shape is settled before the surface lands. Reports never end up showing the wrong number because the column wasn't there yet."
- q: "What's the next thing you're shipping?"
a: "Billing depth: invoice line-item drilldown, dispute workflow, and a few pieces that connect the operational ledger to a clean exportable invoice. After that, finishing the B2B client portal rebuild (B2B Billing page, then a public storefront) is the path to platform completeness for a 3PL operator."
- q: "Where can I see this in action?"
a: "Schedule a 30-minute walkthrough through the contact form. The fastest version is a screen-share where I show the AR aging and throughput screens running on real data, then we plug in your operation and see what would change."

---

Three days. Thirteen things shipped. AR aging, warehouse throughput, a four-step pass on invoice integrity, and a settings page that quietly stopped losing data when operators clicked Save. I want to walk through what landed and, more importantly, why it landed in this particular order — because the sequencing tells you more about how this product is going to evolve than the individual changes do.

## What you can do this morning that you couldn't on Friday

### See your accounts receivable aging at a glance

The new **AR Aging report** does exactly what the name says. Pick an "as of" date (defaults to today, but you can backdate it to reconcile against month-end statements). The report shows every customer's open AR bucketed into 0-30 days, 31-60, 61-90, 90+, and a separate column for disputed invoices. Click any row to drill into the underlying invoices that make up the balance.

Two design choices worth naming. First, the date is a single point-in-time picker, not a range — AR aging is fundamentally a snapshot question, and the report's math reflects that. Second, disputed invoices get their own column instead of being rolled into the aging buckets. Disputed AR isn't aged AR. Treating them the same hides the fact that some of your "90+" balance is actually frozen pending resolution, not unpaid.

Backdating works correctly. If you put May 1 into the date picker, the report shows what your AR looked like on May 1 — sent invoices that hadn't been paid yet, in the buckets they would have been in on that day. Useful for explaining the difference between what your books showed at month-end and what showed up in your morning meeting.

### See actual throughput, not vibes

The new **Throughput Report** is what we shipped on the operations side. Five charts:

- Orders shipped per day (or per week — toggle at the top)
- Pallets received per day
- Picks completed per day
- Packs completed per day
- Cycle time — orders shipped vs orders created — with both p50 (median) and p90 (the slow tail) plotted as lines

Above the charts, a strip of stat cards summarizes range totals plus the latest p50 and p90 cycle times. The granularity toggle (Day / Week) is a reusable primitive — the same toggle will show up on every time-series report we ship from here.

The cycle-time chart is the one I'd start with. Most 3PLs have a hand-wavy sense of "we ship same-day or next-day for most orders" and a much vaguer sense of how often that breaks. The p90 line tells you the truth: for the slowest 10% of your orders, what's the cycle time, and is it getting worse?

### Trust the invoice you just sent

This is the chunk of work I'm most actually proud of, and it's probably the least exciting to read about. We did a four-part pass on the integrity of invoice data — every step landed because the previous step's audit surfaced a failure mode we hadn't considered.

The shape:

1. **Due dates exist now.** Until Tuesday, the `invoices` table had no `due_date` column. Net terms lived as a vibe ("we're net-30, mostly"). The migration added a real `due_date` populated by a function that resolves the right value: business-specific override → tenant default → 30. Existing invoices got backfilled. New invoices get the right `due_date` at the moment they're created.
2. **AR aging now means something.** Once due dates were real, the AR aging report could be built on top. (See above.)
3. **Status and timestamps can't disagree.** The audit on the AR aging chunk surfaced five rows where the invoice's `status` and its `paid_at` / `sent_at` timestamps disagreed (an invoice marked `paid` with no `paid_at` value, etc.). We backfilled the inconsistencies, then added a database-level constraint that prevents the inconsistency from happening again. After the cleanup, two customer accounts' open AR shifted noticeably — one by $2,185, one by $567 — because the underlying data was finally coherent.
4. **Critical actions can't fail silently.** While auditing the constraint, we discovered that the API endpoints for canceling and voiding an invoice would accept the action without requiring a reason. Both endpoints now return a 400 if the reason is empty, and the dialogs that submit those requests gate the button on a non-empty reason field. Three layers of defense (UI, API, DB) for the actions that an operator would never want to undo silently.

The reason this is worth four paragraphs: the integrity layer is what makes the rest of the product trustworthy. An AR aging report on top of inconsistent data is worse than no report at all — it gives you a number you'd defend in a client meeting, and the number is wrong. We did the boring work first.

### Stop losing data when you save settings

The Settings page had a bug class that was almost worse than a normal bug — it was decoratively wrong. The General tab showed inputs labeled "Facility Name," "Facility Code," "Facility Address," and "Timezone," and the Save button looked exactly like a save button. None of those inputs mapped to anything in the database. If the save handler had ever fired, it would have written nothing — but if it had been "fixed" by hooking up the wrong columns, it would have overwritten valid data with the wrong fields.

The fix: every input now maps to a real column on the right table. Save persists what you typed. The Users tab — which used to dead-end at a placeholder — now redirects to the actual employee management screen with a banner explaining the move. The Integrations tab (which had decorative "Connected" indicators that were lying) is hidden until we have something real to put there.

Honest UI is part of the product. If a tab is decorative, hide it. If a button doesn't do what it looks like it does, take it off the screen.

### See revenue by customer

The new **Revenue by Customer** report (added on the operator-revenue side, separate from the operator-AR side) lets you slice your revenue by client tenant over any date range. It uses the same `DateRangeFilter` primitive as the rest of the reports, sorts and filters in-place, and exports cleanly. It's the report you pull up when a client asks for a quarterly summary, or when you're reviewing which customers are actually carrying your operation.

## The pattern behind the cadence

Five of the thirteen ships were "precursor" chunks — small, focused changes that prepared the ground for the report or screen that followed. The pattern goes like this:

> When the build chunk's audit surfaces missing data, inconsistent data, or a column that doesn't exist yet, we split off the integrity fix as its own precursor. The precursor ships first. Then the report or screen lands on top.

Three days, three precursors:

- **Due dates** before AR aging
- `**shipped_at` timestamps** before the throughput cycle-time chart
- **Status/timestamp consistency** before letting invoices change state via the dialog

Each precursor was small. Each had its own audit-build-verify loop. None of them were exciting on their own. All of them are why the reports built on top of them aren't quietly lying.

The alternative — what most software gets shipped this way avoids — would be to push the report out the door using whatever the data shape happened to be on Monday, and then quietly patch the underlying data later when the customer notices a number is wrong. That's how reports earn the reputation for being "directional" instead of authoritative. We chose the slower order on purpose.

## What's next

The locked sequence from here:

1. **Billing depth.** Invoice line-item drilldown, dispute workflow, and the connective tissue that makes the operational event ledger feel like a full billing surface. This is the last chunk of the originally-scoped operator billing arc.
2. **B2B Reports rewrite.** The current B2B reports surface for client tenants is honest but skeletal. The rewrite gives clients the same caliber of analytics operators have.
3. **B2B Billing page.** Clients see their own billing inside the client portal — line items, statements, invoice status. Eliminates the "can you re-send my invoice" email entirely.
4. **B2B storefront.** A public-facing surface where end customers of a 3PL's clients can see their order status without an account. Last piece of the platform-completeness arc for a 3PL operator.

I'm not going to put dates on those because dates on roadmap items are how trust gets eroded. They'll ship in that order, and they'll ship at roughly the cadence of the last three days. Subscribe to the [blog feed](/blog) or follow along on [LinkedIn](#) (link going live shortly) for updates.

## A note on this being pre-customer

Everything in this post is shipped and running on the platform. None of it is shipped to a paying customer yet — we're actively lining up our first design-partner operators. If you're running a mid-size 3PL (200–1,000 monthly orders, 3–10 active client brands) and the work above is the kind of work you'd want a vendor to actually be doing, the [contact form](/contact) is the right next step. The first three customers will get unusually direct access to me and the roadmap.

— Michael