import { useStore } from '../lib/store'
import { dict } from '../lib/i18n'
import { formatDate } from '../lib/utils'
import { useToast } from './ui/Toast'
import { IconPin, IconTag } from './ui/Icons'

export function Notices() {
  const { lang, data } = useStore()
  const { push } = useToast()
  const t = (k: string) => dict[k]?.[lang] ?? k

  const activeOffers = data.offers.filter((o) => o.active)
  const sortedNotices = [...data.notices].sort((a, b) => Number(b.pinned) - Number(a.pinned))

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      /* clipboard may be unavailable */
    }
    push({ kind: 'info', title: t('codeCopied'), body: code })
  }

  return (
    <section id="offers" className="relative py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <span className="rounded-full border border-gold-400/40 bg-gold-400/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-gold-300">
            {t('noticeTitle')}
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
            {lang === 'bn' ? (
              <>নোটিশ ও <span className="text-gold-300">বিশেষ অফার</span></>
            ) : (
              <>Notices &amp; <span className="text-gold-300">Special Offers</span></>
            )}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-brand-100/65">{t('noticeSub')}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Offers */}
          <div>
            <h3 className="mb-4 flex items-center gap-2 font-display text-xl font-bold text-gold-300">
              <IconTag width={18} height={18} />
              {t('offersLabel')}
            </h3>
            <div className="space-y-4">
              {activeOffers.map((o) => (
                <article
                  key={o.id}
                  className="relative overflow-hidden rounded-3xl border border-gold-400/30 bg-gradient-to-r from-brand-950 via-ink-900 to-brand-950 p-5"
                >
                  {/* ticket notch decorations */}
                  <span className="absolute -top-3 -left-3 h-6 w-6 rounded-full bg-ink-950" />
                  <span className="absolute -bottom-3 -left-3 h-6 w-6 rounded-full bg-ink-950" />
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      {o.discount > 0 && (
                        <span className="inline-block rounded-full bg-gold-400 px-3 py-0.5 text-xs font-extrabold text-ink-950">
                          {o.discount}% {lang === 'bn' ? 'ছাড়' : 'OFF'}
                        </span>
                      )}
                      <h4 className="mt-2 font-bold text-brand-50">{lang === 'bn' ? o.titleBn : o.titleEn}</h4>
                      <p className="mt-1 max-w-md text-sm text-brand-100/70">{lang === 'bn' ? o.descBn : o.descEn}</p>
                    </div>
                  </div>
                  {o.code && (
                    <button
                      onClick={() => copyCode(o.code)}
                      className="mt-4 flex w-full items-center justify-between rounded-xl border border-dashed border-gold-400/60 bg-ink-950/60 px-4 py-2.5 transition hover:bg-ink-950"
                    >
                      <span className="font-mono text-sm font-bold tracking-[0.2em] text-gold-300">{o.code}</span>
                      <span className="text-xs font-semibold text-brand-100/60">{t('copyCode')}</span>
                    </button>
                  )}
                </article>
              ))}
              {activeOffers.length === 0 && (
                <p className="rounded-2xl border border-brand-500/15 py-8 text-center text-sm text-brand-100/45">
                  {lang === 'bn' ? 'এই মুহূর্তে কোনো অফার নেই' : 'No active offers right now'}
                </p>
              )}
            </div>
          </div>

          {/* Notices */}
          <div>
            <h3 className="mb-4 flex items-center gap-2 font-display text-xl font-bold text-gold-300">
              <IconPin width={18} height={18} />
              {t('noticesLabel')}
            </h3>
            <div className="space-y-4">
              {sortedNotices.map((n) => (
                <article
                  key={n.id}
                  className="rounded-2xl border border-brand-500/15 bg-ink-900/60 p-5 transition hover:border-gold-400/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-bold text-brand-50">{lang === 'bn' ? n.titleBn : n.titleEn}</h4>
                    {n.pinned && (
                      <span className="shrink-0 rounded-full bg-gold-400/15 px-2.5 py-0.5 text-[10px] font-bold text-gold-300">
                        {lang === 'bn' ? 'পিন করা' : 'Pinned'}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-brand-100/70">{lang === 'bn' ? n.bodyBn : n.bodyEn}</p>
                  <p className="mt-3 text-[11px] text-brand-100/40">{formatDate(n.date, lang)}</p>
                </article>
              ))}
              {sortedNotices.length === 0 && (
                <p className="rounded-2xl border border-brand-500/15 py-8 text-center text-sm text-brand-100/45">
                  {lang === 'bn' ? 'কোনো নোটিশ নেই' : 'No notices yet'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
