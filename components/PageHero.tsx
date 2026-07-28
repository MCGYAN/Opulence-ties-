import { SITE_NAME } from '@/lib/site-brand';
import React from 'react';
import Image from 'next/image';

interface PageHeroProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  eyebrow?: string;
}

export default function PageHero({ title, subtitle, backgroundImage, eyebrow = SITE_NAME }: PageHeroProps) {
  return (
    <div className="relative overflow-hidden min-h-[34vh] md:min-h-[40vh] flex items-center justify-center bg-gradient-to-br from-brand-cream via-brand-latte to-brand-champagne/70">
      {backgroundImage ? (
        <div className="absolute inset-0">
          <Image
            src={backgroundImage}
            alt={title}
            fill
            className="object-cover opacity-50 scale-105"
            priority
            sizes="100vw"
            quality={84}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-cream/70 via-brand-latte/75 to-brand-champagne/85" />
        </div>
      ) : (
        <>
          <div className="absolute -top-24 -right-16 h-80 w-80 rounded-full bg-brand-rose/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-brand-sage/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-brand-rose/25 to-transparent" />
        </>
      )}

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-18 text-center z-10 flex flex-col items-center">
        <span className="inline-flex items-center gap-3 bg-white/70 backdrop-blur-sm border border-brand-rose/15 rounded-full px-5 py-2 text-brand-rose text-[10px] md:text-xs tracking-[0.32em] uppercase font-semibold mb-5 animate-fade-in-up">
          <span className="w-6 md:w-10 h-px bg-brand-rose/40" />
          {eyebrow}
          <span className="w-6 md:w-10 h-px bg-brand-rose/40" />
        </span>

        <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.5rem] text-brand-plum mb-4 md:mb-5 leading-[1.08] animate-fade-in-up animate-delay-100 px-2">
          {title}
        </h1>

        {subtitle && (
          <p className="text-sm sm:text-base md:text-lg text-brand-plum/70 max-w-2xl mx-auto leading-relaxed font-light animate-fade-in-up animate-delay-200 px-4">
            {subtitle}
          </p>
        )}
      </div>

      <div className="absolute bottom-0 left-0 w-full boutique-divider opacity-60" />
    </div>
  );
}
