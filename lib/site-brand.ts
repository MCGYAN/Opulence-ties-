/**
 * Opulence Ties — brand identity matched to opulenceties.com
 */

import { OPULENCE_SHOP_CATEGORIES } from '@/lib/opulence-catalog';

export const SITE_NAME = 'Opulence Ties';
export const SITE_SHORT_NAME = 'OpulenceTies';
export const SITE_DESCRIPTION =
  'Discover premium luxury fashion and accessories at Opulence Ties. Curated collection of high-end ties, fashion pieces, and exclusive accessories for the discerning individual.';
export const SITE_TAGLINE = 'The Culture Of Royalty';
export const SITE_HERO_TAGLINE = 'Discover Your Favourite Collections.';
export const SITE_LOCATION_TAGLINE = 'Lashibi, Ghana';

export const HERO_HEADLINE = 'Discover Your Favourite';
export const HERO_SUBHEADLINE =
  'Neckties, bow ties, cuffs and scarves, crafted for professionals who dress with presence.';

export const SITE_URL = 'https://www.opulenceties.com';
export const CONTACT_EMAIL = 'Support@opulenceties.com';
export const CONTACT_EMAIL_SECONDARY = 'Opulenceties@gmail.com';
export const CONTACT_PHONE = '0241448340';
export const CONTACT_PHONE_DISPLAY = '+233 241 448 340';
export const CONTACT_PHONE_SECONDARY = '0595008581';
export const CONTACT_PHONE_SECONDARY_DISPLAY = '+233 595 008 581';
export const WHATSAPP_URL = 'https://wa.me/233241448340';
export const BUSINESS_ADDRESS = '15 Baussino Street, Lashibi Community 18';
export const BUSINESS_CITY = 'Lashibi';
export const BUSINESS_COUNTRY = 'Ghana';
export const USA_ADDRESS = '1 Remsen Road, Apt 4K, Yonkers, NY 10710';
export const USA_PHONE = '+1 (914) 267-7187';
export const USA_PHONE_TEL = '+19142677187';

export const LOGO_VERSION = '3';
export const LOGO_PATH = `/logo.png?v=${LOGO_VERSION}`;
export const HEADER_LOGO_PATH = LOGO_PATH;
export const FOOTER_LOGO_PATH = LOGO_PATH;

export function resolveSiteLogo(cmsValue?: string | null): string {
  const v = (cmsValue ?? '').trim().toLowerCase();
  if (!v) return LOGO_PATH;
  return LOGO_PATH;
}

export const OG_IMAGE_PATH = '/og-image.png';
export const HERO_IMAGE_VERSION = '2';
export const HERO_IMAGE_PATH = '/hero/slide-2.jpeg';

/** Same four backgrounds as opulenceties.com, in the same order. */
export const HERO_SLIDES = [
  { src: '/hero/slide-1.jpeg', alt: 'Opulence Ties neckties in a woven display' },
  { src: '/hero/slide-2.jpeg', alt: 'Opulence Ties bow ties in black, teal, burgundy and navy' },
  { src: '/hero/slide-3.jpeg', alt: 'Opulence Ties striped and patterned neckties' },
  { src: '/hero/slide-4.jpg', alt: 'Opulence Ties necktie styled on a white shirt' },
] as const;

export const SOCIAL_INSTAGRAM = 'https://instagram.com/opulence_ties';
export const SOCIAL_FACEBOOK = 'https://facebook.com/opulenceties';
export const SOCIAL_TIKTOK = '';
export const SOCIAL_SNAPCHAT = '';

export const DEFAULT_PRODUCT_BRAND = 'Opulence';
export const CATALOG_PDF_PREFIX = 'opulence-ties-catalog';

export const FEATURED_BENEFITS = [
  { label: 'Craft', title: 'Custom-Made Neckties' },
  { label: 'Style', title: 'Professional Styling' },
  { label: 'Heritage', title: 'Ghanaian Identity' },
  { label: 'Presence', title: 'Dress With Authority' },
] as const;

export const SHOP_CATEGORIES = OPULENCE_SHOP_CATEGORIES.map((category) => ({
  label: category.label,
  href: category.href,
}));

export const CUSTOMER_REVIEWS = [
  {
    text: 'The necktie sits clean and the fabric feels made for the room, not borrowed from it.',
    rating: 5,
  },
  {
    text: 'I ordered a custom piece for a ceremony. The finish looked considered, not mass-produced.',
    rating: 5,
  },
  {
    text: 'Gye Nyame in the weave is quiet until you notice it. That is exactly the point.',
    rating: 5,
  },
  {
    text: 'From Lashibi to my door. Packaging was sharp and the knot held all evening.',
    rating: 5,
  },
] as const;

export const ABOUT_HEADLINE = 'A Ghanaian necktie house';
export const ABOUT_BODY =
  'is a Ghanaian necktie and scarves manufacturing business for fashion-conscious professionals and companies. We craft custom-made neckties and complementary accessories, then help clients wear them with intention.';

export const BRAND_COLORS = {
  primary: '#DAA520',
  accent: '#DC2626',
  ink: '#111111',
  surface: '#FFFFFF',
  cream: '#FFFFFF',
  white: '#FFFFFF',
} as const;
