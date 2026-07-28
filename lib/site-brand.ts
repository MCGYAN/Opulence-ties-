/**
 * Hair Reigns GH, brand identity & site copy
 */

export const SITE_NAME = 'Hair Reigns GH';
export const SITE_SHORT_NAME = 'Hair Reigns';
export const SITE_DESCRIPTION =
  'Premium human-hair wigs, closures & frontals in Ghana, plus expert wig fixing, custom builds and revamps. Look stunning. Feel unstoppable.';
export const SITE_TAGLINE = 'Wear Your Crown.';
export const SITE_HERO_TAGLINE = 'Where Every Strand Makes You Reign.';
export const SITE_LOCATION_TAGLINE = 'Ghana';

export const HERO_HEADLINE = 'Wear Your Crown With Confidence.';
export const HERO_SUBHEADLINE =
  'Ready-made human-hair wigs, closure & frontal units, and custom-made crowns, plus fixing, machine wig-making and revamp services that bring your look back to life.';

export const SITE_URL = 'https://hairreignsgh.com';
export const CONTACT_EMAIL = 'hairreignsgh@gmail.com';
export const CONTACT_PHONE = '0203659949';
export const CONTACT_PHONE_DISPLAY = '020 365 9949';
export const CONTACT_PHONE_SECONDARY = '0557758875';
export const CONTACT_PHONE_SECONDARY_DISPLAY = '055 775 8875';
export const WHATSAPP_URL = 'https://wa.me/233203659949';
export const BUSINESS_ADDRESS = 'Ghana, nationwide delivery available';
export const BUSINESS_CITY = 'Ghana';
export const BUSINESS_COUNTRY = 'Ghana';

export const LOGO_VERSION = '4';
export const LOGO_PATH = `/logo.png?v=${LOGO_VERSION}`;
export const HEADER_LOGO_PATH = `/logo-header.png?v=${LOGO_VERSION}`;
export const FOOTER_LOGO_PATH = `/logo-footer.png?v=${LOGO_VERSION}`;

export function resolveSiteLogo(cmsValue?: string | null): string {
  const v = (cmsValue ?? '').trim().toLowerCase();
  if (!v) return LOGO_PATH;
  return LOGO_PATH;
}

export const OG_IMAGE_PATH = '/og-image.png';
export const HERO_IMAGE_VERSION = '3';
export const HERO_IMAGE_PATH = `/hero.jpg?v=${HERO_IMAGE_VERSION}`;

export const HERO_SLIDES = [
  {
    src: `/hero.jpg?v=${HERO_IMAGE_VERSION}`,
    alt: 'Woman wearing a premium human-hair wig from Hair Reigns GH',
  },
] as const;

export const SOCIAL_INSTAGRAM = 'https://instagram.com/hair_reigns_gh';
export const SOCIAL_FACEBOOK = 'https://www.facebook.com/HairReignsGH';
export const SOCIAL_TIKTOK = '';
export const SOCIAL_SNAPCHAT = '';

export const DEFAULT_PRODUCT_BRAND = 'Hair Reigns GH';
export const CATALOG_PDF_PREFIX = 'hair-reigns-gh-catalog';

export const FEATURED_BENEFITS = [
  { label: 'Premium', title: '100% Human Hair Quality' },
  { label: 'Expert', title: 'Wig Fixing & Custom Builds' },
  { label: 'Nationwide', title: 'Delivery Across Ghana' },
  { label: 'Trusted', title: 'Order via Call or WhatsApp' },
] as const;

export const SHOP_CATEGORIES = [
  { label: 'Ready-Made Wigs', href: '/shop?category=ready-made-wigs' },
  { label: 'Closure Units', href: '/shop?category=closure-units' },
  { label: 'Frontal Units', href: '/shop?category=frontal-units' },
  { label: 'Custom & Services', href: '/shop?category=custom-and-services' },
] as const;

export const CUSTOMER_REVIEWS = [
  { text: 'The wig looked exactly like the photos, soft, full, and so natural. I felt like a queen.', rating: 5 },
  { text: 'They fixed my old wig and it came back looking brand new. Worth every cedi.', rating: 5 },
  { text: 'Fast response on WhatsApp and my custom unit fits perfectly. Already ordered again.', rating: 5 },
  { text: 'Best hair plug in Ghana. Quality is real and the install was flawless.', rating: 5 },
] as const;

export const ABOUT_HEADLINE = 'Your Crown Deserves to Reign';
export const ABOUT_BODY =
  'Hair Reigns GH is a Ghanaian wig and hair brand built for women who want to look stunning without the stress. We sell ready-made human-hair wigs, closure units, frontal units and custom-made wigs, and we back every sale with expert wig fixing, machine wig-making and revamp services. When you shop with us, you are not just buying hair. You are investing in confidence.';

export const BRAND_COLORS = {
  pink: '#E3187D',
  softRose: '#F2A0C4',
  ink: '#6B5560',
  blush: '#FFF0F7',
  cream: '#FFF8FB',
  white: '#FFFFFF',
} as const;
