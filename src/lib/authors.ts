/**
 * Author registry. Each author's `slug` becomes a Content Collection enum value
 * and powers the Person schema attached to every blog post.
 *
 * To add a new author:
 *   1. Add an entry below
 *   2. Run `astro check` — TypeScript will tell you everywhere you need to update
 */

import { SITE_URL } from './brand';

export interface Author {
  slug: string;
  name: string;
  jobTitle: string;
  bio: string;
  image: string;
  sameAs: string[];
}

export const AUTHORS = {
  michael: {
    slug: 'michael',
    name: 'Michael',
    jobTitle: 'Founder & Builder, Deliver WMS',
    bio: 'Business owner and software engineer. Builds Deliver WMS — a simpler, more intuitive, more cost-effective WMS for the operators legacy vendors leave behind.',
    image: `${SITE_URL}/images/founder.jpeg`,
    sameAs: [], // add LinkedIn / X here when ready
  },
} as const satisfies Record<string, Author>;

export type AuthorSlug = keyof typeof AUTHORS;

export const AUTHOR_SLUGS = Object.keys(AUTHORS) as [AuthorSlug, ...AuthorSlug[]];

export function authorIdFor(slug: AuthorSlug): string {
  // Stable @id that the Article.author can reference and the /about page
  // can also expose. Keep it consistent everywhere.
  return slug === 'michael'
    ? `${SITE_URL}/about#michael`
    : `${SITE_URL}/team/${slug}#person`;
}
