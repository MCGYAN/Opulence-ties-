'use client';

import { useEffect, useState } from 'react';
import { DmChannel, DmDesk, DmThread, channelLabel, loadDmDesk, saveDmDesk } from '@/lib/dm-store';

const FILTERS: { id: 'all' | DmChannel; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'website', label: 'Website' },
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'instagram', label: 'Instagram' },
];

export default function DmsPage() {
  const [desk, setDesk] = useState<DmDesk>({ automation: true, threads: [] });
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['id']>('all');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');

  const refresh = () => {
    const next = loadDmDesk();
    setDesk(next);
    setActiveId((current) => current || next.threads[0]?.id || null);
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

  const update = (next: DmDesk) => {
    setDesk(next);
    saveDmDesk(next);
  };

  const visible = desk.threads.filter((thread) => filter === 'all' || thread.channel === filter);
  const active = desk.threads.find((thread) => thread.id === activeId) || visible[0] || null;
  const waiting = desk.threads.filter((thread) => thread.needsPerson).length;
  const fromChat = desk.threads.filter((thread) => thread.orderNumber).length;

  const patchThread = (id: string, patch: Partial<DmThread>) => {
    update({
      ...desk,
      threads: desk.threads.map((thread) => (thread.id === id ? { ...thread, ...patch } : thread)),
    });
  };

  const reply = () => {
    if (!active || !draft.trim()) return;
    patchThread(active.id, {
      automation: false,
      needsPerson: false,
      messages: [...active.messages, { id: `own-${Date.now()}`, role: 'owner', text: draft.trim(), at: new Date().toISOString() }],
    });
    setDraft('');
  };

  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-[11px] uppercase tracking-[0.28em] text-[#c4a15a]">Direct messages</p>
      <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-3xl font-bold text-[#2a241e]">DMs</h1>
        <button
          type="button"
          onClick={() => update({ ...desk, automation: !desk.automation })}
          className={`rounded-xl px-4 py-2 text-sm font-semibold ${desk.automation ? 'bg-[#c4a15a] text-[#2a241e]' : 'border border-[#e4d8c4] text-[#6b6156]'}`}
        >
          {desk.automation ? 'Assistant is on' : 'Assistant is off'}
        </button>
      </div>
      <p className="mt-1 text-sm text-[#6b6156]">Website, WhatsApp, and Instagram.</p>

      <div className="mt-5 grid grid-cols-3 gap-3">
        {[
          ['Chats', desk.threads.length],
          ['Orders from a chat', fromChat],
          ['Waiting for you', waiting],
        ].map(([label, value]) => (
          <div key={String(label)} className="admin-panel rounded-2xl p-4">
            <p className="text-[10px] uppercase tracking-[0.16em] text-[#6b6156]">{label}</p>
            <p className="mt-1 text-2xl font-bold text-[#2a241e]">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFilter(item.id)}
            className={`rounded-full border px-3 py-1.5 text-sm ${filter === item.id ? 'border-[#c4a15a] bg-[#c4a15a]/15 text-[#2a241e]' : 'border-[#e4d8c4] text-[#6b6156]'}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[18rem_1fr]">
        <div className="space-y-2">
          {visible.map((thread) => (
            <button
              key={thread.id}
              type="button"
              onClick={() => setActiveId(thread.id)}
              className={`admin-panel w-full rounded-2xl p-3 text-left ${active?.id === thread.id ? 'border-[#c4a15a]' : ''}`}
            >
              <p className="text-sm font-semibold text-[#2a241e]">{thread.name}</p>
              <p className="text-xs text-[#6b6156]">{channelLabel(thread.channel)} · {thread.handle}</p>
              {thread.needsPerson && <p className="mt-1 text-xs text-[#8d6230]">Waiting for you</p>}
              {thread.orderNumber && <p className="mt-1 text-xs text-[#8d6230]">Order {thread.orderNumber}</p>}
            </button>
          ))}
          {visible.length === 0 && <p className="text-sm text-[#6b6156]">No messages here yet.</p>}
        </div>

        {active && (
          <section className="admin-panel flex min-h-[28rem] flex-col rounded-2xl p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e4d8c4] pb-3">
              <div>
                <h2 className="font-semibold text-[#2a241e]">{active.name}</h2>
                <p className="text-xs text-[#6b6156]">{channelLabel(active.channel)} · {active.handle}</p>
              </div>
              <button
                type="button"
                onClick={() => patchThread(active.id, { automation: !active.automation, needsPerson: false })}
                className="rounded-lg border border-[#e4d8c4] px-3 py-2 text-sm text-[#2a241e]"
              >
                {active.automation ? 'Take over' : 'Hand back to the assistant'}
              </button>
            </div>
            <div className="flex-1 space-y-2 overflow-y-auto py-4">
              {active.messages.map((message) => (
                <p key={message.id} className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${message.role === 'customer' ? 'bg-[#efe8dc] text-[#2a241e]' : message.role === 'owner' ? 'ml-auto bg-[#3f342c] text-[#efe8dc]' : 'ml-auto bg-[#c4a15a]/20 text-[#2a241e]'}`}>
                  <span className="mb-1 block text-[10px] uppercase tracking-[0.14em] text-[#6b6156]">{message.role === 'owner' ? 'You' : message.role === 'assistant' ? 'Assistant' : active.name}</span>
                  {message.text}
                </p>
              ))}
            </div>
            <form
              className="flex gap-2 border-t border-[#e4d8c4] pt-3"
              onSubmit={(event) => {
                event.preventDefault();
                reply();
              }}
            >
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Reply as yourself"
                className="min-w-0 flex-1 rounded-xl border border-[#e4d8c4] bg-white/80 px-3 py-2 text-sm outline-none focus:border-[#c4a15a]"
              />
              <button type="submit" className="rounded-xl bg-[#c4a15a] px-4 py-2 text-sm font-semibold text-[#2a241e]">Send</button>
            </form>
          </section>
        )}
      </div>
    </div>
  );
}
