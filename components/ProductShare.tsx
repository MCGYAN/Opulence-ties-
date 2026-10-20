'use client';

import { useState } from 'react';

type ProductShareProps = {
  name: string;
  price: number;
  image?: string;
};

export default function ProductShare({ name, price, image }: ProductShareProps) {
  const [copied, setCopied] = useState(false);
  const [note, setNote] = useState('');

  const pageUrl = () => (typeof window === 'undefined' ? '' : window.location.href);
  const message = () => `${name.trim()} · GH₵${price.toFixed(2)}\n${pageUrl()}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(pageUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const shareStatus = async () => {
    const url = pageUrl();
    const text = message();
    if (!navigator.share) {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
      return;
    }

    try {
      if (image && navigator.canShare) {
        const response = await fetch(image);
        const blob = await response.blob();
        const file = new File([blob], 'opulence-tie.jpg', { type: blob.type || 'image/jpeg' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({ title: name, text, url, files: [file] });
          return;
        }
      }
      await navigator.share({ title: name, text, url });
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        setNote('Share did not open. Copy the link and paste it on your status.');
      }
    }
  };

  return (
    <div className="border-t border-black/10 pt-5">
      <p className="mb-3 text-xs uppercase tracking-[0.22em] text-neutral-500">Send this piece</p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={shareStatus}
          className="inline-flex items-center gap-2 rounded-md bg-black px-4 py-2.5 text-sm text-white hover:bg-neutral-800"
        >
          <i className="ri-share-forward-line" />
          Share to status
        </button>
        <a
          href={`https://wa.me/?text=${encodeURIComponent(message())}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-md border border-black/15 px-4 py-2.5 text-sm hover:border-black"
        >
          <i className="ri-whatsapp-line" />
          WhatsApp
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl())}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-md border border-black/15 px-4 py-2.5 text-sm hover:border-black"
        >
          <i className="ri-facebook-fill" />
          Facebook
        </a>
        <button
          type="button"
          onClick={copyLink}
          className="inline-flex items-center gap-2 rounded-md border border-black/15 px-4 py-2.5 text-sm hover:border-black"
        >
          <i className={copied ? 'ri-check-line' : 'ri-link'} />
          {copied ? 'Link copied' : 'Copy pay link'}
        </button>
      </div>
      {note && <p className="mt-2 text-xs text-neutral-500">{note}</p>}
    </div>
  );
}
