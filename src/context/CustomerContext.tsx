'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Customer = {
  email: string
  name: string
}

type CustomerContextType = {
  customer: Customer | null
  signIn: (email: string, name?: string) => void
  signOut: () => void
  hydrated: boolean
}

const CustomerContext = createContext<CustomerContextType | null>(null)

const STORAGE_KEY = 'label-indeza-customer'

export function CustomerProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) setCustomer(JSON.parse(saved))
    setHydrated(true)
  }, [])

  const signIn = (email: string, name?: string) => {
    const c = { email, name: name || email.split('@')[0] }
    setCustomer(c)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(c))
  }

  const signOut = () => {
    setCustomer(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <CustomerContext.Provider value={{ customer, signIn, signOut, hydrated }}>
      {children}
    </CustomerContext.Provider>
  )
}

export const useCustomer = () => {
  const ctx = useContext(CustomerContext)
  if (!ctx) throw new Error('useCustomer must be used within CustomerProvider')
  return ctx
}
