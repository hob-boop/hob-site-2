'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type CartItem = {
  slug: string
  title: string
  price: number
  image: string | null
  qty: number
}

type CartContextValue = {
  items: CartItem[]
  count: number
  subtotal: number
  addItem: (item: Omit<CartItem, 'qty'>, qty?: number) => void
  updateQty: (slug: string, qty: number) => void
  removeItem: (slug: string) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

const STORAGE_KEY = 'hob-cart'

export function CartProvider({children}: {children: ReactNode}) {
  const [items, setItems] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  // Load whatever was saved from a previous visit, once, on mount.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) setItems(JSON.parse(raw))
    } catch {
      // Corrupt or unavailable storage — start with an empty cart.
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items, hydrated])

  const addItem = useCallback((item: Omit<CartItem, 'qty'>, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.slug === item.slug)
      if (existing) {
        return prev.map((i) => (i.slug === item.slug ? {...i, qty: i.qty + qty} : i))
      }
      return [...prev, {...item, qty}]
    })
  }, [])

  const updateQty = useCallback((slug: string, qty: number) => {
    setItems((prev) =>
      qty <= 0 ? prev.filter((i) => i.slug !== slug) : prev.map((i) => (i.slug === slug ? {...i, qty} : i)),
    )
  }, [])

  const removeItem = useCallback((slug: string) => {
    setItems((prev) => prev.filter((i) => i.slug !== slug))
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const count = items.reduce((n, i) => n + i.qty, 0)
  const subtotal = items.reduce((n, i) => n + i.qty * i.price, 0)

  const value = useMemo(
    () => ({items, count, subtotal, addItem, updateQty, removeItem, clear}),
    [items, count, subtotal, addItem, updateQty, removeItem, clear],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
