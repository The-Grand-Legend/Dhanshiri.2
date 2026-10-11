import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../lib/store'
import { BADGE_LABEL, CATEGORIES, PAYMENT_LABEL } from '../lib/i18n'
import type { AppData, Badge, GalleryItem, MenuItem, Notice, Offer } from '../types'
import { cn, formatDate, formatTime12, taka, uid } from '../lib/utils'
import { useToast } from '../components/ui/Toast'
import { Modal } from '../components/ui/Modal'
import {
  IconAlert,
  IconBell,
  IconCake,
  IconCheck,
  IconClipboard,
  IconExternal,
  IconEye,
  IconEyeOff,
  IconImage,
  IconLayout,
  IconLock,
  IconLogout,
  IconMegaphone,
  IconMenu,
  IconPhone,
  IconPlus,
  IconSettings,
  IconStar,
  IconTag,
  IconTrash,
  IconUsers,
} from '../components/ui/Icons'

type TabKey =
  | 'dashboard'
  | 'menu'
  | 'gallery'
  | 'offers'
  | 'notices'
  | 'bookings'
  | 'events'
  | 'orders'
  | 'reviews'
  | 'settings'

const TABS: { key: TabKey; bn: string; en: string; icon: React.ReactNode }[] = [
  { key: 'dashboard', bn: 'ড্যাশবোর্ড', en: 'Dashboard', icon: <IconLayout width={17} height={17} /> },
  { key: 'menu', bn: 'মেনু ম্যানেজার', en: 'Menu Manager', icon: <IconMenu width={17} height={17} /> },
  { key: 'gallery', bn: 'গ্যালারি ম্যানেজার', en: 'Gallery Manager', icon: <IconImage width={17} height={17} /> },
  { key: 'offers', bn: 'অফার ম্যানেজার', en: 'Offers Manager', icon: <IconTag width={17} height={17} /> },
  { key: 'notices', bn: 'নোটিশ বোর্ড', en: 'Notice Board', icon: <IconMegaphone width={17} height={17} /> },
  { key: 'bookings', bn: 'বুকিং ম্যানেজার', en: 'Booking Manager', icon: <IconClipboard width={17} height={17} /> },
  { key: 'events', bn: 'ইভেন্ট বুকিং', en: 'Event Bookings', icon: <IconCake width={17} height={17} /> },
  { key: 'orders', bn: 'অর্ডার ম্যানেজার', en: 'Orders Manager', icon: <IconBell width={17} height={17} /> },
  { key: 'reviews', bn: 'রিভিউ', en: 'Reviews', icon: <IconStar width={17} height={17} /> },
  { key: 'settings', bn: 'সেটিংস', en: 'Settings', icon: <IconSettings width={17} height={17} /> },
]

export function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const { lang, setLang, setData, resetAll } = useStore()
  const { push } = useToast()
  const [tab, setTab] = useState<TabKey>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const patch = (fn: (d: AppData) => AppData) => setData(fn)

  return (
    <div className="flex min-h-screen bg-ink-950">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-brand-500/15 bg-ink-900 transition-transform lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center gap-2.5 border-b border-brand-500/15 px-5 py-4">
          <img src="/icons/icon.svg" alt="" className="h-9 w-9 rounded-lg ring-1 ring-gold-400/40" />
          <div>
            <p className="font-display text-sm font-bold text-gold-300">Dhanshiri Admin</p>
            <p className="text-[10px] text-brand-100/45">{lang === 'bn' ? 'প্যানেল' : 'Panel'}</p>
          </div>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => {
                setTab(t.key)
                setSidebarOpen(false)
              }}
              className={cn(
                'flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition',
                tab === t.key
                  ? 'bg-gold-400/15 text-gold-300'
                  : 'text-brand-100/65 hover:bg-brand-500/10 hover:text-brand-50'
              )}
            >
              {t.icon}
              {lang === 'bn' ? t.bn : t.en}
            </button>
          ))}
        </nav>

        <div className="space-y-1 border-t border-brand-500/15 p-3">
          <div className="flex overflow-hidden rounded-full border border-brand-500/30 text-xs font-bold">
            <button
              onClick={() => setLang('bn')}
              className={cn('flex-1 py-1.5 transition', lang === 'bn' ? 'bg-gold-400 text-ink-950' : 'text-brand-100/70')}
            >
              বাংলা
            </button>
            <button
              onClick={() => setLang('en')}
              className={cn('flex-1 py-1.5 transition', lang === 'en' ? 'bg-gold-400 text-ink-950' : 'text-brand-100/70')}
            >
              EN
            </button>
          </div>
          <Link
            to="/"
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-brand-100/65 transition hover:bg-brand-500/10"
          >
            <IconExternal width={16} height={16} />
            {lang === 'bn' ? 'ওয়েবসাইট দেখুন' : 'View Website'}
          </Link>
          <button
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-red-400/85 transition hover:bg-red-500/10"
          >
            <IconLogout width={16} height={16} />
            {lang === 'bn' ? 'লগ আউট' : 'Log Out'}
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-brand-500/15 bg-ink-950/90 px-4 py-3 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg border border-brand-500/30 p-2 lg:hidden"
              aria-label="Menu"
            >
              <IconMenu width={16} height={16} />
            </button>
            <h1 className="font-display text-lg font-bold text-brand-50">
              {lang === 'bn' ? TABS.find((t) => t.key === tab)?.bn : TABS.find((t) => t.key === tab)?.en}
            </h1>
          </div>
          <span className="rounded-full bg-brand-500/15 px-3 py-1 text-xs font-semibold text-brand-200">
            {lang === 'bn' ? 'অ্যাডমিন' : 'Admin'}
          </span>
        </header>

        <main className="p-4 sm:p-6">
          {tab === 'dashboard' && <Dashboard goTab={setTab} />}
          {tab === 'menu' && <MenuManager patch={patch} />}
          {tab === 'gallery' && <GalleryManager patch={patch} />}
          {tab === 'offers' && <OffersManager patch={patch} />}
          {tab === 'notices' && <NoticeManager patch={patch} />}
          {tab === 'bookings' && <BookingManager patch={patch} />}
          {tab === 'events' && <EventManager patch={patch} />}
          {tab === 'orders' && <OrdersManager patch={patch} />}
          {tab === 'reviews' && <ReviewsManager patch={patch} />}
          {tab === 'settings' && (
            <SettingsManager
              patch={patch}
              onReset={() => {
                resetAll()
                push({
                  kind: 'info',
                  title: lang === 'bn' ? 'ডেটা রিসেট হয়েছে' : 'Data reset',
                  body: lang === 'bn' ? 'সব ডেমো ডেটা ফিরিয়ে আনা হয়েছে' : 'Seed data restored',
                })
              }}
            />
          )}
        </main>
      </div>
    </div>
  )
}

/* ---------------- Shared bits ---------------- */

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('rounded-2xl border border-brand-500/15 bg-ink-900/60 p-4 sm:p-5', className)}>{children}</div>
}

function Empty({ text }: { text: string }) {
  return <p className="py-12 text-center text-sm text-brand-100/40">{text}</p>
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className, ...rest } = props
  return (
    <input
      {...rest}
      className={cn(
        'w-full rounded-xl border border-brand-500/25 bg-ink-950/70 px-3.5 py-2.5 text-sm text-brand-50 outline-none transition placeholder:text-brand-100/30 focus:border-gold-400/70 focus:ring-2 focus:ring-gold-400/20',
        className
      )}
    />
  )
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className, ...rest } = props
  return (
    <textarea
      {...rest}
      className={cn(
        'w-full rounded-xl border border-brand-500/25 bg-ink-950/70 px-3.5 py-2.5 text-sm text-brand-50 outline-none transition placeholder:text-brand-100/30 focus:border-gold-400/70 focus:ring-2 focus:ring-gold-400/20',
        className
      )}
    />
  )
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  const { className, ...rest } = props
  return (
    <select
      {...rest}
      className={cn(
        'w-full appearance-none rounded-xl border border-brand-500/25 bg-ink-950/70 px-3.5 py-2.5 text-sm text-brand-50 outline-none transition focus:border-gold-400/70 focus:ring-2 focus:ring-gold-400/20 [&>option]:bg-ink-900',
        className
      )}
    />
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <span className="mb-1 block text-xs font-semibold text-brand-100/70">{children}</span>
}

