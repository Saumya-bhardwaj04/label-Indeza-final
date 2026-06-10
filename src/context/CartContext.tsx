'use client'

import { createContext, useContext, useState, useEffect } from 'react'

export type CartItem = {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  size?: string
  selectedSize?: string
  measurements?: {
    bust?:   string
    waist?:  string
    hip?:    string
    height?: string
    sleeve?: string
    notes?:  string
  }
}

type CartContextType = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, qty: number) => void
  clearCart: () => void
  total: number
  count: number
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('label-indeza-cart')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          setItems(parsed)
        } else {
          localStorage.removeItem('label-indeza-cart')
        }
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage:', e)
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated && Array.isArray(items)) {
      localStorage.setItem('label-indeza-cart', JSON.stringify(items))
    }
  }, [items, hydrated])

  const safeItems = Array.isArray(items) ? items : []

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const currentItems = Array.isArray(prev) ? prev : []
      const existing = currentItems.find((i) => i.id === item.id)
      if (existing) {
        return currentItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i
        )
      }
      return [...currentItems, { ...item, quantity: item.quantity || 1 }]
    })
  }

  const removeItem = (id: string) => setItems((prev) => (Array.isArray(prev) ? prev : []).filter((i) => i.id !== id))

  const updateQuantity = (id: string, qty: number) => {
    if (qty === 0) {
      removeItem(id)
      return
    }
    setItems((prev) => (Array.isArray(prev) ? prev : []).map((i) => (i.id === id ? { ...i, quantity: qty } : i)))
  }

  const clearCart = () => setItems([])
  const total = safeItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const count = safeItems.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, total, count }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
