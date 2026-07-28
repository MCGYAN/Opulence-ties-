/**
 * Bibi Beauty Store — brand identity & site copy
 */

export const SITE_NAME = 'Bibi Beauty Store';
export const SITE_SHORT_NAME = 'Bibi Beauty';
export const SITE_DESCRIPTION =
  'Makeup, skincare and beauty essentials in Accra — so you walk out glowing, feeling confident, and ready for every moment.';
export const SITE_TAGLINE = 'Glow Like You Mean It.';
export const SITE_HERO_TAGLINE = 'Beauty that makes you feel unforgettable.';
export const SITE_LOCATION_TAGLINE = 'Darkuman, Accra';

export const HERO_HEADLINE = 'Wake Up Looking Like Your Softest Self.';
export const HERO_SUBHEADLINE =
  'From everyday glam to skin that feels cared for — shop makeup and skincare you can trust, with nationwide delivery and pay on delivery.';

export const SITE_URL = 'https://bibibeautystore.com';
export const CONTACT_EMAIL = 'hello@bibibeautystore.com';
export const CONTACT_PHONE = '0243849598';
export const CONTACT_PHONE_DISPLAY = '024 384 9598';
export const CONTACT_PHONE_SECONDARY = '0531724359';
export const CONTACT_PHONE_SECONDARY_DISPLAY = '053 172 4359';
export const WHATSAPP_URL = 'https://wa.me/233243849598';
export const BUSINESS_ADDRESS = 'Darkuman, Fadama Junction, Accra';
export const BUSINESS_CITY = 'Accra';
export const BUSINESS_COUNTRY = 'Ghana';

export const LOGO_VERSION = '5';
export const LOGO_PATH = `/logo.png?v=${LOGO_VERSION}`;
/** Same mark everywhere — header, footer, splash */
export const HEADER_LOGO_PATH = LOGO_PATH;
export const FOOTER_LOGO_PATH = LOGO_PATH;

export function resolveSiteLogo(cmsValue?: string | null): string {
  const v = (cmsValue ?? '').trim().toLowerCase();
  if (!v) return LOGO_PATH;
  return LOGO_PATH;
}

export const OG_IMAGE_PATH = '/og-image.png';
export const HERO_IMAGE_VERSION = '6';
export const HERO_IMAGE_PATH = `/hero.jpg?v=${HERO_IMAGE_VERSION}`;

export const HERO_SLIDES = [
  {
    src: `/hero.jpg?v=${HERO_IMAGE_VERSION}`,
    alt: 'Bibi Beauty — polished makeup glow, serene and radiant',
  },
] as const;

export const SOCIAL_INSTAGRAM = 'https://instagram.com/bibibeautystore';
export const SOCIAL_FACEBOOK = '';
export const SOCIAL_TIKTOK = '';
export const SOCIAL_SNAPCHAT = '';

export const DEFAULT_PRODUCT_BRAND = 'Bibi Beauty';
export const CATALOG_PDF_PREFIX = 'bibi-beauty-catalog';

export const FEATURED_BENEFITS = [
  { label: 'Glow', title: 'Makeup That Feels Like You' },
  { label: 'Care', title: 'Skincare That Comforts Skin' },
  { label: 'Nationwide', title: 'Delivery Across Ghana' },
  { label: 'Easy', title: 'Pay On Delivery' },
] as const;

export const SHOP_CATEGORIES = [
  { label: 'Makeup', href: '/shop?category=makeup' },
  { label: 'Skincare', href: '/shop?category=skincare' },
  { label: 'Beauty Essentials', href: '/shop?category=beauty-essentials' },
  { label: 'New Arrivals', href: '/shop?category=new-arrivals' },
] as const;

export const CUSTOMER_REVIEWS = [
  {
    text: 'I finally found a lip combo that stays and still feels soft. I walked into the room feeling like myself — just brighter.',
    rating: 5,
  },
  {
    text: 'Ordered skincare on WhatsApp, paid on delivery, and my face has never felt this calm. Real products, real results.',
    rating: 5,
  },
  {
    text: 'From Darkuman to my doorstep — packaging was neat and the glow was instant. Bibi Beauty gets it.',
    rating: 5,
  },
  {
    text: 'The foundation matched perfectly and the team helped me choose. I feel confident without trying too hard.',
    rating: 5,
  },
] as const;

export const ABOUT_HEADLINE = 'Beauty That Starts With How You Feel';
export const ABOUT_BODY =
  'is Accra’s neighbourhood beauty destination at Darkuman, Fadama Junction — built for women who want to look polished and feel powerful. We stock makeup, skincare and beauty essentials you can count on, deliver nationwide, and make checkout easy with pay on delivery. When you shop with us, you are not just buying products. You are choosing the version of you that walks in glowing.';

export const BRAND_COLORS = {
  pink: '#E2187A',
  softRose: '#F5A3C7',
  ink: '#5C3A4A',
  blush: '#FFF0F6',
  cream: '#FFF7FB',
  white: '#FFFFFF',
} as const;
