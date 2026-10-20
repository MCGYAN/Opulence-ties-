'use client';

import { useEffect, useState } from 'react';
import {
  DEFAULT_SITE_COPY,
  SiteCopy,
  loadSiteCopy,
  readHeroImage,
  resetSiteCopy,
  saveSiteCopy,
} from '@/lib/site-copy';

function Field({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-2 block text-[#6b6156]">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-[#e4d8c4] bg-white/80 px-4 py-3 text-[#2a241e] outline-none focus:border-[#c4a15a]"
      />
      {hint && <span className="mt-1 block text-xs text-[#6b6156]">{hint}</span>}
    </label>
  );
}

export default function ContentPage() {
  const [copy, setCopy] = useState<SiteCopy>(DEFAULT_SITE_COPY);
  const [notice, setNotice] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setCopy(loadSiteCopy());
    setReady(true);
  }, []);

  const setField = (key: keyof SiteCopy, value: string) => {
    setCopy((current) => ({ ...current, [key]: value }));
    setNotice('');
  };

  const updateSlide = (index: number, patch: Partial<SiteCopy['heroSlides'][number]>) => {
    setCopy((current) => ({
      ...current,
      heroSlides: current.heroSlides.map((slide, slideIndex) => (slideIndex === index ? { ...slide, ...patch } : slide)),
    }));
    setNotice('');
  };

  const onImage = async (index: number, file?: File) => {
    if (!file) return;
    try {
      const src = await readHeroImage(file);
      updateSlide(index, { src });
    } catch {
      setNotice('That picture could not be used. Try another one.');
    }
  };

  const addSlide = async (file?: File) => {
    if (!file) return;
    try {
      const src = await readHeroImage(file);
      setCopy((current) => ({
        ...current,
        heroSlides: [...current.heroSlides, { src, alt: 'Hero image' }],
      }));
      setNotice('');
    } catch {
      setNotice('That picture could not be used. Try another one.');
    }
  };

  const removeSlide = (index: number) => {
    setCopy((current) => {
      if (current.heroSlides.length <= 1) return current;
      return { ...current, heroSlides: current.heroSlides.filter((_, slideIndex) => slideIndex !== index) };
    });
  };

  const save = () => {
    const slides = copy.heroSlides.filter((slide) => slide.src.trim());
    if (!slides.length) {
      setNotice('Keep at least one hero picture.');
      return;
    }
    const next = { ...copy, heroSlides: slides };
    saveSiteCopy(next);
    setCopy(next);
    setNotice('Saved. Open the shop homepage to see it.');
  };

  if (!ready) return null;

  return (
    <div className="mx-auto max-w-5xl">
      <p className="text-[11px] uppercase tracking-[0.28em] text-[#c4a15a]">Content</p>
      <h1 className="mt-1 text-3xl font-bold text-[#2a241e]">Words on the shop</h1>
      <p className="mt-1 max-w-xl text-sm text-[#6b6156]">
        Change the homepage wording, the copyright line, and the hero pictures. Products and categories stay in their own pages.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" onClick={save} className="rounded-xl bg-[#c4a15a] px-5 py-3 text-sm font-semibold text-[#2a241e] hover:bg-[#a8873f]">
          Save words
        </button>
        <button
          type="button"
          onClick={() => {
            setCopy(resetSiteCopy());
            setNotice('Restored the original words.');
          }}
          className="rounded-xl border border-[#e4d8c4] px-5 py-3 text-sm text-[#2a241e]"
        >
          Restore original
        </button>
        {notice && <p className="self-center text-sm text-[#8d6230]">{notice}</p>}
      </div>

      <section className="admin-panel mt-6 rounded-2xl p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-[#2a241e]">Hero</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Small line above the title" value={copy.heroEyebrow} onChange={(value) => setField('heroEyebrow', value)} />
          <Field label="First line" value={copy.heroLine1} onChange={(value) => setField('heroLine1', value)} />
          <Field label="Second line" value={copy.heroLine2} onChange={(value) => setField('heroLine2', value)} />
          <Field label="Gold word, first" value={copy.heroWord1} onChange={(value) => setField('heroWord1', value)} />
          <Field label="Gold word, second" value={copy.heroWord2} onChange={(value) => setField('heroWord2', value)} hint="These two take turns in the headline." />
          <Field label="Main button" value={copy.heroShop} onChange={(value) => setField('heroShop', value)} />
          <Field label="Second button" value={copy.heroExplore} onChange={(value) => setField('heroExplore', value)} />
        </div>
      </section>

      <section className="admin-panel mt-4 rounded-2xl p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-[#2a241e]">Hero pictures</h2>
          <label className="cursor-pointer rounded-xl border border-[#c4a15a] px-4 py-2 text-sm text-[#2a241e]">
            Add a picture
            <input type="file" accept="image/*" className="hidden" onChange={(event) => { addSlide(event.target.files?.[0]); event.target.value = ''; }} />
          </label>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {copy.heroSlides.map((slide, index) => (
            <article key={`${index}-${slide.src.slice(0, 24)}`} className="rounded-xl border border-[#e4d8c4] p-3">
              <img src={slide.src} alt="" className="h-36 w-full rounded-lg object-cover" />
              <label className="mt-3 block text-sm">
                <span className="mb-2 block text-[#6b6156]">Description</span>
                <input
                  value={slide.alt}
                  onChange={(event) => updateSlide(index, { alt: event.target.value })}
                  className="w-full rounded-xl border border-[#e4d8c4] bg-white/80 px-3 py-2 text-[#2a241e] outline-none focus:border-[#c4a15a]"
                />
              </label>
              <div className="mt-3 flex gap-2">
                <label className="cursor-pointer rounded-lg border border-[#e4d8c4] px-3 py-2 text-sm text-[#2a241e]">
                  Replace
                  <input type="file" accept="image/*" className="hidden" onChange={(event) => { onImage(index, event.target.files?.[0]); event.target.value = ''; }} />
                </label>
                <button type="button" onClick={() => removeSlide(index)} className="rounded-lg border border-[#e4d8c4] px-3 py-2 text-sm text-[#6b6156]">
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="admin-panel mt-4 rounded-2xl p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-[#2a241e]">Ribbon</h2>
        <div className="mt-4">
          <Field label="The line that runs under the hero" value={copy.marquee} onChange={(value) => setField('marquee', value)} />
        </div>
      </section>

      <section className="admin-panel mt-4 rounded-2xl p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-[#2a241e]">Section headings</h2>
        <p className="mt-1 text-sm text-[#6b6156]">The collections and the pieces themselves stay in Products and Categories.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Collections, small line" value={copy.collectionsEyebrow} onChange={(value) => setField('collectionsEyebrow', value)} />
          <Field label="Collections title" value={copy.collectionsTitle} onChange={(value) => setField('collectionsTitle', value)} />
          <Field label="Featured, small line" value={copy.featuredEyebrow} onChange={(value) => setField('featuredEyebrow', value)} />
          <Field label="Featured title" value={copy.featuredTitle} onChange={(value) => setField('featuredTitle', value)} />
          <Field label="Link under the featured pieces" value={copy.featuredLink} onChange={(value) => setField('featuredLink', value)} />
          <Field label="Button on each piece" value={copy.buyNow} onChange={(value) => setField('buyNow', value)} />
        </div>
      </section>

      <section className="admin-panel mt-4 rounded-2xl p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-[#2a241e]">Footer</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Tagline" value={copy.footerTagline} onChange={(value) => setField('footerTagline', value)} />
          <Field label="Copyright name" value={copy.copyrightName} onChange={(value) => setField('copyrightName', value)} hint="The year stays current. This is the name after it." />
        </div>
      </section>
    </div>
  );
}
