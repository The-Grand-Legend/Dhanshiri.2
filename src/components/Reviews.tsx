import { useEffect, useMemo, useRef, useState } from 'react'
import { useStore } from '../lib/store'
import { dict } from '../lib/i18n'
import { cn, formatDate, todayISO, uid } from '../lib/utils'
import { useToast } from './ui/Toast'
import { Stars } from './ui/Stars'
import { IconChevronLeft, IconChevronRight, IconStar } from './ui/Icons'

export function Reviews() {
  const { lang, data, setData } = useStore()
  const { push } = useToast()
  const t = (k: string) => dict[k]?.[lang] ?? k

  const [page, setPage] = useState(0)
  const [form, setForm] = useState({ name: '', rating: 5, comment: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const timer = useRef<number | null>(null)

  const avg = useMemo(() => {
    if (data.reviews.length === 0) return 0
    return data.reviews.reduce((s, r) => s + r.rating, 0) / data.reviews.length
  }, [data.reviews])

  const perPage = 3
  const pages = Math.max(1, Math.ceil(data.reviews.length / perPage))
  const visible = data.reviews.slice(page * perPage, page * perPage + perPage)

  // Auto-rotate
  useEffect(() => {
    timer.current = window.setInterval(() => setPage((p) => (p + 1) % pages), 6000)
    return () => {
      if (timer.current) window.clearInterval(timer.current)
    }
  }, [pages])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const err: Record<string, string> = {}
    if (!form.name.trim()) err.name = t('nameRequired')
    if (!form.comment.trim()) err.comment = lang === 'bn' ? 'মন্তব্য লিখুন' : 'Write a comment'
    setErrors(err)
    if (Object.keys(err).length) return

    setData((d) => ({
      ...d,
      reviews: [
        {
          id: uid('rv'),
          name: form.name.trim(),
          rating: form.rating,
          comment: form.comment.trim(),
          date: todayISO(),
        },
        ...d.reviews,
      ],
    }))
    push({ kind: 'success', title: t('reviewThanks') })
    setForm({ name: '', rating: 5, comment: '' })
    setPage(0)
  }

  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: data.reviews.filter((r) => r.rating === star).length,
  }))

  return (
    <section id="reviews" className="relative py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <span className="rounded-full border border-gold-400/40 bg-gold-400/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-gold-300">
            {t('reviewsTitle')}
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
            {lang === 'bn' ? (
              <>গ্রাহকদের <span className="text-gold-300">প্রিয় জায়গা</span></>
            ) : (
              <>A Favourite Of Our <span className="text-gold-300">Guests</span></>
            )}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-brand-100/65">{t('reviewsSub')}</p>
        </div>

        {/* Summary + carousel */}
        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          {/* Rating summary */}
          <div className="glass rounded-3xl border border-brand-500/20 p-6 text-center">
            <p className="font-display text-6xl font-bold text-gold-300">{avg.toFixed(1)}</p>
            <div className="mt-2 flex justify-center">
              <Stars value={Math.round(avg)} size={20} />
            </div>
            <p className="mt-2 text-xs text-brand-100/60">
              {data.reviews.length} {lang === 'bn' ? 'রিভিউ ভিত্তিক' : 'based on reviews'}
            </p>
            <div className="mt-5 space-y-1.5">
              {ratingCounts.map(({ star, count }) => {
                const pct = data.reviews.length ? (count / data.reviews.length) * 100 : 0
                return (
                  <div key={star} className="flex items-center gap-2 text-xs">
                    <span className="w-3 text-brand-100/60">{star}</span>
                    <IconStar width={11} height={11} fill="#facc15" className="text-gold-400" />
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-brand-500/20">
                      <div className="h-full rounded-full bg-gold-400 transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-5 text-right text-brand-100/50">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Carousel */}
          <div>
            <div className="relative grid gap-4 sm:grid-cols-3">
              {visible.map((r) => (
                <article
                  key={r.id}
                  className="animate-float-up flex flex-col rounded-3xl border border-brand-500/15 bg-ink-900/60 p-5"
                >
                  <Stars value={r.rating} />
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-brand-100/80">“{r.comment}”</p>
                  <div className="mt-4 flex items-center gap-2.5 border-t border-brand-500/12 pt-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-gold-400 to-gold-600 text-sm font-bold text-ink-950">
                      {r.name.charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{r.name}</p>
                      <p className="text-[11px] text-brand-100/45">{formatDate(r.date, lang)}</p>
                    </div>
                  </div>
                </article>
              ))}
              {visible.length === 0 && (
                <p className="col-span-full py-10 text-center text-sm text-brand-100/50">
                  {lang === 'bn' ? 'এখনো কোনো রিভিউ নেই। প্রথম রিভিউটি আপনারই হতে পারে!' : 'No reviews yet. Be the first!'}
                </p>
              )}
            </div>

            {pages > 1 && (
              <div className="mt-5 flex items-center justify-center gap-3">
                <button
                  onClick={() => setPage((p) => (p - 1 + pages) % pages)}
                  className="rounded-full border border-brand-500/30 p-2 hover:bg-brand-500/15"
                  aria-label="Previous"
                >
                  <IconChevronLeft width={15} height={15} />
                </button>
                <div className="flex gap-1.5">
                  {Array.from({ length: pages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i)}
                      className={cn(
                        'h-2 rounded-full transition-all',
                        i === page ? 'w-6 bg-gold-400' : 'w-2 bg-brand-500/30 hover:bg-brand-500/50'
                      )}
                      aria-label={`Page ${i + 1}`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setPage((p) => (p + 1) % pages)}
                  className="rounded-full border border-brand-500/30 p-2 hover:bg-brand-500/15"
                  aria-label="Next"
                >
                  <IconChevronRight width={15} height={15} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Write review form */}
        <form
          onSubmit={submit}
          className="glass mx-auto mt-12 max-w-2xl rounded-3xl border border-brand-500/20 p-6"
          noValidate
        >
          <h3 className="mb-4 text-center font-display text-xl font-bold text-gold-300">{t('writeReview')}</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-brand-100/75">{t('yourName')}</span>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className={cls(!!errors.name)}
              />
              {errors.name && <p className="mt-1 text-[11px] text-red-400">{errors.name}</p>}
            </label>
            <div>
              <span className="mb-1 block text-xs font-semibold text-brand-100/75">{t('rating')}</span>
              <div className="flex h-[42px] items-center gap-1">
                <Stars value={form.rating} onChange={(v) => setForm((f) => ({ ...f, rating: v }))} size={26} />
                <span className="ml-2 text-sm font-bold text-gold-300">{form.rating}/5</span>
              </div>
            </div>
          </div>
          <label className="mt-3 block">
            <span className="mb-1 block text-xs font-semibold text-brand-100/75">{t('comment')}</span>
            <textarea
              rows={3}
              value={form.comment}
              onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
              className={cls(!!errors.comment)}
            />
            {errors.comment && <p className="mt-1 text-[11px] text-red-400">{errors.comment}</p>}
          </label>
          <button
            type="submit"
            className="mt-4 w-full rounded-xl bg-gradient-to-r from-gold-400 to-gold-500 py-3 text-sm font-bold text-ink-950 transition hover:scale-[1.02] sm:w-auto sm:px-10"
          >
            {t('submitReview')}
          </button>
        </form>
      </div>
    </section>
  )
}

function cls(err?: boolean) {
  return `w-full rounded-xl border bg-ink-950/70 px-3.5 py-2.5 text-sm text-brand-50 outline-none transition focus:border-gold-400/70 focus:ring-2 focus:ring-gold-400/20 ${
    err ? 'border-red-500/60' : 'border-brand-500/25'
  }`
}
