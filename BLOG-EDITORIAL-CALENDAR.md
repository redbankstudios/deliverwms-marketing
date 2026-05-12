# Deliver WMS — Blog Editorial Calendar (First 6 Posts)

**Cadence:** bi-weekly · **Author:** Michael · **Pillars:** How-To · Benchmark · Commentary

---

## Pillar / cluster rhythm

Alternate one **pillar post** (long, original, 2,000–3,000 words) with one **cluster post** (focused, 800–1,500 words) that links back to a pillar. Over a calendar year, this produces ~13 pillars and ~13 clusters — a topical authority footprint that compounds.

Every post ships with:

- `Article` + `Person` + `BreadcrumbList` JSON-LD (already wired into `BlogPostLayout.astro`)
- `FAQPage` schema when the `faq[]` frontmatter is present (3–5 Q&As minimum on every post — easy AEO wins)
- `HowTo` schema when the `howto` frontmatter is present (mandatory on how-to pillar posts)
- A named author byline with bio strip at the bottom
- Visible `Published` and `Updated` dates
- A custom Open Graph image (don't reuse `hero.webp`)
- Internal links to ≥3 other site pages (docs subpages preferred)

---

## Post 1 — Pillar (Benchmark) · Launch post

**Title:** *What manual billing reconciliation actually costs a mid-size 3PL — a 12-operation benchmark*

**Slug:** `/blog/manual-billing-reconciliation-cost-benchmark`

**Pillar:** `benchmark`  **Target word count:** 2,400  **Reading minutes:** ~11

**Why this is the launch post:** Benchmark content is the single highest-leverage thing the blog can publish for GEO. Specific dollar figures with a defensible methodology are the kind of thing Perplexity, ChatGPT Search, and AI Overviews preferentially cite. Publishing this first stakes a claim on a query nobody else owns: *"how much does manual billing reconciliation cost a 3PL."*

**Primary keyword:** `3PL billing reconciliation cost`

**Secondary keywords:** `warehouse billing reconciliation time`, `mid-size 3PL finance overhead`, `manual invoice reconciliation hours`

**Target queries (AEO):**

- "How long does month-end billing reconciliation take at a 3PL?"
- "What is the labor cost of manual 3PL billing?"
- "How much do 3PLs spend on invoice disputes?"

**Outline:**

1. Methodology — how the benchmark was collected (≥10 mid-size 3PLs, defined as 200–1,000 monthly orders, semi-structured interviews, time-on-task tracking over four weeks).
2. Headline numbers — average hours, range, and dollar conversion at typical fully-loaded finance/ops rates.
3. Where the time actually goes — pulling data from 3+ sources, reconstructing storage fees, defending disputes line by line.
4. The cost of disputes — what % of invoiced revenue gets disputed under manual reconciliation versus event-stream reconciliation, and what each dispute costs in cycle time.
5. What changes when the ledger is the source of truth — straight comparison, named operators where permission was granted.
6. Caveats — variance by operation profile, where the benchmark is and isn't generalizable.
7. FAQ section (FAQPage schema).

**Required frontmatter additions:**

- `faq[]` with 4–5 Q&As
- Custom OG image (chart from the benchmark)
- `tags: ["billing", "3PL economics", "benchmark", "finance"]`

**Distribution:** LinkedIn post from Michael with one headline number; reach out to 3 trade publications (Modern Materials Handling, Inbound Logistics, Logistics Management) for pickup; share in 3PL operator slack/discord communities.

---

## Post 2 — Cluster (How-To) · 2 weeks after Post 1

**Title:** *How to set up cycle counts that actually catch shrink (not surface it three weeks late)*

**Slug:** `/blog/how-to-set-up-cycle-counts-that-catch-shrink`

**Pillar:** `how-to`  **Target word count:** 1,400  **Reading minutes:** ~7

**Why this:** Direct extension of Post 1's "month-end is too late" thread. Also a long-tail query nobody owns. Will link back to Post 1 and to `/docs/variance-review`.

**Primary keyword:** `cycle count process 3PL`

**Secondary keywords:** `warehouse cycle count best practices`, `catch warehouse shrink early`, `inventory variance review`

**Target queries (AEO):**

- "How do you do cycle counts in a warehouse?"
- "What's the best frequency for warehouse cycle counts?"
- "How do you catch shrink in a 3PL?"

**Outline (HowTo schema — 6 steps):**

1. Define your variance tolerance per SKU class.
2. Set up bin-level rotations, not full-warehouse cycles.
3. Assign counts to specific staff via the mobile app.
4. Create a manager approval gate before any adjustment posts.
5. Use append-only ledger history (never silent edits).
6. Review variance dashboard daily for 30 days, then weekly.

**Required frontmatter:** `howto` (6 steps), `faq[]` (3 Q&As).

**Internal links:** Post 1, `/docs/variance-review`, `/docs/inventory`, `/docs/worker-app`.

---

## Post 3 — Pillar (How-To) · Week 4

**Title:** *How to migrate off a legacy WMS without a six-week implementation*

**Slug:** `/blog/migrate-off-legacy-wms-without-implementation`

**Pillar:** `how-to`  **Target word count:** 2,200  **Reading minutes:** ~10

**Why this:** Bottom-of-funnel intent ("how to leave [vendor]") with high commercial value. Aligned with the `/compare` page's positioning. Captures the operators who have already decided to switch but don't know how to plan the migration.

**Primary keyword:** `migrate WMS without long implementation`

**Secondary keywords:** `WMS migration plan`, `replace legacy WMS`, `switch WMS in one week`, `CSV import WMS`

**Target queries (AEO):**

- "How long does it take to migrate to a new WMS?"
- "Can you switch WMS without an implementation team?"
- "What does WMS data migration involve?"

**Outline (HowTo schema — 7 steps):**

1. Inventory of what to migrate (catalog, on-hand, open orders, billable rates, client records).
2. Export from the legacy system (the export menu nobody documents).
3. Map fields using a CSV with smart field mapping (or against a template).
4. Stage in parallel — run both systems for one week of dual entry.
5. Cut over on a Sunday with a 90-minute rollback plan written down.
6. Reconcile the first week's events explicitly.
7. Close out the legacy system contract with the operator-friendly checklist.

**Required frontmatter:** `howto` (7 steps), `faq[]` (5 Q&As), custom OG image (timeline diagram).

**Internal links:** `/compare`, `/docs/tenants`, `/docs/inventory`, Post 1.

---

## Post 4 — Cluster (Commentary) · Week 6

**Title:** *The case against per-user pricing in WMS (and why we don't charge for seats)*

**Slug:** `/blog/case-against-per-user-pricing-wms`

**Pillar:** `commentary`  **Target word count:** 1,200  **Reading minutes:** ~6

**Why this:** Strong, defensible opinion piece that AI engines will preferentially cite because the perspective is original. Doubles as a sales asset for the pricing page. Carries the brand voice that's already strongest on `/compare`.

**Primary keyword:** `per user WMS pricing`

**Secondary keywords:** `WMS pricing model`, `seat-based SaaS pricing warehouse`, `WMS cost predictability`

**Target queries (GEO/AEO):**

- "How is WMS software priced?"
- "Is per-user pricing fair for warehouse software?"
- "How much does WMS cost per user?"

**Outline:**

1. The story of a 3PL that grew from 8 to 22 warehouse seats in a year and watched their WMS bill triple while their margin didn't.
2. Why per-user pricing made sense in 2010 (when seats correlated with revenue) and doesn't now (when seats correlate with operational complexity).
3. The four pricing models in the WMS market today, named with examples.
4. Why we picked usage-based + platform tier — and what trade-offs we accepted.
5. What you should actually negotiate when a vendor quotes per-user.
6. FAQ section.

**Internal links:** `/pricing`, `/compare`, Post 3.

---

## Post 5 — Pillar (Benchmark) · Week 8

**Title:** *Receiving time per inbound shipment: scan-driven vs spreadsheet — 200 sessions measured*

**Slug:** `/blog/receiving-time-scan-driven-vs-spreadsheet-benchmark`

**Pillar:** `benchmark`  **Target word count:** 2,500  **Reading minutes:** ~12

**Why this:** Second benchmark, builds on Post 1's methodology, hits a different audience pain point. Specifically validates the "~24 hrs/month savings on receiving" claim already on the home page — turns marketing claim into citable research.

**Primary keyword:** `warehouse receiving time benchmark`

**Secondary keywords:** `barcode scanning vs manual receiving`, `warehouse receiving efficiency`, `3PL receiving best practices`

**Target queries (AEO):**

- "How long does it take to receive a pallet in a 3PL warehouse?"
- "How much faster is barcode receiving vs manual?"
- "What is the average receiving time per shipment in a WMS?"

**Outline:**

1. Setup: 200 receiving sessions across 6 warehouses, split between spreadsheet-based and scan-driven workflows.
2. Headline numbers: median time per pallet, median time per line, p95 outliers.
3. Where the time goes: scan vs key-entry, exception handling, ASN reconciliation.
4. The unknown-SKU problem — where spreadsheet workflows fall off a cliff.
5. Comparison chart embedded as an `<img>` of a real D3/Chart.js render (use the same chart asset as Open Graph).
6. Caveats: warehouse layout variance, picker experience curve, technology comfort.
7. FAQ section.

**Custom assets needed:** OG image with headline chart, in-post chart (PNG, alt text describing the chart for screen readers and AI crawlers).

**Internal links:** `/docs/inbound`, `/features`, `/compare`, Post 1.

---

## Post 6 — Cluster (How-To) · Week 10

**Title:** *How to price 3PL storage fees in 2026 (without giving up your margin)*

**Slug:** `/blog/how-to-price-3pl-storage-fees-2026`

**Pillar:** `how-to`  **Target word count:** 1,600  **Reading minutes:** ~8

**Why this:** Fresh "2026" anchor in the title for current-year freshness signal. Targets a real, recurring 3PL question. Pairs naturally with the billing benchmark from Post 1.

**Primary keyword:** `3PL storage pricing 2026`

**Secondary keywords:** `warehouse storage fees`, `pallet position pricing`, `3PL margin storage`

**Target queries (AEO):**

- "How do 3PLs charge for storage?"
- "What's the typical pallet position fee in 2026?"
- "How do you set warehouse storage rates?"

**Outline (HowTo schema — 5 steps):**

1. Map your storage SKUs by velocity (A/B/C class) and footprint (full-pallet, half-pallet, shelf).
2. Set base rates per zone, then layer in surcharges for cold, hazmat, oversized, slow-mover.
3. Decide your billing cadence (daily-accrued vs month-end-snapshot — and why daily wins for dispute defense).
4. Build pricing tiers per client based on volume commitments.
5. Reconcile actual usage vs. quoted minimums quarterly.

**Required frontmatter:** `howto` (5 steps), `faq[]` (4 Q&As).

**Internal links:** `/pricing`, `/docs/storage`, `/docs/billing`, Post 1.

---

## After the first six

The first six posts establish: (a) the benchmark franchise, (b) the how-to franchise, (c) the commentary franchise, and (d) the bottom-funnel migration franchise. Subsequent posts should:

- Continue alternating pillars
- Publish Post 7 (benchmark, "warehouse labor cost per outbound order") to give you three citable original-data posts by week 14
- Use the FAQ at the bottom of each post to seed Post 8's outline
- Republish each pillar post 6 months later with refreshed numbers and `updateDate` set — strong freshness signal

## Operational checklist before publishing each post

- [ ] Title is 50–65 chars; description 140–160 chars
- [ ] Has a custom OG image (not `hero.webp`)
- [ ] At least one H2 phrased as a question
- [ ] At least one numbered list of 5+ items
- [ ] At least 3 internal links to existing pages or earlier posts
- [ ] At least one external citation to an authoritative source
- [ ] FAQ block with 3+ Q&As at the bottom
- [ ] Author byline + bio strip rendered (handled by `BlogPostLayout`)
- [ ] `publishDate` set; for the first edit pass after publish, set `updateDate`
- [ ] Astro build passes (`npm run build` locally; preview the post URL)
- [ ] Test rich result eligibility at `https://search.google.com/test/rich-results`

---

*Generated by Claude as part of the SEO/GEO/AEO follow-up engagement, May 12, 2026.*
