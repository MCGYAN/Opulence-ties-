'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { OPULENCE_PRODUCTS, OPULENCE_SHOP_CATEGORIES } from '@/lib/opulence-catalog';
import { loadSiteCopy } from '@/lib/site-copy';
import { useCart } from '@/context/CartContext';
import { usePageTitle } from '@/hooks/usePageTitle';

const FEATURED = OPULENCE_PRODUCTS.filter((product) => product.featured && product.quantity > 0).slice(0, 8);

export default function Home() {
  usePageTitle('');
  const router = useRouter();
  const { addToCart } = useCart();
  const [slide, setSlide] = useState(1);
  const [word, setWord] = useState(1);
  const [ready, setReady] = useState(false);
  const [copy, setCopy] = useState(loadSiteCopy);

  useEffect(() => {
    setCopy(loadSiteCopy());
  }, []);

  const slides = copy.heroSlides;
  const rotating = [copy.heroWord1, copy.heroWord2].filter((label) => label.trim());

  useEffect(() => {
    setReady(true);
    const id = setInterval(() => {
      setSlide((current) => (current + 1) % Math.max(slides.length, 1));
      setWord((current) => (current + 1) % Math.max(rotating.length, 1));
    }, 5000);
    return () => clearInterval(id);
  }, [slides.length, rotating.length]);

  return (
    <main className="min-h-screen bg-[#F7F4EF] text-black">
      {/* Sleek Hero Section */}
      <section className="relative h-[80vh] min-h-[500px] md:min-h-[600px] w-full overflow-hidden bg-[#050505]">
        {slides.map((hero, index) => (
          <div
            key={`${hero.src}-${index}`}
            className={`absolute inset-0 transition-all duration-[1500ms] ease-out ${
              index === slide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          >
            <img src={hero.src} alt={hero.alt} className="h-full w-full object-cover object-center opacity-70 md:opacity-80" />
          </div>
        ))}
        {/* Rich dark gradient for text readability and luxury feel */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10 md:bg-gradient-to-r md:from-black/90 md:via-black/40 md:to-transparent" />
        
        <div className="relative h-full max-w-[1380px] mx-auto px-5 py-8 flex flex-col justify-end md:justify-center">
          <div
            className={`max-w-2xl transition-all duration-1000 ${
              ready ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
          >
            <span className="mb-4 inline-block border border-[#DAA520]/50 bg-black/40 px-3 py-1 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.3em] text-[#DAA520] backdrop-blur-sm">
              {copy.heroEyebrow}
            </span>
            <h1 className="mb-6 text-4xl sm:text-5xl font-bold leading-[1.15] text-white lg:text-7xl tracking-tight">
              {copy.heroLine1}
              <br />
              {copy.heroLine2}
              <br />
              <span className="relative inline-block min-h-[1.2em] min-w-[12ch] text-[#DAA520]">
                {rotating.map((label, index) => (
                  <span
                    key={label}
                    className={`absolute left-0 transition-all duration-500 ${
                      index === word ? 'translate-y-0 opacity-100 blur-0' : 'pointer-events-none translate-y-4 opacity-0 blur-sm'
                    }`}
                  >
                    {label}
                  </span>
                ))}
              </span>
            </h1>
            <div className="flex flex-wrap items-center gap-3 md:gap-4">
              <Link
                href="/shop"
                className="inline-flex h-12 md:h-14 items-center justify-center bg-[#DAA520] px-8 md:px-10 text-xs md:text-sm font-bold uppercase tracking-widest text-black transition-all hover:bg-[#F3D27A] hover:shadow-[0_0_20px_rgba(218,165,32,0.3)]"
              >
                {copy.heroShop}
              </Link>
              <a
                href="#collections"
                className="inline-flex h-12 md:h-14 items-center justify-center border border-white/30 px-8 md:px-10 text-xs md:text-sm font-bold uppercase tracking-widest text-white transition-all hover:border-white hover:bg-white hover:text-black"
              >
                {copy.heroExplore}
              </a>
            </div>
          </div>
        </div>

        {/* Minimalist slide indicators */}
        <div className="absolute bottom-6 md:bottom-8 left-0 right-0 flex justify-center gap-2 md:gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => {
                setSlide(index);
                setWord(index % Math.max(rotating.length, 1));
              }}
              className={`h-1 transition-all duration-500 ${
                index === slide ? 'w-8 md:w-12 bg-[#DAA520]' : 'w-3 md:w-4 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Marquee */}
      <div className="royalty-marquee border-y border-white/5 bg-[#0A0A0A]" aria-hidden>
        <div className="royalty-marquee-track">
          {Array.from({ length: 2 }).map((_, band) => (
            <div key={band} className="flex">
              {Array.from({ length: 6 }).map((__, index) => (
                <span key={`${band}-${index}`} className="px-6 md:px-8 py-3 md:py-4 text-[9px] md:text-[11px] font-bold uppercase tracking-[0.3em] text-[#DAA520]">
                  ✦ {copy.marquee} ✦
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Clean Collections Section - 2x2 Grid on Mobile */}
      <section id="collections" className="bg-[#F7F4EF] py-16 md:py-24 scroll-mt-16">
        <div className="mx-auto max-w-[1380px] px-3 sm:px-6 lg:px-8">
          <div className="mb-10 md:mb-16 flex flex-col items-center text-center">
            <p className="mb-3 md:mb-4 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] text-[#B8860B]">{copy.collectionsEyebrow}</p>
            <h2 className="text-2xl font-bold uppercase tracking-widest text-black sm:text-3xl lg:text-4xl">{copy.collectionsTitle}</h2>
            <div className="mt-4 md:mt-6 h-[1px] w-12 md:w-16 bg-[#B8860B]"></div>
          </div>
          
          {/* Mobile: 2 columns, Desktop: 3 columns */}
          <div className="grid grid-cols-2 gap-2 sm:gap-4 md:gap-6 lg:grid-cols-3">
            {OPULENCE_SHOP_CATEGORIES.map((category) => (
              <Link
                key={category.id}
                href={category.href}
                className="group relative block aspect-[4/5] overflow-hidden bg-[#EAE8E3] border border-black/5"
              >
                <img
                  src={category.image}
                  alt={category.label}
                  className="h-full w-full object-cover opacity-90 transition-transform duration-1000 ease-out group-hover:scale-110 group-hover:opacity-100"
                />
                {/* Refined rich gradient overlay so white text stands out */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10 transition-opacity duration-500 group-hover:opacity-70" />
                
                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-6 md:p-8 flex flex-col justify-end">
                  <p className="mb-1 md:mb-2 text-[7px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-[#DAA520] opacity-90 transition-transform duration-500 group-hover:-translate-y-1">
                    {category.productCount} Pieces
                  </p>
                  <h3 className="text-sm sm:text-xl md:text-2xl font-bold tracking-wider text-white transition-transform duration-500 group-hover:-translate-y-1">
                    {category.label}
                  </h3>
                  <div className="mt-2 md:mt-4 h-[1px] w-6 md:w-12 bg-white/50 transition-all duration-500 ease-out group-hover:w-full group-hover:bg-[#DAA520]" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Sleek Featured Pieces Section - 2x2 Grid on Mobile */}
      <section id="featured" className="bg-[#FBFAF7] py-16 md:py-24 text-black scroll-mt-16 border-t border-[#DAA520]/25">
        <div className="mx-auto max-w-[1380px] px-3 sm:px-6 lg:px-8">
          <div className="mb-10 md:mb-16 flex flex-col items-center text-center">
            <p className="mb-3 md:mb-4 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] text-[#DAA520]">{copy.featuredEyebrow}</p>
            <h2 className="text-2xl font-bold uppercase tracking-widest sm:text-3xl lg:text-4xl">{copy.featuredTitle}</h2>
            <div className="mt-4 md:mt-6 h-[1px] w-12 md:w-16 bg-[#DAA520]"></div>
          </div>

          {/* Grid Layout for Featured - 2 cols on mobile, 4 on desktop */}
          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
            {FEATURED.map((product) => (
              <article
                key={product.id}
                className="group flex flex-col"
              >
                <Link href={`/product/${product.slug}`} className="block relative aspect-[3/4] overflow-hidden bg-[#EFEAE2] border border-black/5">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover opacity-90 transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-100"
                  />
                  <div className="absolute top-2 left-2 md:top-4 md:left-4 border border-[#DAA520]/40 bg-black/75 px-2 py-1 md:px-3 md:py-1.5 text-[7px] md:text-[9px] font-bold uppercase tracking-[0.2em] text-[#DAA520]">
                    {product.quantity <= 15 ? `Only ${product.quantity} left` : `${product.quantity} in stock`}
                  </div>
                  {/* Subtle hover overlay */}
                  <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/5 pointer-events-none" />
                </Link>
                <div className="pt-4 md:pt-6 flex flex-col flex-1">
                  <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-[#DAA520] mb-1.5 md:mb-2">{product.category}</p>
                  <Link href={`/product/${product.slug}`} className="text-xs sm:text-sm md:text-base lg:text-lg font-medium tracking-wide line-clamp-2 hover:text-[#B8860B] transition-colors">
                    {product.name.trim()}
                  </Link>
                  <p className="mt-1.5 md:mt-2 text-xs md:text-sm font-semibold text-black/70">GH₵{product.price.toFixed(2)}</p>
                  
                  <div className="mt-auto pt-4 md:pt-5">
                    <button
                      type="button"
                      onClick={() => {
                        addToCart({
                          id: product.id,
                          name: product.name.trim(),
                          price: product.price,
                          image: product.image,
                          quantity: 1,
                          slug: product.slug,
                          maxStock: product.quantity,
                          moq: 1,
                        });
                        router.push('/checkout');
                      }}
                      className="w-full border border-black/15 bg-transparent py-2.5 md:py-3.5 text-[9px] md:text-xs font-medium uppercase tracking-[0.2em] text-black/70 transition-colors hover:border-black hover:bg-black hover:text-white"
                    >
                      {copy.buyNow}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          
          <div className="mt-12 md:mt-16 flex justify-center">
            <Link href="/shop" className="inline-flex items-center gap-2 border-b border-[#DAA520] pb-1 text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-[#DAA520] transition-all hover:text-[#F3D27A] hover:border-[#F3D27A]">
              {copy.featuredLink} <i className="ri-arrow-right-line" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
