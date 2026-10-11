import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../lib/store'
import { dict } from '../lib/i18n'
import { IconLock, IconShield } from '../components/ui/Icons'
import { AdminPanel } from '../admin/AdminPanel'

const SESSION_KEY = 'dhanshiri_admin_session'

export function Admin() {
  const { lang, data } = useStore()
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === 'ok')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  const login = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === data.settings.password) {
      sessionStorage.setItem(SESSION_KEY, 'ok')
      setAuthed(true)
      setError(false)
    } else {
      setError(true)
      setPassword('')
    }
  }

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-ink-950 via-brand-950 to-ink-950 px-4">
        <div className="pointer-events-none absolute top-1/4 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-brand-600/15 blur-3xl" />
        <form
          onSubmit={login}
          className="animate-pop glass ring-soft relative w-full max-w-sm rounded-3xl border border-brand-500/25 p-8"
        >
          <div className="mb-6 text-center">
            <img src="/icons/icon.svg" alt="" className="mx-auto h-16 w-16 rounded-2xl ring-1 ring-gold-400/40" />
            <h1 className="mt-4 font-display text-2xl font-bold text-gold-300">Admin Panel</h1>
            <p className="mt-1 text-xs text-brand-100/55">
              {lang === 'bn' ? 'ধনশিরি রেস্টুরেন্ট ম্যানেজমেন্ট' : 'Dhanshiri Restaurant Management'}
            </p>
          </div>

          <label className="block">
            <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-brand-100/75">
              <IconLock width={13} height={13} />
              {lang === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError(false)
              }}
              autoFocus
              className={`w-full rounded-xl border bg-ink-950/70 px-4 py-3 text-center text-lg tracking-[0.3em] text-brand-50 outline-none transition focus:border-gold-400/70 focus:ring-2 focus:ring-gold-400/20 ${
                error ? 'border-red-500/60' : 'border-brand-500/25'
              }`}
              placeholder="••••••"
            />
            {error && (
              <p className="mt-2 flex items-center justify-center gap-1.5 text-[11px] font-medium text-red-400">
                <IconShield width={12} height={12} />
                {lang === 'bn' ? 'ভুল পাসওয়ার্ড! আবার চেষ্টা করুন।' : 'Wrong password! Try again.'}
              </p>
            )}
          </label>

          <button
            type="submit"
            className="mt-5 w-full rounded-xl bg-gradient-to-r from-gold-400 to-gold-500 py-3 text-sm font-bold text-ink-950 transition hover:scale-[1.02]"
          >
            {lang === 'bn' ? 'লগ ইন করুন' : 'Log In'}
          </button>

          <p className="mt-6 text-center text-xs text-brand-100/35">
            {lang === 'bn' ? 'ডেমো পাসওয়ার্ড: 202020' : 'Demo password: 202020'}
          </p>

          <div className="mt-4 border-t border-brand-500/15 pt-4 text-center">
            <Link to="/" className="text-xs text-gold-300/80 transition hover:text-gold-300">
              ← {lang === 'bn' ? 'ওয়েবসাইটে ফিরে যান' : 'Back to website'}
            </Link>
          </div>
        </form>
      </div>
    )
  }

  return (
    <AdminPanel
      onLogout={() => {
        sessionStorage.removeItem(SESSION_KEY)
        setAuthed(false)
      }}
    />
  )
}

export { dict }
