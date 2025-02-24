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
import { CartItem, CartItemModel } from "@/types/cart"
import Link from "next/link"
import { CreateCustomerDto } from "@/types/customer"
import { useOrder } from "@/contexts/order.context"
import { mercadopagoService } from "@/api/mercado-pago"
import { VariantPrice, VariantPriceModel } from "@/types/product"
import { useShop } from "@/contexts/shop.context"
import { usePaymentProvider } from "@/contexts/payment-provider.context"
import { PaymentProvider, PaymentProviderType } from "@/types/payment-provider"

interface FormErrors {
  email?: string
  lastName?: string
  address1?: string
  city?: string
  province?: string
  phone?: string
}
const generateUrl = (url: string) => {
  return `${process.env.NEXT_PUBLIC_API}/uploads/${url}`;
}

const defaultImage = (imageUrls: string[]) => {
  return imageUrls && imageUrls.length > 0 && imageUrls[0]
  ? generateUrl(imageUrls[0])
  : "/assets/image.png";
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items: cartItems, total, clearCart } = useCart()
  const { createOrderFromCart } = useOrder()
  const itemModels = cartItems.map((i) => new CartItemModel(i));
  const { customer, isLoading: isAuthLoading } = useAuth()
  const [deliveryMethod, setDeliveryMethod] = useState<"shipping" | "pickup">("shipping")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const tax = total * 0.18 // 18% IGV
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  
  const [formData, setFormData] = useState<CreateCustomerDto>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    acceptsMarketing: false,
    addresses: [
      {
        company: "",
        address1: "",
        address2: "",
        city: "",
        province: "",
        zip: "",
        country: "PE",
        phone: "",
      },
    ]
  })

  const { paymentProviders, isLoading: isLoadingProviders, getProvidersByCurrency } = usePaymentProvider()
  const { selectedCurrency } = useShop()
  const [ selectedPaymentIdProvider, setSelectedPaymentIdProvider] = useState<string | null>(null)

  // Filtrar proveedores de pago por la moneda seleccionada
  const availablePaymentProviders = getProvidersByCurrency(selectedCurrency?.code)

  const selectPaymentById = (selectedPaymentIdProvider: string) => { 
    console.log("selectedPaymentIdProvider", selectedPaymentIdProvider)
    setSelectedPaymentIdProvider(selectedPaymentIdProvider)
    const provider = availablePaymentProviders.find((p) => p.id === selectedPaymentIdProvider)
    if (provider) {
      setPaymentMethod(provider)
    } 
  }

  const getPrice = (item: CartItemModel) => {
    const priceObject = item.variant.prices.find((p: VariantPriceModel) => p.currency.code === selectedCurrency?.code)
    const price = Number.parseFloat(priceObject?.price || "0")
    return price
  }

  const [orderDetails, setOrderDetails] = useState({
    customerNotes: "",
    preferredDeliveryDate: "",
  })
  const [paymentMethod, setPaymentMethod] = useState<PaymentProvider | null>(null)

  const validateField = useCallback(
    (name: string, value: string): string | undefined => {
      switch (name) {
        case "email":
          return !value || !value.includes("@") ? "Email inválido" : undefined
        case "lastName":
          return !value ? "Apellidos es requerido" : undefined
        case "address1":
          return deliveryMethod === "shipping" && !value ? "Dirección es requerida" : undefined
        case "city":
          return deliveryMethod === "shipping" && !value ? "Ciudad es requerida" : undefined
        case "province":
          return deliveryMethod === "shipping" && !value ? "Región es requerida" : undefined
        case "phone":
          return !value ? "Teléfono es requerido" : undefined
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

  
  const handleAddressChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setFormData((prev) => ({
        ...prev,
        addresses: [
          {
            ...prev.addresses[0],
            [name]: value,
          },
        ],
      }))
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
      // console.log("paymentMethod", paymentMethod?.name)
      // console.log("selectedPaymentProvider", selectedPaymentIdProvider)
      if (paymentMethod?.type === PaymentProviderType.MERCADO_PAGO) {
        // Create MercadoPago preference
        const itemsPref = cartItems.map((item) => ({
          id: item.variant.id,
          title: item.product.title,
          unit_price: Number(item.variant.prices[0]?.price || 0),
          quantity: item.quantity,
        }))
        
        const init_point = await mercadopagoService.createPreference(
          itemsPref,
          formData,
        )
        
        // Redirect to MercadoPago payment page
        window.location.href = init_point
      } else {
        // Proceed with other payment methods (create order directly)
          const order = await createOrderFromCart({ items: cartItems, total }, formData)
        
          toast.success("¡Orden creada con éxito!")
          clearCart()
          router.push(`/order-confirmation/${order.id}`)
      }
      // const order = await createOrderFromCart({ items, total }, formData)

      // toast.success("¡Orden creada con éxito!")
      // clearCart()
      // router.push(`/order-confirmation/${order.id}`)
    } catch (error) {
      console.log("Error creating order:", error)
      toast.error(error instanceof Error ? error.message : "Error al crear la orden. Por favor, inténtelo de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isAuthLoading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid md:grid-cols-[1fr_400px] gap-8">
          {/* Left Column - Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Contact Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Contacto</h2>
                {!customer && (
                  <div className="text-sm">
                    ¿Ya tienes una cuenta?{" "}
                    <Link href="/login" className="text-pink-500 hover:text-pink-600">
                      Iniciar sesión
                    </Link>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <div>
                  <Input
                    type="email"
                    name="email"
                    value={customer ? customer.email : formData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    className={`w-full ${formErrors.email ? "border-red-500" : ""}`}
                    required
                    disabled={!!customer}
                  />
                  {formErrors.email && <p className="text-sm text-red-500 mt-1">{formErrors.email}</p>}
                </div>
                <div>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Teléfono"
                    className={`w-full ${formErrors.phone ? "border-red-500" : ""}`}
                    required
                  />
                  {formErrors.phone && <p className="text-sm text-red-500 mt-1">{formErrors.phone}</p>}
                </div>
                {/* <div className="flex items-center space-x-2">
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
                </div> */}
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

            {/* Shipping Address */}
            {deliveryMethod === "shipping" && (
              <section className="space-y-4">
                {customer && customer.addresses.length > 0 && (
                  <div>
                    <Label htmlFor="savedAddress">Dirección guardada</Label>
                    <Select
                      name="savedAddress"
                      value={selectedAddressId || ""}
                      onValueChange={(value) => {
                        setSelectedAddressId(value)
                        const selectedAddress = customer.addresses.find((addr) => addr.id === value)
                        if (selectedAddress) {
                          setFormData((prevData) => ({
                            ...prevData,
                            addresses: [selectedAddress],
                          }))
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar dirección guardada" />
                      </SelectTrigger>
                      <SelectContent>
                        {customer.addresses.map((address) => (
                          <SelectItem key={address.id} value={address.id}>
                            {address.address1}, {address.city}
                          </SelectItem>
                        ))}
                        <SelectItem value="new">Agregar nueva dirección</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <Label htmlFor="country">País / Región</Label>
                  <Select name="country" defaultValue="PE">
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar país" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PE">Perú</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Nombre</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={customer ? customer.firstName : formData.firstName}
                      onChange={handleInputChange}
                      required
                      disabled={!!customer}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Apellidos</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={customer ? customer.lastName : formData.lastName}
                      onChange={handleInputChange}
                      required
                      className={formErrors.lastName ? "border-red-500" : ""}
                      disabled={!!customer}
                    />
                    {formErrors.lastName && <p className="text-sm text-red-500 mt-1">{formErrors.lastName}</p>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="address1">Dirección</Label>
                  <Input
                    id="address1"
                    name="address1"
                    type="text"
                    value={formData.addresses[0].address1}
                    onChange={handleAddressChange}
                    required
                    className={formErrors.address1 ? "border-red-500" : ""}
                  />
                  {formErrors.address1 && <p className="text-sm text-red-500 mt-1">{formErrors.address1}</p>}
                </div>

                <div>
                  <Label htmlFor="address2">Casa, apartamento, etc. (opcional)</Label>
                  <Input
                    id="address2"
                    name="address2"
                    type="text"
                    value={formData.addresses[0].address2}
                    onChange={handleAddressChange}
                  />
                </div>

                <div className="grid grid-cols-6 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="city">Ciudad</Label>
                    <Input
                      id="city"
                      name="city"
                      type="text"
                      value={formData.addresses[0].city}
                      onChange={handleAddressChange}
                      required
                      className={formErrors.city ? "border-red-500" : ""}
                    />
                    {formErrors.city && <p className="text-sm text-red-500 mt-1">{formErrors.city}</p>}
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="province">Región</Label>
                    <Select
                      name="province"
                      value={formData.addresses[0].province}
                      onValueChange={(value) =>
                        handleAddressChange({
                          target: { name: "province", value },
                        } as React.ChangeEvent<HTMLInputElement>)
                      }
                    >
                      <SelectTrigger className={formErrors.province ? "border-red-500" : ""}>
                        <SelectValue placeholder="Seleccionar región" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lima">Lima</SelectItem>
                        <SelectItem value="arequipa">Arequipa</SelectItem>
                        <SelectItem value="cusco">Cusco</SelectItem>
                      </SelectContent>
                    </Select>
                    {formErrors.province && <p className="text-sm text-red-500 mt-1">{formErrors.province}</p>}
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="zip">Código postal</Label>
                    <Input
                      id="zip"
                      name="zip"
                      type="text"
                      value={formData.addresses[0].zip}
                      onChange={handleAddressChange}
                      required
                    />
                  </div>
                </div>

                {!customer && (
                  <div className="flex items-start gap-2">
                    <Checkbox id="saveInfo" name="saveInfo" />
                    <Label htmlFor="saveInfo" className="text-sm leading-none">
                      Guardar mi información y consultar más rápidamente la próxima vez
                    </Label>
                  </div>
                )}
              </section>
            )}
            </section>

            <section>
              <Label htmlFor="customerNotes">Notas (opcional)</Label>
              <Input
                id="customerNotes"
                name="customerNotes"
                type="text"
                value={orderDetails.customerNotes}
                onChange={(e) => setOrderDetails((prev) => ({ ...prev, customerNotes: e.target.value }))}
                placeholder="Añade alguna nota para el pedido"
              />
            </section>
            {/* Payment Methods */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Método de Pago</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Todas las transacciones son seguras y están encriptadas.
              </p>
              <div className="space-y-4">
                <div className="border rounded-lg overflow-hidden">
                <RadioGroup
                      value={selectedPaymentIdProvider || ""}
                      onValueChange={(value) => selectPaymentById(value)}
                    >
                      {availablePaymentProviders.map((provider) => (
                        <div key={provider.id} className="p-4 border-b last:border-b-0">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value={provider.id} id={provider.id} />
                            <Label htmlFor={provider.id} className="flex-1">
                              <div className="flex items-center justify-between">
                                <span>{provider.name} {provider.type}</span>
                                {/* Aquí puedes agregar iconos o información adicional del proveedor */}
                              </div>
                            </Label>
                          </div>
                          {selectedPaymentIdProvider === provider.id && (
                            <div className="mt-4 pl-6">
                              <div className="text-sm text-muted-foreground">{provider.description}</div>
                              {/* Aquí puedes agregar campos adicionales específicos del proveedor si es necesario */}
                            </div>
                          )}
                        </div>
                      ))}
                    </RadioGroup>
                  {/* <RadioGroup defaultValue="mercadopago" className="divide-y">
                    <div className="p-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="mercadopago" id="mercadopago" />
                        <Label htmlFor="mercadopago" className="flex-1">
                          <div className="flex items-center justify-between">
                            <span>Mercado Pago</span>
                            <div className="flex items-center gap-2">
                              <Image
                                src="assets/mercadopago.svg"
                                alt="Visa"
                                width={32}
                                height={20}
                                className="h-5 w-auto"
                              />
                              <Image
                                src="assets/visa.svg"
                                alt="Mastercard"
                                width={32}
                                height={20}
                                className="h-5 w-auto"
                              />
                              <Image
                                src="assets/master.svg"
                                alt="master"
                                width={32}
                                height={20}
                                className="h-5 w-auto"
                              />
                              <span className="text-sm text-muted-foreground">+3</span>
                            </div>
                          </div>
                        </Label>
                      </div>
                      <div className="mt-4 pl-6">
                        <div className="flex justify-center">
                          <div className="text-center max-w-sm">
                            <div className="mx-auto w-16 h-16 mb-4 text-muted-foreground">
                              <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <rect x="3" y="3" width="18" height="18" rx="2" />
                                <path d="M3 9h18" />
                                <path d="M15 15h3" />
                              </svg>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Después de hacer clic en "Pagar ahora", serás redirigido a Mercado Pago para completar tu
                              compra de forma segura.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="bank" id="bank" />
                        <Label htmlFor="bank">Depósito Bancario</Label>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="reserve" id="reserve" />
                        <Label htmlFor="reserve">Solicitar Reserva</Label>
                      </div>
                    </div>
                  </RadioGroup> */}
                </div>
              </div>
            </section>
            
            {/* Submit Button */}
            <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600" disabled={isSubmitting}>
              {isSubmitting ? "Procesando..." : "Reservar Ahora"}
            </Button>
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
                    {selectedCurrency?.symbol} {getPrice(item).toFixed(2)}
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
                <span>{selectedCurrency?.symbol} {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>IGV</span>
                <span>{selectedCurrency?.symbol} {tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium text-lg">
                <span>Total</span>
                <span>{selectedCurrency?.symbol} {(total + tax).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}


