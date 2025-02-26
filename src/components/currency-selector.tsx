"use client"

import type React from "react"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useShop } from "@/contexts/shop.context"
import { cn } from "@/lib/utils"

export const CurrencySelector: React.FC = () => {
  const { shopConfig, selectedCurrency, setSelectedCurrency } = useShop()

  if (!shopConfig || !selectedCurrency) return null

  return (
    <div className="z-50">
      <Select
      
        value={selectedCurrency.code}
        onValueChange={(value) => {
          const currency = shopConfig.acceptedCurrencies.find((curr) => curr.code === value)
          if (currency) {
            setSelectedCurrency(currency)
          }
        }}
      >
        <SelectTrigger className="w-[70px] bg-gray-800 shadow-lg hover:shadow-xl transition-shadow border-none">
          <SelectValue placeholder="Select currency" />
        </SelectTrigger>
        <SelectContent position="popper" className="rounded-lg shadow-xl   bg-white">
          {shopConfig.acceptedCurrencies.map((currency) => (
            <SelectItem
              key={currency.code}
              value={currency.code}
              className={cn(
                "hover:bg-gray-50",
                selectedCurrency.code === currency.code && "bg-gray-50",
              )}
            >
               {currency.code}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}