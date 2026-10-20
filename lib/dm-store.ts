export type DmChannel = 'website' | 'whatsapp' | 'instagram';
export type DmRole = 'customer' | 'assistant' | 'owner';

export type DmMessage = {
  id: string;
  role: DmRole;
  text: string;
  at: string;
};

export type DmThread = {
  id: string;
  channel: DmChannel;
  name: string;
  handle: string;
  automation: boolean;
  needsPerson: boolean;
  orderNumber?: string;
  messages: DmMessage[];
};

export type DmDesk = {
  automation: boolean;
  threads: DmThread[];
};

const KEY = 'opulence-dms';

const SAMPLE: DmDesk = {
  automation: true,
  threads: [
    {
      id: 'wa-ama',
      channel: 'whatsapp',
      name: 'WhatsApp guest',
      handle: '+233 24 000 0000',
      automation: true,
      needsPerson: false,
      orderNumber: 'OT-4K2P',
      messages: [
        { id: 'wa-1', role: 'customer', text: 'Is The Signature still available?', at: '2026-10-20T09:10:00.000Z' },
        { id: 'wa-2', role: 'assistant', text: 'The Signature is in stock. You can pay on the piece page, no account needed.', at: '2026-10-20T09:10:20.000Z' },
        { id: 'wa-3', role: 'customer', text: 'I paid. Order OT-4K2P.', at: '2026-10-20T09:40:00.000Z' },
        { id: 'wa-4', role: 'assistant', text: 'OT-4K2P is paid and being prepared for delivery in Accra.', at: '2026-10-20T09:40:12.000Z' },
      ],
    },
    {
      id: 'ig-guest',
      channel: 'instagram',
      name: 'Instagram guest',
      handle: '@guest',
      automation: false,
      needsPerson: true,
      messages: [
        { id: 'ig-1', role: 'customer', text: 'Can I speak to someone about a wedding order?', at: '2026-10-20T10:05:00.000Z' },
        { id: 'ig-2', role: 'assistant', text: 'The owner will step in on this chat.', at: '2026-10-20T10:05:08.000Z' },
      ],
    },
  ],
};

function blank(): DmDesk {
  return { automation: true, threads: [] };
}

export function loadDmDesk(): DmDesk {
  if (typeof window === 'undefined') return SAMPLE;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) {
      window.localStorage.setItem(KEY, JSON.stringify(SAMPLE));
      return SAMPLE;
    }
    const parsed = JSON.parse(raw) as DmDesk;
    if (!parsed || !Array.isArray(parsed.threads)) return blank();
    return { automation: parsed.automation !== false, threads: parsed.threads };
  } catch {
    return blank();
  }
}

export function saveDmDesk(desk: DmDesk) {
  window.localStorage.setItem(KEY, JSON.stringify(desk));
  window.dispatchEvent(new Event('opulence-dms'));
}

export function channelLabel(channel: DmChannel) {
  if (channel === 'whatsapp') return 'WhatsApp';
  if (channel === 'instagram') return 'Instagram';
  return 'Website';
}
