"use client"

import { useCallback, useState } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { useAddress } from "@/contexts/address.context"
import { Address } from "@/types/address"
import { useAuth } from "@/contexts/auth.context"
import { CartItemModel } from "@/types/cart"


export default function CheckoutPage() {

  interface FormErrors {
    email?: string
    lastName?: string
    address?: string
    city?: string
    region?: string
  }

  const generate_url = (url: string) => {
    return `${process.env.BASE_IMAGE_URL}/uploads/${url}`;
  }

  const defaultImage = (imageUrls: string[]) => {
    return imageUrls && imageUrls.length > 0 && imageUrls[0]
    ? generate_url(imageUrls[0])
    : "/assets/image.png";
  }

  const router = useRouter()
  const { items, total, clearCart } = useCart()
  const itemModels = items.map((i) => new CartItemModel(i));
  const { user, isLoading: isAuthLoading } = useAuth()
  const { addresses, createAddress, getAddresses, updateAddress, isLoading: isAddressLoading } = useAddress()
  const [deliveryMethod, setDeliveryMethod] = useState<"shipping" | "pickup">("shipping")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const tax = total * 0.18 // 18% IGV
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0)
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    region: "",
    postalCode: "",
    phone: "",
    notes: "",
    deliveryDate: "",
    newsletter: false,
  })

  const validateField = useCallback(
    (name: string, value: string): string | undefined => {
      switch (name) {
        case "email":
          return !value || !value.includes("@") ? "Email inválido" : undefined
        case "lastName":
          return !value ? "Apellidos es requerido" : undefined
        case "address":
          return deliveryMethod === "shipping" && !value ? "Dirección es requerida" : undefined
        case "city":
          return deliveryMethod === "shipping" && !value ? "Ciudad es requerida" : undefined
        case "region":
          return deliveryMethod === "shipping" && !value ? "Región es requerida" : undefined
        default:
          return undefined
      }
    },
    [deliveryMethod],
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setFormData((prev) => ({ ...prev, [name]: value }))
      const error = validateField(name, value)
      setFormErrors((prev) => ({ ...prev, [name]: error }))
    },
    [validateField],
  )

  const handleSelectChange = useCallback(
    (name: string, value: string) => {
      setFormData((prev) => ({ ...prev, [name]: value }))
      const error = validateField(name, value)
      setFormErrors((prev) => ({ ...prev, [name]: error }))
    },
    [validateField],
  )

  const handleCheckboxChange = useCallback((checked: boolean) => {
    setFormData((prev) => ({ ...prev, newsletter: checked }))
  }, [])

  const validateForm = useCallback((): boolean => {
    const errors: FormErrors = {}
    let isValid = true

    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key, value)
      if (error) {
        errors[key as keyof FormErrors] = error
        isValid = false
      }
    })

    setFormErrors(errors)
    return isValid
  }, [formData, validateField])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!validateForm()) {
      setIsSubmitting(false)
      toast.error("Por favor, complete todos los campos requeridos")
      return
    }

    try {
      // Simulate API call
      // await new Promise((resolve) => setTimeout(resolve, 2000))
      let shippingAddress: Address

      if (user) {
        // For logged-in users
        if (addresses.length > 0) {
          // Update existing address
          shippingAddress = await updateAddress(addresses[0].id, {
            firstName: formData.firstName,
            lastName: formData.lastName,
            address1: formData.address,
            address2: formData.apartment,
            city: formData.city,
            state: formData.region,
            postalCode: formData.postalCode,
            country: "PE",
            phone: formData.phone,
          })
        } else {
          // Create new address
          shippingAddress = await createAddress({
            customerId: user.id,
            firstName: formData.firstName,
            lastName: formData.lastName,
            address1: formData.address,
            address2: formData.apartment,
            city: formData.city,
            state: formData.region,
            postalCode: formData.postalCode,
            country: "PE",
            phone: formData.phone,
          })
        }
      } else {
        // For guest users
        shippingAddress = await createAddress({
          firstName: formData.firstName,
          lastName: formData.lastName,
          address1: formData.address,
          address2: formData.apartment,
          city: formData.city,
          state: formData.region,
          postalCode: formData.postalCode,
          country: "PE",
          phone: formData.phone,
        })
      }
      // Simulate successful payment
      clearCart()
      toast.success("¡Pago realizado con éxito!")
      router.push("/success") // You would need to create a success page
    } catch (error) {
      toast.error("Error al procesar el pago. Por favor, intente nuevamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid md:grid-cols-[1fr_400px] gap-8">
          {/* Left Column - Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
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
                    name="newsletter"
                    checked={formData.newsletter}
                    onCheckedChange={handleCheckboxChange}
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
                  
                <div className="grid grid-cols-6 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="city">Ciudad</Label>
                    <Input
                      id="city"
                      name="city"
                      type="text"
                      required
                      className={formErrors.city ? "border-red-500" : ""}
                    />
                    {formErrors.city && <p className="text-sm text-red-500 mt-1">{formErrors.city}</p>}
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="region">Región</Label>
                    <Select name="region">
                      <SelectTrigger className={formErrors.region ? "border-red-500" : ""}>
                        <SelectValue placeholder="Seleccionar región" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lima">Lima</SelectItem>
                        <SelectItem value="arequipa">Arequipa</SelectItem>
                        <SelectItem value="cusco">Cusco</SelectItem>
                      </SelectContent>
                    </Select>
                    {formErrors.region && <p className="text-sm text-red-500 mt-1">{formErrors.region}</p>}
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="postalCode">Código postal (opcional)</Label>
                    <Input id="postalCode" name="postalCode" type="text" />
                  </div>
                </div>
                </div>
              )}
            </section>
          </form>

          {/* Right Column - Cart Summary */}
          <div className="bg-gray-50 p-6 rounded-lg space-y-6">
            <div className="space-y-4">
              {itemModels.map((item) => (
                <div key={item.variant.id} className="flex gap-4">
                  <div className="relative w-20 h-20 bg-white rounded-lg border overflow-hidden">
                    <div className="absolute top-0 right-0 bg-gray-500 text-white w-5 h-5 flex items-center justify-center rounded-bl-lg text-xs">
                      {item.quantity}
                    </div>
                    <Image
                      src={defaultImage(item.product?.imageUrls)}
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
                    S/ {(item.variant.prices[0]?.priceAsNumber * item.quantity).toFixed(2)}
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
                <span>S/ {tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium text-lg">
                <span>Total</span>
                <span>S/ {(total + tax).toFixed(2)}</span>
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

