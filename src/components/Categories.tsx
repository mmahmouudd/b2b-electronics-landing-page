import { motion } from 'framer-motion';
import {
  LayoutGrid, Cpu, CircuitBoard, Plug, Radar, Zap, Lightbulb, Clock, ArrowUpRight,
} from 'lucide-react';

const LOGOS = ['VOLTAIC', 'NORDWELLE', 'AXIOM LABS', 'HELIOSYSTEMS', 'KAPPATEC', 'FERROCORE', 'BRIGHTPATH'];

const CATEGORIES = [
  { name: 'Microcontrollers', count: '24,800 lines', icon: Cpu },
  { name: 'Passives', count: '61,200 lines', icon: CircuitBoard },
  { name: 'Connectors', count: '18,900 lines', icon: Plug },
  { name: 'Sensors', count: '12,400 lines', icon: Radar },
  { name: 'Power Management', count: '16,300 lines', icon: Zap },
  { name: 'Optoelectronics', count: '9,750 lines', icon: Lightbulb },
  { name: 'Frequency Control', count: '7,820 lines', icon: Clock },
  { name: 'All categories', count: '180,000+ lines', icon: LayoutGrid },
];

export default function Categories({ onSelectCategory }: { onSelectCategory?: (name: string) => void }) {
  return (
    <>
      {/* Trust logos */}
      <section className="border-b border-slate-200 bg-white py-8" aria-label="Trusted by">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Trusted by 12,000+ procurement & engineering teams
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {LOGOS.map((logo) => (
              <span key={logo} className="font-display text-sm font-bold tracking-[0.25em] text-slate-300 transition-colors hover:text-slate-500">
                {logo}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-slate-50 py-16 sm:py-20" aria-labelledby="categories-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">Browse the catalog</p>
              <h2 id="categories-heading" className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Every category, one invoice
              </h2>
              <p className="mt-2 max-w-xl text-slate-600">
                Consolidate your BOM across 2,400 franchised manufacturers — one PO, one shipment, one payment term.
              </p>
            </div>
            <a href="#catalog" className="group inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700">
              View full catalog
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {CATEGORIES.map((cat, i) => (
              <motion.button
                key={cat.name}
                type="button"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                onClick={() => onSelectCategory?.(cat.name === 'All categories' ? 'All' : cat.name)}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 text-left transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-600/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                <div className="mb-4 inline-grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                  <cat.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <p className="font-display text-sm font-bold text-slate-900">{cat.name}</p>
                <p className="mt-1 text-xs font-medium text-slate-500">{cat.count}</p>
                <ArrowUpRight className="absolute right-4 top-4 h-4 w-4 text-slate-300 transition-all group-hover:text-blue-600" aria-hidden="true" />
              </motion.button>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
