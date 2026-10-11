import { createContext, useCallback, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { IconAlert, IconCheck, IconClose, IconInfo } from './Icons'
import { cn } from '../../lib/utils'

type ToastKind = 'success' | 'error' | 'info'

interface ToastItem {
  id: string
  kind: ToastKind
  title: string
  body?: string
}

interface ToastCtx {
  push: (t: { kind?: ToastKind; title: string; body?: string }) => void
}

const Ctx = createContext<ToastCtx | null>(null)

const ICONS: Record<ToastKind, ReactNode> = {
  success: <IconCheck className="text-brand-300" width={22} height={22} />,
  error: <IconAlert className="text-red-400" width={22} height={22} />,
  info: <IconInfo className="text-gold-300" width={22} height={22} />,
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const push = useCallback(
    ({ kind = 'success', title, body }: { kind?: ToastKind; title: string; body?: string }) => {
      const id = `t_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
      setToasts((prev) => [...prev, { id, kind, title, body }])
      window.setTimeout(() => remove(id), 4500)
    },
    [remove]
  )

  return (
    <Ctx.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-4 left-1/2 z-[120] flex w-[min(94vw,420px)] -translate-x-1/2 flex-col gap-2 sm:left-auto sm:right-4 sm:translate-x-0">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={cn(
              'animate-float-up ring-soft flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur-xl',
              t.kind === 'success' && 'border-brand-500/40 bg-brand-950/95',
              t.kind === 'error' && 'border-red-500/40 bg-red-950/95',
              t.kind === 'info' && 'border-gold-500/40 bg-ink-900/95'
            )}
          >
            <span className="mt-0.5 shrink-0">{ICONS[t.kind]}</span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">{t.title}</p>
              {t.body && <p className="mt-0.5 text-xs opacity-80">{t.body}</p>}
            </div>
            <button
              onClick={() => remove(t.id)}
              className="shrink-0 rounded-full p-1 opacity-60 transition hover:bg-white/10 hover:opacity-100"
              aria-label="Close"
            >
              <IconClose width={14} height={14} />
            </button>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  )
}

export function useToast(): ToastCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
