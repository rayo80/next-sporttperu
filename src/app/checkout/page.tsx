"use client"

import { useCallback, useEffect, useState } from "react"
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
import { mercadopagoService } from "@/services/mercado-pago"
import { VariantPrice, VariantPriceModel } from "@/types/product"
import { useShop } from "@/contexts/shop.context"
import { usePaymentProvider } from "@/contexts/payment-provider.context"
import { PaymentProvider, PaymentProviderType } from "@/types/payment-provider"
import { useShippingMethod } from "@/contexts/shipping-method.context"
import { CheckoutFormData } from "@/types/checkout"
import { OrderFinancialStatus } from "@/types/commom"

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
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const { availablePaymentProviders } = usePaymentProvider()
  const [paymentMethod, setPaymentMethod] = useState<PaymentProvider | null>(null)
  const [ selectedPaymentIdProvider, setSelectedPaymentIdProvider] = useState<string | null>(null)

  const { shopConfig, selectedCurrency } = useShop()
  
  const { availableShippingMethods, selectedMethod, setSelectedMethod } = useShippingMethod()

  // Calcular la fecha 3 días después de hoy
  const threeDaysFromNow = new Date()
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3)
  const defaultDeliveryDate = threeDaysFromNow.toISOString() // Formato: 2025-01-29T05:00:00.000Z

  // Calcula el costo de envío
  const shippingCost = selectedMethod
    ? Number(selectedMethod.prices.find((p) => p.currency.code === selectedCurrency?.code)?.price || 0)
    : 0

  // Actualiza el cálculo del total
  const subtotal = shopConfig?.taxesIncluded
    ? total / (1 + Number(shopConfig?.taxValue) / 100) // Si los impuestos están incluidos, el subtotal es el total dividido por 1.18
    : total // Si los impuestos no están incluidos, el subtotal es el total

  const taxRate = Number(shopConfig?.taxValue || 18) / 100 

  const tax = shopConfig?.taxesIncluded
    ? subtotal * taxRate // Si los impuestos están incluidos, calculamos el IGV del subtotal
    : total * taxRate // Si los impuestos no están incluidos, calculamos el IGV del total

  const finalTotal = subtotal + tax + shippingCost
  // Filtrar proveedores de pago por la moneda seleccionada
  // const availablePaymentProviders = getProvidersByCurrency(selectedCurrency?.code)
  const [ formData, setFormData] = useState<CheckoutFormData>({
    customer: {
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
      ],
    },
    orderDetails: {
      customerNotes: "",
      preferredDeliveryDate: defaultDeliveryDate,
      paymentProviderId: null,
      shippingMethodId: null,
      deliveryMethod: "shipping",
    },
    payment: {
      currencyId: selectedCurrency?.id || "curr_f62e7f75-f8f4", // Solo el ID
      subtotal: 0,
      tax: 0,
      shippingCost: 0,
      total: 0,
    },
    discountCode: "",
  })

  // Agregar un useEffect para actualizar los valores de pago cuando cambien los cálculos
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      payment: {
        currencyId: selectedCurrency?.id || prev.payment.currencyId,
        subtotal,
        tax,
        shippingCost,
        total: finalTotal,
      },
    }))
  }, [subtotal, tax, shippingCost, finalTotal, selectedCurrency])

  // Update the useEffect to populate the form with customer data if available
  useEffect(() => {
    if (customer) {
      setFormData((prev) => ({
        ...prev,
        customer: {
          firstName: customer.firstName,
          lastName: customer.lastName,
          phone: customer.phone,
          email: customer.email,
          acceptsMarketing: customer.acceptsMarketing,
          addresses: customer.addresses,
        },
      }))
      if (customer.addresses.length > 0) {
        setSelectedAddressId(customer.addresses[0].id)
      }
    }
  }, [customer])



  const getPrice = (item: CartItemModel) => {
    const priceObject = item.variant.prices.find((p: VariantPriceModel) => p.currency.code === selectedCurrency?.code)
    const price = Number.parseFloat(priceObject?.price || "0")
    return price
  }

  const validateField = useCallback((name: string, value: string): string | undefined => {
    switch (name) {
      case "email":
        return !value || !value.includes("@") ? "Email inválido" : undefined
      case "lastName":
        return !value ? "Apellidos es requerido" : undefined
      case "address1":
        return !value ? "Dirección es requerida" : undefined
      case "city":
        return !value ? "Ciudad es requerida" : undefined
      case "province":
        return !value ? "Región es requerida" : undefined
      case "phone":
        return !value ? "Teléfono es requerido" : undefined
      default:
        return undefined
    }
  }, [])

  // Update the handleInputChange function
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setFormData((prev) => ({
        ...prev,
        customer: {
          ...prev.customer,
          [name]: value,
        },
      }))
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

  const handleCheckoutChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      console.log("name", name, "value", value)
      setFormData((prev) => ({
        ...prev,
        orderDetails: {
          ...prev.orderDetails,
          customerNotes: e.target.value,
        },
      }))
      console.log("form data", formData)
    },
    [validateField],
  )
  
  // Update the handleAddressChange function
  const handleAddressChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setFormData((prev) => ({
        ...prev,
        customer: {
          ...prev.customer,
          addresses: [
            {
              ...prev.customer.addresses[0],
              [name]: value,
            },
          ],
        },
      }))
      const error = validateField(name, value)
      setFormErrors((prev) => ({ ...prev, [name]: error }))
    },
    [validateField],
  )

  // Update the handleCheckboxChange function
  const handleCheckboxChange = useCallback((checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      customer: {
        ...prev.customer,
        acceptsMarketing: checked,
      },
    }))
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

  // Update the handlePaymentMethodChange function
  const handlePaymentMethodChange = (paymentId: string) => {
    const provider = availablePaymentProviders.find((p) => p.id === paymentId)
    setPaymentMethod(provider || null)
    setFormData((prev) => ({
      ...prev,
      orderDetails: {
        ...prev.orderDetails,
        paymentProviderId: paymentId,
      },
    }))
  }

  const handleShippingMethodChange = (methodId: string) => {
    const method = availableShippingMethods.find((m) => m.id === methodId)
    setSelectedMethod(method || null)
    setFormData((prev) => ({
      ...prev,
      orderDetails: {
        ...prev.orderDetails,
        shippingMethodId: methodId,
      },
    }))
  }


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    if (!validateForm()) {
      setIsSubmitting(false)
      toast.error("Por favor, complete todos los campos requeridos")
      return
    }

    try {
      const currencyId = formData.payment.currencyId
      const completeFormData: CheckoutFormData = {
        ...formData,
        customer: {
          ...formData.customer,
          id: customer ? customer.id : formData.customer.id, // Si hay `customer`, usa su `id`, sino mantiene el del formulario.
          addresses: customer ? customer.addresses.map((addr) => ({ ...addr })) : formData.customer.addresses, // Si hay `customer`, usa sus direcciones, sino mantiene las del formulario.
        },
        cartItems: cartItems.map((item) => ({
          variantId: item.variant.id,
          title: item.product.title,
          quantity: item.quantity,
          price: Number(item.variant.prices.find((p) => p.currencyId === currencyId)?.price || 0),
        })),
        orderDetails: {
          ...formData.orderDetails,
          paymentStatus: OrderFinancialStatus.PENDING,
        }
      }

      if (paymentMethod?.type === PaymentProviderType.MERCADO_PAGO) {

        // Create MercadoPago preference
        try {
          const mercadoPagoItems = completeFormData.cartItems!.map((item) => ({
            id: item.variantId,
            title: item.title,
            description: item.title,
            unit_price: item.price,
            quantity: item.quantity,
          }))
          
          // const checkoutMPFormData: CheckoutFormData = {
          //   ...completeFormData,
          //   orderDetails: {
          //     ...completeFormData.orderDetails,
          //     paymentStatus: OrderFinancialStatus.PENDING, // Agregar estado pendiente
          //   },
          // }

          const order = await createOrderFromCart(
            completeFormData
          )
          console.log("completeFormData", completeFormData)
          const init_point = await mercadopagoService.createPreference(
            mercadoPagoItems,
            completeFormData,
            order.id
          )
          
          // Redirect to MercadoPago payment page
          window.location.href = init_point
        } catch (error) {
          console.error("Error creating MercadoPago preference:", error)
          toast.error("Error al crear la preferencia de pago. Por favor, inténtelo de nuevo.")
        }
      } else {
        // Proceed with  other payment methods (create order directly)
          const order = await createOrderFromCart(completeFormData)
        
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
                    value={customer ? customer.email : formData.customer.email}
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
                    value={formData.customer.phone}
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
              <h2 className="text-xl font-semibold mb-4">Métodos de envío</h2>
              {availableShippingMethods.length > 0 ? (
                <RadioGroup 
                  value={selectedMethod?.id} 
                  onValueChange={handleShippingMethodChange} 
                  className="space-y-2">
                  {availableShippingMethods.map((method) => {
                    const price = method.prices.find((p) => p.currency.code === selectedCurrency?.code)
                    if (!price) return null // No mostrar si no hay precio en la moneda actual
                    return (
                      <div key={method.id} className="   border  ">
                        <RadioGroupItem value={method.id} id={method.id}  className="peer sr-only" />
                        <Label 
                          htmlFor={method.id} 
                          className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer peer-data-[state=checked]:border-pink-500">
                          <div className="flex items-center gap-2">
                            {Number(price.price) === 0 ? <Store className="h-5 w-5" /> : <Truck className="h-5 w-5" />}
                          </div>
                          <span>{method.name}</span>
                          <span>{selectedCurrency?.symbol} {Number(price.price)}</span>
                        </Label>
                      </div>
                    )
                  })}
                </RadioGroup>
              ) : (
                <p className="text-muted-foreground">
                  No hay métodos de envío disponibles para la moneda seleccionada.
                </p>
              )}
            </section>

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
                      value={customer ? customer.firstName : formData.customer.firstName}
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
                      value={customer ? customer.lastName : formData.customer.lastName}
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
                    value={formData.customer.addresses[0].address1}
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
                    value={formData.customer.addresses[0].address2}
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
                      value={formData.customer.addresses[0].city}
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
                      value={formData.customer.addresses[0].province}
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
                      value={formData.customer.addresses[0].zip}
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
            
            {/* Customer Notes */}
            <section>
              <Label htmlFor="customerNotes">Notas (opcional)</Label>
              <Input
                id="customerNotes"
                name="customerNotes"
                type="text"
                value={formData.orderDetails.customerNotes}
                onChange={handleCheckoutChange}
                placeholder="Añade alguna nota para el pedido"
              />
            </section>

            {/* Payment Providers */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Método de Pago</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Todas las transacciones son seguras y están encriptadas.
              </p>
              <div className="space-y-4">
                <div className="border rounded-lg overflow-hidden">
                <RadioGroup
                      value={paymentMethod?.id}
                      onValueChange={handlePaymentMethodChange}
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
                </div>
              </div>
            </section>
            
            {/* Submit Button */}
            <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600" disabled={isSubmitting}>
              {isSubmitting ? "Procesando..." : "Pagar Ahora"}
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

            {/* <div className="pt-4 border-t">
              <div className="flex items-center">
                <Input
                  placeholder="Código de descuento"
                  className="rounded-r-none"
                />
                <Button variant="secondary" className="rounded-l-none">
                  Aplicar
                </Button>
              </div>
            </div> */}

            {/* Order Summary */}
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal · {itemCount} artículos</span>
                <span>
                  {selectedCurrency?.symbol} {subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Envío</span>
                <span>
                  {selectedCurrency?.symbol} {shippingCost.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Impuestos</span>
                <span>
                  {selectedCurrency?.symbol} {tax.toFixed(2)}
                </span>
              </div>
              <div className="pt-4 border-t">
                <div className="flex justify-between items-baseline">
                  <span className="text-base font-medium">Total</span>
                  <div className="text-right">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm text-muted-foreground">{selectedCurrency?.code}</span>
                      <span className="text-2xl font-medium">
                        {selectedCurrency?.symbol} {finalTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}


