'use client';

import { SITE_NAME, SITE_TAGLINE, LOGO_PATH, CONTACT_EMAIL, CONTACT_PHONE, BUSINESS_ADDRESS, SOCIAL_INSTAGRAM, SOCIAL_TIKTOK, CATALOG_PDF_PREFIX, OG_IMAGE_PATH, HERO_IMAGE_PATH, DEFAULT_PRODUCT_BRAND } from '@/lib/site-brand';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { usePageTitle } from '@/hooks/usePageTitle';
import ProductCard, { type ColorVariant } from '@/components/ProductCard';
import ProductCardSkeleton from '@/components/skeletons/ProductCardSkeleton';
import { getColorHex } from '@/components/ProductCard';
import { supabase } from '@/lib/supabase';
import {
  filterMockProducts,
  getMockCategories,
  isMockCatalogMode,
  mockProductToCard,
} from '@/lib/mock-catalog';
import { cachedQuery } from '@/lib/query-cache';
import PageHero from '@/components/PageHero';

function ShopContent() {
  usePageTitle('Shop All Products');
  const searchParams = useSearchParams();

  // State
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([{ id: 'all', name: 'All Products', count: 0 }]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [sortBy, setSortBy] = useState('popular');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const productsPerPage = 9;

  // Initialize from URL params
  useEffect(() => {
    const category = searchParams.get('category');
    const sort = searchParams.get('sort');
    const search = searchParams.get('search');

    if (category) setSelectedCategory(category);
    if (sort) setSortBy(sort);
    // Search is handled in the fetch function via searchParams directly or we could add a state for it
  }, [searchParams]);

  // Fetch Categories
  useEffect(() => {
    async function fetchCategories() {
      if (isMockCatalogMode()) {
        setCategories(getMockCategories());
        return;
      }

      try {
        const res = await fetch('/api/storefront/categories');
        if (res.ok) {
          const data = await res.json();
          if (data) setCategories(data);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    }
    fetchCategories();
  }, []);

  // Fetch Products
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const search = searchParams.get('search');

        if (isMockCatalogMode()) {
          const { products, total } = filterMockProducts({
            search,
            category: selectedCategory,
            priceMin: priceRange[0],
            priceMax: priceRange[1],
            minRating: selectedRating,
            sortBy,
            page,
            perPage: productsPerPage,
          });
          setProducts(products.map(mockProductToCard));
          setTotalProducts(total);
          return;
        }

        // Build cache key from all filter params
        const cacheKey = `shop:${selectedCategory}:${search || ''}:${priceRange.join('-')}:${selectedRating}:${sortBy}:${page}`;

        const { data, count, error } = await cachedQuery<{ data: any; count: any; error: any }>(
          cacheKey,
          async () => {
            let query = supabase
              .from('products')
              .select(`
                *,
                categories!inner(name, slug),
                product_images!product_id(url, position),
                product_variants(id, name, price, quantity, option1, option2, image_url)
              `, { count: 'exact' })
              .order('position', { foreignTable: 'product_images', ascending: true });

            // Search
            if (search) {
              query = query.ilike('name', `%${search}%`);
            }

            // Category Filter with Subcategories
            if (selectedCategory !== 'all') {
              const categoryObj = categories.find(c => c.slug === selectedCategory);

              if (categoryObj) {
                const targetSlugs = [selectedCategory];
                const childSlugs = categories
                  .filter(c => c.parent_id === categoryObj.id)
                  .map(c => c.slug);
                targetSlugs.push(...childSlugs);
                query = query.in('categories.slug', targetSlugs);
              } else {
                query = query.eq('categories.slug', selectedCategory);
              }
            }

            // Price Filter
            if (priceRange[1] < 5000) {
              query = query.gte('price', priceRange[0]).lte('price', priceRange[1]);
            }

            // Rating Filter
            if (selectedRating > 0) {
              query = query.gte('rating_avg', selectedRating);
            }

            // Sorting
            switch (sortBy) {
              case 'price-low':
                query = query.order('price', { ascending: true });
                break;
              case 'price-high':
                query = query.order('price', { ascending: false });
                break;
              case 'rating':
                query = query.order('rating_avg', { ascending: false });
                break;
              case 'new':
                query = query.order('created_at', { ascending: false });
                break;
              case 'popular':
              default:
                query = query.order('created_at', { ascending: false });
                break;
            }

            // Pagination
            const from = (page - 1) * productsPerPage;
            const to = from + productsPerPage - 1;
            query = query.range(from, to);

            return query as any;
          },
          2 * 60 * 1000 // Cache for 2 minutes
        );

        if (error) throw error;

        if (data) {
          const formattedProducts = data.map((p: any) => {
            const variants = p.product_variants || [];
            const hasVariants = variants.length > 0;
            const minVariantPrice = hasVariants ? Math.min(...variants.map((v: any) => v.price || p.price)) : undefined;
            const totalVariantStock = hasVariants ? variants.reduce((sum: number, v: any) => sum + (v.quantity || 0), 0) : 0;
            const effectiveStock = hasVariants ? totalVariantStock : p.quantity;
            // Extract unique colors from option2
            const colorVariants: ColorVariant[] = [];
            const seenColors = new Set<string>();
            for (const v of variants) {
              const colorName = v.option2;
              if (colorName && !seenColors.has(colorName.toLowerCase().trim())) {
                const hex = getColorHex(colorName);
                if (hex) {
                  seenColors.add(colorName.toLowerCase().trim());
                  colorVariants.push({ name: colorName.trim(), hex });
                }
              }
            }

            return {
              id: p.id,           // Product UUID for cart/orders
              slug: p.slug,       // Slug for navigation
              name: p.name,
              price: p.price,
              originalPrice: p.compare_at_price,
              image: p.product_images?.[0]?.url || 'https://via.placeholder.com/800x800?text=No+Image',
              rating: p.rating_avg || 0,
              reviewCount: 0, // Need to implement reviews relation
              badge: p.compare_at_price > p.price ? 'Sale' : undefined, // Simple badge logic
              inStock: effectiveStock > 0,
              maxStock: effectiveStock || 50,
              moq: p.moq || 1,
              category: p.categories?.name,
              hasVariants,
              minVariantPrice,
              colorVariants
            };
          });
          setProducts(formattedProducts);
          setTotalProducts(count || 0);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [selectedCategory, priceRange, selectedRating, sortBy, page, searchParams, categories]);

  const totalPages = Math.ceil(totalProducts / productsPerPage);

  return (
    <main className="min-h-screen bg-brand-cream">
      <PageHero
        eyebrow={`${SITE_NAME} Collection`}
        title="The Edit"
        subtitle="Browse human-hair wigs, closures, frontals and services, your next crown is waiting."
      />

      <div className="lg:hidden glass-cream border-b border-brand-rose/15 py-3 px-4 sticky top-16 z-30">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 text-brand-plum font-medium text-sm"
          >
            <i className="ri-filter-3-line text-lg text-brand-plum/70" />
            Filters &amp; Sort
          </button>
          <span className="text-sm text-brand-plum/60">{totalProducts} Products</span>
        </div>
      </div>

      <section className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            <aside className={`${isFilterOpen ? 'fixed inset-0 z-40 bg-brand-cream overflow-y-auto pb-24' : 'hidden'} lg:block lg:w-72 lg:flex-shrink-0`}>
              <div className="lg:sticky lg:top-28">
                <div className="p-6 lg:p-0">
                  <div className="flex items-center justify-between mb-6 lg:hidden">
                    <h2 className="font-serif text-xl text-brand-plum">Refine your look</h2>
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="w-10 h-10 flex items-center justify-center rounded-full text-brand-plum hover:bg-brand-latte/60"
                    >
                      <i className="ri-close-line text-2xl" />
                    </button>
                  </div>

                  <div className="boutique-panel glass-frosted p-6 space-y-8 lg:!bg-transparent lg:!backdrop-blur-none lg:!border-0 lg:!shadow-none lg:p-0">
                    <div>
                      <h3 className="boutique-section-eyebrow mb-4">Categories</h3>
                      <div className="space-y-1">
                        <button
                          onClick={() => {
                            setSelectedCategory('all');
                            setPage(1);
                            setIsFilterOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 rounded-full text-sm transition-all ${
                            selectedCategory === 'all'
                              ? 'boutique-chip-active font-semibold'
                              : 'text-brand-plum/75 hover:bg-brand-latte/50'
                          }`}
                        >
                          All pieces
                        </button>

                        {categories.filter(c => !c.parent_id && c.id !== 'all').map(parent => {
                          const subcategories = categories.filter(c => c.parent_id === parent.id);
                          const isSelected = selectedCategory === parent.slug;

                          return (
                            <div key={parent.id} className="space-y-1">
                              <button
                                onClick={() => {
                                  setSelectedCategory(parent.slug);
                                  setPage(1);
                                }}
                                className={`w-full text-left px-4 py-2.5 rounded-full text-sm transition-all flex justify-between items-center ${
                                  isSelected
                                    ? 'boutique-chip-active font-semibold'
                                    : 'text-brand-plum/75 hover:bg-brand-latte/50'
                                }`}
                              >
                                <span>{parent.name}</span>
                              </button>

                              {subcategories.length > 0 && (
                                <div className="ml-3 border-l border-brand-rose/15 pl-2 space-y-1">
                                  {subcategories.map(child => (
                                    <button
                                      key={child.id}
                                      onClick={() => {
                                        setSelectedCategory(child.slug);
                                        setPage(1);
                                        setIsFilterOpen(false);
                                      }}
                                      className={`w-full text-left px-4 py-2 rounded-full text-sm transition-all ${
                                        selectedCategory === child.slug
                                          ? 'text-brand-rose font-semibold bg-brand-latte/40'
                                          : 'text-brand-plum/60 hover:text-brand-plum hover:bg-brand-latte/30'
                                      }`}
                                    >
                                      {child.name}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="boutique-divider" />

                    <div>
                      <h3 className="boutique-section-eyebrow mb-4">Max price GH₵{priceRange[1]}</h3>
                      <input
                        type="range"
                        min="0"
                        max="5000"
                        step="50"
                        value={priceRange[1]}
                        onChange={(e) => {
                          setPriceRange([0, parseInt(e.target.value)]);
                          setPage(1);
                        }}
                        className="w-full h-1.5 bg-brand-latte rounded-full appearance-none cursor-pointer accent-brand-plum"
                      />
                      <div className="flex items-center justify-between text-xs text-brand-plum/50 mt-3 uppercase tracking-wider">
                        <span>GH₵0</span>
                        <span>GH₵5000+</span>
                      </div>
                    </div>

                    <div className="boutique-divider" />

                    <div>
                      <h3 className="boutique-section-eyebrow mb-4">Rating</h3>
                      <div className="space-y-2">
                        {[4, 3, 2, 1].map(rating => (
                          <button
                            key={rating}
                            onClick={() => {
                              setSelectedRating(rating === selectedRating ? 0 : rating);
                              setPage(1);
                            }}
                            className={`w-full text-left px-4 py-2.5 rounded-full text-sm transition-all ${
                              selectedRating === rating
                                ? 'boutique-chip-active'
                                : 'text-brand-plum/75 hover:bg-brand-latte/50'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {[1, 2, 3, 4, 5].map(star => (
                                <i
                                  key={star}
                                  className={`${star <= rating ? 'ri-star-fill text-brand-rose' : 'ri-star-line text-brand-plum/25'} text-sm`}
                                />
                              ))}
                              <span>& up</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <button onClick={() => setIsFilterOpen(false)} className="boutique-btn-primary w-full lg:hidden">
                      Show results
                    </button>
                  </div>
                </div>
              </div>
            </aside>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                <p className="text-sm text-brand-plum/60">
                  Showing <span className="font-semibold text-brand-plum">{products.length}</span> of{' '}
                  <span className="font-semibold text-brand-plum">{totalProducts}</span>
                </p>

                <div className="flex items-center gap-3">
                  <label className="text-xs uppercase tracking-[0.16em] text-brand-plum/50 whitespace-nowrap">Sort</label>
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setPage(1);
                    }}
                    className="boutique-input !py-2 !px-4 text-sm cursor-pointer min-w-[180px]"
                  >
                    <option value="popular">Most popular</option>
                    <option value="new">Newest</option>
                    <option value="price-low">Price: low to high</option>
                    <option value="price-high">Price: high to low</option>
                    <option value="rating">Highest rated</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8 md:gap-8">
                  {[...Array(6)].map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8" data-product-shop>
                    {products.map(product => (
                      <ProductCard key={product.id} {...product} />
                    ))}
                  </div>

                  {products.length === 0 && (
                    <div className="text-center py-20 boutique-panel max-w-lg mx-auto">
                      <div className="w-16 h-16 flex items-center justify-center mx-auto mb-5 rounded-full bg-brand-latte/60">
                        <i className="ri-search-eye-line text-3xl text-brand-rose/70" />
                      </div>
                      <h3 className="font-serif text-2xl text-brand-plum mb-2">Nothing matched</h3>
                      <p className="text-brand-plum/60 mb-8 text-sm">Try adjusting your filters to discover more pieces.</p>
                      <button
                        onClick={() => {
                          setSelectedCategory('all');
                          setPriceRange([0, 5000]);
                          setSelectedRating(0);
                          setPage(1);
                        }}
                        className="boutique-btn-primary"
                      >
                        Clear filters
                      </button>
                    </div>
                  )}
                </>
              )}

              {totalPages > 1 && (
                <div className="mt-14 flex justify-center">
                  <div className="inline-flex items-center gap-2 boutique-panel !rounded-full px-2 py-2">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-brand-latte/60 text-brand-plum transition-colors disabled:opacity-40"
                    >
                      <i className="ri-arrow-left-s-line text-xl" />
                    </button>
                    <span className="px-4 text-sm font-medium text-brand-plum/70">
                      {page} / {totalPages}
                    </span>
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-brand-latte/60 text-brand-plum transition-colors disabled:opacity-40"
                    >
                      <i className="ri-arrow-right-s-line text-xl" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-brand-cream"><div className="w-10 h-10 border-2 border-brand-rose border-t-brand-plum rounded-full animate-spin" /></div>}>
      <ShopContent />
    </Suspense>
  );
}