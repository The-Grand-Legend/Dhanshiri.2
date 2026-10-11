import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { IconClose } from './Icons'
import { cn } from '../../lib/utils'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  wide?: boolean
}

export function Modal({ open, onClose, title, children, wide }: ModalProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[110] flex items-end justify-center sm:items-center" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div
        className={cn(
          'animate-pop ring-soft relative max-h-[92vh] w-full overflow-y-auto rounded-t-3xl border border-brand-500/20 bg-ink-900 p-5 sm:rounded-3xl sm:p-6',
          wide ? 'sm:max-w-3xl' : 'sm:max-w-md'
        )}
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          {title && <h3 className="text-lg font-bold text-gold-300">{title}</h3>}
          <button
            onClick={onClose}
            className="ml-auto rounded-full border border-brand-500/30 p-1.5 transition hover:bg-brand-500/10"
            aria-label="Close"
          >
            <IconClose width={16} height={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
