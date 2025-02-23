"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"

import { paymentProviderService } from "@/api/payment-provider"
import { PaymentProvider } from "@/types/payment-provider"

interface PaymentProviderContextType {
  paymentProviders: PaymentProvider[] | null
  isLoading: boolean
  error: string | null
  setPaymentProvider: (provider: PaymentProvider) => Promise<void>
  refreshPaymentProvider: () => Promise<void>
}

const PaymentProviderContext = createContext<PaymentProviderContextType | undefined>(undefined)

export function PaymentProviderProvider({ children }: { children: React.ReactNode }) {
  const [paymentProviders, setPaymentProvider] = useState<PaymentProvider | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPaymentProvider = useCallback(async () => {


  useEffect(() => {
    fetchPaymentProvider()
  }, [fetchPaymentProvider])

  const updatePaymentProvider = async (provider: PaymentProvider) => {
    try {
      setIsLoading(true)
      setError(null)
      const updatedProvider = await paymentProviderService.updatePaymentProvider(provider.id, provider)
      setPaymentProvider(updatedProvider)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const refreshPaymentProvider = async () => {
    await fetchPaymentProvider()
  }

  return (
    <PaymentProviderContext.Provider
      value={{
        paymentProviders,
        isLoading,
        error,
        setPaymentProvider: updatePaymentProvider,
        refreshPaymentProvider,
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

