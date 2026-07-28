'use client';

import {
  SITE_NAME,
  HERO_HEADLINE,
  HERO_SUBHEADLINE,
  HERO_SLIDES,
  FEATURED_BENEFITS,
  CUSTOMER_REVIEWS,
  ABOUT_HEADLINE,
  ABOUT_BODY,
} from '@/lib/site-brand';
import { MOCK_SHOP_CATEGORIES, MOCK_FEATURED_PRODUCTS } from '@/lib/mock-catalog';
import Link from 'next/link';
import HeroImageSlider from '@/components/HeroImageSlider';
import MockCategoryCard from '@/components/MockCategoryCard';
import MockProductCard from '@/components/MockProductCard';
import AnimatedSection, { AnimatedGrid } from '@/components/AnimatedSection';
import NewsletterSection from '@/components/NewsletterSection';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function Home() {
  usePageTitle('');

  return (
    <main className="min-h-screen bg-brand-cream">
      {/* SECTION 1 HERO */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-brand-cream">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-cream via-brand-latte to-brand-champagne/40" />
        <div className="absolute top-1/4 -left-20 w-72 h-72 rounded-full bg-brand-rose/8 blur-3xl animate-float" />
        <div className="absolute bottom-1/4 -right-16 w-96 h-96 rounded-full bg-brand-sage/25 blur-3xl animate-float animate-delay-300" />
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none select-none">
          <span className="font-serif text-[14vw] text-brand-rose/[0.06] whitespace-nowrap tracking-tight">REIGN</span>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <AnimatedSection>
              <p className="text-[10px] font-semibold tracking-[0.32em] uppercase text-brand-plum/45 mb-5 flex items-center gap-3">
                <span className="h-px w-8 bg-brand-plum/25" />
                {SITE_NAME}
              </p>
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] text-brand-plum leading-[1.02] mb-6">
                {HERO_HEADLINE}
              </h1>
              <p className="text-brand-plum/75 text-lg md:text-xl max-w-lg mb-10 leading-relaxed font-light">
                {HERO_SUBHEADLINE}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/shop" className="boutique-btn-primary">
                  Shop wigs & hair
                </Link>
                <Link href="#shop-by-category" className="boutique-btn-secondary">
                  Browse collections
                </Link>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={150}>
              <div className="relative md:p-4 md:glass-card md:rounded-[2rem] md:shadow-boutique-lg">
                <HeroImageSlider slides={HERO_SLIDES} />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* SECTION 2, TRUST STRIP (tablet & desktop only) */}
      <section className="hidden md:block py-10 md:py-14 bg-brand-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl glass-frosted overflow-hidden">
            <div
              className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-rose/30 to-transparent"
              aria-hidden
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-brand-rose/10">
              {FEATURED_BENEFITS.map((benefit, i) => (
                <div
                  key={benefit.title}
                  className="group relative px-6 py-8 md:px-8 md:py-10 text-center"
                >
                  <span
                    className={`block font-serif text-2xl md:text-3xl tabular-nums mb-3 transition-colors duration-300 ${
                      i === 0 ? 'text-brand-rose/40 group-hover:text-brand-rose' : 'text-brand-rose/15 group-hover:text-brand-rose/35'
                    }`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="block w-6 h-px bg-brand-rose/25 mx-auto mb-4 group-hover:w-10 group-hover:bg-brand-rose/50 transition-all duration-300" />
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-plum/45 mb-2">
                    {benefit.label}
                  </p>
                  <p className="font-serif text-base md:text-lg text-brand-plum leading-snug">
                    {benefit.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3, SHOP BY CATEGORY */}
      <section id="shop-by-category" className="py-16 md:py-24 bg-brand-cream scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12 md:mb-16">
            <span className="boutique-section-eyebrow">Explore</span>
            <h2 className="boutique-section-title mb-3">Shop By Category</h2>
            <p className="text-brand-plum/70">Wigs, closures, frontals and services, find your perfect crown.</p>
          </AnimatedSection>
          <AnimatedGrid className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {MOCK_SHOP_CATEGORIES.map((cat, i) => (
              <MockCategoryCard
                key={cat.id}
                label={cat.label}
                href={cat.href}
                image={cat.image}
                index={i}
              />
            ))}
          </AnimatedGrid>
        </div>
      </section>

      {/* SECTION 4, FEATURED PRODUCTS */}
      <section id="featured-products" className="py-16 md:py-24 bg-white/60 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12 md:mb-16">
            <span className="boutique-section-eyebrow">Featured</span>
            <h2 className="boutique-section-title mb-3">Featured Products</h2>
            <p className="text-brand-plum/70">Handpicked wigs, units and services our customers love.</p>
          </AnimatedSection>
          <AnimatedGrid className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6 md:gap-8">
            {MOCK_FEATURED_PRODUCTS.map((product) => (
              <MockProductCard
                key={product.id}
                slug={product.slug}
                name={product.name}
                category={product.category}
                price={product.price}
                originalPrice={'originalPrice' in product ? product.originalPrice : undefined}
                image={product.image}
                tagline={product.tagline}
              />
            ))}
          </AnimatedGrid>
          <div className="text-center mt-12">
            <Link href="/shop" className="boutique-btn-secondary">
              View all wigs & hair
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 5, CUSTOMER REVIEWS */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12 md:mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-brand-plum mb-3">
              Queens Who Wear Their Crown
            </h2>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CUSTOMER_REVIEWS.map((review, i) => (
              <div
                key={i}
                className="glass-card rounded-2xl p-6 md:p-8 boutique-card-hover"
              >
                <div className="flex gap-0.5 text-brand-plum/30 mb-4">
                  {[...Array(review.rating)].map((_, j) => (
                    <i key={j} className="ri-star-fill text-sm text-brand-rose/70" />
                  ))}
                </div>
                <p className="text-brand-plum/90 text-sm md:text-base leading-relaxed">&ldquo;{review.text}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6, ABOUT */}
      <section className="py-16 md:py-24 bg-brand-latte/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-brand-plum mb-6">{ABOUT_HEADLINE}</h2>
            <p className="text-brand-plum/80 text-lg leading-relaxed">{ABOUT_BODY}</p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 mt-8 text-brand-plum font-semibold hover:text-brand-rose transition-colors"
            >
              Learn more <i className="ri-arrow-right-line" />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* SECTION 7, NEWSLETTER */}
      <section className="py-16 md:py-20 bg-brand-cream">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="glass-frosted rounded-3xl p-8 md:p-12">
            <NewsletterSection />
          </div>
        </div>
      </section>
    </main>
  );
}
