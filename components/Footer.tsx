'use client';

import {
  SITE_NAME,
  SITE_TAGLINE,
  CONTACT_EMAIL,
  BUSINESS_ADDRESS,
  SOCIAL_INSTAGRAM,
  SOCIAL_FACEBOOK,
  LOGO_PATH,
  SHOP_CATEGORIES,
  WHATSAPP_URL,
  CONTACT_PHONE,
  CONTACT_PHONE_DISPLAY,
} from '@/lib/site-brand';
import Link from 'next/link';
import { useCMS } from '@/context/CMSContext';

export default function Footer() {
  const { getSetting } = useCMS();

  const siteName = getSetting('site_name') || SITE_NAME;
  const contactEmail = getSetting('contact_email') || CONTACT_EMAIL;
  const contactAddress = getSetting('contact_address') || BUSINESS_ADDRESS;
  const socialInstagram = getSetting('social_instagram') || SOCIAL_INSTAGRAM;
  const socialFacebook = getSetting('social_facebook') || SOCIAL_FACEBOOK;

  const shopLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop All', href: '/shop' },
    { label: 'Categories', href: '/categories' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const socialLinks = [
    { href: socialInstagram, icon: 'ri-instagram-line', label: 'Instagram' },
    { href: socialFacebook, icon: 'ri-facebook-fill', label: 'Facebook' },
    { href: WHATSAPP_URL, icon: 'ri-whatsapp-line', label: 'WhatsApp' },
  ].filter((s) => Boolean(s.href));

  return (
    <footer className="relative mt-8 md:mt-12 bg-white text-brand-plum border-t border-brand-rose/10 rounded-t-[1.75rem] md:rounded-t-[2.5rem]">
      <div className="max-w-7xl mx-auto px-5 sm:px-6">
        {/* Mobile layout */}
        <div className="md:hidden pt-10 pb-6 space-y-8">
          <div className="flex flex-col items-center text-center">
            <Link href="/" className="inline-block mb-5">
              <img
                src={LOGO_PATH}
                alt={siteName}
                className="h-36 w-auto max-w-[300px] object-contain object-center"
              />
            </Link>
            <p className="font-serif text-lg text-brand-rose">{SITE_TAGLINE}</p>
          </div>

          <div className="rounded-2xl border border-brand-rose/20 bg-brand-latte/60 px-5 py-5 space-y-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-rose">Get In Touch</p>
            <p className="text-sm text-brand-plum/70 leading-relaxed">{contactAddress}</p>
            <a
              href={`tel:${CONTACT_PHONE}`}
              className="inline-flex items-center gap-2 text-sm text-brand-plum hover:text-brand-rose transition-colors"
            >
              <i className="ri-phone-line text-brand-rose" aria-hidden />
              {CONTACT_PHONE_DISPLAY}
            </a>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-rose mb-4">Shop</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              {shopLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-brand-plum/80 py-1 hover:text-brand-rose transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-rose mb-4">Categories</p>
            <div className="flex flex-wrap gap-2">
              {SHOP_CATEGORIES.map((cat) => (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className="text-xs px-3 py-1.5 rounded-full border border-brand-rose/25 text-brand-plum/80 hover:bg-brand-latte hover:text-brand-rose transition-colors"
                >
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>

          {socialLinks.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-rose mb-4 text-center">
                Follow Us
              </p>
              <div className="flex justify-center gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex flex-col items-center gap-1.5 min-w-[4.5rem]"
                  >
                    <span className="w-12 h-12 rounded-full border border-brand-rose/40 flex items-center justify-center text-lg text-brand-rose hover:bg-brand-rose hover:text-white transition-all">
                      <i className={social.icon} />
                    </span>
                    <span className="text-[10px] text-brand-plum/45">{social.label}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Desktop layout */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16 pt-14 pb-10">
          <div className="space-y-5">
            <Link href="/" className="inline-block">
              <img
                src={LOGO_PATH}
                alt={siteName}
                className="h-40 w-auto max-w-[340px] object-contain object-left"
              />
            </Link>
            <p className="font-serif text-xl text-brand-rose">{SITE_TAGLINE}</p>
            <div className="text-sm text-brand-plum/70 space-y-1">
              <p className="font-medium text-brand-plum">{siteName}</p>
              <p>{contactAddress}</p>
              <p>
                <a href={`mailto:${contactEmail}`} className="hover:text-brand-rose transition-colors">
                  {contactEmail}
                </a>
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-5 text-brand-rose">Quick Links</h4>
            <ul className="space-y-2.5 text-sm text-brand-plum/75">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-brand-rose transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-5 text-brand-rose">Follow Us</h4>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full border border-brand-rose/40 flex items-center justify-center text-brand-rose hover:bg-brand-rose hover:text-white transition-all"
                >
                  <i className={social.icon} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-brand-rose/10 py-6 md:mt-4 md:pt-8 text-center text-xs text-brand-plum/45">
          <p>&copy; {new Date().getFullYear()} {siteName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
