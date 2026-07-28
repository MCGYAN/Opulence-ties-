import {
  SITE_NAME,
  SITE_DESCRIPTION,
  BUSINESS_CITY,
  BUSINESS_COUNTRY,
  OG_IMAGE_PATH,
} from '@/lib/site-brand';
import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://hairreignsgh.com';

export const SEO_KEYWORDS = [
  'human hair wigs Ghana',
  'lace front wigs Ghana',
  'closure units Ghana',
  'frontal units Ghana',
  'custom wigs Ghana',
  'wig fixing Ghana',
  'wig revamp Ghana',
  'Hair Reigns GH',
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
      title: `${SITE_NAME} | Premium Wigs & Hair Services in Ghana`,
      description: SITE_DESCRIPTION,
      path: '/',
    }),
  shop: () =>
    buildPageMetadata({
      title: `Shop Wigs & Hair | ${SITE_NAME}`,
      description: `Browse human-hair wigs, closures, frontals and services at ${SITE_NAME}. Order via WhatsApp.`,
      path: '/shop',
    }),
  categories: () =>
    buildPageMetadata({
      title: `Categories | ${SITE_NAME}`,
      description: `Shop ready-made wigs, closure units, frontal units and custom services at ${SITE_NAME}.`,
      path: '/categories',
    }),
  about: () =>
    buildPageMetadata({
      title: `About | ${SITE_NAME}`,
      description: `Meet ${SITE_NAME}, Ghana's destination for premium wigs, closures, frontals and expert hair services.`,
      path: '/about',
    }),
  contact: () =>
    buildPageMetadata({
      title: `Contact | ${SITE_NAME}`,
      description: `Call or WhatsApp ${SITE_NAME} to order wigs, book fixing or ask about custom units.`,
      path: '/contact',
    }),
};
