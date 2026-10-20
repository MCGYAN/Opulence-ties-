-- Sample categories for a new store. Replace or delete these after you add your own.
INSERT INTO public.categories (name, slug, description, status)
SELECT 'Category One',
       'category-one',
       'Replace this sample category.',
       'active'::public.category_status
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'category-one');

INSERT INTO public.categories (name, slug, description, status)
SELECT 'Category Two',
       'category-two',
       'Replace this sample category.',
       'active'::public.category_status
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'category-two');

INSERT INTO public.categories (name, slug, description, status)
SELECT 'Essentials',
       'essentials',
       'Everyday products customers reorder.',
       'active'::public.category_status
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'essentials');

INSERT INTO public.categories (name, slug, description, status)
SELECT 'New Arrivals',
       'new-arrivals',
       'The latest products added to the shop.',
       'active'::public.category_status
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'new-arrivals');
