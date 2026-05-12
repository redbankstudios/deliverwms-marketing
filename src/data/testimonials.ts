/**
 * Customer testimonials registry.
 *
 * IMPORTANT — fill these in with REAL customer data before going to production.
 * The placeholders below are clearly marked TODO so the homepage renders a
 * "stand-in" layout you can replace one card at a time. Set
 * `placeholder: false` once a card is real.
 *
 * Why this matters: named customer proof with quantified outcomes is the
 * single biggest E-E-A-T signal an AI search engine evaluates. Extensiv's
 * homepage features 7+ of these. Three real ones gets you to parity.
 *
 * Each testimonial that is NOT a placeholder emits Review schema and
 * contributes to AggregateRating math on the product.
 */

export interface Testimonial {
  id: string;
  /** False = use this in production. True = TODO placeholder, won't emit Review schema. */
  placeholder: boolean;
  quote: string;
  authorName: string;
  authorTitle: string;
  companyName: string;
  /** Optional avatar URL — absolute path under /public is fine. */
  avatar?: string;
  /** Optional company logo URL — absolute path under /public is fine. */
  logo?: string;
  /** Headline metric like '$40k saved' or '60 hours per week back'. */
  metric?: string;
  /** Date the quote was provided (ISO string). */
  date?: string;
  /** 1–5 stars. Defaults to 5 if omitted. */
  rating?: number;
  /** Optional published case study URL for "Read the full story →". */
  caseStudyUrl?: string;
}

/**
 * Pre-launch state: empty array. TestimonialsSection and ReviewSchema both
 * detect this and render nothing — the section disappears from the homepage
 * and no Review/AggregateRating schema is emitted. The wiring stays in place
 * so when the first real customer quote lands you only edit this file.
 *
 * Example entry (uncomment + adapt when ready):
 *
 *   {
 *     id: 'acme-3pl-1',
 *     placeholder: false,
 *     quote: 'We cut month-end billing close from twelve hours to under one.',
 *     authorName: 'Jane Doe',
 *     authorTitle: 'Director of Operations',
 *     companyName: 'Acme 3PL',
 *     avatar: '/images/customers/jane-doe.jpg',
 *     logo: '/images/customers/acme-3pl.svg',
 *     metric: '11 hrs / month reclaimed',
 *     date: '2026-06-15',
 *     rating: 5,
 *     caseStudyUrl: '/case-studies/acme-3pl',
 *   },
 */
export const TESTIMONIALS: Testimonial[] = [];

/** Real testimonials (placeholder === false) — these emit Review schema. */
export const realTestimonials = () => TESTIMONIALS.filter((t) => !t.placeholder);
