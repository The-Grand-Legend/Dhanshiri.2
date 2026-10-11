import { useStore } from '../lib/store'
import { dict } from '../lib/i18n'
import { IconBell, IconCalendar, IconCart, IconClose, IconGift, IconMegaphone } from './ui/Icons'
import type { Notification } from '../types'

interface Props {
  open: boolean
  onClose: () => void
}

const KIND_ICON: Record<Notification['kind'], React.ReactNode> = {
  order: <IconCart width={17} height={17} />,
  booking: <IconCalendar width={17} height={17} />,
  event: <IconGift width={17} height={17} />,
  general: <IconMegaphone width={17} height={17} />,
}

function timeAgo(iso: string, lang: 'bn' | 'en'): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return lang === 'bn' ? 'এইমাত্র' : 'just now'
  if (mins < 60) return lang === 'bn' ? `${mins} মিনিট আগে` : `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return lang === 'bn' ? `${hours} ঘণ্টা আগে` : `${hours}h ago`
  const days = Math.floor(hours / 24)
  return lang === 'bn' ? `${days} দিন আগে` : `${days}d ago`
}

export function Notifications({ open, onClose }: Props) {
  const { lang, notifications, dismissNotification, clearNotifications } = useStore()

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[101]">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <aside className="animate-float-up ring-soft absolute top-0 right-0 flex h-full w-[min(94vw,380px)] flex-col border-l border-brand-500/20 bg-ink-900">
        <header className="flex items-center justify-between border-b border-brand-500/15 px-5 py-4">
          <h3 className="flex items-center gap-2 text-lg font-bold text-gold-300">
            <IconBell width={18} height={18} />
            {dict.notifTitle[lang]}
            {notifications.length > 0 && (
              <span className="rounded-full bg-brand-500/25 px-2 py-0.5 text-xs text-brand-100">
                {notifications.length}
              </span>
            )}
          </h3>
          <div className="flex items-center gap-1">
            {notifications.length > 0 && (
              <button
                onClick={clearNotifications}
                className="rounded-full px-2.5 py-1 text-xs text-brand-100/50 transition hover:bg-brand-500/15 hover:text-red-400"
              >
                {lang === 'bn' ? 'সব মুছুন' : 'Clear all'}
              </button>
            )}
            <button onClick={onClose} className="rounded-full p-2 hover:bg-brand-500/15" aria-label="Close">
              <IconClose width={16} height={16} />
            </button>
          </div>
        </header>

        <div className="flex-1 space-y-2.5 overflow-y-auto px-4 py-4">
          {notifications.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-500/10 text-brand-300">
                <IconBell width={28} height={28} />
              </span>
              <p className="text-sm text-brand-100/50">{dict.notifEmpty[lang]}</p>
            </div>
          ) : (
            notifications.map((n) => (
              <article
                key={n.id}
                className="group relative flex gap-3 rounded-2xl border border-brand-500/15 bg-ink-950/50 p-3.5"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-400/15 text-gold-300">
                  {KIND_ICON[n.kind]}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-brand-50">
                    {lang === 'bn' ? n.titleBn : n.titleEn}
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-brand-100/65">
                    {lang === 'bn' ? n.bodyBn : n.bodyEn}
                  </p>
                  <p className="mt-1.5 text-[10px] text-brand-100/35">{timeAgo(n.createdAt, lang)}</p>
                </div>
                <button
                  onClick={() => dismissNotification(n.id)}
                  className="absolute top-2 right-2 rounded-full p-1 opacity-0 transition group-hover:opacity-100 hover:bg-brand-500/20"
                  aria-label="Dismiss"
                >
                  <IconClose width={12} height={12} />
                </button>
              </article>
            ))
          )}
        </div>
      </aside>
    </div>
  )
}
