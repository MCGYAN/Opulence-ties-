import { SITE_NAME } from '@/lib/site-brand';
import Link from 'next/link';
import { getSupabaseServerClient } from '@/lib/supabase';
import { getMockCategories, type MockCategory } from '@/lib/mock-catalog';
import PageHero from '@/components/PageHero';

export const revalidate = 0;

const palette = [
  { color: 'from-brand-plum/80 to-brand-dark', icon: 'ri-shopping-bag-3-line' },
  { color: 'from-brand-rose/80 to-brand-plum', icon: 'ri-t-shirt-2-line' },
  { color: 'from-brand-sage/70 to-brand-plum', icon: 'ri-sparkling-2-line' },
  { color: 'from-brand-champagne/80 to-brand-rose', icon: 'ri-heart-3-line' },
  { color: 'from-brand-latte to-brand-rose/60', icon: 'ri-star-smile-line' },
  { color: 'from-brand-nude/80 to-brand-sage', icon: 'ri-store-3-line' },
];

function mapCategories(categoriesData: MockCategory[]) {
  return categoriesData.map((c, i) => {
    const style = palette[i % palette.length];
    return {
      ...c,
      image: c.image_url || 'https://via.placeholder.com/600x400?text=Category',
      color: style.color,
      icon: style.icon,
      productCount: 'Browse',
    };
  });
}

export default async function CategoriesPage() {
  const supabase = getSupabaseServerClient();
  let categoriesData: MockCategory[] = getMockCategories();

  if (supabase) {
    const { data } = await supabase
      .from('categories')
      .select('id, name, slug, description, image_url, position, parent_id')
      .eq('status', 'active')
      .order('position', { ascending: true });

    if (data?.length) {
      categoriesData = data as MockCategory[];
    }
  }

  const categories = mapCategories(categoriesData);

  return (
    <div className="min-h-screen bg-brand-cream">
      <PageHero
        eyebrow="Collections"
        title="Shop by Category"
        subtitle="Shop dresses, sets, tops, jeans, accessories, and more."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {categories.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/shop?category=${category.slug}`}
                className="group boutique-panel overflow-hidden !rounded-2xl boutique-card-hover !p-0"
              >
                <div className="relative h-52 overflow-hidden boutique-image-zoom">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="boutique-img-target w-full h-full object-cover"
                  />
                  <span className="boutique-image-shine" aria-hidden />
                  <span className="boutique-image-vignette opacity-70 group-active:opacity-100" aria-hidden />
                  <div className="absolute inset-0 z-[4] bg-gradient-to-t from-brand-plum/80 via-brand-plum/20 to-transparent transition-opacity duration-300 group-active:from-brand-plum/90" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-11 h-11 bg-gradient-to-br ${category.color} rounded-full flex items-center justify-center shadow-sm`}>
                      <i className={`${category.icon} text-lg text-brand-cream`} />
                    </div>
                    <div>
                      <h3 className="font-serif text-xl text-brand-plum">{category.name}</h3>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-brand-plum/45">Collection</p>
                    </div>
                  </div>
                  <p className="text-brand-plum/65 leading-relaxed text-sm mb-4 line-clamp-2">
                    {category.description || 'Explore curated pieces in this collection.'}
                  </p>
                  <div className="flex items-center text-brand-rose font-semibold text-sm group-hover:gap-3 transition-all duration-300">
                    <span>Enter collection</span>
                    <i className="ri-arrow-right-line" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 boutique-panel max-w-lg mx-auto">
            <i className="ri-inbox-line text-5xl text-brand-rose/40 mb-4" />
            <p className="font-serif text-xl text-brand-plum">No categories yet.</p>
          </div>
        )}
      </div>

      <div className="bg-brand-plum py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-plum via-brand-dark to-brand-plum opacity-90" />
        <div className="absolute -top-20 right-0 w-64 h-64 rounded-full bg-brand-rose/10 blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-brand-cream mb-4">Need styling help?</h2>
          <p className="text-brand-cream/70 mb-8 leading-relaxed max-w-xl mx-auto">
            Browse the full edit or reach out, we&apos;ll help you find your next favourite piece.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/shop" className="boutique-btn-primary !bg-brand-cream !text-brand-plum hover:!bg-white">
              <i className="ri-search-line" />
              Shop all pieces
            </Link>
            <Link href="/contact" className="boutique-btn-secondary !border-brand-cream/40 !text-brand-cream hover:!bg-brand-cream/10 hover:!text-brand-cream">
              <i className="ri-customer-service-2-line" />
              Contact us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
