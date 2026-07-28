/**
 * Frontend-only mock catalog, used when Supabase is not configured.
 * Replace with live data once NEXT_PUBLIC_SUPABASE_* env vars are set.
 */

import { isSupabaseConfigured } from '@/lib/supabase';

export function isMockCatalogMode(): boolean {
  return !isSupabaseConfigured();
}

export const MOCK_SHOP_CATEGORIES = [
  {
    id: 'ready-made-wigs',
    label: 'Ready-Made Wigs',
    href: '/shop?category=ready-made-wigs',
    image: '',
  },
  {
    id: 'closure-units',
    label: 'Closure Units',
    href: '/shop?category=closure-units',
    image: '',
  },
  {
    id: 'frontal-units',
    label: 'Frontal Units',
    href: '/shop?category=frontal-units',
    image: '',
  },
  {
    id: 'custom-and-services',
    label: 'Custom & Services',
    href: '/shop?category=custom-and-services',
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
    id: 'cat-wigs',
    name: 'Ready-Made Wigs',
    slug: 'ready-made-wigs',
    description: 'Premium human-hair wigs, ready to wear, body wave, straight, curly and more.',
    image_url: '',
    parent_id: null,
    position: 1,
  },
  {
    id: 'cat-closures',
    name: 'Closure Units',
    slug: 'closure-units',
    description: '4x4 and 5x5 closures in natural textures, the perfect finish for any install.',
    image_url: '',
    parent_id: null,
    position: 2,
  },
  {
    id: 'cat-frontals',
    name: 'Frontal Units',
    slug: 'frontal-units',
    description: '13x4 and 13x6 frontals for seamless, scalp-like hairlines that turn heads.',
    image_url: '',
    parent_id: null,
    position: 3,
  },
  {
    id: 'cat-custom',
    name: 'Custom & Services',
    slug: 'custom-and-services',
    description: 'Custom-made wigs plus wig fixing, machine wig-making and revamp services.',
    image_url: '',
    parent_id: null,
    position: 4,
  },
  {
    id: 'cat-new',
    name: 'New Arrivals',
    slug: 'new-arrivals',
    description: 'Fresh drops, limited units added weekly. Grab yours before they sell out.',
    image_url: '',
    parent_id: null,
    position: 5,
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
    id: 'mock-body-wave-wig-14',
    slug: 'body-wave-ready-wig-14',
    name: 'Body Wave Ready-Made Wig 14"',
    description:
      'Soft, bouncy body-wave human hair on a comfortable cap. Pre-plucked hairline, natural density, and ready to slay straight out of the bag. Perfect for everyday glam or a night out.',
    price: 1450,
    compare_at_price: 1700,
    category: 'Ready-Made Wigs',
    categorySlug: 'ready-made-wigs',
    image: '',
    tagline: '14", Body wave, Human hair',
    rating_avg: 4.9,
    quantity: 8,
    moq: 1,
    featured: true,
  },
  {
    id: 'mock-straight-lace-16',
    slug: 'straight-lace-front-wig-16',
    name: 'Straight Lace Front Wig 16"',
    description:
      'Sleek, silky straight strands with a flawless lace front. Middle-part ready, minimal shedding, and that glass-hair finish your selfies have been waiting for.',
    price: 1850,
    compare_at_price: 2100,
    category: 'Ready-Made Wigs',
    categorySlug: 'ready-made-wigs',
    image: '',
    tagline: '16", Lace front, Silky straight',
    rating_avg: 4.8,
    quantity: 6,
    moq: 1,
    featured: true,
  },
  {
    id: 'mock-4x4-closure',
    slug: '4x4-hd-closure-unit',
    name: '4x4 HD Lace Closure Unit',
    description:
      'High-definition lace closure that melts into your skin. Available in body wave and straight textures, the secret to a seamless, expensive-looking install.',
    price: 650,
    category: 'Closure Units',
    categorySlug: 'closure-units',
    image: '',
    tagline: '4x4, HD lace, Body wave or straight',
    rating_avg: 4.7,
    quantity: 15,
    moq: 1,
    featured: true,
  },
  {
    id: 'mock-13x4-frontal',
    slug: '13x4-frontal-unit',
    name: '13x4 Lace Frontal Unit',
    description:
      'Ear-to-ear frontal with a natural hairline and versatile parting. Style it any way you want, your crown, your rules.',
    price: 950,
    compare_at_price: 1100,
    category: 'Frontal Units',
    categorySlug: 'frontal-units',
    image: '',
    tagline: '13x4, Ear-to-ear, Natural hairline',
    rating_avg: 4.8,
    quantity: 10,
    moq: 1,
    featured: true,
  },
  {
    id: 'mock-custom-wig',
    slug: 'custom-made-wig',
    name: 'Custom-Made Wig (Made to Order)',
    description:
      'Tell us your length, texture, cap size and colour, we build your dream unit from scratch. Machine-made precision with a personal touch. Consultation via WhatsApp before we start.',
    price: 2200,
    category: 'Custom & Services',
    categorySlug: 'custom-and-services',
    image: '',
    tagline: 'Made to order, Your specs, Expert craft',
    rating_avg: 5.0,
    quantity: 99,
    moq: 1,
    featured: true,
  },
  {
    id: 'mock-wig-fixing',
    slug: 'wig-fixing-service',
    name: 'Professional Wig Fixing',
    description:
      'Walk in stressed, walk out snatched. Our stylists secure your unit with a flawless, long-lasting install, glueless or glued, depending on your preference.',
    price: 120,
    category: 'Custom & Services',
    categorySlug: 'custom-and-services',
    image: '',
    tagline: 'Expert install, Glueless or glued',
    rating_avg: 4.9,
    quantity: 99,
    moq: 1,
    featured: false,
  },
  {
    id: 'mock-wig-revamp',
    slug: 'wig-revamp-service',
    name: 'Wig Revamp & Restoration',
    description:
      'Tired, tangled, or flat? We bring old wigs back to life, wash, deep condition, restyle and restore bounce so your investment keeps paying off.',
    price: 150,
    category: 'Custom & Services',
    categorySlug: 'custom-and-services',
    image: '',
    tagline: 'Wash, condition, restyle, restore',
    rating_avg: 4.8,
    quantity: 99,
    moq: 1,
    featured: false,
  },
  {
    id: 'mock-machine-wig',
    slug: 'machine-wig-making-service',
    name: 'Machine Wig-Making Service',
    description:
      'Send us your bundles and closure, we construct a durable, beautiful machine-made wig built to last. Perfect for resellers and personal wear.',
    price: 350,
    category: 'Custom & Services',
    categorySlug: 'custom-and-services',
    image: '',
    tagline: 'Your hair, Our craft, Built to last',
    rating_avg: 4.7,
    quantity: 99,
    moq: 1,
    featured: false,
  },
  {
    id: 'mock-curly-wig-new',
    slug: 'deep-curly-wig-18-new',
    name: 'Deep Curly Wig 18" (New Arrival)',
    description:
      'Just dropped, voluminous deep curls with head-turning bounce. Limited stock. Once it is gone, it is gone.',
    price: 1950,
    compare_at_price: 2300,
    category: 'New Arrivals',
    categorySlug: 'new-arrivals',
    image: '',
    tagline: '18", Deep curly, Limited drop',
    rating_avg: 4.9,
    quantity: 4,
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
  const isService = product.categorySlug === 'custom-and-services' && product.price < 500;
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
    features: isService
      ? ['Book via WhatsApp', 'Expert stylists', 'Satisfaction guaranteed']
      : ['100% human hair', 'Premium quality', 'Nationwide delivery'],
    featured: isService
      ? ['Book via WhatsApp', 'Expert stylists', 'Satisfaction guaranteed']
      : ['100% human hair', 'Premium quality', 'Nationwide delivery'],
    care: isService
      ? 'Contact us on WhatsApp to book your appointment and confirm availability.'
      : 'Store on a wig stand, brush gently, and avoid excessive heat. Follow care instructions included with your unit.',
    preorderShipping: null,
  };
}

export function getRelatedMockProducts(product: MockProduct, limit = 4) {
  return MOCK_PRODUCTS.filter((p) => p.id !== product.id && p.categorySlug === product.categorySlug)
    .slice(0, limit)
    .map(mockProductToCard);
}
