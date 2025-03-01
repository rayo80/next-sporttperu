"use client"

import { shippingMethodService } from "@/api/shipping-method"
import { ShippingMethod } from "@/types/shipping-method"
import type React from "react"
import { createContext, useContext, useState, useEffect, useMemo } from "react"
import { useShop } from "./shop.context"


interface ShippingMethodContextType {
  shippingMethods: ShippingMethod[]
  availableShippingMethods: ShippingMethod[]
  isLoading: boolean
  error: string | null
  selectedMethod: ShippingMethod | null
  setSelectedMethod: (method: ShippingMethod | null) => void
}

const ShippingMethodContext = createContext<ShippingMethodContextType | undefined>(undefined)


export const ShippingMethodProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedMethod, setSelectedMethod] = useState<ShippingMethod | null>(null)
  const { selectedCurrency } = useShop()
  
  useEffect(() => {
    const fetchShippingMethods = async () => {
      setIsLoading(true)
      try {
        const methods = await shippingMethodService.getAll()
        setShippingMethods(methods)
      } catch (err) {
        setError("Failed to fetch shipping methods")
        console.error("Error fetching shipping methods:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchShippingMethods()
  }, [])

  const availableShippingMethods = useMemo(() => {
    return shippingMethods.filter((method) =>
      method.prices.some((price) => price.currency.code === selectedCurrency?.code),
    )
  }, [shippingMethods, selectedCurrency])

  return (
    <ShippingMethodContext.Provider
      value={{
        shippingMethods,
        availableShippingMethods,
        isLoading,
        error,
        selectedMethod,
        setSelectedMethod,
      }}
    >
      {children}
    </ShippingMethodContext.Provider>
  )
}

export const useShippingMethod = () => {
  const context = useContext(ShippingMethodContext)
  if (context === undefined) {
    throw new Error("useShippingMethod must be used within a ShippingMethodProvider")
  }
  return context
}
