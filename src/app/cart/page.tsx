"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Pencil, X, Minus, Plus } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useCart } from "@/contexts/cart.context"
import { SiteFooter } from "@/components/site-footer"


export default function CartPage() {
  const { items, total, removeItem, updateQuantity, clearCart } = useCart()
  const [date, setDate] = useState<Date>()
  const [specialInstructions, setSpecialInstructions] = useState("")

  const handleQuantityChange = (slug: string, newQuantity: number) => {
    if (newQuantity >= 0) {
      updateQuantity(slug, newQuantity)
    }
  }

  
  const validUrl = (imagePath: any) => {
    return imagePath ? `${process.env.BASE_IMAGE_URL}/uploads/${imagePath}` : '/default-image.png';
  }

  const handleUpdateCart = () => {
    // In a real app, this would sync with the backend
    console.log("Cart updated")
  }

  return (
    <>
      <SiteHeader />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <h1 className="text-3xl font-bold mb-8">Carrito de Compras</h1>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Tu carrito está vacío</p>
            <Button asChild>
              <Link href="/">Continuar Comprando</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="rounded-lg border overflow-hidden mb-8">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-4">Imagen</th>
                    <th className="text-left p-4">Producto</th>
                    <th className="text-left p-4">Precio</th>
                    <th className="text-left p-4">Cantidad</th>
                    <th className="text-left p-4">Total</th>
                    <th className="text-left p-4">Eliminar</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {items.map((item) => {
                    const price = item.product.prices[0]?.price || 0
                    const itemTotal = price * item.quantity

                    return (
                      <tr key={item.product.slug} className="bg-white">
                        <td className="p-4">
                          <div className="w-24 h-24 relative">
                            <Image
                              src={validUrl(item.product.imageUrls[0])}
                              alt={item.product.title}
                              fill
                              className="object-contain"
                            />
                          </div>
                        </td>
                        <td className="p-4">
                          <h3 className="font-medium">{item.product.title}</h3>
                          {item.product.variants[0]?.color && (
                            <p className="text-sm text-muted-foreground">{item.product.variants[0].color}</p>
                          )}
                        </td>
                        <td className="p-4">S/. {price.toFixed(2)}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleQuantityChange(item.product.slug, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <Input
                              type="number"
                              min="0"
                              value={item.quantity}
                              onChange={(e) =>
                                handleQuantityChange(item.product.slug, Number.parseInt(e.target.value) || 0)
                              }
                              className="w-16 text-center"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleQuantityChange(item.product.slug, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                        <td className="p-4">S/. {itemTotal.toFixed(2)}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => removeItem(item.product.slug)}>
                              <X className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center mb-8">
              <Button asChild variant="outline">
                <Link href="/">CONTINUAR COMPRANDO</Link>
              </Button>
              <div className="flex gap-4">
                <Button variant="outline" onClick={handleUpdateCart}>
                  ACTUALIZAR CARRITO
                </Button>
                <Button variant="outline" onClick={clearCart}>
                  LIMPIAR CARRITO
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="border rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">Fecha de entrega</h2>
                  <div className="space-y-4">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                        >
                          {date ? format(date, "PPP", { locale: es }) : "Escoger una Fecha de entrega"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                          disabled={(date) => date.getDay() === 0 || date.getDay() === 6}
                        />
                      </PopoverContent>
                    </Popover>
                    <p className="text-sm text-muted-foreground">No hacemos delivery los fines de semana</p>
                  </div>
                </div>

                <div className="border rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">Instrucciones especiales para el vendedor</h2>
                  <Textarea
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="Escribe aquí tus instrucciones especiales..."
                    className="min-h-[100px]"
                  />
                </div>
              </div>

              <div className="border rounded-lg p-6 h-fit">
                <h2 className="text-xl font-semibold mb-4">Precio Total</h2>
                <div className="space-y-4">
                  <div className="flex justify-between py-2 border-b">
                    <span>Subtotal</span>
                    <span>S/. {total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b font-medium">
                    <span>Total</span>
                    <span>S/. {total.toFixed(2)}</span>
                  </div>
                  <Button className="w-full bg-pink-500 hover:bg-pink-600">Proceder a pagar</Button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
      <SiteFooter />
    </>
  )
}
