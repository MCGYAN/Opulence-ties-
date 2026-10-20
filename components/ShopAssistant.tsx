'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { findDemoOrder } from '@/lib/demo-orders';
import { DmMessage, DmThread, loadDmDesk, saveDmDesk } from '@/lib/dm-store';

const OFFERS = [
  'Ask me the price.',
  'Is it in stock? Just ask.',
  'I can send a pay link.',
  'Where is your order? Ask here.',
  'No need to search. I can help.',
];

function stamp(): DmMessage['id'] {
  return `m-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export default function ShopAssistant() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [thread, setThread] = useState<DmThread | null>(null);
  const [sending, setSending] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [offer, setOffer] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) return;
    const id = setInterval(() => setOffer((current) => (current + 1) % OFFERS.length), 3200);
    return () => clearInterval(id);
  }, [open]);

  const refresh = () => {
    const desk = loadDmDesk();
    setThread(desk.threads.find((item) => item.id === 'website') || null);
  };

  useEffect(() => {
    refresh();
    const onChange = () => refresh();
    window.addEventListener('storage', onChange);
    window.addEventListener('opulence-dms', onChange);
    return () => {
      window.removeEventListener('storage', onChange);
      window.removeEventListener('opulence-dms', onChange);
    };
  }, []);

  const send = async (preset?: string) => {
    const text = (preset ?? draft).trim();
    if (!text || sending) return;
    setDraft('');
    setOpen(true);
    setSending(true);

    const desk = loadDmDesk();
    const current = desk.threads.find((item) => item.id === 'website') || {
      id: 'website',
      channel: 'website' as const,
      name: 'Website guest',
      handle: 'On the shop',
      automation: true,
      needsPerson: false,
      messages: [],
    };
    const customerMessage: DmMessage = { id: stamp(), role: 'customer', text, at: new Date().toISOString() };
    const withCustomer: DmThread = { ...current, messages: [...current.messages, customerMessage] };
    const assistantOn = desk.automation && withCustomer.automation && !withCustomer.needsPerson;

    if (!assistantOn) {
      const waiting: DmThread = { ...withCustomer, needsPerson: true };
      saveDmDesk({ ...desk, threads: [waiting, ...desk.threads.filter((item) => item.id !== 'website')] });
      setThread(waiting);
      setSending(false);
      return;
    }

    let reply = 'The owner will reply here.';
    let needsPerson = false;
    if (assistantOn) {
      const known = findDemoOrder(text);
      const orders = known ? [{ number: known.order_number, label: known.delivery.label, total: known.total }] : [];
      try {
        const response = await fetch('/api/assistant', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: withCustomer.messages.map((message) => ({ role: message.role, text: message.text })),
            orders,
          }),
        });
        const data = await response.json();
        reply = typeof data.text === 'string' ? data.text : reply;
        needsPerson = Boolean(data.needsPerson);
      } catch {
        reply = 'I could not answer just now. The owner can take this chat.';
        needsPerson = true;
      }
    }

    const assistantMessage: DmMessage = { id: stamp(), role: 'assistant', text: reply, at: new Date().toISOString() };
    const nextThread: DmThread = {
      ...withCustomer,
      needsPerson,
      automation: needsPerson ? false : withCustomer.automation,
      messages: [...withCustomer.messages, assistantMessage],
    };
    const threads = [nextThread, ...desk.threads.filter((item) => item.id !== 'website')];
    saveDmDesk({ ...desk, threads });
    setThread(nextThread);
    setSending(false);
  };

  if (!mounted) return null;

  return createPortal(
    <div className="fixed bottom-[5.4rem] right-4 z-[100] flex flex-col items-end lg:bottom-8 lg:right-8">
      {open && (
        <div className="mb-3 flex h-[min(28rem,70vh)] w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-[#DAA520]/40 bg-[#0A0A0A] text-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#DAA520]">Customer service</p>
              <p className="mt-0.5 flex items-center gap-1.5 text-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-[#7dcea0]"></span>
                Here now. No need to call.
              </p>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close customer service" className="text-white/60">
              <i className="ri-close-line text-xl"></i>
            </button>
          </div>
          <div className="flex-1 space-y-2 overflow-y-auto px-3 py-3">
            <p className="max-w-[90%] rounded-2xl bg-white/10 px-3 py-2 text-sm text-white">
              Ask me anything. Price, whether it is in stock, how to pay, or where your order is. You do not have to search the shop.
            </p>
            {(thread?.messages || []).map((message) => (
              <p
                key={message.id}
                className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm ${message.role === 'customer' ? 'ml-auto bg-[#DAA520] text-black' : 'bg-white/10 text-white'}`}
              >
                {message.text}
              </p>
            ))}
            {!thread?.messages.length && (
              <div className="flex flex-wrap gap-2 pt-1">
                {['Is this piece in stock?', 'Where is my order?'].map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => send(prompt)}
                    className="rounded-full border border-[#DAA520]/50 px-3 py-1.5 text-xs text-[#DAA520]"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}
          </div>
          <form
            className="flex gap-2 border-t border-white/10 p-3"
            onSubmit={(event) => {
              event.preventDefault();
              send();
            }}
          >
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Ask customer service"
              className="min-w-0 flex-1 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm outline-none"
            />
            <button type="submit" disabled={sending} className="rounded-xl bg-[#DAA520] px-3 py-2 text-sm font-semibold text-black disabled:opacity-50">
              Send
            </button>
          </form>
        </div>
      )}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mb-2 max-w-[14rem] rounded-2xl rounded-br-md bg-black/90 px-3 py-2 text-left text-sm leading-snug text-white shadow-lg"
        >
          {OFFERS[offer]}
        </button>
      )}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Customer service. Message us if you need help."
        className="relative flex h-14 w-14 items-center justify-center"
      >
        {!open && (
          <>
            <span className="shop-assist-ping" aria-hidden></span>
            <span className="shop-assist-ping shop-assist-ping-late" aria-hidden></span>
          </>
        )}
        <span className="shop-assist-core relative flex h-14 w-14 items-center justify-center rounded-full bg-[#DAA520] text-black shadow-lg">
          <i className={`${open ? 'ri-close-line' : 'ri-customer-service-2-line'} text-2xl`}></i>
        </span>
      </button>
    </div>,
    document.body
  );
}
