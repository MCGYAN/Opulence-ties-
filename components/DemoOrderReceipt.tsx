'use client';

import Link from 'next/link';
import type { DemoOrder } from '@/lib/demo-orders';

const money = (value: number) => `GH₵${value.toFixed(2)}`;

export default function DemoOrderReceipt({ order, mode }: { order: DemoOrder; mode: 'success' | 'tracking' }) {
  const placed = new Date(order.created_at).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <main className="min-h-screen bg-[#f7f5f2] px-4 py-12 text-black">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs uppercase tracking-[0.28em] text-[#9a7420]">
          {mode === 'success' ? 'Payment received' : 'Order tracking'}
        </p>
        <h1 className="mt-2 text-4xl font-bold">{mode === 'success' ? 'You are done.' : order.order_number}</h1>
        <p className="mt-3 max-w-xl text-neutral-600">
          {mode === 'success'
            ? `Paid as a guest. Track this order any time with ${order.order_number} or the WhatsApp number you used.`
            : `${order.shipping_address.name} · ${order.phone}`}
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Stat label="Order" value={order.order_number} />
          <Stat label="Status" value="Being prepared" />
          <Stat label="Delivery" value={order.delivery.label} />
        </div>

        <ol className="mt-8 grid gap-3 sm:grid-cols-3">
          <Step done title="Paid" detail={placed} />
          <Step done title="Preparing" detail="The piece is being packed" />
          <Step title={order.delivery.method === 'pickup' ? 'Ready for pickup' : 'On the way'} detail={order.delivery.label} />
        </ol>

        <section className="mt-8 rounded-2xl bg-white p-6">
          <ul className="space-y-4">
            {order.order_items.map((item) => (
              <li key={item.id} className="flex items-center gap-4">
                <img src={item.metadata.image} alt="" className="h-20 w-16 rounded-md object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{item.product_name}</p>
                  <p className="text-sm text-neutral-500">Qty {item.quantity}</p>
                </div>
                <p>{money(item.unit_price * item.quantity)}</p>
              </li>
            ))}
          </ul>
          <div className="mt-5 space-y-2 border-t border-black/10 pt-4 text-sm">
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal</span>
              <span>{money(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Delivery</span>
              <span>{order.shipping_total === 0 ? 'Free' : money(order.shipping_total)}</span>
            </div>
            <div className="flex justify-between text-base font-medium">
              <span>Total</span>
              <span>{money(order.total)}</span>
            </div>
          </div>
          <p className="mt-4 text-sm text-neutral-600">
            {order.shipping_address.landmark}, {order.shipping_address.city}
          </p>
        </section>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={`/order-tracking?order=${order.order_number}`} className="rounded-md bg-black px-5 py-3 text-sm text-white">
            Track this order
          </Link>
          <Link href="/#featured" className="rounded-md border border-black/15 bg-white px-5 py-3 text-sm">
            Keep shopping
          </Link>
        </div>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-black px-4 py-4 text-white">
      <p className="text-[11px] uppercase tracking-[0.18em] text-white/50">{label}</p>
      <p className="mt-2 text-sm">{value}</p>
    </div>
  );
}

function Step({ title, detail, done = false }: { title: string; detail: string; done?: boolean }) {
  return (
    <li className={`rounded-xl border px-4 py-4 ${done ? 'border-black bg-white' : 'border-black/10 bg-white/60'}`}>
      <p className="text-sm font-medium">{done ? '✓ ' : ''}{title}</p>
      <p className="mt-1 text-xs text-neutral-500">{detail}</p>
    </li>
  );
}
