export type DemoOrderItem = {
  id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  metadata: { image?: string };
};

export type DemoOrder = {
  order_number: string;
  created_at: string;
  status: 'processing';
  payment_status: 'paid';
  phone: string;
  email: string;
  subtotal: number;
  shipping_total: number;
  total: number;
  shipping_address: {
    name: string;
    landmark: string;
    city: string;
  };
  delivery: {
    method: 'accra' | 'scheduled' | 'pickup' | 'abroad';
    date?: string;
    label: string;
  };
  order_items: DemoOrderItem[];
  metadata: { demo: true; tracking_number: string };
};

const STORAGE_KEY = 'opulence-demo-orders';

function readAll(): DemoOrder[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as DemoOrder[]) : [];
  } catch {
    return [];
  }
}

function phoneKey(value: string) {
  const digits = value.replace(/\D/g, '');
  return digits.slice(-9);
}

export function saveDemoOrder(order: DemoOrder) {
  const next = [order, ...readAll().filter((item) => item.order_number !== order.order_number)];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next.slice(0, 30)));
  return order;
}

export function getDemoOrder(orderNumber: string) {
  const key = orderNumber.trim().toLowerCase();
  return readAll().find((order) => order.order_number.toLowerCase() === key) || null;
}

export function findDemoOrder(query: string) {
  const trimmed = query.trim();
  if (!trimmed) return null;
  const byNumber = getDemoOrder(trimmed);
  if (byNumber) return byNumber;
  const key = phoneKey(trimmed);
  if (key.length < 9) return null;
  return readAll().find((order) => phoneKey(order.phone) === key) || null;
}

export function createDemoOrderNumber() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const code = Array.from({ length: 4 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('');
  return `OT-${code}`;
}
