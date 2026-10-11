export function uid(prefix = 'id'): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

export function nowISO(): string {
  return new Date().toISOString()
}

export function formatDate(iso: string, lang: 'bn' | 'en'): string {
  if (!iso) return '—'
  const d = new Date(iso.length <= 10 ? iso + 'T00:00:00' : iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatTime12(t: string, lang: 'bn' | 'en'): string {
  if (!t || !t.includes(':')) return t
  const [hRaw, m] = t.split(':')
  const h = Number(hRaw)
  const suffix = h >= 12 ? (lang === 'bn' ? 'PM' : 'PM') : 'AM'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}:${m} ${suffix}`
}

export function taka(n: number, lang: 'bn' | 'en'): string {
  const num = lang === 'bn'
    ? new Intl.NumberFormat('bn-BD', { maximumFractionDigits: 0 }).format(n)
    : new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n)
  return lang === 'bn' ? `৳${num}` : `৳${num}`
}

export function phoneDigits(s: string): string {
  return s.replace(/[^\d+]/g, '')
}

export function isValidBdPhone(s: string): boolean {
  const d = phoneDigits(s)
  return /^(\+?88)?01[3-9]\d{8}$/.test(d)
}

export function maskPhone(s: string): string {
  const d = phoneDigits(s)
  if (d.length < 8) return d
  return d.slice(0, 5) + '****' + d.slice(-2)
}
