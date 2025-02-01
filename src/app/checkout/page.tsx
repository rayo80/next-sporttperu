"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Truck, Store } from 'lucide-react'
import { SiteHeader } from "@/components/site-header"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useCart } from "@/contexts/cart.context"


export default function CheckoutPage() {
  const router = useRouter()
  const { items, total } = useCart()
  const [deliveryMethod, setDeliveryMethod] = useState<"shipping" | "pickup">("shipping")
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    newsletter: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const taxAmount = total * 0.18 // 18% IGV
  
  return (
    <>
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid md:grid-cols-[1fr_400px] gap-8">
          {/* Left Column - Form */}
          <div className="space-y-8">
            {/* Contact Section */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Contacto</h2>
              <div className="space-y-4">
                <div>
                  <Input
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email o número de teléfono móvil"
                    className="w-full"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="newsletter"
                    checked={formData.newsletter}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, newsletter: checked as boolean }))
                    }
                  />
                  <label
                    htmlFor="newsletter"
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Enviarme novedades y ofertas por correo electrónico
                  </label>
                </div>
              </div>
            </section>

            {/* Delivery Section */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Entrega</h2>
              <RadioGroup
                value={deliveryMethod}
                onValueChange={(value) => setDeliveryMethod(value as "shipping" | "pickup")}
                className="space-y-4"
              >
                <div>
                  <RadioGroupItem value="shipping" id="shipping" className="peer sr-only" />
                  <Label
                    htmlFor="shipping"
                    className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer peer-data-[state=checked]:border-pink-500"
                  >
                    <Truck className="h-5 w-5" />
                    <div>
                      <div className="font-medium">Envío</div>
                      <div className="text-sm text-muted-foreground">Entrega a domicilio</div>
                    </div>
                  </Label>
                </div>

                <div>
                  <RadioGroupItem value="pickup" id="pickup" className="peer sr-only" />
                  <Label
                    htmlFor="pickup"
                    className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer peer-data-[state=checked]:border-pink-500"
                  >
                    <Store className="h-5 w-5" />
                    <div>
                      <div className="font-medium">Retiro en tienda</div>
                      <div className="text-sm text-muted-foreground">Recoge tu pedido en nuestra tienda</div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>

              {deliveryMethod === "shipping" && (
                <div className="mt-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Nombre (opcional)</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Apellidos</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address">Dirección</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="apartment">Casa, apartamento, etc. (opcional)</Label>
                    <Input
                      id="apartment"
                      name="apartment"
                      value={formData.apartment}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* Right Column - Cart Summary */}
          <div className="bg-gray-50 p-6 rounded-lg space-y-6">
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.product.slug} className="flex gap-4">
                  <div className="relative w-20 h-20 bg-white rounded-lg border overflow-hidden">
                    <div className="absolute top-0 right-0 bg-gray-500 text-white w-5 h-5 flex items-center justify-center rounded-bl-lg text-xs">
                      {item.quantity}
                    </div>
                    <Image
                      src={"/placeholder.svg"}
                      alt={item.product.title}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.product.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.product.vendor}
                    </p>
                  </div>
                  <div className="font-medium">
                    S/ {(item.product.prices[0]?.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center">
                <Input
                  placeholder="Código de descuento"
                  className="rounded-r-none"
                />
                <Button variant="secondary" className="rounded-l-none">
                  Aplicar
                </Button>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>S/ {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>IGV</span>
                <span>S/ {taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium text-lg">
                <span>Total</span>
                <span>S/ {(total + taxAmount).toFixed(2)}</span>
              </div>
            </div>

            <Button className="w-full bg-pink-500 hover:bg-pink-600">
              Confirmar pedido
            </Button>
          </div>
        </div>
      </main>
    </>
  )
}
