'use client';

import { SITE_NAME, HEADER_LOGO_PATH } from '@/lib/site-brand';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createPortal } from 'react-dom';
import MiniCart from './MiniCart';
import { useCart } from '@/context/CartContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useCMS } from '@/context/CMSContext';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Categories', href: '/categories' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlistCount, setWishlistCount] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);

  const { cartCount, isCartOpen, setIsCartOpen } = useCart();
  const { getSetting } = useCMS();

  const siteName = getSetting('site_name') || SITE_NAME;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const updateWishlistCount = () => {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setWishlistCount(wishlist.length);
    };

    updateWishlistCount();
    window.addEventListener('wishlistUpdated', updateWishlistCount);

    if (!isSupabaseConfigured()) {
      return () => {
        window.removeEventListener('wishlistUpdated', updateWishlistCount);
      };
    }

    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      window.removeEventListener('wishlistUpdated', updateWishlistCount);
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isSearchOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSearchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const iconBtn =
    'h-10 w-10 rounded-full flex items-center justify-center text-brand-plum transition-all duration-300 max-lg:bg-white/70 max-lg:border max-lg:border-brand-rose/15 lg:glass-pill lg:border-white/40 hover:text-brand-rose';

  const headerContent = (
    <>
      <header
        data-store-header
        className={`store-header-fixed mobile-header-glass safe-area-top transition-all duration-300 lg:duration-500 lg:ease-boutique ${
          scrolled ? 'lg:glass-frosted lg:border-white/40 lg:shadow-boutique' : 'lg:glass-cream lg:border-brand-rose/20'
        }`}
      >
        <nav aria-label="Main navigation" className="relative">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            {/* Mobile: logo left | search + cart right */}
            <div className="lg:hidden flex items-center justify-between h-[4.5rem] gap-3">
              <Link href="/" className="flex shrink-0 select-none" aria-label="Go to homepage">
                <img
                  src={HEADER_LOGO_PATH}
                  alt={siteName}
                  className="h-16 w-auto max-w-[min(62vw,260px)] object-contain object-left"
                />
              </Link>
              <div className="flex items-center justify-end gap-1 shrink-0">
                <button className={iconBtn} onClick={() => setIsSearchOpen(true)} aria-label="Search">
                  <i className="ri-search-line text-xl" />
                </button>
                <div className="relative">
                  <button className={iconBtn} onClick={() => setIsCartOpen(!isCartOpen)} aria-label="Cart">
                    <i className="ri-shopping-bag-3-line text-xl" />
                    {cartCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-rose text-[10px] font-bold text-white">
                        {cartCount}
                      </span>
                    )}
                  </button>
                  <MiniCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
                </div>
              </div>
            </div>

            {/* Desktop */}
            <div
              className={`hidden lg:grid lg:grid-cols-[auto_1fr_auto] lg:items-center lg:gap-4 lg:transition-all lg:duration-500 ${
                scrolled ? 'lg:h-[4.75rem]' : 'lg:h-24'
              }`}
            >
              <div className="flex items-center gap-3">
                <Link href="/" className="flex items-center select-none" aria-label="Go to homepage">
                  <img
                    src={HEADER_LOGO_PATH}
                    alt={siteName}
                    className={`w-auto object-contain transition-all duration-500 ${
                      scrolled ? 'h-14 sm:h-16' : 'h-16 sm:h-[4.5rem] max-w-[300px]'
                    }`}
                  />
                </Link>
              </div>

              <div className="hidden lg:flex items-center justify-center">
                <div className="flex items-center glass-pill px-2 py-1.5 shadow-sm">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="group relative px-4 py-2 text-[11px] uppercase tracking-[0.22em] font-semibold text-brand-plum/85 transition-colors hover:text-brand-rose"
                    >
                      {link.label}
                      <span className="absolute left-3 right-3 -bottom-0.5 h-px scale-x-0 bg-brand-rose transition-transform duration-300 ease-boutique group-hover:scale-x-100" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-1 sm:gap-2">
                <button className={iconBtn} onClick={() => setIsSearchOpen(true)} aria-label="Search">
                  <i className="ri-search-line text-xl" />
                </button>

                <Link href="/wishlist" className={`${iconBtn} relative hidden sm:flex`} aria-label="Wishlist">
                  <i className="ri-heart-3-line text-xl" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-rose text-[10px] font-bold text-white">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                {user ? (
                  <Link href="/account" className={`${iconBtn} hidden sm:flex`} aria-label="Account">
                    <i className="ri-user-3-line text-xl" />
                  </Link>
                ) : (
                  <Link href="/auth/login" className={`${iconBtn} hidden sm:flex`} aria-label="Login">
                    <i className="ri-user-3-line text-xl" />
                  </Link>
                )}

                <div className="relative">
                  <button className={iconBtn} onClick={() => setIsCartOpen(!isCartOpen)} aria-label="Cart">
                    <i className="ri-shopping-bag-3-line text-xl" />
                    {cartCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-rose text-[10px] font-bold text-white">
                        {cartCount}
                      </span>
                    )}
                  </button>
                  <MiniCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {isSearchOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-24 px-4 animate-fade-in-backdrop">
          <div
            className="absolute inset-0 bg-brand-plum/40 backdrop-blur-sm"
            onClick={() => setIsSearchOpen(false)}
            aria-hidden
          />
          <div className="relative w-full max-w-xl glass-frosted rounded-2xl p-6 md:p-8 animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="boutique-section-eyebrow mb-1">Discover</p>
                <h3 className="font-serif text-2xl text-brand-plum">Search the collection</h3>
              </div>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full text-brand-plum/60 hover:text-brand-plum hover:bg-brand-latte/60 transition-colors"
                aria-label="Close search"
              >
                <i className="ri-close-line text-2xl" />
              </button>
            </div>
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Try dresses, tops, sets..."
                  className="boutique-input pr-14 text-base"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-brand-plum text-brand-cream hover:bg-brand-dark transition-colors"
                  aria-label="Submit search"
                >
                  <i className="ri-arrow-right-line text-lg" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );

  if (!mounted) return null;

  return createPortal(headerContent, document.body);
}
