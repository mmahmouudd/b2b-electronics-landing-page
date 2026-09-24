import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, TrendingDown, BadgeCheck, ArrowRight, Check } from 'lucide-react';
import { PRODUCTS, getTier, formatMoney, formatUnitPrice, formatQty } from '../data/products';
import { useCart } from '../context/CartContext';

const FEATURED = PRODUCTS.find((p) => p.id === 'mcu-001')!;

const ACCOUNT_TIERS = [
  { name: 'Standard', volume: 'Pay as you go', discount: '—', terms: 'Card / Prepay', support: 'Self-serve', highlight: false },
  { name: 'Verified', volume: '$50k+ / yr', discount: '3% extra', terms: 'Net-30', support: 'Priority email', highlight: false },
  { name: 'Preferred', volume: '$250k+ / yr', discount: '6% extra', terms: 'Net-45', support: 'Dedicated rep', highlight: true },
  { name: 'Enterprise', volume: '$1M+ / yr', discount: 'Custom', terms: 'Custom terms', support: 'SLA + VMI program', highlight: false },
];

export default function BulkPricing() {
  const { addItem } = useCart();
  const [qty, setQty] = useState(2500);

  const tier = getTier(FEATURED, qty);
  const tierIndex = FEATURED.tiers.indexOf(tier);
  const total = tier.unitPrice * qty;
  const base = FEATURED.tiers[0].unitPrice;
  const saved = (base - tier.unitPrice) * qty;
  const nextTier = FEATURED.tiers[tierIndex + 1];

  const sliderPct = useMemo(() => {
    const min = Math.log(10);
    const max = Math.log(25000);
    return Math.min(100, Math.max(0, ((Math.log(Math.max(qty, 10)) - min) / (max - min)) * 100));
  }, [qty]);

  return (
    <section id="pricing" className="relative overflow-hidden bg-slate-950 py-16 sm:py-24" aria-labelledby="pricing-heading">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'linear-gradient(rgba(148,163,184,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.06) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }}
        aria-hidden="true"
      />
      <div className="absolute -left-32 top-0 h-[420px] w-[420px] rounded-full bg-blue-600/15 blur-[130px]" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-cyan-400">Transparent volume pricing</p>
          <h2 id="pricing-heading" className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            The more you buy, the less you pay. Automatically.
          </h2>
          <p className="mt-3 text-slate-400">
            Price breaks are applied in real time — no negotiation, no hidden matrix. Drag the quantity to see your landed unit cost.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {/* Interactive calculator */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-slate-700/60 bg-slate-900/70 p-6 backdrop-blur sm:p-8"
          >
            <div className="flex items-start gap-4">
              <img src={FEATURED.image} alt={FEATURED.name} className="h-16 w-16 rounded-2xl border border-slate-700 object-cover" loading="lazy" />
              <div>
                <p className="font-mono text-xs text-cyan-400">{FEATURED.mpn}</p>
                <h3 className="font-display text-base font-bold text-white">{FEATURED.name}</h3>
                <p className="text-xs text-slate-400">{FEATURED.manufacturer} · {FEATURED.package} · MOQ {formatQty(FEATURED.moq)}</p>
              </div>
            </div>

            <div className="mt-8">
              <div className="flex items-end justify-between">
                <label htmlFor="qty-slider" className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Order quantity
                </label>
                <label className="flex items-center gap-1.5">
                  <span className="sr-only">Quantity</span>
                  <input
                    type="number"
                    min={FEATURED.moq}
                    max={25000}
                    value={qty}
                    onChange={(e) => setQty(Math.min(25000, Math.max(FEATURED.moq, parseInt(e.target.value || '0', 10) || FEATURED.moq)))}
                    className="w-28 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-right font-mono text-sm font-bold text-white focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                  />
                  <span className="text-xs font-medium text-slate-400">pcs</span>
                </label>
              </div>
              <input
                id="qty-slider"
                type="range"
                min={10}
                max={25000}
                step={10}
                value={qty}
                onChange={(e) => setQty(parseInt(e.target.value, 10))}
                className="mt-3 w-full cursor-pointer accent-cyan-400"
                style={{ background: `linear-gradient(to right, #06b6d4, #3b82f6) left center / ${sliderPct}% 100% no-repeat, #334155` }}
                aria-valuetext={`${formatQty(qty)} pieces`}
              />
              <div className="mt-1.5 flex justify-between font-mono text-[10px] text-slate-500">
                <span>10</span><span>500</span><span>5k</span><span>25k</span>
              </div>
            </div>

            {/* Result panel */}
            <div className="mt-6 grid grid-cols-3 gap-3 rounded-2xl border border-slate-700/60 bg-slate-950/60 p-4 text-center">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Unit price</p>
                <p className="mt-1 font-mono text-xl font-bold text-cyan-300 sm:text-2xl">{formatUnitPrice(tier.unitPrice)}</p>
              </div>
              <div className="border-x border-slate-800">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Line total</p>
                <p className="mt-1 font-mono text-xl font-bold text-white sm:text-2xl">{formatMoney(total)}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">You save</p>
                <p className="mt-1 font-mono text-xl font-bold text-emerald-400 sm:text-2xl">{formatMoney(saved)}</p>
              </div>
            </div>

            {nextTier && (
              <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-amber-300">
                <TrendingDown className="h-3.5 w-3.5" />
                Add {formatQty(nextTier.minQty - qty)} more units to unlock {formatUnitPrice(nextTier.unitPrice)}/pc
                {nextTier.minQty - qty > 0 && (
                  <span className="text-slate-400">— saves {formatMoney((tier.unitPrice - nextTier.unitPrice) * qty)}</span>
                )}
              </p>
            )}

            <button
              type="button"
              onClick={() => addItem(FEATURED.id, qty)}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
            >
              <ShoppingCart className="h-4 w-4" />
              Add {formatQty(qty)} pcs at {formatUnitPrice(tier.unitPrice)} — {formatMoney(total)}
            </button>
          </motion.div>

          {/* Tier table */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col rounded-3xl border border-slate-700/60 bg-slate-900/70 p-6 backdrop-blur sm:p-8"
          >
            <h3 className="font-display text-lg font-bold text-white">Price breaks — {FEATURED.mpn}</h3>
            <p className="mt-1 text-sm text-slate-400">Unit pricing updates live with your quantity above.</p>

            <table className="mt-6 w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-700 text-[11px] uppercase tracking-wider text-slate-500">
                  <th scope="col" className="pb-3 font-bold">Quantity range</th>
                  <th scope="col" className="pb-3 text-right font-bold">Unit price</th>
                  <th scope="col" className="pb-3 text-right font-bold">Savings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {FEATURED.tiers.map((t, i) => {
                  const active = i === tierIndex;
                  return (
                    <tr
                      key={t.minQty}
                      className={`transition-colors ${active ? 'bg-cyan-400/10' : ''}`}
                    >
                      <td className="py-3.5">
                        <span className="flex items-center gap-2.5">
                          {active && <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" aria-hidden="true" />}
                          <span className={active ? 'font-mono font-bold text-cyan-300' : 'font-mono text-slate-300'}>
                            {formatQty(t.minQty)} – {t.maxQty ? formatQty(t.maxQty) : '∞'}
                          </span>
                          {active && (
                            <span className="rounded-full bg-cyan-400/15 px-2 py-0.5 text-[10px] font-bold uppercase text-cyan-300">Your tier</span>
                          )}
                        </span>
                      </td>
                      <td className={`py-3.5 text-right font-mono font-bold ${active ? 'text-cyan-300' : 'text-white'}`}>
                        {formatUnitPrice(t.unitPrice)}
                      </td>
                      <td className="py-3.5 text-right font-mono text-emerald-400">
                        {Math.round((1 - t.unitPrice / base) * 100)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-slate-800 pt-5 text-xs text-slate-400">
              <span className="flex items-center gap-1.5"><BadgeCheck className="h-4 w-4 text-emerald-400" /> Franchise-direct, fully traceable</span>
              <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-cyan-400" /> Date-code guaranteed ≤ 12 mo</span>
              <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-cyan-400" /> Quotes valid 30 days</span>
            </div>
          </motion.div>
        </div>

        {/* Account tiers */}
        <div className="mt-14">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h3 className="font-display text-2xl font-bold text-white">Stack account-level discounts on top</h3>
              <p className="mt-1.5 max-w-2xl text-sm text-slate-400">
                Your negotiated tier discount applies on top of every price break, across every line in your cart.
              </p>
            </div>
            <a
              href="#rfq"
              className="group inline-flex items-center gap-1.5 rounded-xl border border-cyan-400/40 bg-cyan-400/10 px-5 py-2.5 text-sm font-bold text-cyan-300 transition hover:bg-cyan-400/20"
            >
              Apply for business account
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>

          <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-700/60">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-900/80 text-[11px] uppercase tracking-wider text-slate-500">
                  <th scope="col" className="px-5 py-3.5 font-bold">Account tier</th>
                  <th scope="col" className="px-5 py-3.5 font-bold">Annual volume</th>
                  <th scope="col" className="px-5 py-3.5 font-bold">Extra discount</th>
                  <th scope="col" className="px-5 py-3.5 font-bold">Payment terms</th>
                  <th scope="col" className="px-5 py-3.5 font-bold">Support</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-900/40">
                {ACCOUNT_TIERS.map((t) => (
                  <tr key={t.name} className={t.highlight ? 'bg-cyan-400/[0.07]' : ''}>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-2 font-display font-bold text-white">
                        {t.name}
                        {t.highlight && (
                          <span className="rounded-full bg-cyan-400/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-cyan-300">Most popular</span>
                        )}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-300">{t.volume}</td>
                    <td className="px-5 py-4 font-mono font-bold text-emerald-400">{t.discount}</td>
                    <td className="px-5 py-4 text-slate-300">{t.terms}</td>
                    <td className="px-5 py-4 text-slate-300">{t.support}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
