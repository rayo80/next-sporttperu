"use client"

import { Minus, Plus, X } from "lucide-react"
import Image from "next/image"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

import { cn } from "@/lib/utils"
import { useCart } from "@/contexts/cart.context"
import Link from "next/link"
import { CartItem, CartItemModel } from "@/types/cart"
import { VariantPrice, VariantPriceModel } from "@/types/product"
import { useShop } from "@/contexts/shop.context"
import { get } from "http"

interface CartDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const generate_url = (url: string) => {
  return `${process.env.BASE_IMAGE_URL}/uploads/${url}`;
}


export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { selectedCurrency } = useShop()
  const { items, total, removeItem, updateQuantity } = useCart()
  const itemModels = items.map((i) => new CartItemModel(i));


  const getPrice = (item: CartItemModel) => {
    const priceObject = item.variant.prices.find((p: VariantPrice) => p.currency.code === selectedCurrency?.code)
    const price = Number.parseFloat(priceObject?.price || "0")
    return price
  }

  const getTotalItem = (item: CartItemModel) => {
    return getPrice(item) * item.quantity
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Carrito de Compras</SheetTitle>
          <SheetDescription className="sr-only">
            Modifica tu items aqui.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col h-[98%]">
          <div className="flex-1 overflow-auto py-3">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-muted-foreground mb-4">Tu carrito está vacío</p>
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Continuar Comprando
                </Button>
              </div>
            ) : (
              <ul className="divide-y">
                {itemModels.map((item) => (
                  <li key={item.variant.id} className="flex py-4 animate-in slide-in-from-right">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border">
                      <Image
                        src={generate_url(item.product.imageUrls[0])}
                        alt={item.product.title}
                        width={100}
                        height={100}
                        className="h-full w-full object-contain object-center"
                      />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium">
                          <h3 className="text-sm">{item.variant.title}</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-1 opacity-50 hover:opacity-100"
                            onClick={() => removeItem(item.variant.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {selectedCurrency?.symbol} {getTotalItem(item).toFixed(2)}
                        </p>
                      </div>
                      <div className="flex flex-1 items-end justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.variant.id, Math.max(0, item.quantity - 1))}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.variant.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-right font-medium">
                          {selectedCurrency?.symbol} {getTotalItem(item).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t pt-6 space-y-3">
              <div className="flex justify-between text-base font-medium">
                <p>Total</p>
                <p>{selectedCurrency?.symbol} {total.toFixed(2)}</p>
              </div>
              <div className="space-y-2">
                <Button 
                  className="w-full bg-pink-500 hover:bg-pink-600" 
                  asChild
                  onClick={() => onOpenChange(false)}
                >
                  <Link href="/checkout">COMPRAR</Link>
                </Button>
                <Button variant="outline"
                  asChild
                  className="w-full" 
                  onClick={() => onOpenChange(false)}>
                  <Link href="/cart">VER CARRITO</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}