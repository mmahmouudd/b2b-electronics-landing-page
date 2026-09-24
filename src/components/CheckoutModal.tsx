import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  X, ArrowLeft, ArrowRight, Building2, CreditCard, Landmark, FileText, CheckCircle2,
  Loader2, ShieldCheck, Minus, Plus, Trash2, Lock, Truck,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getTier, formatMoney, formatUnitPrice, formatQty } from '../data/products';

const STEPS = [
  { id: 'review', label: 'Order review', icon: FileText },
  { id: 'business', label: 'Business details', icon: Building2 },
  { id: 'payment', label: 'Payment & terms', icon: CreditCard },
  { id: 'confirm', label: 'Confirm', icon: CheckCircle2 },
] as const;

type PaymentMethod = 'net30' | 'card' | 'wire';

interface FormState {
  company: string;
  contact: string;
  email: string;
  phone: string;
  taxId: string;
  address: string;
  city: string;
  zip: string;
  country: string;
  shipping: 'ground' | 'express' | 'overnight';
  poNumber: string;
  cardName: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  terms: boolean;
}

const INITIAL_FORM: FormState = {
  company: '', contact: '', email: '', phone: '', taxId: '',
  address: '', city: '', zip: '', country: 'United States',
  shipping: 'ground', poNumber: '', cardName: '', cardNumber: '', cardExpiry: '', cardCvc: '',
  terms: false,
};

const SHIPPING_OPTIONS = [
  { id: 'ground', label: 'Ground freight', eta: '3–5 business days', cost: 18.5 },
  { id: 'express', label: 'Express (2-Day)', eta: '2 business days', cost: 42.0 },
  { id: 'overnight', label: 'Next-day air', eta: 'Next business day', cost: 89.0 },
] as const;

const inputCls = (error: boolean) =>
  `w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition focus:outline-none focus:ring-2 ${
    error
      ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
      : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/20'
  }`;

function Field({ label, error, children, className = '' }: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs font-bold text-slate-600">{label}</span>
      {children}
      {error && <span className="mt-1 block text-[11px] font-medium text-red-600" role="alert">{error}</span>}
    </label>
  );
}

