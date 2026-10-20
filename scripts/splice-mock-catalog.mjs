import fs from 'fs';

const src = fs.readFileSync('lib/mock-catalog.ts', 'utf8');
const rest = src.slice(src.indexOf('export const MOCK_FEATURED_PRODUCTS'));
const head = `/**
 * Opulence Ties catalog. Live Supabase data replaces this when configured.
 */

import { isSupabaseConfigured } from '@/lib/supabase';
import { OPULENCE_CATEGORIES, OPULENCE_PRODUCTS, OPULENCE_SHOP_CATEGORIES } from '@/lib/opulence-catalog';

export function isMockCatalogMode(): boolean {
  return !isSupabaseConfigured();
}

export const MOCK_SHOP_CATEGORIES = OPULENCE_SHOP_CATEGORIES;

export type MockCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  parent_id: string | null;
  position: number;
};

export const MOCK_CATEGORIES: MockCategory[] = OPULENCE_CATEGORIES;

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

const MOCK_PRODUCTS: MockProduct[] = OPULENCE_PRODUCTS;

`;

fs.writeFileSync('lib/mock-catalog.ts', head + rest);
console.log('mock catalog wired');
