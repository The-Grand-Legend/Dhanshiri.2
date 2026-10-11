import { useEffect, useState } from 'react'
import { useStore } from '../lib/store'
import { dict } from '../lib/i18n'
import { IconClose, IconDownload } from './ui/Icons'

interface BIPEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function PWAInstall() {
  const { lang } = useStore()
  const [deferred, setDeferred] = useState<BIPEvent | null>(null)
  const [show, setShow] = useState(false)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    const onBIP = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BIPEvent)
      setShow(true)
    }
    const onInstalled = () => {
      setInstalled(true)
      setShow(false)
    }
    window.addEventListener('beforeinstallprompt', onBIP)
    window.addEventListener('appinstalled', onInstalled)
    if (window.matchMedia('(display-mode: standalone)').matches) setInstalled(true)
    return () => {
      window.removeEventListener('beforeinstallprompt', onBIP)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  if (installed || !show || !deferred) return null

  const install = async () => {
    await deferred.prompt()
    const choice = await deferred.userChoice
    if (choice.outcome === 'accepted') setInstalled(true)
    setShow(false)
    setDeferred(null)
  }

  return (
    <div className="animate-float-up ring-soft fixed bottom-20 left-1/2 z-[94] w-[min(92vw,400px)] -translate-x-1/2 rounded-2xl border border-gold-400/30 bg-ink-900/95 p-4 backdrop-blur-xl sm:bottom-6 sm:left-6 sm:translate-x-0">
      <button
        onClick={() => setShow(false)}
        className="absolute top-2 right-2 rounded-full p-1 text-brand-100/50 hover:bg-brand-500/15"
        aria-label="Close"
      >
        <IconClose width={13} height={13} />
      </button>
      <div className="flex items-center gap-3">
        <img src="/icons/icon.svg" alt="" className="h-11 w-11 rounded-xl ring-1 ring-gold-400/40" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-gold-300">
            {lang === 'bn' ? 'ধনশিরি অ্যাপ ইনস্টল করুন' : 'Install Dhanshiri App'}
          </p>
          <p className="text-xs text-brand-100/60">
            {lang === 'bn' ? 'হোম স্ক্রিনে যোগ করে দ্রুত অর্ডার করুন' : 'Add to home screen for quick ordering'}
          </p>
        </div>
        <button
          onClick={install}
          className="flex shrink-0 items-center gap-1.5 rounded-full bg-gold-400 px-3.5 py-2 text-xs font-bold text-ink-950 transition hover:scale-105"
        >
          <IconDownload width={13} height={13} />
          {dict.installApp[lang]}
        </button>
      </div>
    </div>
  )
}
