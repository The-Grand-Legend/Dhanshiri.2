interface PayIconProps {
  method: 'bkash' | 'nagad' | 'card'
  className?: string
}

/** Simple brand-styled payment method emblems (not official logos). */
export function IconBkash({ method, className = '' }: PayIconProps) {
  if (method === 'card') {
    return (
      <svg viewBox="0 0 64 44" width="72" height="50" className={className} fill="none">
        <rect x="2" y="2" width="60" height="40" rx="6" fill="#0ea5e9" opacity="0.15" stroke="#38bdf8" strokeWidth="2" />
        <rect x="2" y="11" width="60" height="8" fill="#38bdf8" />
        <rect x="9" y="27" width="20" height="5" rx="2.5" fill="#38bdf8" />
        <rect x="34" y="27" width="10" height="5" rx="2.5" fill="#7dd3fc" />
      </svg>
    )
  }
  const color = method === 'bkash' ? '#e2136e' : '#f97316'
  const label = method === 'bkash' ? 'bKash' : 'Nagad'
  return (
    <svg viewBox="0 0 96 44" width="110" height="50" className={className} fill="none">
      <rect x="2" y="2" width="92" height="40" rx="10" fill={color} opacity="0.14" stroke={color} strokeWidth="2" />
      <text
        x="48"
        y="28"
        textAnchor="middle"
        fontFamily="'Plus Jakarta Sans', sans-serif"
        fontSize="17"
        fontWeight="800"
        fill={color}
      >
        {label}
      </text>
    </svg>
  )
}
