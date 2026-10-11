import { useState } from 'react'
import { useStore } from '../lib/store'
import { dict } from '../lib/i18n'
import { taka } from '../lib/utils'
import { Modal } from './ui/Modal'
import { IconBkash } from './ui/PayIcons'
import {
  IconAlert,
  IconCart,
  IconCheck,
  IconClose,
  IconLock,
  IconMinus,
  IconPlus,
  IconShield,
  IconTrash,
} from './ui/Icons'

interface CartDrawerProps {
  open: boolean
  onClose: () => void
  onOpenNotif: () => void
}

const PAYMENT_OPTIONS = [
  { key: 'bkash', bn: 'বিকাশ', en: 'bKash', color: 'bg-pink-600' },
  { key: 'nagad', bn: 'নগদ', en: 'Nagad', color: 'bg-orange-600' },
  { key: 'card', bn: 'কার্ড', en: 'Card', color: 'bg-sky-600' },
] as const

export function CartDrawer({ open, onClose, onOpenNotif }: CartDrawerProps) {
  const { lang, data, cart, setQty, clearCart, cartTotal, setData, pushNotification } = useStore()
  const t = (k: string) => dict[k]?.[lang] ?? k

  const [checkout, setCheckout] = useState(false)
  const [step, setStep] = useState<'form' | 'pay' | 'done'>('form')
  const [payment, setPayment] = useState<(typeof PAYMENT_OPTIONS)[number]['key']>('bkash')
  const [customer, setCustomer] = useState({ name: '', phone: '', address: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [orderId, setOrderId] = useState('')
  const [processing, setProcessing] = useState(false)

  const lines = cart
    .map((l) => ({ line: l, item: data.menu.find((m) => m.id === l.id) }))
    .filter((x): x is { line: typeof x.line; item: NonNullable<typeof x.item> } => Boolean(x.item))

  const delivery = data.settings.deliveryCharge
  const grandTotal = cartTotal + (lines.length > 0 ? delivery : 0)

  const closeCheckout = () => {
    setCheckout(false)
    setStep('form')
    setErrors({})
    setProcessing(false)
  }

  const startCheckout = () => {
    if (lines.length === 0) return
    setCheckout(true)
  }

  const validateForm = () => {
    const e: Record<string, string> = {}
    if (!customer.name.trim()) e.name = t('nameRequired')
    if (!/^\d{11}$/.test(customer.phone.replace(/\D/g, ''))) e.phone = t('phoneInvalid')
    if (!customer.address.trim()) e.address = lang === 'bn' ? 'ঠিকানা লিখুন' : 'Enter your address'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const confirmOrder = () => {
    if (!validateForm()) return
    setStep('pay')
  }

  const payNow = () => {
    setProcessing(true)
    window.setTimeout(() => {
      const id = `DHN${Math.floor(1000 + Math.random() * 9000)}`
      const items = lines.map((x) => ({
        id: x.item.id,
        nameBn: x.item.nameBn,
        nameEn: x.item.nameEn,
        price: x.item.price,
        qty: x.line.qty,
      }))
      setData((d) => ({
        ...d,
        orders: [
          {
            id,
            items,
            total: grandTotal,
            customer: customer.name.trim(),
            phone: customer.phone.trim(),
            address: customer.address.trim(),
            payment,
            status: 'placed',
            createdAt: new Date().toISOString(),
          },
          ...d.orders,
        ],
      }))
      pushNotification({
        kind: 'order',
        titleBn: `অর্ডার #${id} নেওয়া হয়েছে`,
        titleEn: `Order #${id} received`,
        bodyBn: `${customer.name.trim()} — মোট ${taka(grandTotal, 'bn')}`,
        bodyEn: `${customer.name.trim()} — total ${taka(grandTotal, 'en')}`,
      })
      setOrderId(id)
      setStep('done')
      setProcessing(false)
      clearCart()
      setCustomer({ name: '', phone: '', address: '' })
    }, 1200)
  }

  return (
    <>
      {/* Cart drawer */}
      {open && (
        <div className="fixed inset-0 z-[100]">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <aside className="animate-float-up ring-soft absolute top-0 right-0 flex h-full w-[min(94vw,430px)] flex-col border-l border-brand-500/20 bg-ink-900">
            <header className="flex items-center justify-between border-b border-brand-500/15 px-5 py-4">
              <h3 className="flex items-center gap-2 text-lg font-bold text-gold-300">
                <IconCart width={18} height={18} />
                {t('cartTitle')}
                {lines.length > 0 && (
                  <span className="rounded-full bg-brand-500/25 px-2 py-0.5 text-xs text-brand-100">
                    {cart.reduce((s, l) => s + l.qty, 0)}
                  </span>
                )}
              </h3>
              <button onClick={onClose} className="rounded-full p-2 hover:bg-brand-500/15" aria-label="Close">
                <IconClose width={16} height={16} />
              </button>
            </header>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-500/10 text-brand-300">
                  <IconCart width={34} height={34} />
                </span>
                <p className="font-semibold text-brand-100">{t('emptyCart')}</p>
                <p className="text-sm text-brand-100/50">{t('emptyCartBody')}</p>
                <a
                  href="#menu"
                  onClick={onClose}
                  className="mt-2 rounded-full bg-gold-400 px-5 py-2 text-sm font-bold text-ink-950"
                >
                  {t('exploreMenu')}
                </a>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
                  {lines.map(({ line, item }) => (
                    <div key={item.id} className="flex gap-3 rounded-2xl border border-brand-500/15 bg-ink-950/50 p-2.5">
                      <img
                        src={item.image}
                        alt={item.nameEn}
                        className="h-16 w-16 shrink-0 rounded-xl object-cover"
                        loading="lazy"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{lang === 'bn' ? item.nameBn : item.nameEn}</p>
                        <p className="text-xs font-bold text-gold-300">{taka(item.price, lang)}</p>
                        <div className="mt-1.5 flex items-center gap-2">
                          <button
                            onClick={() => setQty(item.id, line.qty - 1)}
                            className="rounded-md bg-brand-500/20 p-1 hover:bg-brand-500/35"
                            aria-label="Decrease"
                          >
                            {line.qty === 1 ? <IconTrash width={12} height={12} /> : <IconMinus width={12} height={12} />}
                          </button>
                          <span className="w-6 text-center text-sm font-bold">{line.qty}</span>
                          <button
                            onClick={() => setQty(item.id, line.qty + 1)}
                            className="rounded-md bg-brand-500/20 p-1 hover:bg-brand-500/35"
                            aria-label="Increase"
                          >
                            <IconPlus width={12} height={12} />
                          </button>
                          <span className="ml-auto text-sm font-bold text-brand-50">
                            {taka(item.price * line.qty, lang)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <footer className="space-y-3 border-t border-brand-500/15 px-5 py-4">
                  <div className="flex justify-between text-sm text-brand-100/70">
                    <span>{t('subtotal')}</span>
                    <span>{taka(cartTotal, lang)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-brand-100/70">
                    <span>{t('deliveryCharge')}</span>
                    <span>{taka(delivery, lang)}</span>
                  </div>
                  <div className="flex justify-between border-t border-brand-500/15 pt-2 text-base font-bold">
                    <span>{t('total')}</span>
                    <span className="text-gold-300">{taka(grandTotal, lang)}</span>
                  </div>
                  <button
                    onClick={startCheckout}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold-400 to-gold-500 py-3 text-sm font-bold text-ink-950 transition hover:scale-[1.02]"
                  >
                    <IconLock width={15} height={15} />
                    {t('checkout')}
                  </button>
                  <button
                    onClick={clearCart}
                    className="w-full py-1 text-xs font-medium text-brand-100/45 transition hover:text-red-400"
                  >
                    {t('clearCart')}
                  </button>
                </footer>
              </>
            )}
          </aside>
        </div>
      )}

      {/* Checkout modal */}
      <Modal
        open={checkout}
        onClose={closeCheckout}
        title={step === 'done' ? t('orderSuccess') : t('checkoutTitle')}
      >
        {step === 'form' && (
          <div className="space-y-3">
            <div className="rounded-xl bg-brand-500/10 px-3.5 py-2.5 text-xs text-brand-100/70">
              {t('subtotal')}: <b className="text-gold-300">{taka(cartTotal, lang)}</b> + {t('deliveryCharge')}:{' '}
              <b className="text-gold-300">{taka(delivery, lang)}</b> ={' '}
              <b className="text-gold-300">{taka(grandTotal, lang)}</b>
            </div>

            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-brand-100/75">{t('fullName')}</span>
              <input
                value={customer.name}
                onChange={(e) => setCustomer((c) => ({ ...c, name: e.target.value }))}
                className={fieldCls(!!errors.name)}
              />
              {errors.name && <p className="mt-1 text-[11px] text-red-400">{errors.name}</p>}
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-brand-100/75">{t('mobile')}</span>
              <input
                type="tel"
                value={customer.phone}
                onChange={(e) => setCustomer((c) => ({ ...c, phone: e.target.value }))}
                placeholder="01XXXXXXXXX"
                className={fieldCls(!!errors.phone)}
              />
              {errors.phone && <p className="mt-1 text-[11px] text-red-400">{errors.phone}</p>}
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-brand-100/75">{t('deliveryAddress')}</span>
              <textarea
                rows={2}
                value={customer.address}
                onChange={(e) => setCustomer((c) => ({ ...c, address: e.target.value }))}
                className={fieldCls(!!errors.address)}
              />
              {errors.address && <p className="mt-1 text-[11px] text-red-400">{errors.address}</p>}
            </label>

            <div>
              <span className="mb-1.5 block text-xs font-semibold text-brand-100/75">{t('payWith')}</span>
              <div className="grid grid-cols-3 gap-2">
                {PAYMENT_OPTIONS.map((m) => (
                  <button
                    key={m.key}
                    onClick={() => setPayment(m.key)}
                    className={`rounded-xl border py-2.5 text-xs font-bold transition ${
                      payment === m.key
                        ? 'border-gold-400 bg-gold-400/15 text-gold-300'
                        : 'border-brand-500/30 bg-brand-500/8 text-brand-100/70 hover:border-gold-400/40'
                    }`}
                  >
                    {lang === 'bn' ? m.bn : m.en}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={confirmOrder}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold-400 to-gold-500 py-3 text-sm font-bold text-ink-950 transition hover:scale-[1.02]"
            >
              <IconShield width={15} height={15} />
              {t('placeOrder')}
            </button>
          </div>
        )}

        {step === 'pay' && (
          <div className="space-y-4 text-center">
            <IconBkash className="mx-auto" method={payment} />
            {payment === 'card' ? (
              <p className="text-sm text-brand-100/70">
                {lang === 'bn'
                  ? 'কার্ড পেমেন্ট নিরাপদ গেটওয়ে দিয়ে সম্পন্ন হবে। কনফার্ম করলে অর্ডার প্লেস হবে।'
                  : 'Card payment is processed via a secure gateway. Confirm to place the order.'}
              </p>
            ) : (
              <>
                <p className="text-sm text-brand-100/70">{t('bkashHint')}</p>
                <div className="rounded-xl border border-dashed border-gold-400/50 bg-gold-400/10 px-4 py-3">
                  <p className="text-xs text-gold-200/80">
                    {lang === 'bn' ? 'পেমেন্ট রেফারেন্স / Transaction ID' : 'Payment Reference / TrxID'}
                  </p>
                  <input
                    placeholder="e.g. 9HXA11B2C3"
                    className="mt-1 w-full bg-transparent text-center text-sm font-bold tracking-widest text-gold-200 outline-none placeholder:tracking-normal placeholder:text-gold-200/30"
                  />
                </div>
              </>
            )}
            <button
              onClick={payNow}
              disabled={processing}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold-400 to-gold-500 py-3 text-sm font-bold text-ink-950 transition hover:scale-[1.02] disabled:opacity-60"
            >
              {processing ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink-950 border-t-transparent" />
              ) : (
                <IconLock width={15} height={15} />
              )}
              {t('placeOrder')}
            </button>
            <p className="flex items-center justify-center gap-1.5 text-[11px] text-brand-100/40">
              <IconShield width={12} height={12} />
              {lang === 'bn' ? 'সম্পূর্ণ নিরাপদ ও এনক্রিপ্টেড পেমেন্ট' : '100% secure & encrypted payment'}
            </p>
          </div>
        )}

        {step === 'done' && (
          <div className="space-y-4 text-center">
            <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-500/20 text-brand-300">
              <IconCheck width={40} height={40} />
            </span>
            <div>
              <h4 className="text-xl font-bold text-gold-300">{t('orderSuccess')}</h4>
              <p className="mt-1 text-sm text-brand-100/70">{t('orderSuccessBody')}</p>
              <p className="mt-3 inline-block rounded-full bg-brand-500/15 px-4 py-1.5 text-sm font-bold">
                {t('orderNo')}: #{orderId}
              </p>
            </div>
            <div className="flex items-start gap-2 rounded-xl bg-gold-400/10 px-3.5 py-2.5 text-left text-xs text-gold-200/90">
              <IconAlert width={15} height={15} className="mt-0.5 shrink-0" />
              {lang === 'bn'
                ? 'অর্ডার আপডেট নোটিফিকেশনে দেখতে পাবেন। প্রয়োজনে কল করুন 01912-845151'
                : 'Track order updates in the notification bell. Call 01912-845151 for support.'}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  closeCheckout()
                  onOpenNotif()
                }}
                className="flex-1 rounded-xl border border-brand-500/30 py-2.5 text-sm font-semibold hover:bg-brand-500/10"
              >
                {t('notifTitle')}
              </button>
              <button
                onClick={closeCheckout}
                className="flex-1 rounded-xl bg-gold-400 py-2.5 text-sm font-bold text-ink-950"
              >
                {lang === 'bn' ? 'ঠিক আছে' : 'Done'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}

function fieldCls(err?: boolean) {
  return `w-full rounded-xl border bg-ink-950/70 px-3.5 py-2.5 text-sm text-brand-50 outline-none transition focus:border-gold-400/70 focus:ring-2 focus:ring-gold-400/20 ${
    err ? 'border-red-500/60' : 'border-brand-500/25'
  }`
}
