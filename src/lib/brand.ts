/**
 * Central source of truth for brand entity facts that show up in
 * multiple schema components, the footer, and meta tags. Edit here
 * once, propagates everywhere.
 */

export const SITE_URL = 'https://deliverwms.com';

export const BRAND = {
  name: 'Deliver WMS',
  legalName: 'Deliver WMS',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  email: 'hello@deliverwms.com',
  // Add a real number when ready — strong trust signal for both Google and AI engines.
  telephone: '', // e.g. '+1-555-555-0123'
  description:
    'The all-in-one warehouse management and last-mile delivery platform for 3PLs, eCommerce brands, distributors, and delivery companies.',
  foundingDate: '2025', // adjust to actual founding year
} as const;

/**
 * Optional postal address. If you have a registered business address you're
 * willing to publish, fill it in. Otherwise leave the string fields empty and
 * BaseLayout will skip emitting PostalAddress in the Organization schema.
 */
export const BRAND_ADDRESS = {
  streetAddress: '', // e.g. '123 Main St, Suite 100'
  addressLocality: '', // city, e.g. 'Red Bank'
  addressRegion: '', // state/province code, e.g. 'NJ'
  postalCode: '', // e.g. '07701'
  addressCountry: 'US',
} as const;

/**
 * ContactPoint — how customers reach you. Even one populated channel
 * strengthens the Organization entity in the eyes of Google + AI engines.
 */
export const BRAND_CONTACT_POINTS = [
  {
    contactType: 'sales',
    email: 'hello@deliverwms.com',
    telephone: '', // fill in when phone is live
    availableLanguage: 'English',
    areaServed: 'Worldwide',
  },
] as const;

/**
 * Social profile URLs become Organization.sameAs in the JSON-LD.
 * The sameAs array is one of the strongest signals AI search engines
 * use to confirm an entity exists and is real. Add real URLs as soon
 * as the accounts are live. Empty strings are filtered out.
 */
export const SOCIAL_PROFILES = {
  linkedin: '', // e.g. 'https://www.linkedin.com/company/deliverwms'
  twitter: '', // e.g. 'https://twitter.com/deliverwms'
  github: '', // e.g. 'https://github.com/deliverwms'
  youtube: '', // e.g. 'https://www.youtube.com/@deliverwms'
  crunchbase: '', // e.g. 'https://www.crunchbase.com/organization/deliverwms'
} as const;

export const SAME_AS: string[] = Object.values(SOCIAL_PROFILES).filter(
  (url): url is string => Boolean(url)
);

/**
 * Founder / primary author entity. Used for:
 *   - Person schema on /about
 *   - Article.author on blog posts (when blog launches)
 *   - "About the author" sections
 */
export const FOUNDER = {
  id: `${SITE_URL}/about#michael`,
  name: 'Michael',
  jobTitle: 'Founder & Builder',
  description:
    'Business owner and software engineer building Deliver WMS — a simpler, more intuitive, and more cost-effective warehouse management platform for the operators legacy WMS vendors leave behind.',
  image: `${SITE_URL}/images/founder.jpeg`,
  url: `${SITE_URL}/about`,
  sameAs: [] as string[], // add LinkedIn / X profile once available
} as const;
