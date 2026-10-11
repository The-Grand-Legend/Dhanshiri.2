import { useState } from 'react'
import { useStore } from '../lib/store'
import { dict } from '../lib/i18n'
import { taka, todayISO, uid } from '../lib/utils'
import { useToast } from './ui/Toast'
import { Modal } from './ui/Modal'
import { IconCake, IconGift, IconHeart, IconShield, IconSparkles, IconUsers, IconCheck } from './ui/Icons'

const EVENT_TYPES = [
  { key: 'birthday', icon: <IconCake width={26} height={26} />, img: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=70' },
  { key: 'wedding', icon: <IconHeart width={26} height={26} />, img: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=70' },
  { key: 'corporate', icon: <IconShield width={26} height={26} />, img: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=70' },
  { key: 'special', icon: <IconGift width={26} height={26} />, img: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=800&q=70' },
] as const

export function PartySection() {
  const { lang, data, setData, pushNotification } = useStore()
  const { push } = useToast()
  const t = (k: string) => dict[k]?.[lang] ?? k

  const [modal, setModal] = useState(false)
  const [fullRoom, setFullRoom] = useState(false)
  const [form, setForm] = useState({
    name: '',
    phone: '',
    date: todayISO(),
    guests: 50,
    type: 'birthday' as (typeof EVENT_TYPES)[number]['key'],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [done, setDone] = useState<string | null>(null)

  const hallPrice = data.settings.partyHallPrice
  const estimate = fullRoom ? hallPrice : Math.round((hallPrice / 200) * form.guests)

  const openModal = (room: boolean) => {
    setFullRoom(room)
    setDone(null)
    setErrors({})
    setModal(true)
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const err: Record<string, string> = {}
    if (!form.name.trim()) err.name = t('nameRequired')
    if (!/^\d{11}$/.test(form.phone.replace(/\D/g, ''))) err.phone = t('phoneInvalid')
    setErrors(err)
    if (Object.keys(err).length) return

    const id = uid('ev')
    setData((d) => ({
      ...d,
      events: [
        {
          id,
          name: form.name.trim(),
          phone: form.phone.trim(),
          date: form.date,
          guests: form.guests,
          type: form.type,
          fullRoom,
          amount: estimate,
          createdAt: new Date().toISOString(),
        },
        ...d.events,
      ],
    }))
    pushNotification({
      kind: 'event',
      titleBn: fullRoom ? 'নতুন পূর্ণ হল বুকিং' : 'নতুন ইভেন্ট বুকিং',
      titleEn: fullRoom ? 'New Full Hall Booking' : 'New Event Booking',
      bodyBn: `${form.name.trim()} — ${form.date}, ${form.guests} জন`,
      bodyEn: `${form.name.trim()} — ${form.date}, ${form.guests} guests`,
    })
    push({ kind: 'success', title: t('eventSuccess'), body: `${t('orderNo')}: #${id.slice(-6).toUpperCase()}` })
    setDone(id)
    setForm((f) => ({ ...f, name: '', phone: '' }))
  }

  return (
    <section id="party" className="relative overflow-hidden py-20">
      <div className="pointer-events-none absolute top-1/3 -left-32 h-80 w-80 rounded-full bg-brand-600/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-1/4 h-80 w-80 rounded-full bg-gold-500/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <span className="rounded-full border border-gold-400/40 bg-gold-400/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-gold-300">
            {t('partyTitle')}
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
            {lang === 'bn' ? (
              <>অবিস্মরণীয় করুন প্রতিটি <span className="text-gold-300">উৎসব</span></>
            ) : (
              <>Make Every <span className="text-gold-300">Celebration</span> Unforgettable</>
            )}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-brand-100/65">{t('partySub')}</p>
        </div>

        {/* Event type cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {EVENT_TYPES.map((ev) => (
            <button
              key={ev.key}
              onClick={() => {
                setForm((f) => ({ ...f, type: ev.key }))
                openModal(false)
              }}
              className="group relative overflow-hidden rounded-3xl border border-brand-500/20 text-left transition hover:border-gold-400/60"
            >
              <img
                src={ev.img}
                alt={t(ev.key)}
                loading="lazy"
                className="h-56 w-full object-cover transition duration-700 group-hover:scale-110"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/50 to-transparent" />
              <span className="absolute inset-x-0 bottom-0 p-4">
                <span className="mb-2 flex h-11 w-11 items-center justify-center rounded-2xl bg-gold-400/20 text-gold-300 backdrop-blur">
                  {ev.icon}
                </span>
                <span className="block font-bold text-brand-50">{t(ev.key)}</span>
                <span className="mt-0.5 block text-xs text-gold-300 opacity-0 transition group-hover:opacity-100">
                  {t('bookEvent')} →
                </span>
              </span>
            </button>
          ))}
        </div>

        {/* Full room banner */}
        <div className="mt-8 overflow-hidden rounded-3xl border border-gold-400/30 bg-gradient-to-r from-brand-950 via-ink-900 to-brand-950">
          <div className="grid items-center gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_auto]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-gold-400/15 px-3 py-1 text-xs font-bold text-gold-300">
                <IconSparkles width={13} height={13} />
                {t('fullRoomBooking')}
              </span>
              <h3 className="mt-3 font-display text-2xl font-bold sm:text-3xl">
                {lang === 'bn' ? 'পুরো পার্টি হল নিন ভাড়ায়' : 'Rent The Full Party Hall'}
              </h3>
              <p className="mt-2 max-w-xl text-sm text-brand-100/70">{t('fullRoomDesc')}</p>
              <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-brand-200/80">
                {(lang === 'bn'
                  ? ['২০০+ আসন', 'ফ্রি সাজসজ্জা', 'সাউন্ড সিস্টেম', 'কেটারিং সুবিধা', 'পার্কিং']
                  : ['200+ seats', 'Free decoration', 'Sound system', 'Catering', 'Parking']
                ).map((f) => (
                  <li key={f} className="flex items-center gap-1.5">
                    <IconCheck width={13} height={13} className="text-gold-400" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-center">
              <p className="text-sm text-brand-100/60">
                {lang === 'bn' ? 'শুরু মাত্র' : 'Starting at'}
              </p>
              <p className="font-display text-3xl font-bold text-gold-300">{taka(hallPrice, lang)}</p>
              <button
                onClick={() => openModal(true)}
                className="mt-3 rounded-full bg-gradient-to-r from-gold-400 to-gold-500 px-6 py-2.5 text-sm font-bold text-ink-950 shadow-lg shadow-gold-500/25 transition hover:scale-105"
              >
                {t('bookEvent')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Event booking modal */}
      <Modal open={modal} onClose={() => setModal(false)} title={t('eventBookingTitle')}>
        {done ? (
          <div className="space-y-3 text-center">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-500/20 text-brand-300">
              <IconCheck width={32} height={32} />
            </span>
            <h4 className="text-lg font-bold text-gold-300">{t('eventSuccess')}</h4>
            <p className="text-sm text-brand-100/70">
              {lang === 'bn'
                ? 'আমাদের টিম শীঘ্রই আপনাকে কল করবে বিস্তারিত আলোচনার জন্য।'
                : 'Our team will call you shortly to discuss details.'}
            </p>
            <button
              onClick={() => setModal(false)}
              className="rounded-xl bg-gold-400 px-6 py-2.5 text-sm font-bold text-ink-950"
            >
              {lang === 'bn' ? 'ঠিক আছে' : 'Done'}
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3" noValidate>
            {fullRoom && (
              <div className="rounded-xl border border-gold-400/40 bg-gold-400/10 px-3.5 py-2.5 text-xs font-semibold text-gold-200">
                {t('fullRoomBooking')} — {taka(hallPrice, lang)}
              </div>
            )}

            <div>
              <span className="mb-1.5 block text-xs font-semibold text-brand-100/75">{t('eventType')}</span>
              <div className="grid grid-cols-2 gap-2">
                {EVENT_TYPES.map((ev) => (
                  <button
                    key={ev.key}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, type: ev.key }))}
                    className={`rounded-xl border py-2 text-xs font-bold transition ${
                      form.type === ev.key
                        ? 'border-gold-400 bg-gold-400/15 text-gold-300'
                        : 'border-brand-500/30 bg-brand-500/8 text-brand-100/70 hover:border-gold-400/40'
                    }`}
                  >
                    {t(ev.key)}
                  </button>
                ))}
              </div>
            </div>

            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-brand-100/75">{t('fullName')}</span>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className={cls(!!errors.name)}
              />
              {errors.name && <p className="mt-1 text-[11px] text-red-400">{errors.name}</p>}
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-brand-100/75">{t('mobile')}</span>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="01XXXXXXXXX"
                className={cls(!!errors.phone)}
              />
              {errors.phone && <p className="mt-1 text-[11px] text-red-400">{errors.phone}</p>}
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-brand-100/75">{t('date')}</span>
                <input
                  type="date"
                  min={todayISO()}
                  value={form.date}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  className={cls()}
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-brand-100/75">{t('guests')}</span>
                <input
                  type="number"
                  min={1}
                  max={1000}
                  value={form.guests}
                  disabled={fullRoom}
                  onChange={(e) => setForm((f) => ({ ...f, guests: Math.max(1, Number(e.target.value)) }))}
                  className={cls()}
                />
              </label>
            </div>

            {!fullRoom && (
              <div className="flex items-center justify-between rounded-xl bg-brand-500/12 px-3.5 py-2.5 text-sm">
                <span className="flex items-center gap-1.5 text-brand-100/70">
                  <IconUsers width={14} height={14} />
                  {lang === 'bn' ? 'আনুমানিক খরচ' : 'Estimated cost'}
                </span>
                <span className="font-bold text-gold-300">{taka(estimate, lang)}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-gold-400 to-gold-500 py-3 text-sm font-bold text-ink-950 transition hover:scale-[1.02]"
            >
              {t('bookEvent')}
            </button>
          </form>
        )}
      </Modal>
    </section>
  )
}

function cls(err?: boolean) {
  return `w-full rounded-xl border bg-ink-950/70 px-3.5 py-2.5 text-sm text-brand-50 outline-none transition focus:border-gold-400/70 focus:ring-2 focus:ring-gold-400/20 ${
    err ? 'border-red-500/60' : 'border-brand-500/25'
  }`
}
