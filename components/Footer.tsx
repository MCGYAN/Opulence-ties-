'use client';

import {
  SITE_NAME,
  CONTACT_EMAIL,
  BUSINESS_ADDRESS,
  USA_ADDRESS,
  USA_PHONE,
  CONTACT_EMAIL_SECONDARY,
  CONTACT_PHONE_SECONDARY_DISPLAY,
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
import { useEffect, useState } from 'react';
import { DEFAULT_SITE_COPY, loadSiteCopy } from '@/lib/site-copy';

export default function Footer() {
  const { getSetting } = useCMS();
  const [copy, setCopy] = useState(DEFAULT_SITE_COPY);

  useEffect(() => {
    setCopy(loadSiteCopy());
  }, []);

  const siteName = getSetting('site_name') || SITE_NAME;
  const contactEmail = getSetting('contact_email') || CONTACT_EMAIL;
  const contactAddress = getSetting('contact_address') || BUSINESS_ADDRESS;
  const socialInstagram = getSetting('social_instagram') || SOCIAL_INSTAGRAM;
  const socialFacebook = getSetting('social_facebook') || SOCIAL_FACEBOOK;

  const shopLinks = [
    { label: 'Top Collection', href: '/categories' },
    { label: 'Featured Collection', href: '/shop' },
  ];

  const socialLinks = [
    { href: socialInstagram, icon: 'ri-instagram-line', label: 'Instagram' },
    { href: socialFacebook, icon: 'ri-facebook-fill', label: 'Facebook' },
    { href: WHATSAPP_URL, icon: 'ri-whatsapp-line', label: 'WhatsApp' },
  ].filter((s) => Boolean(s.href));

  return (
    <footer className="relative mt-8 md:mt-12 bg-black text-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-6">
        {/* Mobile layout */}
        <div className="md:hidden pt-6 pb-2">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="inline-block min-w-0">
              <img
                src={LOGO_PATH}
                alt={siteName}
                className="h-9 w-auto max-w-[150px] object-contain object-left"
              />
            </Link>
            {socialLinks.length > 0 && (
              <div className="flex shrink-0 gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-[#DAA520]/40 text-sm text-[#DAA520]"
                  >
                    <i className={social.icon} />
                  </a>
                ))}
              </div>
            )}
          </div>
          <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-[#DAA520]">{copy.footerTagline}</p>

          <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5">
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#DAA520]">Shop</p>
              <ul className="space-y-1.5 text-[13px] text-white/75">
                {shopLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-[#DAA520]">{link.label}</Link>
                  </li>
                ))}
                <li><Link href="/privacy" className="hover:text-[#DAA520]">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-[#DAA520]">Terms</Link></li>
              </ul>
            </div>
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#DAA520]">Visit</p>
              <ul className="space-y-1.5 text-[13px] leading-snug text-white/75">
                <li>{contactAddress}</li>
                <li>
                  <a href={`tel:${CONTACT_PHONE}`} className="hover:text-[#DAA520]">{CONTACT_PHONE_DISPLAY}</a>
                </li>
                <li className="pt-1">{USA_ADDRESS}</li>
                <li>
                  <a href={`tel:${USA_PHONE.replace(/[^\d+]/g, '')}`} className="hover:text-[#DAA520]">{USA_PHONE}</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-5">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#DAA520]">Collections</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              {SHOP_CATEGORIES.map((cat) => (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className="truncate text-[13px] text-white/75 hover:text-[#DAA520]"
                >
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop layout */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16 pt-14 pb-10">
          <div className="space-y-5">
            <Link href="/" className="inline-block">
              <img
                src={LOGO_PATH}
                alt={siteName}
                className="h-16 w-auto max-w-[260px] object-contain object-left"
              />
            </Link>
            <p className="text-brand-rose">{copy.footerTagline}</p>
            <div className="text-sm text-white/75 space-y-1">
              <p className="font-medium text-white">Ghana</p>
              <p>{contactAddress}</p>
              <p>{CONTACT_PHONE_DISPLAY} / {CONTACT_PHONE_SECONDARY_DISPLAY}</p>
              <p className="font-medium text-white pt-3">USA</p>
              <p>{USA_ADDRESS}</p>
              <p>{USA_PHONE}</p>
              <p>{contactEmail}</p>
              <p>{CONTACT_EMAIL_SECONDARY}</p>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-5">Outfits</h4>
            <ul className="space-y-2.5 text-sm text-white/80">
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
            <h4 className="text-lg font-semibold mb-5">Legal</h4>
            <ul className="space-y-2.5 text-sm text-white/80 mb-6">
              <li><Link href="/privacy" className="hover:text-brand-rose">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-brand-rose">Terms</Link></li>
            </ul>
            <h4 className="text-lg font-semibold mb-5">Follow Us</h4>
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

        <div className="border-t border-white/10 py-4 md:mt-4 md:py-6 md:pt-8 text-center text-xs text-white/50">
          <p>&copy; {new Date().getFullYear()} {copy.copyrightName}</p>
        </div>
      </div>
    </footer>
  );
}
