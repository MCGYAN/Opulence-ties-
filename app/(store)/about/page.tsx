'use client';

import Link from 'next/link';
import {
  ABOUT_BODY,
  CONTACT_PHONE_DISPLAY,
  SITE_NAME,
  WHATSAPP_URL,
} from '@/lib/site-brand';
import { usePageTitle } from '@/hooks/usePageTitle';

const TEAM = [
  { name: 'Derick', role: 'Founder & CEO' },
  { name: 'Prince', role: 'Business Development Manager' },
  { name: 'Nana Yaw', role: 'Business Associate' },
];

const SERVICES = [
  'Provide personalized or custom-made designs for individuals and businesses.',
  'Provide professional styling services that enhance a client’s image.',
  'Assist with wardrobe organization, shopping guidance, and personal color analysis.',
  'Provide corporate fashion advice that reflects budget, lifestyle, body shape, and coloring.',
];

export default function AboutPage() {
  usePageTitle('About Us');

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <section className="bg-black px-4 py-20 text-center text-white">
        <p className="mb-3 text-xs uppercase tracking-[0.28em] text-brand-rose">About Us</p>
        <h1 className="text-4xl font-bold md:text-5xl">Meet Our Team</h1>
        <p className="mx-auto mt-4 max-w-2xl text-white/70">
          Our team brings together fashion design, tailoring, and luxury craftsmanship.
        </p>
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-4 py-16 sm:grid-cols-3">
        {TEAM.map((person) => (
          <div key={person.name} className="border border-gray-200 p-8 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-black text-2xl text-brand-rose">
              {person.name.slice(0, 1)}
            </div>
            <h2 className="text-xl font-bold">{person.name}</h2>
            <p className="mt-1 text-sm text-gray-500">{person.role}</p>
          </div>
        ))}
      </section>

      <section className="bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-lg leading-relaxed text-gray-700">
            <strong>{SITE_NAME}</strong> {ABOUT_BODY}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16">
        <p className="text-center text-xs uppercase tracking-[0.24em] text-brand-rose">Our Services</p>
        <h2 className="mt-3 text-center text-3xl font-bold">
          Beyond delivering top-notch neckties and accessories we:
        </h2>
        <ul className="mt-10 space-y-4">
          {SERVICES.map((service) => (
            <li key={service} className="border border-gray-200 px-5 py-4 text-gray-700">
              {service}
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-black px-4 py-16 text-center text-white">
        <h2 className="text-3xl font-bold">Our Clients</h2>
        <p className="mx-auto mt-4 max-w-2xl text-white/70">
          We deliver tailored solutions to individuals, businesses, and organizations across industries.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/shop" className="rounded-md bg-red-600 px-8 py-3 font-semibold hover:bg-red-700">
            Shop Now
          </Link>
          <a href={WHATSAPP_URL} className="rounded-md border border-white px-8 py-3 hover:bg-white hover:text-black">
            WhatsApp {CONTACT_PHONE_DISPLAY}
          </a>
        </div>
      </section>
    </div>
  );
}
