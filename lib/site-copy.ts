import { HERO_SLIDES, SITE_TAGLINE } from '@/lib/site-brand';

const COPY_KEY = 'opulence-site-copy';

export type HeroSlideCopy = {
  src: string;
  alt: string;
};

export type SiteCopy = {
  heroEyebrow: string;
  heroLine1: string;
  heroLine2: string;
  heroWord1: string;
  heroWord2: string;
  heroShop: string;
  heroExplore: string;
  heroSlides: HeroSlideCopy[];
  marquee: string;
  collectionsEyebrow: string;
  collectionsTitle: string;
  featuredEyebrow: string;
  featuredTitle: string;
  featuredLink: string;
  buyNow: string;
  footerTagline: string;
  copyrightName: string;
};

export const DEFAULT_SITE_COPY: SiteCopy = {
  heroEyebrow: 'Official Website',
  heroLine1: 'Discover Your',
  heroLine2: 'Favourite',
  heroWord1: 'Collections.',
  heroWord2: 'Accessories.',
  heroShop: 'Shop Now',
  heroExplore: 'Explore',
  heroSlides: HERO_SLIDES.map((slide) => ({ src: slide.src, alt: slide.alt })),
  marquee: 'The Culture Of Royalty',
  collectionsEyebrow: 'The House',
  collectionsTitle: 'Shop by Collection',
  featuredEyebrow: 'Ready to take home',
  featuredTitle: 'Featured Pieces',
  featuredLink: 'View Full Collection',
  buyNow: 'Buy Now',
  footerTagline: SITE_TAGLINE,
  copyrightName: 'Opulence',
};

export function loadSiteCopy(): SiteCopy {
  if (typeof window === 'undefined') return DEFAULT_SITE_COPY;
  try {
    const raw = window.localStorage.getItem(COPY_KEY);
    if (!raw) return DEFAULT_SITE_COPY;
    const parsed = JSON.parse(raw) as Partial<SiteCopy>;
    const slides = Array.isArray(parsed.heroSlides)
      ? parsed.heroSlides.filter((slide) => slide && typeof slide.src === 'string' && slide.src.trim())
      : [];
    return {
      ...DEFAULT_SITE_COPY,
      ...parsed,
      heroSlides: slides.length ? slides.map((slide) => ({ src: slide.src, alt: slide.alt || '' })) : DEFAULT_SITE_COPY.heroSlides,
    };
  } catch {
    return DEFAULT_SITE_COPY;
  }
}

export function saveSiteCopy(copy: SiteCopy) {
  window.localStorage.setItem(COPY_KEY, JSON.stringify(copy));
}

export function resetSiteCopy() {
  window.localStorage.removeItem(COPY_KEY);
  return DEFAULT_SITE_COPY;
}

export function readHeroImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      const max = 1400;
      const scale = Math.min(1, max / Math.max(image.width, image.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      const context = canvas.getContext('2d');
      if (!context) {
        URL.revokeObjectURL(url);
        reject(new Error('Could not read that image.'));
        return;
      }
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.72));
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not read that image.'));
    };
    image.src = url;
  });
}
