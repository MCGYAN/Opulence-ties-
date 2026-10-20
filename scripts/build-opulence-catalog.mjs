import fs from 'fs';
import os from 'os';
import path from 'path';

const temp = os.tmpdir();
const categories = JSON.parse(fs.readFileSync(path.join(temp, 'opulence-cats.json'), 'utf8')).data;
const productsFile = JSON.parse(fs.readFileSync(path.join(temp, 'opulence-products.json'), 'utf8'));
const products = Array.isArray(productsFile) ? productsFile : productsFile.data || productsFile.products;

const slugify = (value) =>
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const shop = categories.map((category) => ({
  id: category.slug,
  label: category.name,
  href: `/shop?category=${category.slug}`,
  image: category.imageUrl,
  description: category.description.replace(/\s+/g, ' ').trim(),
  productCount: category.product_count,
}));

const mockCategories = categories.map((category, index) => ({
  id: `cat-${category.id}`,
  name: category.name,
  slug: category.slug,
  description: category.description.replace(/\s+/g, ' ').trim(),
  image_url: category.imageUrl,
  parent_id: null,
  position: index + 1,
}));

const seen = new Map();
const mockProducts = products.map((product) => {
  const base = slugify(product.name) || 'tie';
  const count = (seen.get(base) || 0) + 1;
  seen.set(base, count);
  const slug = count === 1 ? base : `${base}-${product.id}`;
  return {
    id: `ot-${product.id}`,
    slug,
    name: count === 1 ? product.name : `${product.name} ${count}`,
    description:
      (product.description || '').trim() ||
      (product.category?.description || '').replace(/\s+/g, ' ').trim() ||
      'A necktie from the Opulence Ties collection.',
    price: Number(product.price) || 0,
    category: product.category?.name || 'Ties',
    categorySlug: product.category?.slug || 'ties',
    image: product.imageUrl || '',
    tagline: product.category?.name || 'Opulence Ties',
    rating_avg: 5,
    quantity: Number(product.stockQuantity) || 0,
    moq: 1,
    featured: count === 1,
  };
});

const file = `/* Generated from the public Opulence Ties catalog. */
export const OPULENCE_SHOP_CATEGORIES = ${JSON.stringify(shop, null, 2)} as const;

export const OPULENCE_CATEGORIES = ${JSON.stringify(mockCategories, null, 2)};

export const OPULENCE_PRODUCTS = ${JSON.stringify(mockProducts, null, 2)};
`;

fs.writeFileSync('lib/opulence-catalog.ts', file);
console.log(`categories ${shop.length}, products ${mockProducts.length}`);
