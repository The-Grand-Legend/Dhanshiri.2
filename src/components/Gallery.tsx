import { useState } from 'react'
import { useStore } from '../lib/store'
import { dict } from '../lib/i18n'
import { cn } from '../lib/utils'
import { Modal } from './ui/Modal'
import { IconImage } from './ui/Icons'

const FILTERS = [
  { key: 'all', bn: 'সব', en: 'All' },
  { key: 'interior', bn: 'ইন্টেরিয়র', en: 'Interior' },
  { key: 'food', bn: 'খাবার', en: 'Food' },
  { key: 'event', bn: 'ইভেন্ট', en: 'Events' },
] as const

export function Gallery() {
  const { lang, data } = useStore()
  const [filter, setFilter] = useState<string>('all')
  const [lightbox, setLightbox] = useState<number | null>(null)
  const t = (k: string) => dict[k]?.[lang] ?? k

  const items = filter === 'all' ? data.gallery : data.gallery.filter((g) => g.category === filter)

  const step = (dir: number) => {
    if (lightbox === null) return
    setLightbox((lightbox + dir + items.length) % items.length)
  }

  return (
    <section id="gallery" className="relative py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-10 text-center">
          <span className="rounded-full border border-gold-400/40 bg-gold-400/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-gold-300">
            {t('navGallery')}
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
            {lang === 'bn' ? <>আমাদের <span className="text-gold-300">গ্যালারি</span></> : <>Our <span className="text-gold-300">Gallery</span></>}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-brand-100/65">
            {lang === 'bn'
              ? 'রেস্টুরেন্টের পরিবেশ, খাবার ও ইভেন্টের কিছু মুহূর্ত'
              : 'Moments from our restaurant, food and events'}
          </p>
        </div>

        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                'rounded-full border px-4 py-2 text-xs font-bold transition sm:text-sm',
                filter === f.key
                  ? 'border-gold-400 bg-gold-400 text-ink-950'
                  : 'border-brand-500/30 bg-brand-500/10 text-brand-100/75 hover:border-gold-400/50'
              )}
            >
              {f[lang]}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((g, i) => (
            <button
              key={g.id}
              onClick={() => setLightbox(i)}
              className={cn(
                'group relative overflow-hidden rounded-2xl border border-brand-500/15 transition hover:border-gold-400/50',
                i % 5 === 0 && 'sm:col-span-2 sm:row-span-2'
              )}
            >
              <img
                src={g.url}
                alt={lang === 'bn' ? g.titleBn : g.titleEn}
                loading="lazy"
                className={cn(
                  'h-full w-full object-cover transition duration-700 group-hover:scale-110',
                  i % 5 === 0 ? 'aspect-[4/3] sm:aspect-square' : 'aspect-[4/3]'
                )}
              />
              <span className="absolute inset-0 flex items-end bg-gradient-to-t from-ink-950/90 via-transparent to-transparent p-3 opacity-0 transition group-hover:opacity-100">
                <span className="text-left text-xs font-bold text-gold-300">
                  {lang === 'bn' ? g.titleBn : g.titleEn}
                </span>
              </span>
            </button>
          ))}
          {items.length === 0 && (
            <div className="col-span-full flex flex-col items-center gap-2 py-16 text-brand-100/50">
              <IconImage width={36} height={36} />
              <p className="text-sm">{lang === 'bn' ? 'কোনো ছবি নেই' : 'No photos yet'}</p>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      <Modal open={lightbox !== null} onClose={() => setLightbox(null)} wide>
        {lightbox !== null && items[lightbox] && (
          <figure>
            <img
              src={items[lightbox].url}
              alt={lang === 'bn' ? items[lightbox].titleBn : items[lightbox].titleEn}
              className="w-full rounded-2xl"
            />
            <figcaption className="mt-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-gold-300">
                {lang === 'bn' ? items[lightbox].titleBn : items[lightbox].titleEn}
              </span>
              <span className="flex gap-2">
                <button
                  onClick={() => step(-1)}
                  className="rounded-full border border-brand-500/30 px-3 py-1 text-xs hover:bg-brand-500/15"
                >
                  ←
                </button>
                <span className="self-center text-xs text-brand-100/50">
                  {lightbox + 1} / {items.length}
                </span>
                <button
                  onClick={() => step(1)}
                  className="rounded-full border border-brand-500/30 px-3 py-1 text-xs hover:bg-brand-500/15"
                >
                  →
                </button>
              </span>
            </figcaption>
          </figure>
        )}
      </Modal>
    </section>
  )
}
