import { useMemo, useState } from 'react'
import { useStore } from '../lib/store'
import { BADGE_LABEL, CATEGORIES, dict } from '../lib/i18n'
import { cn, taka } from '../lib/utils'
import { useToast } from './ui/Toast'
import { IconPlus } from './ui/Icons'
import type { Badge } from '../types'

const BADGE_STYLE: Record<Badge, string> = {
  bestseller: 'bg-gold-400 text-ink-950',
  hot: 'bg-red-500 text-white',
  popular: 'bg-brand-400 text-ink-950',
  new: 'bg-sky-400 text-ink-950',
  dessert: 'bg-pink-400 text-ink-950',
}

export function MenuSection() {
  const { lang, data, addToCart } = useStore()
  const { push } = useToast()
  const [active, setActive] = useState<string>('all')
  const [query, setQuery] = useState('')
  const t = (k: string) => dict[k]?.[lang] ?? k

  const items = useMemo(() => {
    let list = data.menu.filter((m) => m.available)
    if (active !== 'all') list = list.filter((m) => m.category === active)
    const q = query.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (m) =>
          m.nameEn.toLowerCase().includes(q) ||
          m.nameBn.includes(query.trim()) ||
          m.descEn.toLowerCase().includes(q)
      )
    }
    return list
  }, [data.menu, active, query])

  const grouped = useMemo(() => {
    if (active !== 'all' || query.trim()) return [{ key: active, items }]
    return CATEGORIES.map((c) => ({
      key: c.key,
      items: items.filter((m) => m.category === c.key),
    })).filter((g) => g.items.length > 0)
  }, [items, active, query])

  const handleAdd = (id: string, name: string) => {
    addToCart(id)
    push({ kind: 'success', title: t('addedToCart'), body: lang === 'bn' ? name : name })
  }

  return (
    <section id="menu" className="relative py-20">
      <div className="pointer-events-none absolute top-0 left-1/2 h-px w-4/5 -translate-x-1/2 bg-gradient-to-r from-transparent via-brand-500/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-10 text-center">
          <span className="rounded-full border border-gold-400/40 bg-gold-400/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-gold-300">
            {t('menuTitle')}
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold text-brand-50 sm:text-4xl">
            {lang === 'bn' ? <>আমাদের <span className="text-gold-300">স্পেশাল</span> মেনু</> : <>Our Special <span className="text-gold-300">Menu</span></>}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-brand-100/65">{t('menuSub')}</p>
        </div>

        {/* Search */}
        <div className="mx-auto mb-6 max-w-md">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={lang === 'bn' ? 'খাবার খুঁজুন... (যেমন: কাচ্চি, বার্গার)' : 'Search food... (e.g. kacchi, burger)'}
            className="w-full rounded-full border border-brand-500/25 bg-ink-900/70 px-5 py-2.5 text-sm text-brand-50 placeholder:text-brand-100/35 outline-none transition focus:border-gold-400/70 focus:ring-2 focus:ring-gold-400/20"
          />
        </div>

        {/* Category chips */}
        <div className="no-scrollbar mb-10 flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActive('all')}
            className={cn(
              'shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition sm:text-sm',
              active === 'all'
                ? 'border-gold-400 bg-gold-400 text-ink-950'
                : 'border-brand-500/30 bg-brand-500/10 text-brand-100/75 hover:border-gold-400/50'
            )}
          >
            {t('all')}
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              onClick={() => setActive(c.key)}
              className={cn(
                'shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition sm:text-sm',
                active === c.key
                  ? 'border-gold-400 bg-gold-400 text-ink-950'
                  : 'border-brand-500/30 bg-brand-500/10 text-brand-100/75 hover:border-gold-400/50'
              )}
            >
              {c[lang]}
            </button>
          ))}
        </div>

        {/* Grid */}
        {grouped.length === 0 && (
          <p className="py-16 text-center text-brand-100/50">
            {lang === 'bn' ? 'কোনো আইটেম পাওয়া যায়নি।' : 'No items found.'}
          </p>
        )}

        <div className="space-y-14">
          {grouped.map((group) => {
            const cat = CATEGORIES.find((c) => c.key === group.key)
            return (
              <div key={group.key}>
                {grouped.length > 1 && (
                  <h3 className="mb-5 flex items-center gap-3 font-display text-xl font-bold text-gold-300">
                    {cat ? cat[lang] : ''}
                    <span className="h-px flex-1 bg-gradient-to-r from-gold-400/40 to-transparent" />
                    <span className="text-xs font-medium text-brand-100/45">{group.items.length} {t('items')}</span>
                  </h3>
                )}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {group.items.map((item) => (
                    <article
                      key={item.id}
                      className="group flex gap-4 rounded-2xl border border-brand-500/15 bg-ink-900/60 p-3 transition hover:border-gold-400/40 hover:bg-ink-800/70"
                    >
                      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl sm:h-28 sm:w-28">
                        <img
                          src={item.image}
                          alt={lang === 'bn' ? item.nameBn : item.nameEn}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                        />
                        {item.badge && (
                          <span
                            className={cn(
                              'absolute top-1.5 left-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide',
                              BADGE_STYLE[item.badge]
                            )}
                          >
                            {BADGE_LABEL[item.badge]?.[lang] ?? item.badge}
                          </span>
                        )}
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <h4 className="truncate font-semibold text-brand-50">
                          {lang === 'bn' ? item.nameBn : item.nameEn}
                        </h4>
                        <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-brand-100/55">
                          {lang === 'bn' ? item.descBn : item.descEn}
                        </p>
                        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                          <span className="text-lg font-bold text-gold-300">{taka(item.price, lang)}</span>
                          <button
                            onClick={() => handleAdd(item.id, lang === 'bn' ? item.nameBn : item.nameEn)}
                            className="flex items-center gap-1 rounded-full bg-brand-500/20 px-3 py-1.5 text-xs font-bold text-brand-100 transition hover:bg-gold-400 hover:text-ink-950"
                            aria-label={t('addToCart')}
                          >
                            <IconPlus width={13} height={13} />
                            {t('addToCart')}
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
