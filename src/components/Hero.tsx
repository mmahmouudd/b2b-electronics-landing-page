import { useState } from 'react';
import { Search, ShieldCheck, Gauge, PackageCheck, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const POPULAR = ['STM32 MCU', '0603 capacitors', 'Terminal blocks', 'MEMS accelerometer', 'Buck regulator'];

const STATS = [
  { icon: PackageCheck, value: '180k+', label: 'Lines in stock' },
  { icon: ShieldCheck, value: '2,400+', label: 'Franchised makers' },
  { icon: Gauge, value: '99.98%', label: 'Order fill rate' },
];

export default function Hero() {
  const { openCheckout } = useCart();
  const [query, setQuery] = useState('');

  const submit = () => {
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
    window.dispatchEvent(new CustomEvent('catalog-search', { detail: query }));
  };

  return (
    <section id="top" className="relative overflow-hidden bg-slate-950" aria-labelledby="hero-heading">
      {/* Backdrop */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(148,163,184,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.07) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute -top-40 right-[-10%] h-[560px] w-[560px] rounded-full bg-blue-600/20 blur-[140px]"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-[-20%] left-[-10%] h-[480px] w-[480px] rounded-full bg-cyan-500/10 blur-[120px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
        {/* Copy */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3.5 py-1.5 text-xs font-semibold text-cyan-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300" aria-hidden="true" />
            Authorized distributor — 2,400+ franchised manufacturers
          </div>

          <h1 id="hero-heading" className="mt-5 font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Electronic components at <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">wholesale scale.</span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
            Source from 180,000+ in-stock lines with automatic volume pricing, Net-30 terms, and same-day dispatch from three global hubs. Built for procurement teams that move fast.
          </p>

          {/* Search */}
          <form
            className="mt-8 flex flex-col gap-3 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
            role="search"
          >
            <label className="relative flex-1">
              <span className="sr-only">Search part numbers</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="MPN, category, or manufacturer…"
                className="w-full rounded-xl border border-slate-700 bg-slate-900/80 py-3.5 pl-12 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
              />
            </label>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
            >
              Search parts
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <span className="font-medium text-slate-500">Popular:</span>
            {POPULAR.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => {
                  setQuery(term);
                  document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                  window.dispatchEvent(new CustomEvent('catalog-search', { detail: term }));
                }}
                className="rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1 font-medium text-slate-300 transition hover:border-cyan-400/50 hover:text-cyan-300"
              >
                {term}
              </button>
            ))}
          </div>

          {/* Stats */}
          <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-slate-800 pt-8">
            {STATS.map(({ icon: Icon, value, label }) => (
              <div key={label}>
                <dt className="order-2 text-xs font-medium uppercase tracking-wide text-slate-500">{label}</dt>
                <dd className="flex items-center gap-2 font-display text-2xl font-bold text-white sm:text-3xl">
                  <Icon className="h-5 w-5 text-cyan-400" aria-hidden="true" />
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Visual */}
        <div className="relative hidden lg:block" aria-hidden="true">
          <div className="relative overflow-hidden rounded-3xl border border-slate-700/60 shadow-2xl shadow-blue-950/50">
            <img src="/images/hero-pcb.jpg" alt="" className="aspect-[4/3] w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            {/* Floating cards */}
            <div className="absolute left-5 top-5 rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 backdrop-blur-md">
              <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Live order fill rate</p>
              <p className="font-display text-2xl font-bold text-white">
                99.98<span className="text-cyan-400">%</span>
              </p>
            </div>
            <div className="absolute bottom-5 right-5 rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 backdrop-blur-md">
              <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Ships today</p>
              <p className="font-display text-2xl font-bold text-white">
                180,412 <span className="text-sm font-medium text-slate-400">lines</span>
              </p>
            </div>
            <div className="absolute bottom-5 left-5 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3.5 py-2 backdrop-blur-md">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                ISO 9001:2015 · AS9120B
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => openCheckout(true)}
            className="absolute -right-3 -top-5 rotate-3 rounded-xl border border-cyan-400/40 bg-cyan-400/10 px-4 py-2 text-xs font-bold text-cyan-300 backdrop-blur-md transition hover:rotate-0 hover:bg-cyan-400/20"
          >
            Try the B2B checkout →
          </button>
        </div>
      </div>
    </section>
  );
}
