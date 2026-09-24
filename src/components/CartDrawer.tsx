import { useEffect } from 'react';
import { X, Minus, Plus, Trash2, ShieldCheck, Truck, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatMoney, formatUnitPrice, getTier } from '../data/products';

const FREE_SHIPPING_THRESHOLD = 500;

export default function CartDrawer() {
  const { items, isCartOpen, closeCart, setQty, removeItem, subtotal, savings, openCheckout } = useCart();

  useEffect(() => {
    if (!isCartOpen) return;
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && closeCart();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) return null;

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 18.5;
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Shopping cart">
      <div
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
        onClick={closeCart}
        aria-hidden="true"
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="font-display text-lg font-bold text-slate-900">
            Your Cart
            <span className="ml-2 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
              {items.length} line{items.length === 1 ? '' : 's'}
            </span>
          </h2>
          <button
            type="button"
            onClick={closeCart}
            className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="Close cart"
            autoFocus
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-100">
              <Truck className="h-6 w-6 text-slate-400" />
            </div>
            <p className="font-medium text-slate-900">Your cart is empty</p>
            <p className="text-sm text-slate-500">Add components from the catalog to see volume pricing applied automatically.</p>
            <button
              type="button"
              onClick={closeCart}
              className="mt-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Browse catalog
            </button>
          </div>
        ) : (
          <>
            {/* Free shipping progress */}
            <div className="border-b border-slate-100 px-5 py-3">
              {shipping === 0 ? (
                <p className="flex items-center gap-2 text-xs font-medium text-emerald-700">
                  <Truck className="h-4 w-4" /> Free freight unlocked on this order
                </p>
              ) : (
                <p className="text-xs font-medium text-slate-600">
                  Add <span className="font-bold text-slate-900">{formatMoney(FREE_SHIPPING_THRESHOLD - subtotal)}</span> more for free freight
                </p>
              )}
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <ul className="flex-1 divide-y divide-slate-100 overflow-y-auto px-5">
              {items.map(({ product, qty }) => {
                const tier = getTier(product, qty);
                return (
                  <li key={product.id} className="flex gap-3 py-4">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                      <img src={product.image} alt={product.name} className="h-full w-full object-cover" loading="lazy" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900">{product.name}</p>
                      <p className="font-mono text-[11px] text-slate-500">{product.mpn}</p>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <div className="inline-flex items-center rounded-lg border border-slate-200">
                          <button
                            type="button"
                            onClick={() => setQty(product.id, Math.max(product.moq, qty - product.multiples))}
                            className="grid h-7 w-7 place-items-center text-slate-500 hover:text-slate-900 disabled:opacity-40"
                            aria-label={`Decrease quantity of ${product.mpn}`}
                            disabled={qty <= product.moq}
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={qty}
                            onChange={(e) => {
                              const v = parseInt(e.target.value.replace(/\D/g, ''), 10);
                              setQty(product.id, isNaN(v) ? product.moq : Math.max(1, v));
                            }}
                            aria-label={`Quantity for ${product.mpn}`}
                            className="w-14 border-0 bg-transparent p-0 text-center font-mono text-xs font-semibold text-slate-900 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setQty(product.id, qty + product.multiples)}
                            className="grid h-7 w-7 place-items-center text-slate-500 hover:text-slate-900"
                            aria-label={`Increase quantity of ${product.mpn}`}
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="font-mono text-sm font-bold text-slate-900">
                            {formatMoney(tier.unitPrice * qty)}
                          </p>
                          <p className="text-[11px] text-emerald-600">{formatUnitPrice(tier.unitPrice)}/u · tier {product.tiers.indexOf(tier) + 1}</p>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(product.id)}
                      className="self-start rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                      aria-label={`Remove ${product.mpn} from cart`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="border-t border-slate-200 bg-slate-50 px-5 py-4">
              <dl className="space-y-1.5 text-sm">
                <div className="flex justify-between text-slate-600">
                  <dt>Subtotal</dt>
                  <dd className="font-semibold text-slate-900">{formatMoney(subtotal)}</dd>
                </div>
                <div className="flex justify-between text-emerald-600">
                  <dt>Volume savings applied</dt>
                  <dd className="font-semibold">−{formatMoney(savings)}</dd>
                </div>
                <div className="flex justify-between text-slate-600">
                  <dt>Freight</dt>
                  <dd className="font-semibold text-slate-900">{shipping === 0 ? 'FREE' : formatMoney(shipping)}</dd>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-bold text-slate-900">
                  <dt>Estimated total</dt>
                  <dd className="font-mono">{formatMoney(subtotal + shipping)}</dd>
                </div>
              </dl>
              <button
                type="button"
                onClick={() => openCheckout()}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Checkout with Net-30
                <ArrowRight className="h-4 w-4" />
              </button>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                Escrow-protected · Full CoC & traceability docs included
              </p>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
