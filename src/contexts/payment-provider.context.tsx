"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"

import { paymentProviderService } from "@/api/payment-provider"
import { PaymentProvider } from "@/types/payment-provider"

interface PaymentProviderContextType {
  paymentProviders: PaymentProvider[] | null
  isLoading: boolean
  error: string | null
  updatePaymentProvider: (providerId: string, data: Partial<PaymentProvider>) => Promise<void>
  refreshPaymentProviders: () => Promise<void>
  getProvidersByCurrency: (currencyCode: string | undefined) => PaymentProvider[]
}

const PaymentProviderContext = createContext<PaymentProviderContextType | undefined>(undefined)

export function PaymentProviderProvider({ children }: { children: React.ReactNode }) {
  const [paymentProviders, setPaymentProviders] = useState<PaymentProvider[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPaymentProviders = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const providers = await paymentProviderService.getPaymentProviders()
      setPaymentProviders(providers)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPaymentProviders()
  }, [fetchPaymentProviders])

  const updatePaymentProvider = async (providerId: string, data: Partial<PaymentProvider>) => {
    try {
      setIsLoading(true)
      setError(null)
      const updatedProvider = await paymentProviderService.updatePaymentProvider(providerId, data)
      setPaymentProviders((prevProviders) =>
        prevProviders.map((provider) => (provider.id === providerId ? updatedProvider : provider)),
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const refreshPaymentProviders = async () => {
    await fetchPaymentProviders()
  }

  const getProvidersByCurrency = (currencyCode: string) => {
    return paymentProviders?.filter((provider) => provider.currency.code === currencyCode)
  }

  return (
    <PaymentProviderContext.Provider
      value={{
        paymentProviders,
        isLoading,
        error,
        updatePaymentProvider,
        refreshPaymentProviders,
        getProvidersByCurrency,
      }}
    >
      {children}
    </PaymentProviderContext.Provider>
  )
}

export function usePaymentProvider() {
  const context = useContext(PaymentProviderContext)
  if (context === undefined) {
    throw new Error("usePaymentProvider must be used within a PaymentProviderProvider")
  }
  return context
}