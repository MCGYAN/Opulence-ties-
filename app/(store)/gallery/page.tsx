'use client';

import { OPULENCE_SHOP_CATEGORIES } from '@/lib/opulence-catalog';
import { MOCK_FEATURED_PRODUCTS } from '@/lib/mock-catalog';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function GalleryPage() {
  usePageTitle('Gallery');
  const images = [
    ...OPULENCE_SHOP_CATEGORIES.map((category) => ({ src: category.image, alt: category.label })),
    ...MOCK_FEATURED_PRODUCTS.map((product) => ({ src: product.image, alt: product.name })),
  ].filter((item) => item.src);

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-black px-4 py-20 text-center text-white">
        <p className="mb-3 text-xs uppercase tracking-[0.28em] text-brand-rose">Gallery</p>
        <h1 className="text-4xl font-bold md:text-5xl">The Culture Of Royalty</h1>
      </section>
      <section className="mx-auto grid max-w-[1380px] grid-cols-2 gap-3 px-4 py-12 md:grid-cols-3 lg:gap-4">
        {images.map((item) => (
          <figure key={item.src} className="aspect-[4/5] overflow-hidden bg-black">
            <img src={item.src} alt={item.alt} className="h-full w-full object-cover" />
          </figure>
        ))}
      </section>
    </div>
  );
}
