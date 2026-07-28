import {
  SITE_NAME,
  SITE_DESCRIPTION,
  BUSINESS_CITY,
  BUSINESS_COUNTRY,
  OG_IMAGE_PATH,
} from '@/lib/site-brand';
import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://bibibeautystore.com';

export const SEO_KEYWORDS = [
  'Bibi Beauty Store',
  'makeup Accra',
  'skincare Ghana',
  'beauty products Darkuman',
  'cosmetics Accra',
  'pay on delivery beauty',
  'nationwide beauty delivery Ghana',
  BUSINESS_CITY,
  BUSINESS_COUNTRY,
].filter(Boolean);

type SeoInput = {
  title: string;
  description: string;
  path?: string;
  image?: string;
};

export function buildPageMetadata({
  title,
  description,
  path = '',
  image = OG_IMAGE_PATH,
}: SeoInput): Metadata {
  return {
    title,
    description,
    keywords: SEO_KEYWORDS.join(', '),
    alternates: {
      canonical: `${siteUrl}${path}`,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${siteUrl}${path}`,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      siteName: SITE_NAME,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export const pageSeoTemplates = {
  home: () =>
    buildPageMetadata({
      title: `${SITE_NAME} | Makeup & Skincare in Accra`,
      description: SITE_DESCRIPTION,
      path: '/',
    }),
  shop: () =>
    buildPageMetadata({
      title: `Shop Beauty | ${SITE_NAME}`,
      description: `Browse makeup, skincare and beauty essentials at ${SITE_NAME}. Nationwide delivery and pay on delivery.`,
      path: '/shop',
    }),
  categories: () =>
    buildPageMetadata({
      title: `Categories | ${SITE_NAME}`,
      description: `Shop makeup, skincare and beauty essentials at ${SITE_NAME}.`,
      path: '/categories',
    }),
  about: () =>
    buildPageMetadata({
      title: `About | ${SITE_NAME}`,
      description: `Meet ${SITE_NAME} at Darkuman, Fadama Junction — beauty that helps you feel confident and glow.`,
      path: '/about',
    }),
  contact: () =>
    buildPageMetadata({
      title: `Contact | ${SITE_NAME}`,
      description: `Call or WhatsApp ${SITE_NAME} to order makeup, skincare and beauty products.`,
      path: '/contact',
    }),
};
