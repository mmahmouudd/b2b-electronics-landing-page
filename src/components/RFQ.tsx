import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2, Clock, Percent, Quote } from 'lucide-react';

const TESTIMONIALS = [
  {
    quote: 'We consolidated 14 distributors into CircuitSource. Fill rate went from 91% to 99.9% and our buyers stopped playing spreadsheet tennis.',
    name: 'Mara Jensen',
    role: 'Head of Procurement, Voltaic Systems',
  },
  {
    quote: 'Volume pricing is live and honest — no waiting on a sales rep to unlock a break. Our BOM re-quotes went from days to minutes.',
    name: 'Daniel Okafor',
    role: 'Supply Chain Lead, Heliosystems',
  },
  {
    quote: 'The Net-30 approval took one afternoon. Compliance docs arrive with every shipment, which cut our audit prep in half.',
    name: 'Sofia Lindqvist',
    role: 'Quality Manager, Nordwelle Medical',
  },
];

export default function RFQ() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ part: '', qty: '', target: '', notes: '', email: '' });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <>
      {/* Testimonials */}
      <section className="border-t border-slate-200 bg-white py-16 sm:py-20" aria-labelledby="testimonials-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 id="testimonials-heading" className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Procurement teams stay for the fill rate
            </h2>
          </div>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <motion.figure
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-6"
              >
                <Quote className="h-6 w-6 text-blue-600" aria-hidden="true" />
                <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-slate-700">“{t.quote}”</blockquote>
                <figcaption className="mt-5 border-t border-slate-200 pt-4">
                  <p className="text-sm font-bold text-slate-900">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      {/* RFQ */}
      <section id="rfq" className="bg-slate-50 py-16 sm:py-20" aria-labelledby="rfq-heading">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">Request for quote</p>
            <h2 id="rfq-heading" className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Can't find it? We'll source it in 4 hours.
            </h2>
            <p className="mt-3 max-w-lg text-slate-600">
              Our sourcing desk quotes hard-to-find, allocated, and custom-spec parts from 2,400 franchised manufacturers — with the same transparent volume pricing.
            </p>
            <ul className="mt-8 space-y-5">
              {[
                { icon: Clock, title: '4-hour turnaround', desc: 'Average first-quote time during EU and US business hours — including hard-to-find MPNs.' },
                { icon: Percent, title: 'Price-match guarantee', desc: 'Franchise-direct quotes; we match any authorized-distributor quote on identical date codes.' },
                { icon: CheckCircle2, title: 'No minimum commitment', desc: 'RFQs are free and carry no obligation. Quotes stay valid for 30 days.' },
              ].map((item) => (
                <li key={item.title} className="flex gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-600/10 text-blue-600">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-sm font-bold text-slate-900">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-8"
          >
            {sent ? (
              <div className="flex h-full flex-col items-center justify-center py-14 text-center">
                <span className="grid h-16 w-16 place-items-center rounded-full bg-emerald-100">
                  <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                </span>
                <h3 className="mt-5 font-display text-xl font-bold text-slate-900">RFQ received — ref #Q-4821</h3>
                <p className="mt-2 max-w-sm text-sm text-slate-600">
                  Our sourcing desk is on it. Expect a first quote at <span className="font-semibold">{form.email || 'your email'}</span> within 4 business hours.
                </p>
                <button
                  type="button"
                  onClick={() => { setSent(false); setForm({ part: '', qty: '', target: '', notes: '', email: '' }); }}
                  className="mt-6 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  Submit another RFQ
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => { e.preventDefault(); setSent(true); }}
                className="grid gap-4 sm:grid-cols-2"
                aria-label="Request for quote form"
              >
                <label className="block sm:col-span-2">
                  <span className="mb-1.5 block text-xs font-bold text-slate-600">Part number / description *</span>
                  <input
                    required
                    type="text"
                    value={form.part}
                    onChange={set('part')}
                    placeholder="e.g. ESP32-S3-WROOM-1-N8R8 or “inductive proximity sensor, M12”"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-bold text-slate-600">Quantity *</span>
                  <input
                    required
                    type="number"
                    min="1"
                    value={form.qty}
                    onChange={set('qty')}
                    placeholder="5,000"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-bold text-slate-600">Target price / unit</span>
                  <input
                    type="text"
                    value={form.target}
                    onChange={set('target')}
                    placeholder="$2.40"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="mb-1.5 block text-xs font-bold text-slate-600">Work email *</span>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={set('email')}
                    placeholder="you@company.com"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="mb-1.5 block text-xs font-bold text-slate-600">Notes (schedule, specs, alternates)</span>
                  <textarea
                    rows={3}
                    value={form.notes}
                    onChange={set('notes')}
                    placeholder="Needed by week 42; XCLR equivalent acceptable…"
                    className="w-full resize-none rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </label>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:col-span-2"
                >
                  <Send className="h-4 w-4" />
                  Send RFQ to sourcing desk
                </button>
                <p className="text-center text-[11px] text-slate-400 sm:col-span-2">
                  Response within 4 business hours · No obligation · NDA-friendly
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </>
  );
}
