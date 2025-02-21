"use client"

import type React from "react"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useShop } from "@/contexts/shop.context"
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

export const CurrencySelector: React.FC = () => {
  const { shopConfig, selectedCurrency, setSelectedCurrency } = useShop()

  if (!shopConfig || !selectedCurrency) return null

  return (
    <div className="fixed bottom-10 left-10 z-50">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-auto py-2 px-3 text-sm bg-white shadow-lg hover:shadow-xl transition-shadow"
          >
            {selectedCurrency.code}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[170px] p-0 ml-10 rounded-lg shadow-xl border border-gray-200 bg-white" side="top">
          <div className="rounded-md overflow-hidden">
            <div
              className="py-2 px-3 hover:bg-gray-100 cursor-pointer text-sm flex items-center gap-2"
              onClick={() => {
                // Auto location logic would go here
                setSelectedCurrency(shopConfig.defaultCurrency)
              }}
            >
              AUTO LOCATION
            </div>
            {shopConfig.acceptedCurrencies.map((currency) => (
              <div
                key={currency.code}
                className={cn(
                  "py-2 px-3 hover:bg-gray-50  text-sm cursor-pointer flex items-center",
                  selectedCurrency.code === currency.code && "bg-gray-50",
                )}
                onClick={() => setSelectedCurrency(currency)}
              >
                {currency.name} ({currency.code})
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
