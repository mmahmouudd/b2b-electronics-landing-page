import { useState } from 'react';
import { Phone, ShoppingCart, Menu, X, Zap, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';

const NAV_LINKS = [
  { label: 'Catalog', href: '#catalog' },
  { label: 'Bulk Pricing', href: '#pricing' },
  { label: 'Checkout', href: '#checkout' },
  { label: 'Request Quote', href: '#rfq' },
];

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <a href="#top" className="flex items-center gap-2.5 shrink-0" aria-label="CircuitSource home">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-blue-600 to-cyan-400 text-white shadow-lg shadow-blue-600/25">
        <Zap className="h-5 w-5" strokeWidth={2.5} />
      </span>
      <span className={`font-display text-lg font-bold tracking-tight ${dark ? 'text-white' : 'text-slate-900'}`}>
        Circuit<span className="text-blue-600">Source</span>
      </span>
    </a>
  );
}

export default function Header() {
  const { count, openCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-slate-950 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center text-xs font-medium tracking-wide sm:text-[13px]">
          <span className="hidden h-1.5 w-1.5 rounded-full bg-cyan-400 sm:block" aria-hidden="true" />
          <span className="text-slate-300">
            Q3 volume rebate — earn 2% back on bulk orders over $25,000
          </span>
          <a href="#pricing" className="font-semibold text-cyan-300 underline-offset-2 hover:underline">
            See tiers
          </a>
        </div>
      </div>

      {/* Main header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          <Logo />

          <nav className="ml-4 hidden items-center gap-1 lg:flex" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Search (desktop) */}
          <div className="ml-auto hidden max-w-sm flex-1 md:block">
            <label className="relative block">
              <span className="sr-only">Search components</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input
                type="search"
                placeholder="Search 180,000+ part numbers…"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                    window.dispatchEvent(new CustomEvent('catalog-search', { detail: (e.target as HTMLInputElement).value }));
                  }
                }}
                className="w-full rounded-xl border border-slate-200 bg-slate-100/70 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </label>
          </div>

          <div className="ml-auto flex items-center gap-2 md:ml-0">
            <a
              href="tel:+18005550199"
              className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 xl:flex"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              +1 (800) 555-0199
            </a>

            <button
              type="button"
              onClick={openCart}
              className="relative grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              aria-label={`Open cart, ${count} item${count === 1 ? '' : 's'}`}
            >
              <ShoppingCart className="h-5 w-5" aria-hidden="true" />
              {count > 0 && (
                <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-blue-600 px-1 text-[11px] font-bold text-white">
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </button>

            <a
              href="#rfq"
              className="hidden rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/30 transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:block"
            >
              Get a Quote
            </a>

            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 lg:hidden"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-label="Toggle navigation menu"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <nav className="border-t border-slate-200 bg-white px-4 py-3 lg:hidden" aria-label="Mobile">
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  {link.label}
                </a>
              ))}
              <a href="tel:+18005550199" className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100">
                +1 (800) 555-0199
              </a>
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
