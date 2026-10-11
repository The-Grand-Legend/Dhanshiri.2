import { useStore } from '../lib/store'
import { dict } from '../lib/i18n'
import { IconFacebook, IconInstagram, IconPhone, IconMapPin, IconTiktok, IconYoutube } from './ui/Icons'

export function Footer() {
  const { lang, data } = useStore()
  const t = (k: string) => dict[k]?.[lang] ?? k

  const socials = [
    { href: 'https://facebook.com', label: 'Facebook', icon: <IconFacebook width={18} height={18} /> },
    { href: 'https://instagram.com', label: 'Instagram', icon: <IconInstagram width={18} height={18} /> },
    { href: 'https://youtube.com', label: 'YouTube', icon: <IconYoutube width={18} height={18} /> },
    { href: 'https://tiktok.com', label: 'TikTok', icon: <IconTiktok width={18} height={18} /> },
  ]

  const links = [
    { href: '#home', key: 'navHome' },
    { href: '#menu', key: 'navMenu' },
    { href: '#gallery', key: 'navGallery' },
    { href: '#party', key: 'navParty' },
    { href: '#reviews', key: 'navReviews' },
    { href: '#contact', key: 'navContact' },
  ]

  return (
    <footer className="relative border-t border-brand-500/15 bg-ink-900/80 pt-14 pb-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <img src="/icons/icon.svg" alt="Dhanshiri" className="h-11 w-11 rounded-xl ring-1 ring-gold-400/40" />
              <div>
                <p className="font-display text-lg font-bold text-gold-300">Dhanshiri</p>
                <p className="text-[10px] tracking-widest text-brand-200/60 uppercase">
                  Restaurant &amp; Party Center
                </p>
              </div>
            </div>
            <p className="text-glow mt-4 font-display text-base text-gold-200/90">“{t('footerTagline')}”</p>
            <div className="mt-5 flex gap-2.5">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-500/30 text-brand-100/80 transition hover:border-gold-400/60 hover:bg-gold-400/10 hover:text-gold-300"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-4 text-sm font-bold tracking-wide text-gold-300 uppercase">{t('quickLinks')}</h4>
            <ul className="space-y-2.5">
              {links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm text-brand-100/65 transition hover:text-gold-300">
                    {t(l.key)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-sm font-bold tracking-wide text-gold-300 uppercase">{t('contactTitle')}</h4>
            <ul className="space-y-3 text-sm text-brand-100/65">
              <li className="flex items-start gap-2.5">
                <IconMapPin width={15} height={15} className="mt-0.5 shrink-0 text-gold-400" />
                {lang === 'bn' ? 'মোকামতলা, ঢাকা-রংপুর হাইওয়ে, ৫৮০০' : data.settings.address}
              </li>
              <li>
                <a
                  href={`tel:${data.settings.phone.replace(/-/g, '')}`}
                  className="flex items-center gap-2.5 transition hover:text-gold-300"
                >
                  <IconPhone width={15} height={15} className="shrink-0 text-gold-400" />
                  {data.settings.phone}
                </a>
              </li>
              <li className="text-xs text-brand-100/45">
                {t('openHours')}: {data.settings.hours}
              </li>
            </ul>
          </div>

          {/* Credits */}
          <div>
            <h4 className="mb-4 text-sm font-bold tracking-wide text-gold-300 uppercase">
              {lang === 'bn' ? 'ক্রেডিট' : 'Credits'}
            </h4>
            <div className="space-y-2.5 text-sm text-brand-100/65">
              <p>{t('credit')}</p>
              <p>
                {t('devContact')}
              </p>
              <a
                href="tel:01644059887"
                className="inline-flex items-center gap-2 rounded-full border border-gold-400/40 px-4 py-1.5 text-xs font-semibold text-gold-300 transition hover:bg-gold-400/10"
              >
                <IconPhone width={12} height={12} />
                01644-059887
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-brand-500/12 pt-6 text-xs text-brand-100/40 sm:flex-row">
          <p>
            © {new Date().getFullYear()} Dhanshiri Restaurant &amp; Party Center. {t('rights')}.
          </p>
          <p>
            {t('credit')} · {t('devContact')}
          </p>
        </div>
      </div>
    </footer>
  )
}
