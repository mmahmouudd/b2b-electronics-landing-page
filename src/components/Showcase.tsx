import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search, SlidersHorizontal, X, ShoppingCart, FileText, List, LayoutGrid, PackageX, Check,
} from 'lucide-react';
import {
  PRODUCTS, MANUFACTURERS, PACKAGES, fromPrice, formatUnitPrice, formatQty,
} from '../data/products';
import type { Product } from '../data/products';
import { useCart } from '../context/CartContext';

interface Filters {
  query: string;
  categories: string[];
  manufacturers: string[];
  packages: string[];
  inStockOnly: boolean;
  rohsOnly: boolean;
  priceMin: string;
  priceMax: string;
  sort: string;
}

const EMPTY: Filters = {
  query: '',
  categories: [],
  manufacturers: [],
  packages: [],
  inStockOnly: false,
  rohsOnly: false,
  priceMin: '',
  priceMax: '',
  sort: 'featured',
};

const SORTS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'stock-desc', label: 'Stock: high to low' },
  { value: 'name-asc', label: 'Name: A–Z' },
];

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 py-1 pl-3 pr-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
      aria-label={`Remove filter: ${label}`}
    >
      {label}
      <X className="h-3 w-3" aria-hidden="true" />
    </button>
  );
}

function FilterGroup({ legend, options, selected, onToggle }: {
  legend: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2.5 text-xs font-bold uppercase tracking-wider text-slate-500">{legend}</legend>
      <div className="space-y-1.5">
        {options.map((opt) => (
          <label key={opt} className="flex cursor-pointer items-center gap-2.5 rounded-lg px-1.5 py-1 text-sm text-slate-700 transition hover:bg-slate-50">
            <input
              type="checkbox"
              checked={selected.includes(opt)}
              onChange={() => onToggle(opt)}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 accent-blue-600 focus:ring-2 focus:ring-blue-500/40"
            />
            <span className="truncate">{opt}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function toggle(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function StockBadge({ product }: { product: Product }) {
  if (product.stock >= 100000)
    return <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700"><Check className="h-3 w-3" /> {formatQty(product.stock)} in stock</span>;
  if (product.stock >= 20000)
    return <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700"><Check className="h-3 w-3" /> {formatQty(product.stock)} in stock</span>;
  return <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700">Low stock · {formatQty(product.stock)}</span>;
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(product.moq);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-600/5"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-slate-700 backdrop-blur">
          {product.category}
        </span>
        {product.featured && (
          <span className="absolute right-3 top-3 rounded-full bg-blue-600 px-2.5 py-1 text-[11px] font-bold text-white">Best seller</span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold text-slate-500">{product.manufacturer}</p>
          <p className="font-mono text-[11px] text-slate-400">{product.mpn}</p>
        </div>
        <h3 className="mt-1.5 line-clamp-2 text-sm font-bold leading-snug text-slate-900">{product.name}</h3>

        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-semibold text-slate-600">{product.package}</span>
          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">MOQ {formatQty(product.moq)}</span>
          {product.rohs && <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">RoHS</span>}
        </div>

        <div className="mt-3"><StockBadge product={product} /></div>

        <div className="mt-3 rounded-xl bg-slate-50 px-3 py-2.5">
          <div className="flex items-baseline justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">From</p>
            <p className="font-mono text-sm font-bold text-slate-900">
              {formatUnitPrice(fromPrice(product))}
              <span className="text-[11px] font-medium text-slate-500"> /u @ {formatQty(product.tiers[product.tiers.length - 1].minQty)}+</span>
            </p>
          </div>
          <p className="mt-0.5 text-[11px] text-slate-500">
            List {formatUnitPrice(product.tiers[0].unitPrice)} — save up to{' '}
            <span className="font-semibold text-emerald-600">
              {Math.round((1 - fromPrice(product) / product.tiers[0].unitPrice) * 100)}%
            </span>
          </p>
        </div>

        <div className="mt-auto flex items-center gap-2 pt-4">
          <label className="flex items-center rounded-xl border border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
            <span className="sr-only">Quantity for {product.mpn}</span>
            <input
              type="text"
              inputMode="numeric"
              value={qty}
              onChange={(e) => {
                const v = parseInt(e.target.value.replace(/\D/g, ''), 10);
                setQty(isNaN(v) ? 0 : v);
              }}
              className="w-16 border-0 bg-transparent px-2 py-2 text-center font-mono text-xs font-semibold text-slate-900 focus:outline-none"
            />
          </label>
          <button
            type="button"
            onClick={() => addItem(product.id, Math.max(qty, product.moq))}
            disabled={qty < product.moq}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-3 py-2.5 text-xs font-bold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            title={qty < product.moq ? `Minimum order quantity is ${product.moq}` : undefined}
          >
            <ShoppingCart className="h-4 w-4" />
            Add {qty < product.moq ? `≥ ${formatQty(product.moq)}` : 'to cart'}
          </button>
          {product.datasheet && (
            <button
              type="button"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-blue-300 hover:text-blue-600"
              aria-label={`Download datasheet for ${product.mpn}`}
              title="Datasheet (PDF)"
            >
              <FileText className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}

function TableView({ products }: { products: Product[] }) {
  const { addItem } = useCart();
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="w-full min-w-[860px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
            <th scope="col" className="px-4 py-3 font-bold">MPN</th>
            <th scope="col" className="px-4 py-3 font-bold">Description</th>
            <th scope="col" className="px-4 py-3 font-bold">Package</th>
            <th scope="col" className="px-4 py-3 font-bold">Stock</th>
            <th scope="col" className="px-4 py-3 font-bold">Price breaks</th>
            <th scope="col" className="px-4 py-3 text-right font-bold">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {products.map((p) => (
            <tr key={p.id} className="transition hover:bg-blue-50/40">
              <td className="px-4 py-3">
                <p className="font-mono text-xs font-bold text-blue-700">{p.mpn}</p>
                <p className="mt-0.5 text-[11px] text-slate-500">{p.manufacturer}</p>
              </td>
              <td className="max-w-[260px] px-4 py-3">
                <p className="truncate font-semibold text-slate-900">{p.name}</p>
                <p className="mt-0.5 line-clamp-1 text-[11px] text-slate-500">{p.description}</p>
              </td>
              <td className="px-4 py-3"><span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-semibold text-slate-600">{p.package}</span></td>
              <td className="px-4 py-3"><StockBadge product={p} /></td>
              <td className="px-4 py-3">
                <div className="flex flex-col gap-0.5 font-mono text-[11px] text-slate-600">
                  {p.tiers.map((t) => (
                    <span key={t.minQty} className="flex gap-2">
                      <span className="w-20 text-slate-400">{formatQty(t.minQty)}{t.maxQty ? `–${formatQty(t.maxQty)}` : '+'}</span>
                      <span className="font-semibold text-slate-900">{formatUnitPrice(t.unitPrice)}</span>
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  type="button"
                  onClick={() => addItem(p.id)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white transition hover:bg-blue-600"
                  aria-label={`Add ${p.mpn} to cart, minimum ${p.moq} units`}
                >
                  <ShoppingCart className="h-3.5 w-3.5" />
                  Add {formatQty(p.moq)}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Showcase({ category, onCategoryChange }: {
  category: string;
  onCategoryChange: (c: string) => void;
}) {
  const [filters, setFilters] = useState<Filters>(EMPTY);
  const [showFilters, setShowFilters] = useState(false);
  const [view, setView] = useState<'grid' | 'table'>('grid');

  // Listen for search events from header/hero
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as string;
      setFilters((f) => ({ ...f, query: detail }));
    };
    window.addEventListener('catalog-search', handler);
    return () => window.removeEventListener('catalog-search', handler);
  }, []);

  const set = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    setFilters((f) => ({ ...f, [key]: value }));

  const results = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    const min = filters.priceMin === '' ? null : parseFloat(filters.priceMin);
    const max = filters.priceMax === '' ? null : parseFloat(filters.priceMax);

    let list = PRODUCTS.filter((p) => {
      if (q && ![p.mpn, p.name, p.manufacturer, p.category, p.description].join(' ').toLowerCase().includes(q)) return false;
      if (category !== 'All' && !filters.categories.includes(p.category)) return false;
      if (category === 'All' && filters.categories.length > 0 && !filters.categories.includes(p.category)) return false;
      if (filters.manufacturers.length > 0 && !filters.manufacturers.includes(p.manufacturer)) return false;
      if (filters.packages.length > 0 && !filters.packages.includes(p.package)) return false;
      if (filters.inStockOnly && p.stock < 20000) return false;
      if (filters.rohsOnly && !p.rohs) return false;
      const price = fromPrice(p);
      if (min !== null && !isNaN(min) && price < min) return false;
      if (max !== null && !isNaN(max) && price > max) return false;
      return true;
    });

    switch (filters.sort) {
      case 'price-asc': list = [...list].sort((a, b) => fromPrice(a) - fromPrice(b)); break;
      case 'price-desc': list = [...list].sort((a, b) => fromPrice(b) - fromPrice(a)); break;
      case 'stock-desc': list = [...list].sort((a, b) => b.stock - a.stock); break;
      case 'name-asc': list = [...list].sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    return list;
  }, [filters, category]);

  const activeChips: { label: string; clear: () => void }[] = [];
  if (filters.query) activeChips.push({ label: `"${filters.query}"`, clear: () => set('query', '') });
  const effCats = category !== 'All' ? [category, ...filters.categories.filter((c) => c !== category)] : filters.categories;
  effCats.forEach((c) =>
    activeChips.push({
      label: c,
      clear: () => {
        if (c === category) onCategoryChange('All');
        else set('categories', filters.categories.filter((x) => x !== c));
      },
    })
  );
  filters.manufacturers.forEach((m) => activeChips.push({ label: m, clear: () => set('manufacturers', filters.manufacturers.filter((x) => x !== m)) }));
  filters.packages.forEach((p) => activeChips.push({ label: `Pkg: ${p}`, clear: () => set('packages', filters.packages.filter((x) => x !== p)) }));
  if (filters.inStockOnly) activeChips.push({ label: 'In stock ≥ 20k', clear: () => set('inStockOnly', false) });
  if (filters.rohsOnly) activeChips.push({ label: 'RoHS compliant', clear: () => set('rohsOnly', false) });
  if (filters.priceMin) activeChips.push({ label: `From $${filters.priceMin}`, clear: () => set('priceMin', '') });
  if (filters.priceMax) activeChips.push({ label: `Under $${filters.priceMax}`, clear: () => set('priceMax', '') });

  const activeCount = activeChips.length;

  return (
    <section id="catalog" className="bg-white py-16 sm:py-20" aria-labelledby="catalog-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">Live catalog</p>
            <h2 id="catalog-heading" className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Search, filter, price — in seconds
            </h2>
            <p className="mt-2 max-w-xl text-slate-600">
              Production-grade lines with real-time stock and volume price breaks. Switch to table view for full BOMCompare-style pricing.
            </p>
          </div>

          {/* View toggle */}
          <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1" role="group" aria-label="View mode">
            {([['grid', LayoutGrid, 'Grid'], ['table', List, 'Table']] as const).map(([v, Icon, label]) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                aria-pressed={view === v}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition ${view === v ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Icon className="h-4 w-4" /> {label}
              </button>
            ))}
          </div>
        </div>

        {/* Search & sort bar */}
        <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
          <label className="relative flex-1">
            <span className="sr-only">Search the catalog</span>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              type="search"
              value={filters.query}
              onChange={(e) => set('query', e.target.value)}
              placeholder="Filter by MPN, keyword, manufacturer…"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </label>
          <label className="flex items-center gap-2">
            <span className="sr-only">Sort results</span>
            <select
              value={filters.sort}
              onChange={(e) => set('sort', e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </label>
          <button
            type="button"
            onClick={() => setShowFilters((v) => !v)}
            aria-expanded={showFilters}
            className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition lg:hidden ${showFilters ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 bg-slate-50 text-slate-700'}`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeCount > 0 && (
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-blue-600 px-1 text-[11px] font-bold text-white">{activeCount}</span>
            )}
          </button>
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-[260px_1fr]">
          {/* Filter sidebar */}
          <aside className={`${showFilters ? 'block' : 'hidden'} lg:block`} aria-label="Catalog filters">
            <div className="sticky top-24 space-y-6 rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-display text-sm font-bold text-slate-900">
                  <SlidersHorizontal className="h-4 w-4 text-blue-600" /> Refine
                </h3>
                {activeCount > 0 && (
                  <button type="button" onClick={() => { setFilters(EMPTY); onCategoryChange('All'); }} className="text-xs font-bold text-blue-600 hover:underline">
                    Clear all
                  </button>
                )}
              </div>

              <FilterGroup
                legend="Category"
                options={[...new Set(PRODUCTS.map((p) => p.category))]}
                selected={filters.categories}
                onToggle={(v) => set('categories', toggle(filters.categories, v))}
              />
              <FilterGroup
                legend="Manufacturer"
                options={MANUFACTURERS}
                selected={filters.manufacturers}
                onToggle={(v) => set('manufacturers', toggle(filters.manufacturers, v))}
              />
              <FilterGroup
                legend="Package / Case"
                options={PACKAGES}
                selected={filters.packages}
                onToggle={(v) => set('packages', toggle(filters.packages, v))}
              />

              <fieldset>
                <legend className="mb-2.5 text-xs font-bold uppercase tracking-wider text-slate-500">Compliance</legend>
                <div className="space-y-2">
                  <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg px-1.5 py-1 text-sm text-slate-700">
                    <span>In stock ≥ 20,000</span>
                    <input type="checkbox" checked={filters.inStockOnly} onChange={(e) => set('inStockOnly', e.target.checked)} className="h-4 w-4 accent-blue-600" />
                  </label>
                  <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg px-1.5 py-1 text-sm text-slate-700">
                    <span>RoHS compliant</span>
                    <input type="checkbox" checked={filters.rohsOnly} onChange={(e) => set('rohsOnly', e.target.checked)} className="h-4 w-4 accent-blue-600" />
                  </label>
                </div>
              </fieldset>

              <fieldset>
                <legend className="mb-2.5 text-xs font-bold uppercase tracking-wider text-slate-500">Unit price (USD)</legend>
                <div className="flex items-center gap-2">
                  <label className="flex-1">
                    <span className="sr-only">Minimum unit price</span>
                    <input
                      type="number"
                      min="0"
                      step="0.001"
                      placeholder="Min"
                      value={filters.priceMin}
                      onChange={(e) => set('priceMin', e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 font-mono text-xs focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </label>
                  <span className="text-slate-400" aria-hidden="true">–</span>
                  <label className="flex-1">
                    <span className="sr-only">Maximum unit price</span>
                    <input
                      type="number"
                      min="0"
                      step="0.001"
                      placeholder="Max"
                      value={filters.priceMax}
                      onChange={(e) => set('priceMax', e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 font-mono text-xs focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </label>
                </div>
              </fieldset>

              <div className="rounded-xl bg-blue-50 p-3.5">
                <p className="text-xs font-semibold text-blue-900">Need a part we don't list?</p>
                <p className="mt-1 text-[11px] leading-relaxed text-blue-700">Send an RFQ and our sourcing desk quotes within 4 business hours.</p>
                <a href="#rfq" className="mt-2 inline-block text-xs font-bold text-blue-700 underline-offset-2 hover:underline">Request a quote →</a>
              </div>
            </div>
          </aside>

          {/* Results */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-medium text-slate-600" role="status" aria-live="polite">
                Showing <span className="font-bold text-slate-900">{results.length}</span> of {PRODUCTS.length} lines
              </p>
              {activeCount > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  {activeChips.map((chip, i) => <Chip key={`${chip.label}-${i}`} label={chip.label} onRemove={chip.clear} />)}
                </div>
              )}
            </div>

            {results.length === 0 ? (
              <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center">
                <PackageX className="h-10 w-10 text-slate-300" aria-hidden="true" />
                <p className="mt-4 font-display text-lg font-bold text-slate-900">No lines match your filters</p>
                <p className="mt-1 max-w-sm text-sm text-slate-500">Try broadening your search — or send us an RFQ and we'll source it from our franchise network.</p>
                <button
                  type="button"
                  onClick={() => { setFilters(EMPTY); onCategoryChange('All'); }}
                  className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
                >
                  Reset all filters
                </button>
              </div>
            ) : view === 'grid' ? (
              <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {results.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
              </div>
            ) : (
              <div className="mt-6"><TableView products={results} /></div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
