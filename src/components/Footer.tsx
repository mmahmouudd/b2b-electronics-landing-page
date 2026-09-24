import { Zap, ShieldCheck, Award, Globe } from 'lucide-react';
import { Logo } from './Header';

const COLUMNS = [
  {
    title: 'Catalog',
    links: ['Microcontrollers', 'Passives', 'Connectors', 'Sensors', 'Power Management', 'Optoelectronics'],
  },
  {
    title: 'Purchasing',
    links: ['Bulk pricing tiers', 'Net-30 application', 'Punchout / ERP', 'Scheduled orders', 'Freight & logistics', 'Returns (RMA)'],
  },
  {
    title: 'Company',
    links: ['About CircuitSource', 'Quality & compliance', 'Franchise lines', 'Careers', 'Press kit', 'Contact'],
  },
  {
    title: 'Resources',
    links: ['Datasheet library', 'BOM tools', 'API documentation', 'Distributor agreement', 'Lifecycle alerts', 'Blog'],
  },
];

const BADGES = [
  { icon: Award, label: 'ISO 9001:2015' },
  { icon: ShieldCheck, label: 'AS9120B' },
  { icon: Zap, label: 'ESD S20.20' },
  { icon: Globe, label: 'ITAR registered' },
];

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400" aria-label="Footer">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <Logo dark />
            <p className="mt-4 max-w-xs text-sm leading-relaxed">
              Authorized wholesale distributor of electronic components. Three global hubs, 180,000+ in-stock lines, and pricing that rewards volume.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {BADGES.map((b) => (
                <span key={b.label} className="inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900 px-3 py-1.5 text-[11px] font-bold text-slate-300">
                  <b.icon className="h-3.5 w-3.5 text-cyan-400" />
                  {b.label}
                </span>
              ))}
            </div>
          </div>

          <nav className="grid grid-cols-2 gap-8 sm:grid-cols-4" aria-label="Footer">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">{col.title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#top" className="text-sm transition-colors hover:text-cyan-300">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 sm:flex-row">
          <p className="text-xs">© {new Date().getFullYear()} CircuitSource Distribution B.V. All rights reserved.</p>
          <div className="flex gap-6 text-xs">
            <a href="#top" className="transition-colors hover:text-cyan-300">Privacy</a>
            <a href="#top" className="transition-colors hover:text-cyan-300">Terms of sale</a>
            <a href="#top" className="transition-colors hover:text-cyan-300">Cookies</a>
            <a href="#top" className="transition-colors hover:text-cyan-300">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
