import { useMemo, useState } from 'react'
import { useStore } from '../lib/store'
import { dict, PAYMENT_LABEL } from '../lib/i18n'
import { IMG_HERO } from '../lib/seed'
import { cn, isValidBdPhone, taka, todayISO, uid } from '../lib/utils'
import { useToast } from './ui/Toast'
import { IconCheck, IconClock, IconStar, IconUsers } from './ui/Icons'

const TIME_SLOTS = [
  '12:00', '13:00', '14:00', '18:00', '19:00', '20:00', '21:00', '22:00',
]

const PAYMENT_METHODS = ['bkash', 'nagad', 'card'] as const

export function Hero() {
  const { lang, data, setData, pushNotification } = useStore()
  const { push } = useToast()
  const t = (k: string) => dict[k]?.[lang] ?? k

  const [form, setForm] = useState({
    name: '',
    phone: '',
    date: todayISO(),
    time: '',
    guests: 2,
    payment: 'bkash' as (typeof PAYMENT_METHODS)[number],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  const perGuest = data.settings.tableBookingPrice
  const estimated = useMemo(() => perGuest * form.guests, [perGuest, form.guests])

  const validate = (): boolean => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = t('nameRequired')
    if (!isValidBdPhone(form.phone)) e.phone = t('phoneInvalid')
    if (!form.time) e.time = t('selectTime')
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    window.setTimeout(() => {
      const id = uid('bk')
      setData((d) => ({
        ...d,
        bookings: [
          {
            id,
            name: form.name.trim(),
            phone: form.phone.trim(),
            date: form.date,
            time: form.time,
            guests: form.guests,
            payment: form.payment,
            amount: estimated,
            status: 'pending',
            createdAt: new Date().toISOString(),
          },
          ...d.bookings,
        ],
      }))
      pushNotification({
        kind: 'booking',
        titleBn: 'নতুন টেবিল বুকিং',
        titleEn: 'New Table Booking',
        bodyBn: `${form.name.trim()} — ${form.date} তারিখ, ${form.time} সময়, ${form.guests} জন`,
        bodyEn: `${form.name.trim()} — ${form.date} at ${form.time}, ${form.guests} guests`,
      })
      push({
        kind: 'success',
        title: t('bookingSuccess'),
        body: `${t('orderNo')}: #${id.slice(-6).toUpperCase()} · ${taka(estimated, lang)}`,
      })
      setSubmitting(false)
      setForm((f) => ({ ...f, name: '', phone: '', time: '' }))
      setErrors({})
    }, 600)
  }

  const stats = [
    { icon: <IconStar width={18} height={18} />, value: '26+', label: t('heroStat1') },
    { icon: <IconUsers width={18} height={18} />, value: '5000+', label: t('heroStat2') },
    { icon: <IconClock width={18} height={18} />, value: '7+', label: t('heroStat3') },
  ]

  return (
    <section id="home" className="relative overflow-hidden pt-24 pb-16 lg:pt-28">
      {/* Background layers */}
      <div className="absolute inset-0">
        <img src={IMG_HERO} alt="" className="h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/92 via-ink-950/80 to-ink-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/40 to-transparent" />
      </div>
      {/* Decor */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-brand-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-gold-500/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left: copy */}
        <div className="animate-float-up pt-6 lg:pt-0">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-gold-400/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-gold-300">
            <IconSparklesInline />
            {lang === 'bn' ? 'রংপুর হাইওয়ের সেরা স্বাদ' : 'Best taste on Rangpur Highway'}
          </span>
          <h1 className="mt-5 font-display text-4xl leading-tight font-bold text-brand-50 sm:text-5xl lg:text-6xl">
            {lang === 'bn' ? (
              <>
                ধনশিরি রেস্টুরেন্ট
                <br />
                <span className="bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 bg-clip-text text-transparent">
                  ও পার্টি সেন্টার
                </span>
              </>
            ) : (
              <>
                Dhanshiri Restaurant
                <br />
                <span className="bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 bg-clip-text text-transparent">
                  &amp; Party Center
                </span>
              </>
            )}
          </h1>
          <p className="text-glow mt-5 max-w-xl font-display text-xl text-gold-200 sm:text-2xl">
            “{t('tagline')}”
          </p>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-brand-100/75 sm:text-base">
            {lang === 'bn'
              ? 'মোকামতলা, ঢাকা-রংপুর হাইওয়েতে অবস্থিত আমাদের রেস্টুরেন্টে কাচ্চি বিরিয়ানি, বার্গার, বিকিউ সহ বিভিন্ন ধরনের সুস্বাদু খাবার এবং পার্টি হল সেবা পাবেন।'
              : 'Located at Mokamtola on the Dhaka-Rangpur Highway, we serve Kacchi Biryani, burgers, BBQ and much more — plus a full party hall for your special occasions.'}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="#menu"
              className="rounded-full bg-gradient-to-r from-gold-400 to-gold-500 px-7 py-3 text-sm font-bold text-ink-950 shadow-xl shadow-gold-500/25 transition hover:scale-105"
            >
              {t('exploreMenu')}
            </a>
            <a
              href="#booking"
              className="rounded-full border border-brand-300/40 bg-brand-500/10 px-7 py-3 text-sm font-bold text-brand-100 backdrop-blur transition hover:bg-brand-500/20"
            >
              {t('bookTable')}
            </a>
          </div>

          <div className="mt-9 grid max-w-md grid-cols-3 gap-3">
            {stats.map((s) => (
              <div key={s.label} className="glass rounded-2xl border border-brand-500/20 p-3 text-center">
                <span className="mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-gold-400/15 text-gold-300">
                  {s.icon}
                </span>
                <p className="text-lg font-bold text-gold-300">{s.value}</p>
                <p className="text-[11px] text-brand-100/70">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: booking card */}
        <div id="booking" className="animate-float-up">
          <form
            onSubmit={submit}
            className="glass ring-soft rounded-3xl border border-gold-400/25 p-5 sm:p-6"
            noValidate
          >
            <div className="mb-1 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gold-300">{t('bookingTitle')}</h2>
              <span className="rounded-full bg-brand-500/20 px-2.5 py-1 text-[11px] font-semibold text-brand-200">
                {taka(perGuest, lang)} {t('perSeat')}
              </span>
            </div>
            <p className="mb-4 text-xs text-brand-100/60">{t('bookingSub')}</p>

            <div className="grid gap-3">
              <Field label={t('fullName')} error={errors.name}>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder={lang === 'bn' ? 'যেমন: রহিম উদ্দিন' : 'e.g. Rahim Uddin'}
                  className={inputCls(!!errors.name)}
                />
              </Field>

              <Field label={t('mobile')} error={errors.phone}>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="01XXXXXXXXX"
                  className={inputCls(!!errors.phone)}
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label={t('date')}>
                  <input
                    type="date"
                    min={todayISO()}
                    value={form.date}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                    className={inputCls()}
                  />
                </Field>
                <Field label={t('guests')}>
                  <div className={cn(inputCls(), 'flex items-center justify-between px-2')}>
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, guests: Math.max(1, f.guests - 1) }))}
                      className="rounded-lg bg-brand-500/20 px-2.5 py-1 text-sm font-bold hover:bg-brand-500/30"
                    >
                      −
                    </button>
                    <span className="font-semibold text-gold-300">{form.guests}</span>
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, guests: Math.min(50, f.guests + 1) }))}
                      className="rounded-lg bg-brand-500/20 px-2.5 py-1 text-sm font-bold hover:bg-brand-500/30"
                    >
                      +
                    </button>
                  </div>
                </Field>
              </div>

              <Field label={t('time')} error={errors.time}>
                <div className="flex flex-wrap gap-1.5">
                  {TIME_SLOTS.map((slot) => {
                    const ampm = Number(slot.split(':')[0]) >= 12 ? 'PM' : 'AM'
                    const h12 = (() => {
                      const h = Number(slot.split(':')[0])
                      return h % 12 === 0 ? 12 : h % 12
                    })()
                    const label = `${h12}:${slot.split(':')[1]} ${ampm}`
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, time: slot }))}
                        className={cn(
                          'rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition',
                          form.time === slot
                            ? 'border-gold-400 bg-gold-400 text-ink-950'
                            : 'border-brand-500/30 bg-brand-500/10 text-brand-100/80 hover:border-gold-400/50'
                        )}
                      >
                        {label}
                      </button>
                    )
                  })}
                </div>
              </Field>

              <Field label={t('paymentMethod')}>
                <div className="grid grid-cols-3 gap-2">
                  {PAYMENT_METHODS.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, payment: m }))}
                      className={cn(
                        'rounded-xl border py-2 text-xs font-bold transition',
                        form.payment === m
                          ? 'border-gold-400 bg-gold-400/15 text-gold-300'
                          : 'border-brand-500/30 bg-brand-500/8 text-brand-100/70 hover:border-gold-400/40'
                      )}
                    >
                      {PAYMENT_LABEL[m][lang]}
                    </button>
                  ))}
                </div>
              </Field>

              <div className="mt-1 flex items-center justify-between rounded-xl bg-brand-500/12 px-3.5 py-2.5 text-sm">
                <span className="text-brand-100/70">
                  {lang === 'bn' ? 'মোট (আনুমানিক)' : 'Total (estimated)'}
                </span>
                <span className="text-lg font-bold text-gold-300">{taka(estimated, lang)}</span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold-400 to-gold-500 py-3 text-sm font-bold text-ink-950 shadow-lg shadow-gold-500/25 transition hover:scale-[1.02] disabled:opacity-60"
              >
                {submitting ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink-950 border-t-transparent" />
                ) : (
                  <IconCheck width={16} height={16} />
                )}
                {t('bookPay')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

function inputCls(err?: boolean): string {
  return cn(
    'w-full rounded-xl border bg-ink-900/70 px-3.5 py-2.5 text-sm text-brand-50 placeholder:text-brand-100/35 outline-none transition',
    'focus:border-gold-400/70 focus:ring-2 focus:ring-gold-400/20',
    err ? 'border-red-500/60' : 'border-brand-500/25'
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-brand-100/75">
        {label}
      </span>
      {children}
      {error && <span className="mt-1 block text-[11px] font-medium text-red-400">{error}</span>}
    </label>
  )
}

function IconSparklesInline() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2 14.2 9.3 21.5 11.5 14.2 13.7 12 21 9.8 13.7 2.5 11.5 9.8 9.3z" />
    </svg>
  )
}

