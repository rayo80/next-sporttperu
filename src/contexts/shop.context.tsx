"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Currency, ShopConfig } from "@/types/shop"
import { shopService } from "@/api/shop"


interface ShopContextType {
  shopConfig: ShopConfig | null
  isLoading: boolean
  error: string | null
  selectedCurrency: Currency | undefined
  setSelectedCurrency: (currency: Currency) => void
}

const ShopContext = createContext<ShopContextType | undefined>(undefined)

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shopConfig, setShopConfig] = useState<ShopConfig | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | undefined>(undefined)

  useEffect(() => {
    const fetchShopConfig = async () => {
      const shopId = process.env.NEXT_PUBLIC_SHOP_ID
      if (!shopId) {
        setError("Shop ID not configured")
        setIsLoading(false)
        return
      }

      try {
        const config = await shopService.getShopConfig(shopId)
        setShopConfig(config)

        // Set default currency
        const storedCurrencyCode = localStorage.getItem("selectedCurrency")
        const defaultCurrency = storedCurrencyCode
            ? config.acceptedCurrencies.find((c) => c.code === storedCurrencyCode)
            : config.defaultCurrency
        
        setSelectedCurrency(defaultCurrency || config.defaultCurrency)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchShopConfig()
  }, [])

  const handleSetSelectedCurrency = (currency: Currency) => {
    setSelectedCurrency(currency)
    localStorage.setItem("selectedCurrency", currency.code)
  }
  
  return (<ShopContext.Provider 
            value={{ 
                shopConfig, 
                isLoading, 
                error,
                selectedCurrency,
                setSelectedCurrency: handleSetSelectedCurrency,
                }}>
                {children}
        </ShopContext.Provider>)
}

export const useShop = () => {
  const context = useContext(ShopContext)
  if (context === undefined) {
    throw new Error("useShop must be used within a ShopProvider")
  }
  return context
}

