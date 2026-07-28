'use client';

import Link from 'next/link';
import Image from 'next/image';

type Props = {
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image?: string;
  tagline?: string;
  href?: string;
  slug?: string;
};

export default function MockProductCard({
  name,
  category,
  price,
  originalPrice,
  image = '',
  tagline,
  href,
  slug,
}: Props) {
  const hasImage = Boolean(image?.trim());
  const productHref = href || (slug ? `/product/${slug}` : '/shop');
  const onSale = originalPrice != null && originalPrice > price;
  const formatPrice = (val: number) => `GH\u20B5${val.toFixed(2)}`;

  return (
    <article className="group flex flex-col h-full boutique-card-hover">
      <Link
        href={productHref}
        className="relative block aspect-[3/4] rounded-2xl overflow-hidden border border-brand-rose/10 bg-brand-latte/20 mb-3 shadow-sm transition-all duration-500 ease-boutique active:shadow-boutique active:scale-[0.98] boutique-image-zoom md:glass-card md:border-white/40 md:mb-4 md:group-hover:shadow-boutique-glow md:group-hover:border-brand-rose/20"
      >
        {hasImage ? (
          <Image src={image} alt={name} fill className="boutique-img-target object-cover object-top" sizes="(max-width: 768px) 50vw, 25vw" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 m-3 rounded-xl border-2 border-dashed border-brand-rose/25 bg-brand-cream/50">
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-rose/70">Featured</span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-brand-plum/40 text-center">Image coming soon</span>
          </div>
        )}
        {hasImage && (
          <>
            <span className="boutique-image-vignette" aria-hidden />
            <span className="boutique-image-shine" aria-hidden />
          </>
        )}

        {onSale && (
          <span className="absolute top-2.5 left-2.5 z-[2] px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-[0.14em] bg-brand-rose/90 backdrop-blur-md text-white border border-white/20">
            Sale
          </span>
        )}

        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-brand-rose/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-active:opacity-100 group-hover:opacity-100 pointer-events-none" />

        {/* Mobile + desktop tap/hover cue */}
        <div className="absolute bottom-3 left-3 right-3 z-[2] opacity-0 translate-y-2 group-active:opacity-100 group-active:translate-y-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-boutique">
          <span className="block w-full text-center py-2 rounded-full boutique-category-name-glass boutique-category-name-glass--overlay text-brand-plum text-[10px] font-semibold uppercase tracking-[0.18em]">
            Shop now
          </span>
        </div>
      </Link>

      <div className="flex flex-col flex-grow px-1">
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-brand-sage/90 mb-1.5 transition-colors duration-300 group-hover:text-brand-rose">
          {category}
        </p>
        <Link href={productHref} className="block">
          <h3 className="font-serif text-lg md:text-xl leading-snug text-brand-plum mb-1 transition-colors duration-300 group-hover:text-brand-rose line-clamp-2">
            {name}
          </h3>
        </Link>
        {tagline && (
          <p className="text-[11px] text-brand-plum/50 mb-3 leading-relaxed line-clamp-2">{tagline}</p>
        )}
        <div className="flex items-baseline gap-2 mt-auto pt-1">
          <span className="font-semibold text-brand-plum tracking-tight">{formatPrice(price)}</span>
          {onSale && (
            <span className="text-xs text-brand-plum/40 line-through">{formatPrice(originalPrice!)}</span>
          )}
        </div>
      </div>
    </article>
  );
}
