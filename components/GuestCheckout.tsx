'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { createDemoOrderNumber, saveDemoOrder, type DemoOrder } from '@/lib/demo-orders';

const money = (value: number) => `GH₵${value.toFixed(2)}`;

function tomorrow() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}

export default function GuestCheckout() {
  const router = useRouter();
  const { cart, subtotal, clearCart, setIsCartOpen } = useCart();
  useEffect(() => {
    setIsCartOpen(false);
  }, [setIsCartOpen]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [landmark, setLandmark] = useState('');
  const [email, setEmail] = useState('');
  const [destination, setDestination] = useState<'ghana' | 'abroad'>('ghana');
  const [country, setCountry] = useState('');
  const [region, setRegion] = useState('');
  const [postal, setPostal] = useState('');
  const [delivery, setDelivery] = useState<'accra' | 'scheduled' | 'pickup'>('accra');
  const [date, setDate] = useState(tomorrow);
  const [error, setError] = useState('');
  const [paying, setPaying] = useState(false);

  const abroad = destination === 'abroad';
  const shipping = abroad ? 80 : delivery === 'pickup' ? 0 : 20;
  const total = subtotal + shipping;

  const deliveryLabel = useMemo(() => {
    if (abroad) return `Ship to ${country.trim() || 'outside Ghana'}`;
    if (delivery === 'pickup') return 'Pickup at Lashibi';
    if (delivery === 'scheduled') return `Scheduled for ${date}`;
    return 'Accra delivery, 1–2 days';
  }, [abroad, country, date, delivery]);

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-white px-4 py-24 text-center">
        <h1 className="text-3xl font-bold">Your bag is empty</h1>
        <p className="mt-3 text-neutral-600">Choose a tie, then come back to pay.</p>
        <Link href="/#featured" className="mt-8 inline-flex rounded-md bg-red-600 px-6 py-3 text-white hover:bg-red-700">
          Shop featured pieces
        </Link>
      </main>
    );
  }

  const pay = () => {
    if (name.trim().length < 2) return setError('Add the name for the delivery.');
    if (phone.replace(/\D/g, '').length < 9) return setError('Add a WhatsApp number so we can reach you.');
    if (abroad) {
      if (country.trim().length < 2) return setError('Add the country.');
      if (city.trim().length < 2) return setError('Add the city.');
      if (region.trim().length < 2) return setError('Add the state or region.');
      if (postal.trim().length < 3) return setError('Add the postal code.');
      if (landmark.trim().length < 3) return setError('Add the street address.');
    } else if (delivery !== 'pickup') {
      if (city.trim().length < 2) return setError('Add the city or area.');
      if (landmark.trim().length < 3) return setError('Add a landmark or street.');
      if (delivery === 'scheduled' && !date) return setError('Choose a delivery date.');
    }
    setError('');
    setPaying(true);

    const orderNumber = createDemoOrderNumber();
    const order: DemoOrder = {
      order_number: orderNumber,
      created_at: new Date().toISOString(),
      status: 'processing',
      payment_status: 'paid',
      phone: phone.trim(),
      email: email.trim(),
      subtotal,
      shipping_total: shipping,
      total,
      shipping_address: {
        name: name.trim(),
        landmark: abroad
          ? `${landmark.trim()}, ${region.trim()} ${postal.trim()}`
          : delivery === 'pickup'
            ? 'Store pickup, Lashibi'
            : landmark.trim(),
        city: abroad ? `${city.trim()}, ${country.trim()}` : delivery === 'pickup' ? 'Lashibi' : city.trim(),
      },
      delivery: {
        method: abroad ? 'abroad' : delivery,
        date: !abroad && delivery === 'scheduled' ? date : undefined,
        label: deliveryLabel,
      },
      order_items: cart.map((item) => ({
        id: `${item.id}-${item.variant || 'default'}`,
        product_name: item.name,
        quantity: item.quantity,
        unit_price: item.price,
        metadata: { image: item.image },
      })),
      metadata: { demo: true, tracking_number: orderNumber },
    };

    saveDemoOrder(order);
    clearCart();
    router.push(`/order-success?order=${order.order_number}`);
  };

  return (
    <main className="min-h-screen bg-[#f7f5f2] pb-36 text-black lg:pb-10">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-5 lg:grid-cols-[1.2fr_0.8fr] lg:gap-8 lg:px-6 lg:py-10">
        <section className="order-2 lg:order-1">
          <Link href="/" className="text-sm text-neutral-500 hover:text-black">
            ← Continue shopping
          </Link>
          <p className="mt-4 text-[11px] uppercase tracking-[0.28em] text-[#9a7420] lg:mt-6">Guest checkout</p>
          <h1 className="mt-1 text-3xl font-bold lg:mt-2 lg:text-4xl">Pay in one step</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-600 lg:mt-3">
            No account. In Ghana that is a name, a WhatsApp number, and a landmark. Shipping abroad asks for the rest only if you need it.
          </p>

          <form
            id="guest-checkout"
            className="mt-6 space-y-4 lg:mt-8"
            onSubmit={(event) => {
              event.preventDefault();
              pay();
            }}
          >
            <Field label="Full name" value={name} onChange={setName} placeholder="Kwame Mensah" />
            <Field label="WhatsApp number" value={phone} onChange={setPhone} placeholder="024 000 0000" />
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDestination('ghana')}
                className={`rounded-xl px-3 py-3 text-sm ${
                  destination === 'ghana' ? 'bg-black text-white' : 'border border-black/15 bg-white text-neutral-600'
                }`}
              >
                In Ghana
              </button>
              <button
                type="button"
                onClick={() => setDestination('abroad')}
                className={`rounded-xl px-3 py-3 text-sm ${
                  destination === 'abroad' ? 'bg-black text-white' : 'border border-black/15 bg-white text-neutral-600'
                }`}
              >
                Outside Ghana
              </button>
            </div>
            {!abroad && (
            <>
            <div className="grid grid-cols-3 gap-2">
              <Choice
                active={delivery === 'accra'}
                title="Deliver"
                detail="Accra · GH₵20"
                onClick={() => setDelivery('accra')}
              />
              <Choice
                active={delivery === 'scheduled'}
                title="Schedule"
                detail="Pick a day"
                onClick={() => setDelivery('scheduled')}
              />
              <Choice
                active={delivery === 'pickup'}
                title="Pickup"
                detail="Lashibi · Free"
                onClick={() => setDelivery('pickup')}
              />
            </div>
            {delivery === 'scheduled' && (
              <label className="block">
                <span className="mb-2 block text-sm font-medium">Delivery date</span>
                <input
                  type="date"
                  min={tomorrow()}
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className="w-full rounded-xl border border-black/15 bg-white px-4 py-3.5 text-base outline-none focus:border-black"
                />
              </label>
            )}
            </>
            )}
            {abroad ? (
              <>
                <Field label="Country" value={country} onChange={setCountry} placeholder="United States" />
                <Field label="Street address" value={landmark} onChange={setLandmark} placeholder="1 Remsen Road" />
                <Field label="City" value={city} onChange={setCity} placeholder="Yonkers" />
                <div className="grid grid-cols-2 gap-2">
                  <Field label="State" value={region} onChange={setRegion} placeholder="NY" />
                  <Field label="Postal code" value={postal} onChange={setPostal} placeholder="10710" />
                </div>
              </>
            ) : delivery !== 'pickup' && (
              <>
                <Field label="City or area" value={city} onChange={setCity} placeholder="East Legon" />
                <Field label="Landmark or street" value={landmark} onChange={setLandmark} placeholder="Near the A&C Mall" />
              </>
            )}
            <Field label="Email, if you want a receipt" value={email} onChange={setEmail} placeholder="Optional" />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={paying}
              className="hidden w-full rounded-md bg-black py-4 text-base font-medium text-white hover:bg-neutral-800 disabled:opacity-60 lg:block"
            >
              {paying ? 'Confirming…' : `Pay ${money(total)}`}
            </button>
            <p className="hidden text-center text-xs text-neutral-500 lg:block">Demo payment. Nothing is charged.</p>
          </form>
        </section>

        <aside className="order-1 h-fit rounded-2xl bg-black p-4 text-white lg:sticky lg:top-24 lg:order-2 lg:p-6">
          <h2 className="text-lg font-medium">Order</h2>
          <ul className="mt-3 space-y-3 lg:mt-5 lg:space-y-4">
            {cart.map((item) => (
              <li key={`${item.id}-${item.variant}`} className="flex gap-3">
                <img src={item.image} alt="" className="h-16 w-14 rounded-md object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">{item.name}</p>
                  <p className="text-xs text-white/60">Qty {item.quantity}</p>
                </div>
                <p className="text-sm">{money(item.price * item.quantity)}</p>
              </li>
            ))}
          </ul>
          <div className="mt-6 space-y-2 border-t border-white/15 pt-4 text-sm">
            <Row label="Subtotal" value={money(subtotal)} />
            <Row label="Delivery" value={shipping === 0 ? 'Free' : money(shipping)} />
            <div className="flex items-center justify-between pt-2 text-base">
              <span>Total</span>
              <span className="text-[#DAA520]">{money(total)}</span>
            </div>
          </div>
          <p className="mt-3 text-xs text-white/55 lg:mt-4">{deliveryLabel}</p>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-[4.6rem] z-40 border-t border-black/10 bg-[#f7f5f2]/95 px-4 py-3 backdrop-blur lg:hidden">
        <button
          type="submit"
          form="guest-checkout"
          disabled={paying}
          className="w-full rounded-xl bg-black py-3.5 text-sm font-medium text-white disabled:opacity-60"
        >
          {paying ? 'Confirming…' : `Pay ${money(total)}`}
        </button>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-black/15 bg-white px-4 py-3.5 text-base outline-none focus:border-black"
      />
    </label>
  );
}

function Choice({
  active,
  title,
  detail,
  onClick,
}: {
  active: boolean;
  title: string;
  detail: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-2 py-3 text-left ${
        active ? 'border-black bg-black text-white' : 'border-black/15 bg-white'
      }`}
    >
      <span className="block text-[13px] font-medium leading-tight">{title}</span>
      <span className={`mt-1 block text-[11px] leading-tight ${active ? 'text-white/70' : 'text-neutral-500'}`}>{detail}</span>
    </button>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-white/80">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
