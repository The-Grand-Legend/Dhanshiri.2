import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { AppData, CartLine, Lang, MenuItem, Notification } from '../types'
import { defaultData } from './seed'
import { uid } from './utils'

const DATA_KEY = 'dhanshiri_data_v1'
const CART_KEY = 'dhanshiri_cart_v1'
const LANG_KEY = 'dhanshiri_lang_v1'
const NOTIF_KEY = 'dhanshiri_notifs_v1'

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* quota / private mode - ignore */
  }
}

/** Merge seed defaults into stored data so new seed fields (e.g. new settings) survive upgrades. */
function migrate(stored: AppData | null): AppData {
  const base = defaultData()
  if (!stored) return base
  return {
    ...base,
    ...stored,
    settings: { ...base.settings, ...(stored.settings ?? {}) },
    // keep stored collections as-is (admin may have removed seed rows)
    menu: stored.menu?.length ? stored.menu : base.menu,
    gallery: stored.gallery?.length ? stored.gallery : base.gallery,
    offers: stored.offers ?? base.offers,
    notices: stored.notices ?? base.notices,
    reviews: stored.reviews?.length ? stored.reviews : base.reviews,
    bookings: stored.bookings ?? [],
    orders: stored.orders ?? [],
    events: stored.events ?? [],
  }
}

interface StoreValue {
  lang: Lang
  setLang: (l: Lang) => void
  data: AppData
  setData: (updater: (d: AppData) => AppData) => void
  cart: CartLine[]
  addToCart: (id: string, qty?: number) => void
  setQty: (id: string, qty: number) => void
  clearCart: () => void
  cartCount: number
  cartTotal: number
  notifications: Notification[]
  pushNotification: (n: Omit<Notification, 'id' | 'createdAt'>) => void
  dismissNotification: (id: string) => void
  clearNotifications: () => void
  resetAll: () => void
  priceOf: (item: MenuItem) => number
}

const StoreContext = createContext<StoreValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => loadJSON<Lang>(LANG_KEY, 'bn'))
  const [data, setDataState] = useState<AppData>(() => migrate(loadJSON<AppData | null>(DATA_KEY, null)))
  const [cart, setCart] = useState<CartLine[]>(() => loadJSON<CartLine[]>(CART_KEY, []))
  const [notifications, setNotifications] = useState<Notification[]>(() =>
    loadJSON<Notification[]>(NOTIF_KEY, [])
  )

  useEffect(() => save(DATA_KEY, data), [data])
  useEffect(() => save(CART_KEY, cart), [cart])
  useEffect(() => save(NOTIF_KEY, notifications), [notifications])
  useEffect(() => {
    save(LANG_KEY, lang)
    document.documentElement.lang = lang
    document.body.classList.toggle('bn', lang === 'bn')
  }, [lang])

  const setLang = useCallback((l: Lang) => setLangState(l), [])

  const setData = useCallback((updater: (d: AppData) => AppData) => {
    setDataState((prev) => updater(prev))
  }, [])

  const addToCart = useCallback((id: string, qty = 1) => {
    setCart((prev) => {
      const found = prev.find((l) => l.id === id)
      if (found) return prev.map((l) => (l.id === id ? { ...l, qty: l.qty + qty } : l))
      return [...prev, { id, qty }]
    })
  }, [])

  const setQty = useCallback((id: string, qty: number) => {
    setCart((prev) =>
      qty <= 0 ? prev.filter((l) => l.id !== id) : prev.map((l) => (l.id === id ? { ...l, qty } : l))
    )
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const pushNotification = useCallback((n: Omit<Notification, 'id' | 'createdAt'>) => {
    setNotifications((prev) => [
      { ...n, id: uid('notif'), createdAt: new Date().toISOString() },
      ...prev,
    ].slice(0, 50))
  }, [])

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const clearNotifications = useCallback(() => setNotifications([]), [])

  const resetAll = useCallback(() => {
    setDataState(defaultData())
    setCart([])
    setNotifications([])
  }, [])

  const { cartCount, cartTotal } = useMemo(() => {
    let count = 0
    let total = 0
    for (const line of cart) {
      const item = data.menu.find((m) => m.id === line.id)
      if (!item) continue
      count += line.qty
      total += item.price * line.qty
    }
    return { cartCount: count, cartTotal: total }
  }, [cart, data.menu])

  const priceOf = useCallback(
    (item: MenuItem) => item.price,
    []
  )

  const value: StoreValue = {
    lang,
    setLang,
    data,
    setData,
    cart,
    addToCart,
    setQty,
    clearCart,
    cartCount,
    cartTotal,
    notifications,
    pushNotification,
    dismissNotification,
    clearNotifications,
    resetAll,
    priceOf,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}

/** Small helper for components: translate with active language. */
export function useLang(): [Lang, (l: Lang) => void] {
  const { lang, setLang } = useStore()
  return [lang, setLang]
}
