"use client"

import { Minus, Plus, X } from "lucide-react"
import Image from "next/image"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

import { cn } from "@/lib/utils"
import { useCart } from "@/contexts/cart.context"
import Link from "next/link"

interface CartDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { items, total, removeItem, updateQuantity } = useCart()

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Carrito de Compras</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-auto py-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-muted-foreground mb-4">Tu carrito está vacío</p>
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Continuar Comprando
                </Button>
              </div>
            ) : (
              <ul className="divide-y">
                {items.map((item) => (
                  <li key={item.product.slug} className="flex py-6 animate-in slide-in-from-right">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border">
                      <Image
                        src={"/placeholder.svg"}
                        alt={item.product.title}
                        width={100}
                        height={100}
                        className="h-full w-full object-contain object-center"
                      />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium">
                          <h3 className="text-sm">{item.product.title}</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-1 opacity-50 hover:opacity-100"
                            onClick={() => removeItem(item.product.slug)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          S/. {item.product.prices[0]?.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex flex-1 items-end justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.product.slug, Math.max(0, item.quantity - 1))}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.product.slug, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-right font-medium">
                          S/. {(item.product.prices[0]?.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t pt-6 space-y-4">
              <div className="flex justify-between text-base font-medium">
                <p>Total</p>
                <p>S/. {total.toFixed(2)}</p>
              </div>
              <div className="space-y-2">
                <Button 
                  className="w-full bg-pink-500 hover:bg-pink-600" 
                  asChild
                  onClick={() => onOpenChange(false)}
                >
                  <Link href="/checkout">COMPRAR</Link>
                </Button>
                <Button variant="outline" className="w-full" onClick={() => onOpenChange(false)}>
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