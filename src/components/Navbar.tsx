import { useEffect, useState } from 'react'
import { useStore } from '../lib/store'
import { dict } from '../lib/i18n'
import { cn } from '../lib/utils'
import { IconBell, IconCart, IconClose, IconMenu, IconPhone } from './ui/Icons'

const LINKS = [
  { href: '#home', key: 'navHome' },
  { href: '#menu', key: 'navMenu' },
  { href: '#gallery', key: 'navGallery' },
  { href: '#party', key: 'navParty' },
  { href: '#reviews', key: 'navReviews' },
  { href: '#contact', key: 'navContact' },
]

interface NavbarProps {
  onOpenCart: () => void
  onOpenNotif: () => void
}

export function Navbar({ onOpenCart, onOpenNotif }: NavbarProps) {
  const { lang, setLang, cartCount, notifications, data } = useStore()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const t = (k: string) => dict[k]?.[lang] ?? k

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-[90] transition-all duration-300',
        scrolled ? 'glass border-b border-brand-500/15 py-2 shadow-lg' : 'bg-transparent py-4'
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-2.5">
          <img src="/icons/icon.svg" alt="Dhanshiri" className="h-10 w-10 rounded-xl ring-1 ring-gold-400/40" />
          <span className="leading-tight">
            <span className="block font-display text-lg font-bold text-gold-300">Dhanshiri</span>
            <span className="hidden text-[10px] tracking-widest text-brand-200/70 uppercase sm:block">
              Restaurant & Party Center
            </span>
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="rounded-full px-3.5 py-2 text-sm font-medium text-brand-100/85 transition hover:bg-brand-500/15 hover:text-gold-300"
              >
                {t(l.key)}
              </a>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <a
            href={`tel:${data.settings.phone.replace(/-/g, '')}`}
            className="hidden items-center gap-1.5 rounded-full border border-gold-400/30 px-3 py-1.5 text-xs font-semibold text-gold-300 transition hover:bg-gold-400/10 xl:flex"
          >
            <IconPhone width={13} height={13} />
            {data.settings.phone}
          </a>

          {/* Language toggle */}
          <div className="flex overflow-hidden rounded-full border border-brand-500/30 text-xs font-bold">
            <button
              onClick={() => setLang('bn')}
              className={cn(
                'px-2.5 py-1.5 transition',
                lang === 'bn' ? 'bg-gold-400 text-ink-950' : 'text-brand-100/80 hover:bg-brand-500/15'
              )}
              aria-pressed={lang === 'bn'}
            >
              বাংলা
            </button>
            <button
              onClick={() => setLang('en')}
              className={cn(
                'px-2.5 py-1.5 transition',
                lang === 'en' ? 'bg-gold-400 text-ink-950' : 'text-brand-100/80 hover:bg-brand-500/15'
              )}
              aria-pressed={lang === 'en'}
            >
              EN
            </button>
          </div>

          {/* Notifications bell */}
          <button
            onClick={onOpenNotif}
            className="relative rounded-full border border-brand-500/30 p-2 text-brand-100 transition hover:bg-brand-500/15"
            aria-label={dict.notifTitle[lang]}
          >
            <IconBell width={17} height={17} />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-400 px-1 text-[10px] font-bold text-ink-950">
                {notifications.length > 9 ? '9+' : notifications.length}
              </span>
            )}
          </button>

          {/* Cart */}
          <button
            onClick={onOpenCart}
            className="relative rounded-full border border-brand-500/30 p-2 text-brand-100 transition hover:bg-brand-500/15"
            aria-label={dict.cartTitle[lang]}
          >
            <IconCart width={17} height={17} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-400 px-1 text-[10px] font-bold text-ink-950">
                {cartCount}
              </span>
            )}
          </button>

          <a
            href="#menu"
            className="hidden rounded-full bg-gradient-to-r from-gold-400 to-gold-500 px-4 py-2 text-sm font-bold text-ink-950 shadow-lg shadow-gold-500/25 transition hover:scale-105 sm:block"
          >
            {t('orderNow')}
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="rounded-full border border-brand-500/30 p-2 text-brand-100 lg:hidden"
            aria-label="Menu"
          >
            {menuOpen ? <IconClose width={17} height={17} /> : <IconMenu width={17} height={17} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="animate-float-up glass mx-3 mt-3 rounded-2xl border border-brand-500/20 p-3 lg:hidden">
          <ul className="grid gap-1">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-xl px-4 py-2.5 text-sm font-medium text-brand-100/90 transition hover:bg-brand-500/15 hover:text-gold-300"
                >
                  {t(l.key)}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#menu"
                onClick={() => setMenuOpen(false)}
                className="mt-1 block rounded-xl bg-gradient-to-r from-gold-400 to-gold-500 px-4 py-2.5 text-center text-sm font-bold text-ink-950"
              >
                {t('orderNow')}
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
