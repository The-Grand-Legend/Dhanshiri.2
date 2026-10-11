import { useStore } from '../lib/store'
import { dict } from '../lib/i18n'
import { IconClock, IconExternal, IconMapPin, IconPhone } from './ui/Icons'

const MAP_QUERY = encodeURIComponent('2979+7F9 Haji Market, 5800 Dhaka - Rangpur Hwy, Mokamtola')
const MAPS_EMBED = `https://www.google.com/maps?q=${MAP_QUERY}&output=embed`
const MAPS_DIRECTIONS = `https://www.google.com/maps/dir/?api=1&destination=${MAP_QUERY}`

export function Contact() {
  const { lang, data } = useStore()
  const t = (k: string) => dict[k]?.[lang] ?? k
  const s = data.settings

  return (
    <section id="contact" className="relative py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <span className="rounded-full border border-gold-400/40 bg-gold-400/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-gold-300">
            {t('contactTitle')}
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
            {lang === 'bn' ? (
              <>আমাদের <span className="text-gold-300">খুঁজে নিন</span></>
            ) : (
              <>Find <span className="text-gold-300">Us</span></>
            )}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-brand-100/65">{t('contactSub')}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          {/* Info cards */}
          <div className="space-y-4">
            <InfoCard
              icon={<IconMapPin width={22} height={22} />}
              label={t('address')}
              value={lang === 'bn' ? '২৯৭৯+৭এফ৯ হাজী মার্কেট, ৫৮০০ ঢাকা-রংপুর হাইওয়ে, মোকামতলা' : s.address}
            />
            <InfoCard
              icon={<IconPhone width={22} height={22} />}
              label={t('phone')}
              value={s.phone}
              href={`tel:${s.phone.replace(/-/g, '')}`}
            />
            <InfoCard icon={<IconClock width={22} height={22} />} label={t('openHours')} value={s.hours} />

            <div className="flex flex-wrap gap-2">
              <a
                href={MAPS_DIRECTIONS}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold-400 to-gold-500 px-5 py-3 text-sm font-bold text-ink-950 transition hover:scale-[1.02]"
              >
                <IconExternal width={15} height={15} />
                {t('getDirections')}
              </a>
              <a
                href={`tel:${s.phone.replace(/-/g, '')}`}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-brand-300/40 bg-brand-500/10 px-5 py-3 text-sm font-bold text-brand-100 transition hover:bg-brand-500/20"
              >
                <IconPhone width={15} height={15} />
                {t('callNow')}
              </a>
            </div>
          </div>

          {/* Map */}
          <div className="overflow-hidden rounded-3xl border border-brand-500/20">
            <iframe
              title="Dhanshiri Restaurant Location"
              src={MAPS_EMBED}
              className="h-[340px] w-full grayscale-[35%] lg:h-full"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function InfoCard({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode
  label: string
  value: string
  href?: string
}) {
  const inner = (
    <div className="flex items-start gap-4 rounded-2xl border border-brand-500/15 bg-ink-900/60 p-5 transition hover:border-gold-400/40">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gold-400/15 text-gold-300">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold tracking-wide text-brand-100/50 uppercase">{label}</p>
        <p className="mt-0.5 text-sm leading-relaxed font-medium text-brand-50">{value}</p>
      </div>
    </div>
  )
  return href ? <a href={href}>{inner}</a> : inner
}