function GoldButton({
  children,
  onClick,
  type = 'button',
  className,
  disabled,
}: {
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
  className?: string
  disabled?: boolean
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold-400 to-gold-500 px-4 py-2.5 text-sm font-bold text-ink-950 transition hover:scale-[1.02] disabled:opacity-50',
        className
      )}
    >
      {children}
    </button>
  )
}

function DangerButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-lg border border-red-500/30 px-2.5 py-1.5 text-xs font-semibold text-red-400 transition hover:bg-red-500/10"
    >
      {children}
    </button>
  )
}

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: 'bg-gold-400/15 text-gold-300',
    confirmed: 'bg-brand-400/15 text-brand-300',
    cancelled: 'bg-red-500/15 text-red-400',
    placed: 'bg-gold-400/15 text-gold-300',
    preparing: 'bg-sky-400/15 text-sky-300',
    'on-the-way': 'bg-purple-400/15 text-purple-300',
    delivered: 'bg-brand-400/15 text-brand-300',
  }
  return (
    <span className={cn('rounded-full px-2.5 py-0.5 text-[11px] font-bold capitalize', styles[status] ?? 'bg-brand-500/15')}>
      {status.replace('-', ' ')}
    </span>
  )
}

/* ---------------- Dashboard ---------------- */

function Dashboard({ goTab }: { goTab: (t: TabKey) => void }) {
  const { lang, data } = useStore()

  const stats = [
    { label: lang === 'bn' ? 'মোট মেনু আইটেম' : 'Menu Items', value: data.menu.length, icon: <IconMenu width={20} height={20} />, tab: 'menu' as TabKey },
    { label: lang === 'bn' ? 'টেবিল বুকিং' : 'Table Bookings', value: data.bookings.length, icon: <IconClipboard width={20} height={20} />, tab: 'bookings' as TabKey },
    { label: lang === 'bn' ? 'ইভেন্ট বুকিং' : 'Event Bookings', value: data.events.length, icon: <IconCake width={20} height={20} />, tab: 'events' as TabKey },
    { label: lang === 'bn' ? 'অর্ডার' : 'Orders', value: data.orders.length, icon: <IconBell width={20} height={20} />, tab: 'orders' as TabKey },
    { label: lang === 'bn' ? 'গ্যালারি ছবি' : 'Gallery Photos', value: data.gallery.length, icon: <IconImage width={20} height={20} />, tab: 'gallery' as TabKey },
    { label: lang === 'bn' ? 'চলমান অফার' : 'Active Offers', value: data.offers.filter((o) => o.active).length, icon: <IconTag width={20} height={20} />, tab: 'offers' as TabKey },
  ]

  const revenue =
    data.orders.reduce((s, o) => s + o.total, 0) +
    data.bookings.reduce((s, b) => s + b.amount, 0) +
    data.events.reduce((s, e) => s + e.amount, 0)

  const avgRating =
    data.reviews.length > 0 ? data.reviews.reduce((s, r) => s + r.rating, 0) / data.reviews.length : 0

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-brand-950 via-ink-900 to-brand-950">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-wide text-brand-100/55 uppercase">
              {lang === 'bn' ? 'মোট আয় (সব সোর্স)' : 'Total Revenue (all sources)'}
            </p>
            <p className="mt-1 font-display text-3xl font-bold text-gold-300 sm:text-4xl">
              {taka(revenue, lang)}
            </p>
            <p className="mt-1 text-xs text-brand-100/45">
              {lang === 'bn' ? 'অর্ডার + টেবিল বুকিং + ইভেন্ট' : 'Orders + bookings + events'}
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-gold-400/30 bg-ink-950/50 px-5 py-4">
            <IconStar width={22} height={22} fill="#facc15" className="text-gold-400" />
            <div>
              <p className="text-2xl font-bold text-gold-300">{avgRating.toFixed(1)}</p>
              <p className="text-[11px] text-brand-100/50">
                {data.reviews.length} {lang === 'bn' ? 'রিভিউ' : 'reviews'}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((s) => (
          <button
            key={s.label}
            onClick={() => goTab(s.tab)}
            className="rounded-2xl border border-brand-500/15 bg-ink-900/60 p-4 text-left transition hover:border-gold-400/40"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-400/15 text-gold-300">
              {s.icon}
            </span>
            <p className="mt-3 text-2xl font-bold text-brand-50">{s.value}</p>
            <p className="text-[11px] text-brand-100/55">{s.label}</p>
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-gold-300">
            <IconBell width={15} height={15} />
            {lang === 'bn' ? 'সাম্প্রতিক অর্ডার' : 'Recent Orders'}
          </h3>
          {data.orders.length === 0 ? (
            <Empty text={lang === 'bn' ? 'কোনো অর্ডার নেই' : 'No orders yet'} />
          ) : (
            <ul className="space-y-2">
              {data.orders.slice(0, 5).map((o) => (
                <li key={o.id} className="flex items-center justify-between gap-2 rounded-xl bg-ink-950/50 px-3.5 py-2.5 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">#{o.id} · {o.customer}</p>
                    <p className="text-xs text-brand-100/45">{formatDate(o.createdAt, lang)}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="font-bold text-gold-300">{taka(o.total, lang)}</span>
                    <StatusPill status={o.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-gold-300">
            <IconClipboard width={15} height={15} />
            {lang === 'bn' ? 'সাম্প্রতিক বুকিং' : 'Recent Bookings'}
          </h3>
          {data.bookings.length === 0 ? (
            <Empty text={lang === 'bn' ? 'কোনো বুকিং নেই' : 'No bookings yet'} />
          ) : (
            <ul className="space-y-2">
              {data.bookings.slice(0, 5).map((b) => (
                <li key={b.id} className="flex items-center justify-between gap-2 rounded-xl bg-ink-950/50 px-3.5 py-2.5 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{b.name} · {b.guests} {lang === 'bn' ? 'জন' : 'ppl'}</p>
                    <p className="text-xs text-brand-100/45">{b.date} · {formatTime12(b.time, lang)}</p>
                  </div>
                  <StatusPill status={b.status} />
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  )
}

/* ---------------- Menu Manager ---------------- */

const EMPTY_MENU = (): MenuItem => ({
  id: uid('m'),
  nameBn: '',
  nameEn: '',
  descBn: '',
  descEn: '',
  price: 100,
  category: 'biryani',
  badge: '',
  image: '',
  available: true,
})

const SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=900&q=70',
  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=70',
  'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=900&q=70',
  'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=70',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=70',
]

function MenuManager({ patch }: { patch: (fn: (d: AppData) => AppData) => void }) {
  const { lang, data } = useStore()
  const { push } = useToast()
  const [editing, setEditing] = useState<MenuItem | null>(null)
  const [filter, setFilter] = useState('all')

  const items = filter === 'all' ? data.menu : data.menu.filter((m) => m.category === filter)

  const save = () => {
    if (!editing) return
    if (!editing.nameEn.trim() || !editing.nameBn.trim()) {
      push({ kind: 'error', title: lang === 'bn' ? 'নাম দিন (বাংলা ও ইংরেজি)' : 'Name required (both languages)' })
      return
    }
    const exists = data.menu.some((m) => m.id === editing.id)
    patch((d) => ({
      ...d,
      menu: exists ? d.menu.map((m) => (m.id === editing.id ? editing : m)) : [...d.menu, editing],
    }))
    push({ kind: 'success', title: lang === 'bn' ? 'সংরক্ষিত হয়েছে' : 'Saved' })
    setEditing(null)
  }

  const remove = (id: string) => {
    patch((d) => ({ ...d, menu: d.menu.filter((m) => m.id !== id) }))
    push({ kind: 'info', title: lang === 'bn' ? 'মুছে ফেলা হয়েছে' : 'Removed' })
  }

  const updatePrice = (id: string, price: number) => {
    patch((d) => ({ ...d, menu: d.menu.map((m) => (m.id === id ? { ...m, price } : m)) }))
  }

  const updateBadge = (id: string, badge: Badge | '') => {
    patch((d) => ({ ...d, menu: d.menu.map((m) => (m.id === id ? { ...m, badge } : m)) }))
  }

  const toggleAvailable = (id: string) => {
    patch((d) => ({ ...d, menu: d.menu.map((m) => (m.id === id ? { ...m, available: !m.available } : m)) }))
  }

  const bulkPrice = (pct: number) => {
    patch((d) => ({
      ...d,
      menu: d.menu.map((m) => ({ ...m, price: Math.max(10, Math.round(m.price * (1 + pct / 100))) })),
    }))
    push({
      kind: 'success',
      title: lang === 'bn' ? `সব দাম ${pct > 0 ? '+' : ''}${pct}% আপডেট হয়েছে` : `All prices updated ${pct > 0 ? '+' : ''}${pct}%`,
    })
  }

  const BADGES: (Badge | '')[] = ['', 'bestseller', 'hot', 'popular', 'new', 'dessert']

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Select value={filter} onChange={(e) => setFilter(e.target.value)} className="w-auto min-w-40">
          <option value="all">{lang === 'bn' ? 'সব ক্যাটাগরি' : 'All categories'}</option>
          {CATEGORIES.map((c) => (
            <option key={c.key} value={c.key}>
              {c[lang]}
            </option>
          ))}
        </Select>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-brand-100/50">{lang === 'bn' ? 'বাল্ক দাম:' : 'Bulk price:'}</span>
          <DangerButton onClick={() => bulkPrice(-10)}>-10%</DangerButton>
          <DangerButton onClick={() => bulkPrice(10)}>+10%</DangerButton>
        </div>
        <GoldButton className="ml-auto" onClick={() => setEditing(EMPTY_MENU())}>
          <IconPlus width={15} height={15} />
          {lang === 'bn' ? 'নতুন আইটেম' : 'New Item'}
        </GoldButton>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((m) => (
          <Card key={m.id} className={cn(!m.available && 'opacity-50')}>
            <div className="flex gap-3">
              <img src={m.image} alt="" className="h-16 w-16 shrink-0 rounded-xl object-cover" loading="lazy" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{m.nameBn}</p>
                <p className="truncate text-xs text-brand-100/50">{m.nameEn}</p>
                <p className="mt-1 text-xs text-brand-100/40">{CATEGORIES.find((c) => c.key === m.category)?.[lang]}</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <label>
                <Label>{lang === 'bn' ? 'দাম (৳)' : 'Price (৳)'}</Label>
                <Input
                  type="number"
                  value={m.price}
                  onChange={(e) => updatePrice(m.id, Math.max(0, Number(e.target.value)))}
                  className="py-1.5"
                />
              </label>
              <label>
                <Label>{lang === 'bn' ? 'ব্যাজ' : 'Badge'}</Label>
                <Select value={m.badge} onChange={(e) => updateBadge(m.id, e.target.value as Badge | '')} className="py-1.5">
                  {BADGES.map((b) => (
                    <option key={b} value={b}>
                      {b ? BADGE_LABEL[b][lang] : '—'}
                    </option>
                  ))}
                </Select>
              </label>
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              <button
                onClick={() => setEditing(m)}
                className="flex items-center gap-1.5 rounded-lg border border-brand-500/30 px-2.5 py-1.5 text-xs font-semibold text-brand-100/80 transition hover:bg-brand-500/15"
              >
                <IconEye width={13} height={13} />
                {lang === 'bn' ? 'সম্পাদনা' : 'Edit'}
              </button>
              <button
                onClick={() => toggleAvailable(m.id)}
                className="flex items-center gap-1.5 rounded-lg border border-brand-500/30 px-2.5 py-1.5 text-xs font-semibold transition hover:bg-brand-500/15"
              >
                {m.available ? <IconEye width={13} height={13} /> : <IconEyeOff width={13} height={13} />}
                {m.available ? (lang === 'bn' ? 'আছে' : 'Live') : (lang === 'bn' ? 'লুকানো' : 'Hidden')}
              </button>
              <span className="ml-auto">
                <DangerButton onClick={() => remove(m.id)}>
                  <IconTrash width={13} height={13} />
                </DangerButton>
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Editor modal */}
      <Modal open={!!editing} onClose={() => setEditing(null)} title={lang === 'bn' ? 'মেনু আইটেম সম্পাদনা' : 'Edit Menu Item'} wide>
        {editing && (
          <div className="grid gap-3 sm:grid-cols-2">
            <label>
              <Label>{lang === 'bn' ? 'নাম (বাংলা) *' : 'Name (Bangla) *'}</Label>
              <Input value={editing.nameBn} onChange={(e) => setEditing({ ...editing, nameBn: e.target.value })} />
            </label>
            <label>
              <Label>{lang === 'bn' ? 'নাম (ইংরেজি) *' : 'Name (English) *'}</Label>
              <Input value={editing.nameEn} onChange={(e) => setEditing({ ...editing, nameEn: e.target.value })} />
            </label>
            <label>
              <Label>{lang === 'bn' ? 'বর্ণনা (বাংলা)' : 'Description (Bangla)'}</Label>
              <Textarea rows={2} value={editing.descBn} onChange={(e) => setEditing({ ...editing, descBn: e.target.value })} />
            </label>
            <label>
              <Label>{lang === 'bn' ? 'বর্ণনা (ইংরেজি)' : 'Description (English)'}</Label>
              <Textarea rows={2} value={editing.descEn} onChange={(e) => setEditing({ ...editing, descEn: e.target.value })} />
            </label>
            <label>
              <Label>{lang === 'bn' ? 'দাম (৳)' : 'Price (৳)'}</Label>
              <Input type="number" value={editing.price} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} />
            </label>
            <label>
              <Label>{lang === 'bn' ? 'ক্যাটাগরি' : 'Category'}</Label>
              <Select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })}>
                {CATEGORIES.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c[lang]}
                  </option>
                ))}
              </Select>
            </label>
            <label>
              <Label>{lang === 'bn' ? 'ব্যাজ' : 'Badge'}</Label>
              <Select value={editing.badge} onChange={(e) => setEditing({ ...editing, badge: e.target.value as Badge | '' })}>
                {BADGES.map((b) => (
                  <option key={b} value={b}>
                    {b ? BADGE_LABEL[b][lang] : '—'}
                  </option>
                ))}
              </Select>
            </label>
            <label>
              <Label>{lang === 'bn' ? 'ছবির লিংক' : 'Image URL'}</Label>
              <Input value={editing.image} onChange={(e) => setEditing({ ...editing, image: e.target.value })} placeholder="https://..." />
            </label>
            <div className="sm:col-span-2">
              <Label>{lang === 'bn' ? 'নমুনা ছবি' : 'Sample images'}</Label>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_IMAGES.map((url) => (
                  <button
                    key={url}
                    onClick={() => setEditing({ ...editing, image: url })}
                    className={cn(
                      'h-12 w-12 overflow-hidden rounded-lg border-2 transition',
                      editing.image === url ? 'border-gold-400' : 'border-transparent opacity-70 hover:opacity-100'
                    )}
                  >
                    <img src={url} alt="" className="h-full w-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            </div>
            <label className="flex items-center gap-2 sm:col-span-2">
              <input
                type="checkbox"
                checked={editing.available}
                onChange={(e) => setEditing({ ...editing, available: e.target.checked })}
                className="h-4 w-4 accent-gold-400"
              />
              <span className="text-sm text-brand-100/75">{lang === 'bn' ? 'মেনুতে দেখান' : 'Show on menu'}</span>
            </label>
            <div className="flex gap-2 sm:col-span-2">
              <GoldButton onClick={save} className="flex-1">
                <IconCheck width={15} height={15} />
                {lang === 'bn' ? 'সংরক্ষণ করুন' : 'Save'}
              </GoldButton>
              <button
                onClick={() => setEditing(null)}
                className="rounded-xl border border-brand-500/30 px-5 py-2.5 text-sm font-semibold hover:bg-brand-500/10"
              >
                {lang === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

/* ---------------- Gallery Manager ---------------- */

function GalleryManager({ patch }: { patch: (fn: (d: AppData) => AppData) => void }) {
  const { lang, data } = useStore()
  const { push } = useToast()
  const [form, setForm] = useState({ url: '', titleBn: '', titleEn: '', category: 'food' as GalleryItem['category'] })

  const add = () => {
    if (!form.url.trim() || !form.titleBn.trim()) {
      push({ kind: 'error', title: lang === 'bn' ? 'ছবির লিংক ও নাম দিন' : 'URL and title required' })
      return
    }
    patch((d) => ({ ...d, gallery: [{ id: uid('g'), ...form, url: form.url.trim() }, ...d.gallery] }))
    setForm({ url: '', titleBn: '', titleEn: '', category: 'food' })
    push({ kind: 'success', title: lang === 'bn' ? 'ছবি যোগ হয়েছে' : 'Photo added' })
  }

  const remove = (id: string) => {
    patch((d) => ({ ...d, gallery: d.gallery.filter((g) => g.id !== id) }))
    push({ kind: 'info', title: lang === 'bn' ? 'ছবি মুছে ফেলা হয়েছে' : 'Photo removed' })
  }

  return (
    <div className="space-y-5">
      <Card>
        <h3 className="mb-3 text-sm font-bold text-gold-300">
          {lang === 'bn' ? 'নতুন ছবি যোগ করুন' : 'Add New Photo'}
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label>
            <Label>{lang === 'bn' ? 'ছবির লিংক (URL)' : 'Image URL'}</Label>
            <Input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://..." />
          </label>
          <label>
            <Label>{lang === 'bn' ? 'শিরোনাম (বাংলা)' : 'Title (Bangla)'}</Label>
            <Input value={form.titleBn} onChange={(e) => setForm({ ...form, titleBn: e.target.value })} />
          </label>
          <label>
            <Label>{lang === 'bn' ? 'শিরোনাম (ইংরেজি)' : 'Title (English)'}</Label>
            <Input value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} />
          </label>
          <label>
            <Label>{lang === 'bn' ? 'ক্যাটাগরি' : 'Category'}</Label>
            <Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as GalleryItem['category'] })}>
              <option value="interior">{lang === 'bn' ? 'ইন্টেরিয়র' : 'Interior'}</option>
              <option value="food">{lang === 'bn' ? 'খাবার' : 'Food'}</option>
              <option value="event">{lang === 'bn' ? 'ইভেন্ট' : 'Event'}</option>
            </Select>
          </label>
        </div>
        <GoldButton className="mt-3" onClick={add}>
          <IconPlus width={15} height={15} />
          {lang === 'bn' ? 'ছবি যোগ করুন' : 'Add Photo'}
        </GoldButton>
      </Card>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {data.gallery.map((g) => (
          <div key={g.id} className="group relative overflow-hidden rounded-2xl border border-brand-500/15">
            <img src={g.url} alt={g.titleEn} loading="lazy" className="aspect-[4/3] w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950 to-transparent p-2.5">
              <p className="truncate text-xs font-semibold">{lang === 'bn' ? g.titleBn : g.titleEn}</p>
              <p className="text-[10px] text-brand-100/50 capitalize">{g.category}</p>
            </div>
            <button
              onClick={() => remove(g.id)}
              className="absolute top-2 right-2 rounded-full bg-ink-950/80 p-1.5 text-red-400 opacity-0 transition group-hover:opacity-100"
              aria-label="Remove"
            >
              <IconTrash width={13} height={13} />
            </button>
          </div>
        ))}
      </div>
      {data.gallery.length === 0 && <Empty text={lang === 'bn' ? 'কোনো ছবি নেই' : 'No photos'} />}
    </div>
  )
}

/* ---------------- Offers Manager ---------------- */

function OffersManager({ patch }: { patch: (fn: (d: AppData) => AppData) => void }) {
  const { lang, data } = useStore()
  const { push } = useToast()
  const [editing, setEditing] = useState<Offer | null>(null)

  const save = () => {
    if (!editing) return
    if (!editing.titleBn.trim()) {
      push({ kind: 'error', title: lang === 'bn' ? 'শিরোনাম দিন' : 'Title required' })
      return
    }
    const exists = data.offers.some((o) => o.id === editing.id)
    patch((d) => ({
      ...d,
      offers: exists ? d.offers.map((o) => (o.id === editing.id ? editing : o)) : [...d.offers, editing],
    }))
    push({ kind: 'success', title: lang === 'bn' ? 'সংরক্ষিত হয়েছে' : 'Saved' })
    setEditing(null)
  }

  return (
    <div className="space-y-4">
      <GoldButton onClick={() => setEditing({ id: uid('o'), titleBn: '', titleEn: '', descBn: '', descEn: '', code: '', discount: 10, active: true })}>
        <IconPlus width={15} height={15} />
        {lang === 'bn' ? 'নতুন অফার' : 'New Offer'}
      </GoldButton>

      <div className="grid gap-3 sm:grid-cols-2">
        {data.offers.map((o) => (
          <Card key={o.id} className={cn(!o.active && 'opacity-55')}>
            <div className="flex items-start justify-between gap-2">
              <div>
                {o.discount > 0 && (
                  <span className="rounded-full bg-gold-400 px-2 py-0.5 text-[10px] font-extrabold text-ink-950">
                    {o.discount}% {lang === 'bn' ? 'ছাড়' : 'OFF'}
                  </span>
                )}
                <h4 className="mt-1.5 font-bold">{o.titleBn}</h4>
                <p className="text-xs text-brand-100/50">{o.titleEn}</p>
              </div>
              <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold', o.active ? 'bg-brand-400/15 text-brand-300' : 'bg-brand-500/15 text-brand-100/60')}>
                {o.active ? (lang === 'bn' ? 'চালু' : 'Active') : (lang === 'bn' ? 'বন্ধ' : 'Off')}
              </span>
            </div>
            <p className="mt-2 line-clamp-2 text-xs text-brand-100/65">{o.descBn}</p>
            {o.code && <p className="mt-2 font-mono text-xs font-bold tracking-widest text-gold-300">{o.code}</p>}
            <div className="mt-3 flex gap-1.5">
              <button
                onClick={() => setEditing(o)}
                className="flex items-center gap-1.5 rounded-lg border border-brand-500/30 px-2.5 py-1.5 text-xs font-semibold hover:bg-brand-500/15"
              >
                <IconEye width={13} height={13} /> {lang === 'bn' ? 'সম্পাদনা' : 'Edit'}
              </button>
              <button
                onClick={() => patch((d) => ({ ...d, offers: d.offers.map((x) => (x.id === o.id ? { ...x, active: !x.active } : x)) }))}
                className="rounded-lg border border-brand-500/30 px-2.5 py-1.5 text-xs font-semibold hover:bg-brand-500/15"
              >
                {o.active ? (lang === 'bn' ? 'বন্ধ করুন' : 'Disable') : (lang === 'bn' ? 'চালু করুন' : 'Enable')}
              </button>
              <span className="ml-auto">
                <DangerButton onClick={() => patch((d) => ({ ...d, offers: d.offers.filter((x) => x.id !== o.id) }))}>
                  <IconTrash width={13} height={13} />
                </DangerButton>
              </span>
            </div>
          </Card>
        ))}
      </div>
      {data.offers.length === 0 && <Empty text={lang === 'bn' ? 'কোনো অফার নেই' : 'No offers'} />}

      <Modal open={!!editing} onClose={() => setEditing(null)} title={lang === 'bn' ? 'অফার সম্পাদনা' : 'Edit Offer'} wide>
        {editing && (
          <div className="grid gap-3 sm:grid-cols-2">
            <label>
              <Label>{lang === 'bn' ? 'শিরোনাম (বাংলা)' : 'Title (Bangla)'}</Label>
              <Input value={editing.titleBn} onChange={(e) => setEditing({ ...editing, titleBn: e.target.value })} />
            </label>
            <label>
              <Label>{lang === 'bn' ? 'শিরোনাম (ইংরেজি)' : 'Title (English)'}</Label>
              <Input value={editing.titleEn} onChange={(e) => setEditing({ ...editing, titleEn: e.target.value })} />
            </label>
            <label>
              <Label>{lang === 'bn' ? 'বর্ণনা (বাংলা)' : 'Description (Bangla)'}</Label>
              <Textarea rows={2} value={editing.descBn} onChange={(e) => setEditing({ ...editing, descBn: e.target.value })} />
            </label>
            <label>
              <Label>{lang === 'bn' ? 'বর্ণনা (ইংরেজি)' : 'Description (English)'}</Label>
              <Textarea rows={2} value={editing.descEn} onChange={(e) => setEditing({ ...editing, descEn: e.target.value })} />
            </label>
            <label>
              <Label>{lang === 'bn' ? 'কোড' : 'Code'}</Label>
              <Input value={editing.code} onChange={(e) => setEditing({ ...editing, code: e.target.value.toUpperCase() })} />
            </label>
            <label>
              <Label>{lang === 'bn' ? 'ছাড় (%)' : 'Discount (%)'}</Label>
              <Input type="number" value={editing.discount} onChange={(e) => setEditing({ ...editing, discount: Number(e.target.value) })} />
            </label>
            <label className="flex items-center gap-2 sm:col-span-2">
              <input type="checkbox" checked={editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} className="h-4 w-4 accent-gold-400" />
              <span className="text-sm text-brand-100/75">{lang === 'bn' ? 'অফার চালু রাখুন' : 'Offer active'}</span>
            </label>
            <div className="flex gap-2 sm:col-span-2">
              <GoldButton onClick={save} className="flex-1">
                <IconCheck width={15} height={15} />
                {lang === 'bn' ? 'সংরক্ষণ' : 'Save'}
              </GoldButton>
              <button onClick={() => setEditing(null)} className="rounded-xl border border-brand-500/30 px-5 py-2.5 text-sm font-semibold hover:bg-brand-500/10">
                {lang === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

/* ---------------- Notice Manager ---------------- */

function NoticeManager({ patch }: { patch: (fn: (d: AppData) => AppData) => void }) {
  const { lang, data } = useStore()
  const { push } = useToast()
  const [editing, setEditing] = useState<Notice | null>(null)

  const save = () => {
    if (!editing) return
    if (!editing.titleBn.trim()) {
      push({ kind: 'error', title: lang === 'bn' ? 'শিরোনাম দিন' : 'Title required' })
      return
    }
    const exists = data.notices.some((n) => n.id === editing.id)
    patch((d) => ({
      ...d,
      notices: exists ? d.notices.map((n) => (n.id === editing.id ? editing : n)) : [editing, ...d.notices],
    }))
    push({ kind: 'success', title: lang === 'bn' ? 'সংরক্ষিত হয়েছে' : 'Saved' })
    setEditing(null)
  }

  return (
    <div className="space-y-4">
      <GoldButton
        onClick={() =>
          setEditing({
            id: uid('n'),
            titleBn: '',
            titleEn: '',
            bodyBn: '',
            bodyEn: '',
            date: new Date().toISOString().slice(0, 10),
            pinned: false,
          })
        }
      >
        <IconPlus width={15} height={15} />
        {lang === 'bn' ? 'নতুন নোটিশ' : 'New Notice'}
      </GoldButton>

      <div className="space-y-3">
        {data.notices.map((n) => (
          <Card key={n.id}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-bold">{n.titleBn}</h4>
                  {n.pinned && (
                    <span className="rounded-full bg-gold-400/15 px-2 py-0.5 text-[10px] font-bold text-gold-300">
                      {lang === 'bn' ? 'পিন করা' : 'Pinned'}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-brand-100/55">{n.titleEn}</p>
                <p className="mt-2 text-sm text-brand-100/70">{n.bodyBn}</p>
                <p className="mt-2 text-[11px] text-brand-100/35">{n.date}</p>
              </div>
              <div className="flex shrink-0 gap-1.5">
                <button
                  onClick={() => setEditing(n)}
                  className="rounded-lg border border-brand-500/30 p-2 hover:bg-brand-500/15"
                  aria-label="Edit"
                >
                  <IconEye width={13} height={13} />
                </button>
                <DangerButton onClick={() => patch((d) => ({ ...d, notices: d.notices.filter((x) => x.id !== n.id) }))}>
                  <IconTrash width={13} height={13} />
                </DangerButton>
              </div>
            </div>
          </Card>
        ))}
      </div>
      {data.notices.length === 0 && <Empty text={lang === 'bn' ? 'কোনো নোটিশ নেই' : 'No notices'} />}

      <Modal open={!!editing} onClose={() => setEditing(null)} title={lang === 'bn' ? 'নোটিশ সম্পাদনা' : 'Edit Notice'} wide>
        {editing && (
          <div className="grid gap-3 sm:grid-cols-2">
            <label>
              <Label>{lang === 'bn' ? 'শিরোনাম (বাংলা)' : 'Title (Bangla)'}</Label>
              <Input value={editing.titleBn} onChange={(e) => setEditing({ ...editing, titleBn: e.target.value })} />
            </label>
            <label>
              <Label>{lang === 'bn' ? 'শিরোনাম (ইংরেজি)' : 'Title (English)'}</Label>
              <Input value={editing.titleEn} onChange={(e) => setEditing({ ...editing, titleEn: e.target.value })} />
            </label>
            <label className="sm:col-span-2">
              <Label>{lang === 'bn' ? 'বিস্তারিত (বাংলা)' : 'Body (Bangla)'}</Label>
              <Textarea rows={3} value={editing.bodyBn} onChange={(e) => setEditing({ ...editing, bodyBn: e.target.value })} />
            </label>
            <label className="sm:col-span-2">
              <Label>{lang === 'bn' ? 'বিস্তারিত (ইংরেজি)' : 'Body (English)'}</Label>
              <Textarea rows={3} value={editing.bodyEn} onChange={(e) => setEditing({ ...editing, bodyEn: e.target.value })} />
            </label>
            <label className="flex items-center gap-2 sm:col-span-2">
              <input type="checkbox" checked={editing.pinned} onChange={(e) => setEditing({ ...editing, pinned: e.target.checked })} className="h-4 w-4 accent-gold-400" />
              <span className="text-sm text-brand-100/75">{lang === 'bn' ? 'পিন করুন (উপরে দেখাবে)' : 'Pin (show on top)'}</span>
            </label>
            <div className="flex gap-2 sm:col-span-2">
              <GoldButton onClick={save} className="flex-1">
                <IconCheck width={15} height={15} />
                {lang === 'bn' ? 'সংরক্ষণ' : 'Save'}
              </GoldButton>
              <button onClick={() => setEditing(null)} className="rounded-xl border border-brand-500/30 px-5 py-2.5 text-sm font-semibold hover:bg-brand-500/10">
                {lang === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

/* ---------------- Booking Manager ---------------- */

function BookingManager({ patch }: { patch: (fn: (d: AppData) => AppData) => void }) {
  const { lang, data } = useStore()
  const { push } = useToast()
  const [editingPrice, setEditingPrice] = useState(false)
  const [priceDraft, setPriceDraft] = useState(data.settings.tableBookingPrice)

  const setStatus = (id: string, status: 'pending' | 'confirmed' | 'cancelled') => {
    patch((d) => ({ ...d, bookings: d.bookings.map((b) => (b.id === id ? { ...b, status } : b)) }))
    push({ kind: 'success', title: lang === 'bn' ? 'স্ট্যাটাস আপডেট হয়েছে' : 'Status updated' })
  }

  const savePrice = () => {
    patch((d) => ({ ...d, settings: { ...d.settings, tableBookingPrice: Math.max(0, priceDraft) } }))
    push({ kind: 'success', title: lang === 'bn' ? 'বুকিং দাম আপডেট হয়েছে' : 'Booking price updated' })
    setEditingPrice(false)
  }

  return (
    <div className="space-y-4">
      <Card className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs text-brand-100/55">{lang === 'bn' ? 'টেবিল বুকিং দাম (প্রতি জন)' : 'Table booking price (per guest)'}</p>
          {editingPrice ? (
            <div className="mt-1.5 flex items-center gap-2">
              <Input type="number" value={priceDraft} onChange={(e) => setPriceDraft(Number(e.target.value))} className="w-28 py-1.5" />
              <GoldButton onClick={savePrice} className="py-1.5">
                <IconCheck width={14} height={14} />
              </GoldButton>
              <button onClick={() => setEditingPrice(false)} className="rounded-lg border border-brand-500/30 px-2.5 py-1.5 text-xs">
                {lang === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
            </div>
          ) : (
            <button onClick={() => { setPriceDraft(data.settings.tableBookingPrice); setEditingPrice(true) }} className="mt-0.5 flex items-center gap-2 text-2xl font-bold text-gold-300 transition hover:opacity-80">
              {taka(data.settings.tableBookingPrice, lang)}
              <span className="rounded-full bg-brand-500/20 px-2 py-0.5 text-[10px] font-semibold text-brand-200">
                {lang === 'bn' ? 'পরিবর্তন' : 'Change'}
              </span>
            </button>
          )}
        </div>
        <div className="text-right text-xs text-brand-100/50">
          <p>{lang === 'bn' ? 'মোট বুকিং' : 'Total bookings'}: <b className="text-brand-50">{data.bookings.length}</b></p>
          <p className="mt-0.5">
            {lang === 'bn' ? 'মোট মূল্য' : 'Total value'}:{' '}
            <b className="text-gold-300">{taka(data.bookings.reduce((s, b) => s + b.amount, 0), lang)}</b>
          </p>
        </div>
      </Card>

      {data.bookings.length === 0 ? (
        <Empty text={lang === 'bn' ? 'এখনো কোনো টেবিল বুকিং হয়নি' : 'No table bookings yet'} />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-brand-500/15">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-ink-900 text-left text-xs text-brand-100/55">
              <tr>
                <th className="px-4 py-3">{lang === 'bn' ? 'নাম' : 'Name'}</th>
                <th className="px-4 py-3">{lang === 'bn' ? 'মোবাইল' : 'Mobile'}</th>
                <th className="px-4 py-3">{lang === 'bn' ? 'তারিখ ও সময়' : 'Date & Time'}</th>
                <th className="px-4 py-3">{lang === 'bn' ? 'অতিথি' : 'Guests'}</th>
                <th className="px-4 py-3">{lang === 'bn' ? 'পেমেন্ট' : 'Payment'}</th>
                <th className="px-4 py-3">{lang === 'bn' ? 'মূল্য' : 'Amount'}</th>
                <th className="px-4 py-3">{lang === 'bn' ? 'স্ট্যাটাস' : 'Status'}</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-500/10">
              {data.bookings.map((b) => (
                <tr key={b.id} className="bg-ink-950/40">
                  <td className="px-4 py-3 font-semibold">{b.name}</td>
                  <td className="px-4 py-3">
                    <a href={`tel:${b.phone}`} className="flex items-center gap-1.5 text-gold-300/90 hover:text-gold-300">
                      <IconPhone width={12} height={12} />
                      {b.phone}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-brand-100/75">{b.date} · {formatTime12(b.time, lang)}</td>
                  <td className="px-4 py-3">{b.guests}</td>
                  <td className="px-4 py-3 capitalize">{PAYMENT_LABEL[b.payment]?.[lang] ?? b.payment}</td>
                  <td className="px-4 py-3 font-bold text-gold-300">{taka(b.amount, lang)}</td>
                  <td className="px-4 py-3"><StatusPill status={b.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {b.status !== 'confirmed' && (
                        <button onClick={() => setStatus(b.id, 'confirmed')} className="rounded-lg bg-brand-400/15 px-2 py-1 text-[11px] font-bold text-brand-300 hover:bg-brand-400/25">
                          {lang === 'bn' ? 'কনফার্ম' : 'Confirm'}
                        </button>
                      )}
                      {b.status !== 'cancelled' && (
                        <button onClick={() => setStatus(b.id, 'cancelled')} className="rounded-lg bg-red-500/15 px-2 py-1 text-[11px] font-bold text-red-400 hover:bg-red-500/25">
                          {lang === 'bn' ? 'বাতিল' : 'Cancel'}
                        </button>
                      )}
                      <DangerButton onClick={() => patch((d) => ({ ...d, bookings: d.bookings.filter((x) => x.id !== b.id) }))}>
                        <IconTrash width={12} height={12} />
                      </DangerButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

/* ---------------- Event Manager ---------------- */

function EventManager({ patch }: { patch: (fn: (d: AppData) => AppData) => void }) {
  const { lang, data } = useStore()
  const { push } = useToast()
  const [editingPrice, setEditingPrice] = useState(false)
  const [priceDraft, setPriceDraft] = useState(data.settings.partyHallPrice)

  const savePrice = () => {
    patch((d) => ({ ...d, settings: { ...d.settings, partyHallPrice: Math.max(0, priceDraft) } }))
    push({ kind: 'success', title: lang === 'bn' ? 'হল ভাড়া আপডেট হয়েছে' : 'Hall price updated' })
    setEditingPrice(false)
  }

  const typeLabel = (key: string) => {
    const map: Record<string, { bn: string; en: string }> = {
      birthday: { bn: 'বার্থডে পার্টি', en: 'Birthday Party' },
      wedding: { bn: 'বিয়ের অনুষ্ঠান', en: 'Wedding' },
      corporate: { bn: 'কর্পোরেট ইভেন্ট', en: 'Corporate' },
      special: { bn: 'বিশেষ উৎসব', en: 'Special' },
    }
    return map[key]?.[lang] ?? key
  }

  return (
    <div className="space-y-4">
      <Card className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs text-brand-100/55">{lang === 'bn' ? 'পূর্ণ পার্টি হল ভাড়া' : 'Full party hall rental price'}</p>
          {editingPrice ? (
            <div className="mt-1.5 flex items-center gap-2">
              <Input type="number" value={priceDraft} onChange={(e) => setPriceDraft(Number(e.target.value))} className="w-32 py-1.5" />
              <GoldButton onClick={savePrice} className="py-1.5">
                <IconCheck width={14} height={14} />
              </GoldButton>
              <button onClick={() => setEditingPrice(false)} className="rounded-lg border border-brand-500/30 px-2.5 py-1.5 text-xs">
                {lang === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
            </div>
          ) : (
            <button onClick={() => { setPriceDraft(data.settings.partyHallPrice); setEditingPrice(true) }} className="mt-0.5 flex items-center gap-2 text-2xl font-bold text-gold-300 transition hover:opacity-80">
              {taka(data.settings.partyHallPrice, lang)}
              <span className="rounded-full bg-brand-500/20 px-2 py-0.5 text-[10px] font-semibold text-brand-200">
                {lang === 'bn' ? 'পরিবর্তন' : 'Change'}
              </span>
            </button>
          )}
        </div>
        <p className="text-xs text-brand-100/50">
          {lang === 'bn' ? 'মোট ইভেন্ট বুকিং' : 'Total event bookings'}: <b className="text-brand-50">{data.events.length}</b>
        </p>
      </Card>

      {data.events.length === 0 ? (
        <Empty text={lang === 'bn' ? 'এখনো কোনো ইভেন্ট বুকিং হয়নি' : 'No event bookings yet'} />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data.events.map((ev) => (
            <Card key={ev.id}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-bold">{ev.name}</p>
                  <p className="text-xs text-gold-300/90">
                    {typeLabel(ev.type)}
                    {ev.fullRoom ? ` · ${lang === 'bn' ? 'পূর্ণ হল' : 'Full hall'}` : ''}
                  </p>
                </div>
                <DangerButton onClick={() => patch((d) => ({ ...d, events: d.events.filter((x) => x.id !== ev.id) }))}>
                  <IconTrash width={12} height={12} />
                </DangerButton>
              </div>
              <ul className="mt-3 space-y-1 text-xs text-brand-100/65">
                <li className="flex items-center gap-1.5"><IconPhone width={11} height={11} className="text-gold-400" /> {ev.phone}</li>
                <li className="flex items-center gap-1.5"><IconBell width={11} height={11} className="text-gold-400" /> {ev.date}</li>
                <li className="flex items-center gap-1.5"><IconUsers width={11} height={11} className="text-gold-400" /> {ev.guests} {lang === 'bn' ? 'জন' : 'guests'}</li>
              </ul>
              <p className="mt-3 text-lg font-bold text-gold-300">{taka(ev.amount, lang)}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

/* ---------------- Orders Manager ---------------- */

const ORDER_STATUSES = ['placed', 'preparing', 'on-the-way', 'delivered'] as const

function OrdersManager({ patch }: { patch: (fn: (d: AppData) => AppData) => void }) {
  const { lang, data, pushNotification } = useStore()
  const { push } = useToast()
  const [expanded, setExpanded] = useState<string | null>(null)

  const setStatus = (id: string, status: (typeof ORDER_STATUSES)[number]) => {
    const order = data.orders.find((o) => o.id === id)
    patch((d) => ({ ...d, orders: d.orders.map((o) => (o.id === id ? { ...o, status } : o)) }))
    if (order) {
      const statusBn: Record<string, string> = {
        placed: 'নেওয়া হয়েছে',
        preparing: 'রান্না হচ্ছে',
        'on-the-way': 'পথে আছে',
        delivered: 'ডেলিভারি হয়েছে',
      }
      const statusEn: Record<string, string> = {
        placed: 'placed',
        preparing: 'preparing',
        'on-the-way': 'on the way',
        delivered: 'delivered',
      }
      pushNotification({
        kind: 'order',
        titleBn: `অর্ডার #${id} ${statusBn[status]}`,
        titleEn: `Order #${id} ${statusEn[status]}`,
        bodyBn: `${order.customer} — ${taka(order.total, 'bn')}`,
        bodyEn: `${order.customer} — ${taka(order.total, 'en')}`,
      })
    }
    push({ kind: 'success', title: lang === 'bn' ? 'স্ট্যাটাস আপডেট হয়েছে' : 'Status updated' })
  }

  const revenue = useMemo(() => data.orders.reduce((s, o) => s + o.total, 0), [data.orders])

  return (
    <div className="space-y-4">
      <Card className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-brand-100/55">
          {lang === 'bn' ? 'মোট অর্ডার' : 'Total orders'}: <b className="text-base text-brand-50">{data.orders.length}</b>
        </p>
        <p className="text-xs text-brand-100/55">
          {lang === 'bn' ? 'অর্ডার থেকে আয়' : 'Order revenue'}:{' '}
          <b className="text-base text-gold-300">{taka(revenue, lang)}</b>
        </p>
      </Card>

      {data.orders.length === 0 ? (
        <Empty text={lang === 'bn' ? 'এখনো কোনো অর্ডার হয়নি' : 'No orders yet'} />
      ) : (
        <div className="space-y-3">
          {data.orders.map((o) => (
            <Card key={o.id}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-bold">
                    #{o.id} · {o.customer}
                  </p>
                  <p className="text-xs text-brand-100/50">
                    {formatDate(o.createdAt, lang)} · {PAYMENT_LABEL[o.payment]?.[lang]} · {o.phone}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gold-300">{taka(o.total, lang)}</span>
                  <StatusPill status={o.status} />
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {ORDER_STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatus(o.id, s)}
                    className={cn(
                      'rounded-lg border px-2.5 py-1.5 text-[11px] font-bold capitalize transition',
                      o.status === s
                        ? 'border-gold-400 bg-gold-400/15 text-gold-300'
                        : 'border-brand-500/30 text-brand-100/60 hover:bg-brand-500/15'
                    )}
                  >
                    {s.replace('-', ' ')}
                  </button>
                ))}
                <button
                  onClick={() => setExpanded(expanded === o.id ? null : o.id)}
                  className="ml-auto rounded-lg border border-brand-500/30 px-2.5 py-1.5 text-[11px] font-semibold hover:bg-brand-500/15"
                >
                  {expanded === o.id
                    ? lang === 'bn'
                      ? 'লুকান'
                      : 'Hide'
                    : lang === 'bn'
                      ? 'আইটেম দেখুন'
                      : 'View items'}{' '}
                  ({o.items.length})
                </button>
                <DangerButton onClick={() => patch((d) => ({ ...d, orders: d.orders.filter((x) => x.id !== o.id) }))}>
                  <IconTrash width={12} height={12} />
                </DangerButton>
              </div>

              {expanded === o.id && (
                <div className="animate-float-up mt-3 rounded-xl bg-ink-950/60 p-3">
                  <p className="mb-2 text-xs text-brand-100/50">
                    {lang === 'bn' ? 'ঠিকানা' : 'Address'}: {o.address || '—'}
                  </p>
                  <ul className="space-y-1 text-sm">
                    {o.items.map((it) => (
                      <li key={it.id} className="flex justify-between text-brand-100/80">
                        <span>
                          {lang === 'bn' ? it.nameBn : it.nameEn} × {it.qty}
                        </span>
                        <span className="font-semibold">{taka(it.price * it.qty, lang)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

/* ---------------- Reviews Manager ---------------- */

function ReviewsManager({ patch }: { patch: (fn: (d: AppData) => AppData) => void }) {
  const { lang, data } = useStore()

  const avg = data.reviews.length ? data.reviews.reduce((s, r) => s + r.rating, 0) / data.reviews.length : 0

  return (
    <div className="space-y-4">
      <Card className="flex items-center gap-4">
        <span className="font-display text-4xl font-bold text-gold-300">{avg.toFixed(1)}</span>
        <div>
          <StarsStatic value={Math.round(avg)} />
          <p className="mt-1 text-xs text-brand-100/50">
            {data.reviews.length} {lang === 'bn' ? 'রিভিউ মোট' : 'total reviews'}
          </p>
        </div>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {data.reviews.map((r) => (
          <Card key={r.id}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-gold-400 to-gold-600 text-sm font-bold text-ink-950">
                  {r.name.charAt(0).toUpperCase()}
                </span>
                <div>
                  <p className="text-sm font-semibold">{r.name}</p>
                  <p className="text-[11px] text-brand-100/40">{r.date}</p>
                </div>
              </div>
              <DangerButton onClick={() => patch((d) => ({ ...d, reviews: d.reviews.filter((x) => x.id !== r.id) }))}>
                <IconTrash width={12} height={12} />
              </DangerButton>
            </div>
            <div className="mt-2">
              <StarsStatic value={r.rating} />
            </div>
            <p className="mt-2 text-xs leading-relaxed text-brand-100/70">{r.comment}</p>
          </Card>
        ))}
      </div>
      {data.reviews.length === 0 && <Empty text={lang === 'bn' ? 'কোনো রিভিউ নেই' : 'No reviews'} />}
    </div>
  )
}

function StarsStatic({ value }: { value: number }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <IconStar
          key={n}
          width={13}
          height={13}
          fill={n <= value ? '#facc15' : 'none'}
          className={n <= value ? 'text-gold-400' : 'text-brand-500/40'}
        />
      ))}
    </span>
  )
}

/* ---------------- Settings Manager ---------------- */

function SettingsManager({ patch, onReset }: { patch: (fn: (d: AppData) => AppData) => void; onReset: () => void }) {
  const { lang, data } = useStore()
  const { push } = useToast()
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)
  const [info, setInfo] = useState({
    phone: data.settings.phone,
    address: data.settings.address,
    hours: data.settings.hours,
    deliveryCharge: data.settings.deliveryCharge,
  })
  const [pwError, setPwError] = useState('')

  const changePassword = () => {
    if (pw.current !== data.settings.password) {
      setPwError(lang === 'bn' ? 'বর্তমান পাসওয়ার্ড ভুল' : 'Current password is wrong')
      return
    }
    if (pw.next.length < 4) {
      setPwError(lang === 'bn' ? 'নতুন পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে' : 'New password must be at least 4 characters')
      return
    }
    if (pw.next !== pw.confirm) {
      setPwError(lang === 'bn' ? 'নতুন পাসওয়ার্ড মিলছে না' : 'New passwords do not match')
      return
    }
    patch((d) => ({ ...d, settings: { ...d.settings, password: pw.next } }))
    push({ kind: 'success', title: lang === 'bn' ? 'পাসওয়ার্ড পরিবর্তন হয়েছে' : 'Password changed' })
    setPw({ current: '', next: '', confirm: '' })
    setPwError('')
  }

  const saveInfo = () => {
    patch((d) => ({
      ...d,
      settings: {
        ...d.settings,
        phone: info.phone,
        address: info.address,
        hours: info.hours,
        deliveryCharge: Math.max(0, info.deliveryCharge),
      },
    }))
    push({ kind: 'success', title: lang === 'bn' ? 'তথ্য সংরক্ষিত হয়েছে' : 'Info saved' })
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Password */}
      <Card>
        <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-gold-300">
          <IconLock width={15} height={15} />
          {lang === 'bn' ? 'পাসওয়ার্ড পরিবর্তন' : 'Change Password'}
        </h3>
        <div className="space-y-3">
          <label className="block">
            <Label>{lang === 'bn' ? 'বর্তমান পাসওয়ার্ড' : 'Current Password'}</Label>
            <div className="relative">
              <Input
                type={showPw ? 'text' : 'password'}
                value={pw.current}
                onChange={(e) => setPw({ ...pw, current: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-brand-100/45"
                aria-label="Toggle"
              >
                {showPw ? <IconEyeOff width={15} height={15} /> : <IconEye width={15} height={15} />}
              </button>
            </div>
          </label>
          <label className="block">
            <Label>{lang === 'bn' ? 'নতুন পাসওয়ার্ড' : 'New Password'}</Label>
            <Input type={showPw ? 'text' : 'password'} value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} />
          </label>
          <label className="block">
            <Label>{lang === 'bn' ? 'নতুন পাসওয়ার্ড আবার' : 'Confirm New Password'}</Label>
            <Input type={showPw ? 'text' : 'password'} value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} />
          </label>
          {pwError && (
            <p className="flex items-center gap-1.5 text-[11px] font-medium text-red-400">
              <IconAlert width={12} height={12} />
              {pwError}
            </p>
          )}
          <GoldButton onClick={changePassword} className="w-full">
            {lang === 'bn' ? 'পাসওয়ার্ড পরিবর্তন করুন' : 'Change Password'}
          </GoldButton>
        </div>
      </Card>

      {/* Restaurant info */}
      <Card>
        <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-gold-300">
          <IconSettings width={15} height={15} />
          {lang === 'bn' ? 'রেস্টুরেন্ট তথ্য' : 'Restaurant Info'}
        </h3>
        <div className="space-y-3">
          <label className="block">
            <Label>{lang === 'bn' ? 'ফোন নম্বর' : 'Phone Number'}</Label>
            <Input value={info.phone} onChange={(e) => setInfo({ ...info, phone: e.target.value })} />
          </label>
          <label className="block">
            <Label>{lang === 'bn' ? 'ঠিকানা' : 'Address'}</Label>
            <Textarea rows={2} value={info.address} onChange={(e) => setInfo({ ...info, address: e.target.value })} />
          </label>
          <label className="block">
            <Label>{lang === 'bn' ? 'খোলার সময়' : 'Open Hours'}</Label>
            <Input value={info.hours} onChange={(e) => setInfo({ ...info, hours: e.target.value })} />
          </label>
          <label className="block">
            <Label>{lang === 'bn' ? 'ডেলিভারি চার্জ (৳)' : 'Delivery Charge (৳)'}</Label>
            <Input type="number" value={info.deliveryCharge} onChange={(e) => setInfo({ ...info, deliveryCharge: Number(e.target.value) })} />
          </label>
          <GoldButton onClick={saveInfo} className="w-full">
            {lang === 'bn' ? 'সংরক্ষণ করুন' : 'Save Info'}
          </GoldButton>
        </div>
      </Card>

      {/* Danger zone */}
      <Card className="border-red-500/25 lg:col-span-2">
        <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-red-400">
          <IconAlert width={15} height={15} />
          {lang === 'bn' ? 'সতর্কতা অঞ্চল' : 'Danger Zone'}
        </h3>
        <p className="text-xs text-brand-100/60">
          {lang === 'bn'
            ? 'সব অ্যাডমিন পরিবর্তন (মেনু, বুকিং, অর্ডার, গ্যালারি, অফার, নোটিশ) মুছে ডিফল্ট ডেমো ডেটা ফিরিয়ে আনবে। এটি ফেরানো যাবে না।'
            : 'This wipes ALL admin changes (menu, bookings, orders, gallery, offers, notices) and restores the default demo data. This cannot be undone.'}
        </p>
        <button
          onClick={() => {
            if (window.confirm(lang === 'bn' ? 'আপনি কি নিশ্চিত? সব ডেটা রিসেট হবে।' : 'Are you sure? All data will be reset.')) {
              onReset()
            }
          }}
          className="mt-3 flex items-center gap-2 rounded-xl border border-red-500/40 px-4 py-2.5 text-sm font-bold text-red-400 transition hover:bg-red-500/10"
        >
          <IconTrash width={15} height={15} />
          {lang === 'bn' ? 'সব ডেটা রিসেট করুন' : 'Reset All Data'}
        </button>
      </Card>
    </div>
  )
}
