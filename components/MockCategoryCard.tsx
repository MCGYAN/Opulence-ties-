'use client';

import Link from 'next/link';
import Image from 'next/image';

type Props = {
  label: string;
  href: string;
  image?: string;
  index?: number;
};

export default function MockCategoryCard({ label, href, image = '', index = 0 }: Props) {
  const hasImage = Boolean(image?.trim());

  return (
    <Link
      href={href}
      className="group flex flex-col rounded-xl overflow-hidden border border-brand-rose/15 bg-white shadow-sm transition-shadow duration-500 active:shadow-boutique md:rounded-2xl md:glass-card md:border-white/40 boutique-card-hover"
    >
      <div className="relative aspect-[4/5] md:aspect-[3/4] bg-gradient-to-b from-brand-latte to-brand-champagne/60 boutique-image-zoom overflow-hidden">
        {hasImage ? (
          <Image
            src={image}
            alt={label}
            fill
            className="boutique-img-target object-cover object-center"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed border-brand-rose/20 m-3 rounded-xl bg-white/40">
            <span className="font-serif text-2xl md:text-3xl text-brand-rose/25 tabular-nums">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-brand-plum/40 text-center">Image coming soon</span>
          </div>
        )}

        {hasImage && (
          <>
            <span className="boutique-image-vignette" aria-hidden />
            <span className="boutique-image-shine" aria-hidden />
          </>
        )}

        <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-brand-rose/25 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
        <div className="hidden md:flex absolute bottom-4 left-3 right-3 items-center justify-between gap-3 boutique-category-name-glass boutique-category-name-glass--overlay px-4 py-3">
          <span className="font-serif text-lg md:text-xl text-brand-plum tracking-wide">{label}</span>
          <span className="w-9 h-9 rounded-full bg-brand-rose/10 border border-brand-rose/25 flex items-center justify-center text-brand-rose shrink-0 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
            <i className="ri-arrow-right-line" />
          </span>
        </div>
      </div>

      <div className="md:hidden px-3 py-3 text-center boutique-category-name-glass">
        <span className="font-serif text-[13px] text-brand-plum leading-snug block truncate tracking-[0.04em] transition-transform duration-300 group-active:translate-x-0.5">
          {label}
        </span>
      </div>
    </Link>
  );
}
