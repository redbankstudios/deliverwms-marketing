/**
 * Astro Content Collections schema for the Deliver WMS blog.
 *
 * The Zod schema below is intentionally strict — every post must declare an
 * author, publishDate, and at least one pillar tag, because those fields feed
 * directly into the Article + Person JSON-LD that ships with every post.
 *
 * Adding a new author? Edit src/lib/authors.ts.
 * Adding a new pillar? Edit the `pillar` enum below.
 */

import { defineCollection, z } from 'astro:content';
import { AUTHOR_SLUGS } from '@/lib/authors';

const blog = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      // Required SEO/AEO fields
      title: z.string().min(20, 'Title should be at least 20 chars for SERP coverage').max(70),
      description: z.string().min(60, 'Meta description should be ≥60 chars').max(165),

      // Authorship + dates (drive Article + Person schema)
      author: z.enum(AUTHOR_SLUGS),
      publishDate: z.date(),
      updateDate: z.date().optional(),

      // Hero / Open Graph
      heroImage: image().optional(),
      ogImage: z.string().url().optional(), // absolute URL; defaults to brand fallback at render time

      // Categorization
      pillar: z.enum(['how-to', 'benchmark', 'commentary']),
      tags: z.array(z.string()).min(1).max(8),
      readingMinutes: z.number().int().positive().optional(),

      // Optional structured-data inputs
      faq: z
        .array(
          z.object({
            q: z.string(),
            a: z.string(),
          })
        )
        .optional(),

      howto: z
        .object({
          name: z.string(),
          description: z.string(),
          totalTime: z.string().optional(), // ISO 8601 duration
          steps: z.array(
            z.object({
              name: z.string(),
              text: z.string(),
            })
          ),
        })
        .optional(),

      // Lifecycle
      draft: z.boolean().default(false),
      featured: z.boolean().default(false),
      canonicalOverride: z.string().url().optional(),
    }),
});

/**
 * Legal documents — Privacy Policy, Terms of Service, MSA, DPA.
 * Stored as markdown so the prose is easy to update and review without
 * touching component code. Rendered via src/pages/legal/[slug].astro.
 */
const legal = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    shortTitle: z.string(), // for breadcrumb + nav
    description: z.string().min(60).max(165),
    summary: z.string(), // 1-2 sentence hero blurb
    effectiveDate: z.date(),
    lastUpdated: z.date(),
    version: z.string().default('1.0'),
    order: z.number().int().positive(), // for footer/nav ordering
  }),
});

export const collections = { blog, legal };
