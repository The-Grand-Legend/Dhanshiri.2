import { useState } from 'react'
import { IconStar } from './Icons'
import { cn } from '../../lib/utils'

interface StarsProps {
  value: number
  onChange?: (v: number) => void
  size?: number
}

export function Stars({ value, onChange, size = 16 }: StarsProps) {
  const [hover, setHover] = useState(0)
  const interactive = Boolean(onChange)
  const shown = hover || value

  return (
    <div className="flex items-center gap-0.5" role={interactive ? 'radiogroup' : undefined}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type={interactive ? 'button' : undefined}
          disabled={!interactive}
          onClick={() => onChange?.(n)}
          onMouseEnter={() => interactive && setHover(n)}
          onMouseLeave={() => interactive && setHover(0)}
          className={cn(interactive ? 'cursor-pointer transition hover:scale-110' : 'cursor-default')}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
        >
          <IconStar
            width={size}
            height={size}
            fill={n <= shown ? '#facc15' : 'none'}
            className={n <= shown ? 'text-gold-400' : 'text-brand-500/40'}
          />
        </button>
      ))}
    </div>
  )
}
