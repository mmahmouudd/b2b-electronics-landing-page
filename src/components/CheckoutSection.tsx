import { motion } from 'framer-motion';
import { FileText, Workflow, Truck, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

const STEPS = [
  { icon: ShoppingCartIcon, label: 'Order review', desc: 'Volume pricing auto-applied per line' },
  { icon: FileText, label: 'Business details', desc: 'Tax ID, ship-to, PO reference' },
  { icon: Workflow, label: 'Payment & terms', desc: 'Net-30, card, or wire' },
  { icon: CheckCircle2, label: 'Confirmation', desc: 'Instant pro-forma & tracking' },
];

function ShoppingCartIcon(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className} aria-hidden="true">
      <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}

const FEATURES = [
  {
    icon: FileText,
    title: 'Invoice & Net terms',
    desc: 'Net-30/45/60 with credit lines up to $500k. Approved in 24 hours — no personal guarantees.',
  },
  {
    icon: Workflow,
    title: 'PO & ERP automation',
    desc: 'Punchout (cXML/OCI), API ordering, and custom catalog feeds straight into SAP, Oracle, or NetSuite.',
  },
  {
    icon: Truck,
    title: 'Multi-carrier logistics',
    desc: 'Consolidated freight across 3 hubs, DDP options, and automatic customs documentation.',
  },
  {
    icon: ShieldCheck,
    title: 'Compliance & traceability',
    desc: 'RoHS/REACH declarations, certificates of conformance, and full date-code traceability on every order.',
  },
];

export default function CheckoutSection() {
  const { openCheckout } = useCart();

  return (
    <section id="checkout" className="bg-slate-50 py-16 sm:py-20" aria-labelledby="checkout-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">Purchasing, minus the paperwork</p>
          <h2 id="checkout-heading" className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            A checkout built for procurement teams
          </h2>
          <p className="mt-3 text-slate-600">
            Four steps from cart to confirmed PO — with invoicing, approvals, and compliance docs handled automatically.
          </p>
        </div>

        {/* Flow steps */}
        <div className="relative mt-12">
          <div className="absolute left-0 right-0 top-7 hidden border-t-2 border-dashed border-slate-200 lg:block" aria-hidden="true" />
          <ol className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <motion.li
                key={step.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <span className="relative grid h-14 w-14 place-items-center rounded-2xl border border-blue-100 bg-white text-blue-600 shadow-sm">
                  <step.icon className="h-6 w-6" />
                  <span className="absolute -right-1.5 -top-1.5 grid h-6 w-6 place-items-center rounded-full bg-blue-600 text-[11px] font-bold text-white">
                    {i + 1}
                  </span>
                </span>
                <h3 className="mt-4 font-display text-sm font-bold text-slate-900">{step.label}</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">{step.desc}</p>
              </motion.li>
            ))}
          </ol>
        </div>

        {/* CTA panel */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          className="mt-12 overflow-hidden rounded-3xl bg-slate-950"
        >
          <div className="grid gap-8 p-8 sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:p-12">
            <div>
              <h3 className="font-display text-2xl font-bold text-white">
                Average B2B order: <span className="text-cyan-300">4 min 12 sec</span> from cart to PO
              </h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-400">
                Walk through the full checkout flow with a sample order — Net-30 approval, PO matching, and the confirmation packet included.
              </p>
              <button
                type="button"
                onClick={() => openCheckout(true)}
                className="group mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
              >
                Launch the checkout demo
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
              <p className="mt-3 text-xs text-slate-500">No account needed · Sample data · Nothing is charged</p>
            </div>
            <div className="grid content-center gap-3">
              {['Quote-to-PO matching with 3-way validation', 'Multi-user carts with approval chains', 'Partial shipments & scheduled releases', 'AES / ECCN screening built-in'].map((f) => (
                <p key={f} className="flex items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm font-medium text-slate-300">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-cyan-400" />
                  {f}
                </p>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Feature cards */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <motion.article
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-blue-300 hover:shadow-lg hover:shadow-blue-600/5"
            >
              <span className="inline-grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-600">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-sm font-bold text-slate-900">{f.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{f.desc}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
