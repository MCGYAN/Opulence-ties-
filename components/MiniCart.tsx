'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useCart } from '@/context/CartContext';

interface MiniCartProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MiniCart({ isOpen, onClose }: MiniCartProps) {
  const { cart, removeFromCart, updateQuantity, subtotal } = useCart();
  const itemCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-brand-plum/45 backdrop-blur-sm z-40 animate-fade-in-backdrop"
        onClick={onClose}
        aria-hidden
      />

      <div className="fixed top-0 right-0 bottom-0 w-full max-w-md boutique-drawer z-50 animate-slide-in-right flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/30 glass-cream">
          <div>
            <p className="boutique-section-eyebrow mb-0.5">Your bag</p>
            <h2 className="font-serif text-xl text-brand-plum">
              {itemCount} {itemCount === 1 ? 'piece' : 'pieces'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-brand-latte/60 text-brand-plum transition-colors"
            aria-label="Close cart"
          >
            <i className="ri-close-line text-2xl" />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-brand-latte/60 mb-5">
              <i className="ri-shopping-bag-3-line text-4xl text-brand-rose/70" />
            </div>
            <h3 className="font-serif text-xl text-brand-plum mb-2">Your bag is empty</h3>
            <p className="text-sm text-brand-plum/60 mb-8 max-w-xs">
              Explore the collection and find something that makes you feel confident.
            </p>
            <Link href="/shop" onClick={onClose} className="boutique-btn-primary">
              Browse the shop
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.map((item) => (
                <div
                  key={`${item.id}-${item.variant}`}
                  className="flex gap-4 boutique-panel p-4 !rounded-xl !shadow-none"
                >
                  <div className="w-[72px] h-[88px] rounded-lg overflow-hidden flex-shrink-0 border border-brand-rose/10">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover object-top" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-base text-brand-plum mb-1 line-clamp-2 leading-snug">{item.name}</h3>
                    {item.variant && (
                      <p className="text-[11px] uppercase tracking-wider text-brand-plum/50 mb-2">{item.variant}</p>
                    )}

                    <div className="flex items-center justify-between mt-auto pt-2">
                      <span className="font-semibold text-brand-plum">GH₵{item.price.toFixed(2)}</span>

                      <div className="flex items-center border border-brand-rose/20 rounded-full bg-white overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1, item.variant)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-brand-latte/50 text-brand-plum"
                          aria-label="Decrease quantity"
                        >
                          {item.quantity <= (item.moq || 1) ? (
                            <i className="ri-delete-bin-line text-brand-rose text-sm" />
                          ) : (
                            <i className="ri-subtract-line text-sm" />
                          )}
                        </button>
                        <span className="w-8 text-center text-sm font-semibold text-brand-plum">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1, item.variant)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-brand-latte/50 text-brand-plum disabled:opacity-40"
                          disabled={item.quantity >= item.maxStock}
                          aria-label="Increase quantity"
                        >
                          <i className="ri-add-line text-sm" />
                        </button>
                      </div>
                    </div>
                    {item.quantity >= item.maxStock && (
                      <p className="text-[11px] text-brand-rose mt-1">Max stock reached</p>
                    )}
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id, item.variant)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 text-brand-plum/40 hover:text-red-600 flex-shrink-0 self-start"
                    aria-label="Remove item"
                  >
                    <i className="ri-close-line" />
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t border-white/30 p-6 glass-frosted">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-brand-plum/70">Subtotal</span>
                <span className="font-serif text-2xl text-brand-plum">GH₵{subtotal.toFixed(2)}</span>
              </div>
              <p className="text-xs text-brand-plum/50 mb-5 text-center">Shipping calculated at checkout</p>

              <div className="space-y-3">
                <Link href="/checkout" onClick={onClose} className="boutique-btn-primary w-full text-center">
                  Checkout
                </Link>
                <Link href="/cart" onClick={onClose} className="boutique-btn-secondary w-full text-center !py-3">
                  View bag
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