export default function CheckoutModal() {
  const { items, isCheckoutOpen, closeCheckout, setQty, removeItem, subtotal, savings, clearCart } = useCart();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [payment, setPayment] = useState<PaymentMethod>('net30');
  const [processing, setProcessing] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [orderNo, setOrderNo] = useState('');

  useEffect(() => {
    if (!isCheckoutOpen) return;
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && closeCheckout();
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [isCheckoutOpen, closeCheckout]);

  const shippingCost = useMemo(() => {
    if (items.length === 0) return 0;
    const opt = SHIPPING_OPTIONS.find((s) => s.id === form.shipping)!;
    return subtotal >= 2500 && form.shipping === 'ground' ? 0 : opt.cost;
  }, [form.shipping, subtotal, items.length]);

  const tax = subtotal * 0.0;
  const total = subtotal + shippingCost + tax;

  if (!isCheckoutOpen) return null;

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validateStep = (): boolean => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (step === 1) {
      if (!form.company.trim()) e.company = 'Company name is required';
      if (!form.contact.trim()) e.contact = 'Contact name is required';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid work email';
      if (!form.address.trim()) e.address = 'Address is required';
      if (!form.city.trim()) e.city = 'City is required';
      if (!form.zip.trim()) e.zip = 'ZIP / postal code is required';
    }
    if (step === 2 && payment === 'card') {
      if (!form.cardName.trim()) e.cardName = 'Name on card is required';
      if (form.cardNumber.replace(/\s/g, '').length < 12) e.cardNumber = 'Enter a valid card number';
      if (!/^\d{2}\/\d{2}$/.test(form.cardExpiry)) e.cardExpiry = 'MM/YY';
      if (form.cardCvc.length < 3) e.cardCvc = '3–4 digits';
    }
    if (step === 3 && !form.terms) e.terms = 'Please accept the terms to continue';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validateStep()) return;
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    setProcessing(true);
    setTimeout(() => {
      setOrderNo(`CS-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 89999)}`);
      setProcessing(false);
      setPlaced(true);
      clearCart();
    }, 1400);
  };

  const reset = () => {
    setStep(0);
    setForm(INITIAL_FORM);
    setPayment('net30');
    setPlaced(false);
    closeCheckout();
  };

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Checkout">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={reset} aria-hidden="true" />

      <div className="absolute inset-x-0 bottom-0 top-8 mx-auto flex max-w-3xl flex-col overflow-hidden rounded-t-3xl bg-slate-50 shadow-2xl sm:inset-x-4 sm:top-1/2 sm:max-h-[92vh] sm:-translate-y-1/2 sm:rounded-3xl lg:inset-x-auto lg:w-[880px]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-7">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Secure B2B checkout</p>
            <h2 className="font-display text-lg font-bold text-slate-900">
              {placed ? 'Order confirmed' : 'Complete your order'}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700 sm:flex">
              <Lock className="h-3 w-3" /> 256-bit TLS
            </span>
            <button
              type="button"
              onClick={reset}
              className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              aria-label="Close checkout"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Progress */}
        {!placed && (
          <ol className="flex items-center gap-0 border-b border-slate-200 bg-white px-5 py-3 sm:px-7" aria-label="Checkout progress">
            {STEPS.map((s, i) => (
              <li key={s.id} className="flex flex-1 items-center last:flex-none">
                <button
                  type="button"
                  onClick={() => i < step && setStep(i)}
                  className={`flex items-center gap-2 ${i < step ? 'cursor-pointer' : 'cursor-default'}`}
                  aria-current={i === step ? 'step' : undefined}
                  disabled={i > step}
                >
                  <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold transition ${
                    i < step ? 'bg-emerald-500 text-white' : i === step ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                  </span>
                  <span className={`hidden text-xs font-bold sm:block ${i === step ? 'text-slate-900' : 'text-slate-400'}`}>
                    {s.label}
                  </span>
                </button>
                {i < STEPS.length - 1 && <span className={`mx-2 h-px flex-1 ${i < step ? 'bg-emerald-400' : 'bg-slate-200'}`} aria-hidden="true" />}
              </li>
            ))}
          </ol>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {placed ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center px-6 py-14 text-center"
              >
                <span className="grid h-20 w-20 place-items-center rounded-full bg-emerald-100">
                  <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                </span>
                <h3 className="mt-6 font-display text-2xl font-bold text-slate-900">PO received & confirmed</h3>
                <p className="mt-2 max-w-md text-sm text-slate-600">
                  Order <span className="font-mono font-bold text-slate-900">{orderNo}</span> is queued for same-day dispatch.
                  A pro-forma invoice and confirmation packet are on their way to <span className="font-semibold">{form.email || 'your inbox'}</span>.
                </p>
                <dl className="mt-8 grid w-full max-w-md grid-cols-3 gap-3">
                  {[
                    ['Order total', formatMoney(total)],
                    ['Payment', payment === 'net30' ? 'Net-30' : payment === 'card' ? 'Card' : 'Wire'],
                    ['Ships by', new Date(Date.now() + 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })],
                  ].map(([k, v]) => (
                    <div key={k} className="rounded-2xl border border-slate-200 bg-white p-3.5">
                      <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{k}</dt>
                      <dd className="mt-1 font-mono text-sm font-bold text-slate-900">{v}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <button type="button" className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-700">
                    <FileText className="h-4 w-4" /> Download pro-forma (PDF)
                  </button>
                  <button type="button" onClick={reset} className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50">
                    Continue sourcing
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.25 }}
                className="px-5 py-6 sm:px-7"
              >
                {/* STEP 1: Review */}
                {step === 0 && (
                  <div>
                    <ul className="divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                      {items.map(({ product, qty }) => {
                        const tier = getTier(product, qty);
                        return (
                          <li key={product.id} className="flex items-center gap-4 p-4">
                            <img src={product.image} alt="" className="h-14 w-14 rounded-xl border border-slate-200 object-cover" />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-bold text-slate-900">{product.name}</p>
                              <p className="font-mono text-[11px] text-slate-500">{product.mpn} · {product.package}</p>
                              <p className="mt-0.5 text-[11px] font-semibold text-emerald-600">
                                Tier {product.tiers.indexOf(tier) + 1}: {formatUnitPrice(tier.unitPrice)}/pc
                              </p>
                            </div>
                            <div className="flex items-center rounded-lg border border-slate-200">
                              <button type="button" onClick={() => setQty(product.id, Math.max(product.moq, qty - product.multiples))} className="grid h-8 w-8 place-items-center text-slate-500 hover:text-slate-900 disabled:opacity-40" disabled={qty <= product.moq} aria-label={`Decrease ${product.mpn}`}>
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="w-16 text-center font-mono text-xs font-bold text-slate-900">{formatQty(qty)}</span>
                              <button type="button" onClick={() => setQty(product.id, qty + product.multiples)} className="grid h-8 w-8 place-items-center text-slate-500 hover:text-slate-900" aria-label={`Increase ${product.mpn}`}>
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <p className="w-24 text-right font-mono text-sm font-bold text-slate-900">{formatMoney(tier.unitPrice * qty)}</p>
                            <button type="button" onClick={() => removeItem(product.id)} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600" aria-label={`Remove ${product.mpn}`}>
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </li>
                        );
                      })}
                    </ul>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm">
                        <h4 className="flex items-center gap-2 font-display font-bold text-slate-900"><Truck className="h-4 w-4 text-blue-600" /> Fulfillment</h4>
                        <p className="mt-2 text-xs leading-relaxed text-slate-600">
                          Ships from Rotterdam hub · All lines in stock · Date codes ≤ 12 months · Consolidated on one packing list.
                        </p>
                      </div>
                      <dl className="space-y-1.5 rounded-2xl border border-slate-200 bg-white p-4 text-sm">
                        <div className="flex justify-between text-slate-600"><dt>Subtotal</dt><dd className="font-semibold text-slate-900">{formatMoney(subtotal)}</dd></div>
                        <div className="flex justify-between text-emerald-600"><dt>Volume savings</dt><dd className="font-semibold">−{formatMoney(savings)}</dd></div>
                        <div className="flex justify-between border-t border-slate-100 pt-1.5 font-bold text-slate-900"><dt>Estimated total</dt><dd className="font-mono">{formatMoney(subtotal)}</dd></div>
                      </dl>
                    </div>
                  </div>
                )}

                {/* STEP 2: Business details */}
                {step === 1 && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Company / legal entity *" error={errors.company} className="sm:col-span-2">
                      <input type="text" value={form.company} onChange={(e) => set('company', e.target.value)} placeholder="Voltaic Systems GmbH" className={inputCls(!!errors.company)} />
                    </Field>
                    <Field label="Contact name *" error={errors.contact}>
                      <input type="text" value={form.contact} onChange={(e) => set('contact', e.target.value)} placeholder="Alex Moreau" className={inputCls(!!errors.contact)} />
                    </Field>
                    <Field label="Work email *" error={errors.email}>
                      <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="a.moreau@voltaic.io" className={inputCls(!!errors.email)} />
                    </Field>
                    <Field label="Phone">
                      <input type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+49 30 555 0142" className={inputCls(false)} />
                    </Field>
                    <Field label="VAT / Tax ID">
                      <input type="text" value={form.taxId} onChange={(e) => set('taxId', e.target.value)} placeholder="DE812526315" className={inputCls(false)} />
                    </Field>
                    <Field label="Ship-to address *" error={errors.address} className="sm:col-span-2">
                      <input type="text" value={form.address} onChange={(e) => set('address', e.target.value)} placeholder="Industriestraße 42, Building C" className={inputCls(!!errors.address)} />
                    </Field>
                    <Field label="City *" error={errors.city}>
                      <input type="text" value={form.city} onChange={(e) => set('city', e.target.value)} placeholder="Berlin" className={inputCls(!!errors.city)} />
                    </Field>
                    <Field label="ZIP / Postal code *" error={errors.zip}>
                      <input type="text" value={form.zip} onChange={(e) => set('zip', e.target.value)} placeholder="10115" className={inputCls(!!errors.zip)} />
                    </Field>
                    <Field label="Country">
                      <select value={form.country} onChange={(e) => set('country', e.target.value)} className={inputCls(false)}>
                        {['United States', 'Germany', 'United Kingdom', 'Netherlands', 'Japan', 'Canada'].map((c) => <option key={c}>{c}</option>)}
                      </select>
                    </Field>
                    <fieldset className="sm:col-span-2">
                      <legend className="mb-2 text-xs font-bold text-slate-600">Shipping method</legend>
                      <div className="grid gap-2 sm:grid-cols-3">
                        {SHIPPING_OPTIONS.map((opt) => (
                          <label key={opt.id} className={`flex cursor-pointer items-start gap-2.5 rounded-xl border p-3 transition ${form.shipping === opt.id ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-500/20' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                            <input type="radio" name="shipping" checked={form.shipping === opt.id} onChange={() => set('shipping', opt.id)} className="mt-0.5 h-4 w-4 accent-blue-600" />
                            <span>
                              <span className="block text-xs font-bold text-slate-900">{opt.label}</span>
                              <span className="block text-[11px] text-slate-500">{opt.eta}</span>
                              <span className="mt-0.5 block font-mono text-[11px] font-bold text-slate-700">
                                {subtotal >= 2500 && opt.id === 'ground' ? 'FREE' : formatMoney(opt.cost)}
                              </span>
                            </span>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  </div>
                )}

                {/* STEP 3: Payment */}
                {step === 2 && (
                  <div>
                    <fieldset>
                      <legend className="mb-2.5 text-xs font-bold text-slate-600">Payment method</legend>
                      <div className="grid gap-2.5 sm:grid-cols-3">
                        {([
                          { id: 'net30', icon: FileText, title: 'Net-30 invoice', desc: 'Terms account · PO required' },
                          { id: 'card', icon: CreditCard, title: 'Credit card', desc: 'Visa · Mastercard · Amex' },
                          { id: 'wire', icon: Landmark, title: 'Wire / SEPA', desc: 'Pro-forma first' },
                        ] as const).map((m) => (
                          <label key={m.id} className={`cursor-pointer rounded-2xl border p-4 transition ${payment === m.id ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-500/20' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                            <input type="radio" name="payment" checked={payment === m.id} onChange={() => setPayment(m.id)} className="sr-only" />
                            <m.icon className={`h-5 w-5 ${payment === m.id ? 'text-blue-600' : 'text-slate-400'}`} />
                            <span className="mt-2 block text-sm font-bold text-slate-900">{m.title}</span>
                            <span className="block text-[11px] text-slate-500">{m.desc}</span>
                          </label>
                        ))}
                      </div>
                    </fieldset>

                    <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
                      {payment === 'net30' && (
                        <div className="grid gap-4 sm:grid-cols-2">
                          <Field label="PO number" className="sm:col-span-2">
                            <input type="text" value={form.poNumber} onChange={(e) => set('poNumber', e.target.value)} placeholder="PO-2025-00841" className={inputCls(false)} />
                          </Field>
                          <div className="rounded-xl bg-emerald-50 p-3.5 text-xs leading-relaxed text-emerald-800 sm:col-span-2">
                            <span className="font-bold">Terms account verified.</span> Payment due within 30 days of invoice. 1.5% monthly finance charge applies after due date.
                          </div>
                        </div>
                      )}
                      {payment === 'card' && (
                        <div className="grid gap-4 sm:grid-cols-2">
                          <Field label="Name on card *" error={errors.cardName} className="sm:col-span-2">
                            <input type="text" value={form.cardName} onChange={(e) => set('cardName', e.target.value)} placeholder="Alex Moreau" className={inputCls(!!errors.cardName)} />
                          </Field>
                          <Field label="Card number *" error={errors.cardNumber} className="sm:col-span-2">
                            <input type="text" inputMode="numeric" value={form.cardNumber} onChange={(e) => set('cardNumber', e.target.value.replace(/[^\d]/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19))} placeholder="4242 4242 4242 4242" className={inputCls(!!errors.cardNumber)} />
                          </Field>
                          <Field label="Expiry *" error={errors.cardExpiry}>
                            <input type="text" inputMode="numeric" value={form.cardExpiry} onChange={(e) => { let v = e.target.value.replace(/[^\d]/g, '').slice(0, 4); if (v.length > 2) v = `${v.slice(0, 2)}/${v.slice(2)}`; set('cardExpiry', v); }} placeholder="08/27" className={inputCls(!!errors.cardExpiry)} />
                          </Field>
                          <Field label="CVC *" error={errors.cardCvc}>
                            <input type="text" inputMode="numeric" value={form.cardCvc} onChange={(e) => set('cardCvc', e.target.value.replace(/[^\d]/g, '').slice(0, 4))} placeholder="123" className={inputCls(!!errors.cardCvc)} />
                          </Field>
                        </div>
                      )}
                      {payment === 'wire' && (
                        <dl className="grid gap-3 text-xs sm:grid-cols-2">
                          {[
                            ['Beneficiary', 'CircuitSource Europe B.V.'],
                            ['IBAN', 'NL91 ABNA 0417 1643 00'],
                            ['BIC / SWIFT', 'ABNANL2A'],
                            ['Reference', 'Order number (emailed after checkout)'],
                          ].map(([k, v]) => (
                            <div key={k} className="rounded-xl bg-slate-50 p-3">
                              <dt className="font-bold uppercase tracking-wide text-slate-400">{k}</dt>
                              <dd className="mt-0.5 font-mono font-semibold text-slate-800">{v}</dd>
                            </div>
                          ))}
                          <p className="sm:col-span-2 rounded-xl bg-blue-50 p-3 text-blue-800">
                            Stock is reserved for 5 business days pending receipt of funds.
                          </p>
                        </dl>
                      )}
                    </div>

                    <Field label="Internal cost-center reference (optional)" className="mt-4">
                      <input type="text" value={form.poNumber} onChange={(e) => set('poNumber', e.target.value)} placeholder="e.g. CC-ENG-114" className={inputCls(false)} />
                    </Field>
                  </div>
                )}

                {/* STEP 4: Confirm */}
                {step === 3 && (
                  <div>
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-200 bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500">
                            <th scope="col" className="px-4 py-2.5 font-bold">Line</th>
                            <th scope="col" className="px-4 py-2.5 font-bold">Qty</th>
                            <th scope="col" className="px-4 py-2.5 text-right font-bold">Unit</th>
                            <th scope="col" className="px-4 py-2.5 text-right font-bold">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {items.map(({ product, qty }) => {
                            const tier = getTier(product, qty);
                            return (
                              <tr key={product.id}>
                                <td className="px-4 py-2.5">
                                  <p className="font-mono font-bold text-blue-700">{product.mpn}</p>
                                  <p className="truncate text-slate-500">{product.manufacturer}</p>
                                </td>
                                <td className="px-4 py-2.5 font-mono">{formatQty(qty)}</td>
                                <td className="px-4 py-2.5 text-right font-mono">{formatUnitPrice(tier.unitPrice)}</td>
                                <td className="px-4 py-2.5 text-right font-mono font-bold text-slate-900">{formatMoney(tier.unitPrice * qty)}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl border border-slate-200 bg-white p-4 text-xs leading-relaxed text-slate-600">
                        <h4 className="font-display text-sm font-bold text-slate-900">Ship to</h4>
                        <p className="mt-2">{form.contact}</p>
                        <p>{form.company}</p>
                        <p>{form.address}</p>
                        <p>{form.city} {form.zip}, {form.country}</p>
                        <p className="mt-2 font-semibold text-slate-700">
                          {SHIPPING_OPTIONS.find((s) => s.id === form.shipping)?.label}
                        </p>
                      </div>
                      <dl className="space-y-1.5 rounded-2xl border border-slate-200 bg-white p-4 text-sm">
                        <div className="flex justify-between text-slate-600"><dt>Subtotal</dt><dd className="font-semibold text-slate-900">{formatMoney(subtotal)}</dd></div>
                        <div className="flex justify-between text-emerald-600"><dt>Volume savings</dt><dd className="font-semibold">−{formatMoney(savings)}</dd></div>
                        <div className="flex justify-between text-slate-600"><dt>Freight</dt><dd className="font-semibold text-slate-900">{shippingCost === 0 ? 'FREE' : formatMoney(shippingCost)}</dd></div>
                        <div className="flex justify-between text-slate-600"><dt>Tax (exempt)</dt><dd className="font-semibold text-slate-900">$0.00</dd></div>
                        <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-bold text-slate-900"><dt>Order total</dt><dd className="font-mono">{formatMoney(total)}</dd></div>
                      </dl>
                    </div>

                    <label className={`mt-4 flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${errors.terms ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'}`}>
                      <input type="checkbox" checked={form.terms} onChange={(e) => set('terms', e.target.checked)} className="mt-0.5 h-4 w-4 accent-blue-600" />
                      <span className="text-xs leading-relaxed text-slate-600">
                        I agree to the <span className="font-semibold text-blue-700 underline-offset-2">Terms of Sale</span>, confirm component specifications match our BOM requirements, and authorize CircuitSource to fulfill this order{payment === 'net30' ? ' on Net-30 terms' : ''}. *
                        {errors.terms && <span className="mt-1 block font-semibold text-red-600" role="alert">{errors.terms}</span>}
                      </span>
                    </label>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        {!placed && (
          <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-white px-5 py-4 sm:px-7">
            <div className="text-xs text-slate-500">
              {step === 0 ? (
                <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-emerald-600" /> Volume pricing locked for 30 days</span>
              ) : (
                <span>Step {step + 1} of 4</span>
              )}
            </div>
            <div className="flex items-center gap-2.5">
              {step > 0 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
              )}
              <button
                type="button"
                onClick={next}
                disabled={processing || items.length === 0}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                {processing ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Processing…</>
                ) : step === 3 ? (
                  <><Lock className="h-4 w-4" /> Place order · {formatMoney(total)}</>
                ) : (
                  <>Continue <ArrowRight className="h-4 w-4" /></>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
