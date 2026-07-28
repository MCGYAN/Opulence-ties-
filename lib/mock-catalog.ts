/**
 * Frontend-only mock catalog for Bibi Beauty Store.
 * Replace with live data once NEXT_PUBLIC_SUPABASE_* env vars are set.
 */

import { isSupabaseConfigured } from '@/lib/supabase';

export function isMockCatalogMode(): boolean {
  return !isSupabaseConfigured();
}

export const MOCK_SHOP_CATEGORIES = [
  {
    id: 'makeup',
    label: 'Makeup',
    href: '/shop?category=makeup',
    image: '',
  },
  {
    id: 'skincare',
    label: 'Skincare',
    href: '/shop?category=skincare',
    image: '',
  },
  {
    id: 'beauty-essentials',
    label: 'Beauty Essentials',
    href: '/shop?category=beauty-essentials',
    image: '',
  },
  {
    id: 'new-arrivals',
    label: 'New Arrivals',
    href: '/shop?category=new-arrivals',
    image: '',
  },
] as const;

export type MockCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  parent_id: string | null;
  position: number;
};

export const MOCK_CATEGORIES: MockCategory[] = [
  {
    id: 'cat-makeup',
    name: 'Makeup',
    slug: 'makeup',
    description: 'Lips, face and eyes — looks that feel soft, polished and confident.',
    image_url: '',
    parent_id: null,
    position: 1,
  },
  {
    id: 'cat-skincare',
    name: 'Skincare',
    slug: 'skincare',
    description: 'Clean, calm, glowing skin rituals for everyday care.',
    image_url: '',
    parent_id: null,
    position: 2,
  },
  {
    id: 'cat-essentials',
    name: 'Beauty Essentials',
    slug: 'beauty-essentials',
    description: 'The finishing touches that make your routine feel complete.',
    image_url: '',
    parent_id: null,
    position: 3,
  },
  {
    id: 'cat-new',
    name: 'New Arrivals',
    slug: 'new-arrivals',
    description: 'Fresh drops — be first to glow with the newest finds.',
    image_url: '',
    parent_id: null,
    position: 4,
  },
];

export type MockProduct = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  compare_at_price?: number;
  category: string;
  categorySlug: string;
  image: string;
  images?: string[];
  tagline?: string;
  rating_avg: number;
  quantity: number;
  moq: number;
  featured?: boolean;
};

const MOCK_PRODUCTS: MockProduct[] = [
  {
    id: 'mock-matte-lip',
    slug: 'soft-matte-lip-kit',
    name: 'Soft Matte Lip Kit',
    description:
      'A cushiony matte that stays put without drying you out — so your smile feels as good as it looks.',
    price: 85,
    compare_at_price: 110,
    category: 'Makeup',
    categorySlug: 'makeup',
    image: '',
    tagline: 'All-day soft colour',
    rating_avg: 4.9,
    quantity: 30,
    moq: 1,
    featured: true,
  },
  {
    id: 'mock-glow-foundation',
    slug: 'natural-glow-foundation',
    name: 'Natural Glow Foundation',
    description:
      'Light-to-medium coverage that melts into skin — for that “I woke up like this” finish that still photographs beautifully.',
    price: 160,
    category: 'Makeup',
    categorySlug: 'makeup',
    image: '',
    tagline: 'Skin-like finish',
    rating_avg: 4.8,
    quantity: 22,
    moq: 1,
    featured: true,
  },
  {
    id: 'mock-hydrating-serum',
    slug: 'dewdrop-hydrating-serum',
    name: 'Dewdrop Hydrating Serum',
    description:
      'A lightweight sip of moisture that leaves skin plump, calm and quietly radiant — confidence you can feel.',
    price: 120,
    compare_at_price: 145,
    category: 'Skincare',
    categorySlug: 'skincare',
    image: '',
    tagline: 'Plump, calm, glow',
    rating_avg: 4.9,
    quantity: 40,
    moq: 1,
    featured: true,
  },
  {
    id: 'mock-gentle-cleanser',
    slug: 'silk-touch-cleanser',
    name: 'Silk Touch Cleanser',
    description:
      'Removes the day without stripping your barrier — so your skin feels soft, not tight.',
    price: 75,
    category: 'Skincare',
    categorySlug: 'skincare',
    image: '',
    tagline: 'Gentle daily reset',
    rating_avg: 4.7,
    quantity: 35,
    moq: 1,
    featured: true,
  },
  {
    id: 'mock-setting-spray',
    slug: 'all-day-setting-mist',
    name: 'All-Day Setting Mist',
    description:
      'Lock in your look from morning market runs to evening plans — soft-focus finish, zero cake.',
    price: 65,
    category: 'Beauty Essentials',
    categorySlug: 'beauty-essentials',
    image: '',
    tagline: 'Makeup that lasts',
    rating_avg: 4.6,
    quantity: 50,
    moq: 1,
    featured: true,
  },
  {
    id: 'mock-beauty-sponge',
    slug: 'blend-perfect-sponge',
    name: 'Blend Perfect Sponge',
    description:
      'Bounce on foundation for a seamless, second-skin blend — the little tool that upgrades every look.',
    price: 35,
    category: 'Beauty Essentials',
    categorySlug: 'beauty-essentials',
    image: '',
    tagline: 'Flawless blend',
    rating_avg: 4.5,
    quantity: 60,
    moq: 1,
    featured: false,
  },
  {
    id: 'mock-blush-duo',
    slug: 'cheek-flush-duo',
    name: 'Cheek Flush Duo',
    description:
      'A soft flush that makes you look rested and lit-from-within — the kind of colour people notice without knowing why.',
    price: 95,
    category: 'Makeup',
    categorySlug: 'makeup',
    image: '',
    tagline: 'Lit-from-within colour',
    rating_avg: 4.8,
    quantity: 28,
    moq: 1,
    featured: false,
  },
  {
    id: 'mock-new-glow-set',
    slug: 'weekend-glow-set-new',
    name: 'Weekend Glow Set (New)',
    description:
      'Just dropped — a ready-to-glow mini ritual for soft skin and easy glam. Limited stock.',
    price: 210,
    compare_at_price: 250,
    category: 'New Arrivals',
    categorySlug: 'new-arrivals',
    image: '',
    tagline: 'Fresh drop, full glow',
    rating_avg: 5.0,
    quantity: 12,
    moq: 1,
    featured: true,
  },
];

