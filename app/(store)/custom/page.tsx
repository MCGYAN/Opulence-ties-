'use client';

import Link from 'next/link';
import { WHATSAPP_URL } from '@/lib/site-brand';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function CustomPage() {
  usePageTitle('Custom');

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-black px-4 py-20 text-center text-white">
        <p className="mb-3 text-xs uppercase tracking-[0.28em] text-brand-rose">Custom</p>
        <h1 className="text-4xl font-bold md:text-5xl">Custom-made for you</h1>
        <p className="mx-auto mt-4 max-w-2xl text-white/70">
          Personalized neckties and accessories for individuals and businesses. Tell us the occasion, the colors, and the story you want the cloth to carry.
        </p>
      </section>
      <section className="mx-auto grid max-w-4xl gap-6 px-4 py-16 md:grid-cols-3">
        {['Your colors', 'Your symbol', 'Your occasion'].map((item) => (
          <div key={item} className="border border-gray-200 p-6">
            <h2 className="text-lg font-bold">{item}</h2>
            <p className="mt-2 text-sm text-gray-600">
              We design the piece around how you show up, then cut and finish it by hand.
            </p>
          </div>
        ))}
      </section>
      <div className="pb-16 text-center">
        <a href={WHATSAPP_URL} className="mr-3 inline-flex rounded-md bg-red-600 px-8 py-3 font-semibold text-white hover:bg-red-700">
          Start on WhatsApp
        </a>
        <Link href="/contact" className="inline-flex rounded-md border border-black px-8 py-3 font-semibold hover:bg-black hover:text-white">
          Send a message
        </Link>
      </div>
    </div>
  );
}
