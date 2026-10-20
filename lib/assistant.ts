import { OPULENCE_PRODUCTS } from '@/lib/opulence-catalog';

export type AssistantTurn = {
  role: 'customer' | 'assistant' | 'owner';
  text: string;
};

export type AssistantOrder = {
  number: string;
  label: string;
  total: number;
};

const PERSON_MARK = '[[person]]';

export function catalogBrief() {
  return OPULENCE_PRODUCTS
    .filter((product) => product.quantity > 0)
    .map((product) => `${product.name.trim()} | GH₵${product.price} | ${product.quantity} in stock | /product/${product.slug}`)
    .join('\n');
}

export function assistantSystemPrompt(orders: AssistantOrder[]) {
  const orderLines = orders.length
    ? orders.map((order) => `${order.number} | ${order.label} | GH₵${order.total.toFixed(2)} | paid, being prepared`).join('\n')
    : 'No orders on this browser yet.';

  return `You are the sales assistant for Opulence Ties, a necktie house in Lashibi, Ghana that also ships outside Ghana. Write like a person on the shop floor: short, warm, and specific. Plain sentences. No bullet lists unless the guest asks for options.

You can:
- Say if a piece is in stock, its price in GH₵, and give its page as a payment link. Guests pay on that page with no account.
- Say where an order is if it appears below. Ask for the order number or WhatsApp number when you cannot see it.
- Recommend one piece and stay with it until they buy or ask for something else.

Stock and prices, only these:
${catalogBrief()}

Orders placed on this shop:
${orderLines}

If you do not have a fact, say so. Do not invent stock, prices, or tracking.
If they ask for a person, the owner, or a human, start your reply with ${PERSON_MARK} and then one sentence saying the owner will step in.`;
}

export function localAssistantReply(history: AssistantTurn[], orders: AssistantOrder[], origin: string) {
  const latest = [...history].reverse().find((turn) => turn.role === 'customer')?.text.trim() || '';
  const text = latest.toLowerCase();

  if (/person|human|owner|real someone|talk to you|someone real|call me/.test(text)) {
    return {
      text: 'The owner will step in on this chat.',
      needsPerson: true,
    };
  }

  const order = orders.find((item) => text.includes(item.number.toLowerCase()))
    || (/(order|track|where is|status|delivery)/.test(text) ? orders[0] : null);
  if (order && /(order|track|where|status|delivery|ot-)/.test(text)) {
    return {
      text: `${order.number} is paid and being prepared. ${order.label}.`,
      needsPerson: false,
    };
  }
  if (/(order|track|where is my|status)/.test(text)) {
    return {
      text: 'Send the order number, it looks like OT-1234, or the WhatsApp number you paid with.',
      needsPerson: false,
    };
  }

  const product = OPULENCE_PRODUCTS.find((item) => {
    const name = item.name.trim().toLowerCase();
    return name.length > 2 && text.includes(name);
  });
  if (product) {
    if (product.quantity <= 0) {
      return {
        text: `${product.name.trim()} is out at the moment. The Signature is in stock if you want a close alternative.`,
        needsPerson: false,
      };
    }
    return {
      text: `${product.name.trim()} is in stock, ${product.quantity} pieces, GH₵${product.price}. You can pay here with no account: ${origin}/product/${product.slug}`,
      needsPerson: false,
    };
  }

  if (/(stock|available|have|price|how much|buy|pay|link)/.test(text)) {
    const pick = OPULENCE_PRODUCTS.find((item) => item.featured && item.quantity > 0) || OPULENCE_PRODUCTS[0];
    return {
      text: `${pick.name.trim()} is the one guests take home first. ${pick.quantity} in stock, GH₵${pick.price}. Pay here: ${origin}/product/${pick.slug}`,
      needsPerson: false,
    };
  }

  return {
    text: 'Tell me the piece you want, or your order number, and I will take it from there.',
    needsPerson: false,
  };
}

export function readAssistantReply(raw: string) {
  const needsPerson = raw.includes(PERSON_MARK);
  const text = raw.replace(PERSON_MARK, '').trim();
  return { text: text || 'The owner will step in on this chat.', needsPerson };
}