export const MOCK_FEATURED_PRODUCTS = MOCK_PRODUCTS.filter((p) => p.featured).map((p) => ({
  id: p.id,
  slug: p.slug,
  name: p.name,
  category: p.category,
  price: p.price,
  originalPrice: p.compare_at_price,
  image: p.image,
  tagline: p.tagline,
}));

export function getMockCategories(): MockCategory[] {
  return MOCK_CATEGORIES;
}

export function getMockProductBySlug(slug: string): MockProduct | undefined {
  return MOCK_PRODUCTS.find((p) => p.slug === slug || p.id === slug);
}

export type MockShopFilters = {
  search?: string | null;
  category?: string;
  priceMin?: number;
  priceMax?: number;
  minRating?: number;
  sortBy?: string;
  page?: number;
  perPage?: number;
};

export function filterMockProducts(filters: MockShopFilters = {}) {
  const {
    search,
    category = 'all',
    priceMin = 0,
    priceMax = 5000,
    minRating = 0,
    sortBy = 'popular',
    page = 1,
    perPage = 9,
  } = filters;

  let results = [...MOCK_PRODUCTS];

  if (search?.trim()) {
    const q = search.trim().toLowerCase();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.tagline?.toLowerCase().includes(q) ?? false)
    );
  }

  if (category !== 'all') {
    if (category === 'new-arrivals') {
      results = results.filter((p) => p.categorySlug === 'new-arrivals');
    } else {
      results = results.filter((p) => p.categorySlug === category);
    }
  } else if (sortBy === 'new' || sortBy === 'newest') {
    results = results.filter((p) => p.categorySlug === 'new-arrivals' || p.featured);
  }

  if (priceMax < 5000) {
    results = results.filter((p) => p.price >= priceMin && p.price <= priceMax);
  }

  if (minRating > 0) {
    results = results.filter((p) => p.rating_avg >= minRating);
  }

  switch (sortBy) {
    case 'price-low':
      results.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      results.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      results.sort((a, b) => b.rating_avg - a.rating_avg);
      break;
    case 'new':
    case 'newest':
      results.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
      break;
    default:
      results.sort((a, b) => b.rating_avg - a.rating_avg);
      break;
  }

  const total = results.length;
  const from = (page - 1) * perPage;
  const pageItems = results.slice(from, from + perPage);

  return { products: pageItems, total, totalPages: Math.ceil(total / perPage) || 1 };
}

export function mockProductToCard(product: MockProduct) {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    originalPrice: product.compare_at_price,
    image: product.image,
    rating: product.rating_avg,
    reviewCount: 0,
    badge: product.compare_at_price && product.compare_at_price > product.price ? 'Sale' : undefined,
    inStock: product.quantity > 0,
    maxStock: product.quantity,
    moq: product.moq,
    category: product.category,
    hasVariants: false,
    minVariantPrice: undefined,
    colorVariants: [] as { name: string; hex: string }[],
  };
}

export function mockProductToDetail(product: MockProduct) {
  const images = (product.images?.length ? product.images : [product.image]).filter((src) =>
    Boolean(src?.trim())
  );
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: product.description,
    price: product.price,
    compare_at_price: product.compare_at_price,
    images,
    category: product.category,
    rating: product.rating_avg,
    rating_avg: product.rating_avg,
    reviewCount: 0,
    stockCount: product.quantity,
    quantity: product.quantity,
    moq: product.moq,
    colors: [] as string[],
    colorHexMap: {} as Record<string, string>,
    variants: [] as unknown[],
    sizes: [] as string[],
    features: ['Authentic beauty products', 'Nationwide delivery', 'Pay on delivery available'],
    featured: ['Authentic beauty products', 'Nationwide delivery', 'Pay on delivery available'],
    care: 'Store in a cool, dry place. Patch-test new skincare. Follow product directions for best results.',
    preorderShipping: null,
  };
}

export function getRelatedMockProducts(product: MockProduct, limit = 4) {
  return MOCK_PRODUCTS.filter((p) => p.id !== product.id && p.categorySlug === product.categorySlug)
    .slice(0, limit)
    .map(mockProductToCard);
}
