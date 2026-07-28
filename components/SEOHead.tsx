import {
  SITE_NAME,
  SITE_DESCRIPTION,
  LOGO_PATH,
  OG_IMAGE_PATH,
  BUSINESS_CITY,
  BUSINESS_COUNTRY,
} from '@/lib/site-brand';
import { Metadata } from 'next';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: 'website' | 'product' | 'article';
  price?: number;
  currency?: string;
  availability?: string;
  category?: string;
  publishedTime?: string;
  author?: string;
  noindex?: boolean;
  canonicalPath?: string;
}

export function generateMetadata({
  title = `${SITE_NAME} | ${SITE_DESCRIPTION}`,
  description = SITE_DESCRIPTION,
  keywords = [],
  ogImage,
  ogType = 'website',
  price,
  currency = 'USD',
  availability,
  category,
  publishedTime,
  author,
  noindex = false,
  canonicalPath = '',
}: SEOProps): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com';
  const defaultOgImage = `${siteUrl}${OG_IMAGE_PATH}`;
  const resolvedOgImage = ogImage || defaultOgImage;
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

  const defaultKeywords = ['ecommerce', 'online store', SITE_NAME, BUSINESS_CITY, BUSINESS_COUNTRY].filter(
    Boolean
  ) as string[];

  const allKeywords = [...new Set([...keywords, ...defaultKeywords])];

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: allKeywords,
    alternates: {
      canonical: `${siteUrl}${canonicalPath}`,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: `${siteUrl}${canonicalPath}`,
      siteName: SITE_NAME,
      images: [{ url: resolvedOgImage, width: 1200, height: 630 }],
      locale: 'en',
      type: ogType === 'product' ? 'website' : ogType,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [resolvedOgImage],
    },
    robots: noindex ? { index: false, follow: false } : { index: true, follow: true },
  };

  if (ogType === 'product' && price != null) {
    metadata.other = {
      'product:price:amount': String(price),
      'product:price:currency': currency,
      ...(availability ? { 'product:availability': availability } : {}),
      ...(category ? { 'product:category': category } : {}),
    };
  }

  if (publishedTime) {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: 'article',
      publishedTime,
      authors: author ? [author] : undefined,
    };
  }

  return metadata;
}

export function generateOrganizationJsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com';
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: siteUrl,
    logo: `${siteUrl}${LOGO_PATH}`,
    image: `${siteUrl}${LOGO_PATH}`,
    description: SITE_DESCRIPTION,
  };
}

export function generateLocalBusinessJsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com';
  return {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: SITE_NAME,
    image: `${siteUrl}${LOGO_PATH}`,
    url: siteUrl,
  };
}

export function generateProductSchema(product: {
  name: string;
  description: string;
  image: string;
  price: number;
  currency?: string;
  sku: string;
  rating?: number;
  reviewCount?: number;
  availability?: string;
  brand?: string;
  category?: string;
}) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: product.brand || SITE_NAME,
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency || 'USD',
      availability:
        product.availability === 'in_stock'
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      url: typeof window !== 'undefined' ? window.location.href : '',
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
  };

  if (product.rating && product.reviewCount) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  if (product.category) {
    schema.category = product.category;
  }

  return schema;
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function StructuredData({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
