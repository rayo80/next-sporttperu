"use client"

import type React from "react"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Truck, Store, CheckCircle, ArrowLeft, MessageSquare } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useCart } from "@/contexts/cart.context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth.context"
import { CartItemModel } from "@/types/cart"
import Link from "next/link"
import { useOrder } from "@/contexts/order.context"
import { mercadopagoService } from "@/api/mercado-pago"
import type { VariantPriceModel } from "@/types/product"
import { useShop } from "@/contexts/shop.context"
import { usePaymentProvider } from "@/contexts/payment-provider.context"
import { type PaymentProvider, PaymentProviderType } from "@/types/payment-provider"
import { useShippingMethod } from "@/contexts/shipping-method.context"
import type { CheckoutFormData } from "@/types/checkout"
import { OrderFinancialStatus, OrderFulfillmentStatus } from "@/types/commom"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import api from "@/api/base"

interface FormErrors {
  email?: string
  lastName?: string
  address1?: string
  city?: string
  province?: string
  phone?: string
}

const generateUrl = (url: string) => {
  return `${process.env.NEXT_PUBLIC_API}/uploads/${url}`
}

const defaultImage = (imageUrls: string[]) => {
  return imageUrls && imageUrls.length > 0 && imageUrls[0] ? generateUrl(imageUrls[0]) : "/assets/image.png"
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items: cartItems, total, clearCart } = useCart()
  const { createOrderFromCart } = useOrder()
  const itemModels = cartItems.map((i) => new CartItemModel(i))
  const { customer, isLoading: isAuthLoading, isAuthenticated } = useAuth()
  // Update the deliveryMethod handling to set it in the orderDetails object
  const [deliveryMethod, setDeliveryMethod] = useState<"shipping" | "pickup">("shipping")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const { availablePaymentProviders } = usePaymentProvider()
  const [paymentMethod, setPaymentMethod] = useState<PaymentProvider | null>(null)
  const [selectedPaymentIdProvider, setSelectedPaymentIdProvider] = useState<string | null>(null)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)

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

  // Update the formData state initialization to match the CheckoutFormData interface
  const [formData, setFormData] = useState<CheckoutFormData>({
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
      financialStatus: OrderFinancialStatus.PENDING,
      fulfillmentStatus: OrderFulfillmentStatus.UNFULFILLED,
      paymentStatus: "PENDING",
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
          firstName: customer.firstName || "",
          lastName: customer.lastName || "",
          phone: customer.phone || "",
          email: customer.email || "",
          acceptsMarketing: customer.acceptsMarketing || false,
          addresses: customer.addresses || prev.customer.addresses,
        },
      }))
      if (customer.addresses.length > 0) {
        setSelectedAddressId(customer.addresses[0].id)
      }
    }
  }, [customer])

  // Add an effect to update the orderDetails.deliveryMethod when deliveryMethod changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      orderDetails: {
        ...prev.orderDetails,
        deliveryMethod: deliveryMethod,
      },
    }))
  }, [deliveryMethod])

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

  const handleCheckoutChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setFormData((prev) => ({
      ...prev,
      orderDetails: {
        ...prev.orderDetails,
        customerNotes: value,
      },
    }))
  }, [])

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

    // Check email
    if (!formData.customer.email || !formData.customer.email.includes("@")) {
      errors.email = "Email inválido"
      isValid = false
    }

    // Check phone
    if (!formData.customer.phone) {
      errors.phone = "Teléfono es requerido"
      isValid = false
    }

    // Check shipping address fields if delivery method is shipping
    if (deliveryMethod === "shipping") {
      if (!formData.customer.lastName) {
        errors.lastName = "Apellidos es requerido"
        isValid = false
      }

      if (!formData.customer.addresses[0].address1) {
        errors.address1 = "Dirección es requerida"
        isValid = false
      }

      if (!formData.customer.addresses[0].city) {
        errors.city = "Ciudad es requerida"
        isValid = false
      }

      if (!formData.customer.addresses[0].province) {
        errors.province = "Región es requerida"
        isValid = false
      }
    }

    setFormErrors(errors)
    return isValid
  }, [formData, deliveryMethod])

  // Update the handlePaymentMethodChange function
  const handlePaymentMethodChange = (paymentId: string) => {
    const provider = availablePaymentProviders.find((p) => p.id === paymentId)
    setPaymentMethod(provider || null)
    setSelectedPaymentIdProvider(paymentId)
    setFormData((prev) => ({
      ...prev,
      orderDetails: {
        ...prev.orderDetails,
        paymentProviderId: paymentId,
      },
    }))
  }

  // Update the handleShippingMethodChange function to set the shippingMethodId in the orderDetails object
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

  const handleWhatsAppInquiry = () => {
    if (!shopConfig) return
    const phoneNumber = shopConfig.phone
    const message = encodeURIComponent(
      `Hola, acabo de realizar un pedido (${orderId}) y quisiera coordinar la entrega.`,
    )
    const number = phoneNumber?.replace(/[^\w\s]/gi, "").replace(/ /g, "") || ""
    const whatsappUrl = `https://api.whatsapp.com/send/?phone=${number}&text=${message}`
    window.open(whatsappUrl, "_blank")
  }

  // Function to send admin notification email
  const sendAdminNotificationEmail = async (order: any) => {
    try {
      const formatCurrency = (amount: number) => {
        return `${selectedCurrency?.symbol || "S/"} ${amount.toFixed(2)}`
      }

      const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("es-ES", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      }

      // Crear strings para los productos en lugar de objetos
      const productsList = order.lineItems
        .map((item: { title: any; quantity: number; price: any }, index: number) => {
          return `Producto ${index + 1}: ${item.title}, Cantidad: ${item.quantity}, Precio unitario: ${selectedCurrency?.symbol || "S/"} ${Number(item.price).toFixed(2)}, Total: ${selectedCurrency?.symbol || "S/"} ${(Number(item.price) * item.quantity).toFixed(2)}`
        })
        .join(" | ")

      // Crear string para la dirección de envío
      const shippingAddressText = order.shippingAddress
        ? `${order.shippingAddress.address1}, ${order.shippingAddress.city}, ${order.shippingAddress.province}, ${order.shippingAddress.country}`
        : "No disponible"

      // Crear string para el cliente
      const customerText = `Nombre: ${order.customer?.firstName || ""} ${order.customer?.lastName || ""}, Email: ${order.customer?.email || formData.customer.email}, Teléfono: ${order.customer?.phone || formData.customer.phone}`

      // Crear string para el pago
      const paymentText = `Método: ${paymentMethod?.name || "No especificado"}, Estado: ${order.paymentStatus || "PENDIENTE"}`

      // Crear string para el envío
      const shippingText = `Método: ${selectedMethod?.name || "No especificado"}, Costo: ${selectedCurrency?.symbol || "S/"} ${shippingCost.toFixed(2)}, Dirección: ${shippingAddressText}`

      // Crear string para el estado de la orden
      const orderStatusText = `Estado financiero: ${order.financialStatus || "PENDIENTE"}, Estado de cumplimiento: ${order.fulfillmentStatus || "PENDIENTE"}`

      // Crear admin notification data con valores primitivos
      const adminNotificationData = {
        tipo: "nueva_orden",
        fecha: formatDate(new Date().toISOString()),
        ordenId: order.id,
        ordenNumero: order.orderNumber || order.id,
        clienteNombre: `${order.customer?.firstName || ""} ${order.customer?.lastName || ""}`,
        clienteEmail: order.customer?.email || formData.customer.email,
        clienteTelefono: order.customer?.phone || formData.customer.phone,
        clienteDireccion: shippingAddressText,
        clienteInfo: customerText,
        productosList: productsList,
        pagoMetodo: paymentMethod?.name || "No especificado",
        pagoEstado: order.paymentStatus || "PENDIENTE",
        pagoInfo: paymentText,
        envioMetodo: selectedMethod?.name || "No especificado",
        envioCosto: shippingCost.toFixed(2),
        envioDireccion: shippingAddressText,
        envioInfo: shippingText,
        subtotal: Number(order.subtotalPrice).toFixed(2),
        impuestos: Number(order.totalTax).toFixed(2),
        total: Number(order.totalPrice).toFixed(2),
        moneda: selectedCurrency?.code || "PEN",
        simboloMoneda: selectedCurrency?.symbol || "S/",
        notas: order.customerNotes || "Sin notas",
        estadoFinanciero: order.financialStatus || "PENDIENTE",
        estadoCumplimiento: order.fulfillmentStatus || "PENDIENTE",
        estadoOrdenInfo: orderStatusText,
      }

      console.log("Sending admin notification email with data:", adminNotificationData)

      // Send the notification to admin
      const response = await api.post("/email/submit-form", adminNotificationData)

      if (response.data.success) {
        console.log("Admin notification email sent successfully")
      } else {
        console.error("Error sending admin notification:", response.data.message)
      }

      return response.data.success
    } catch (error) {
      console.error("Error sending admin notification email:", error)
      return false
    }
  }

  // Replace the handleSubmit function with this updated version that includes direct API call for email
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!validateForm()) {
      setIsSubmitting(false)
      toast.error("Por favor, complete todos los campos requeridos")
      return
    }

    if (!selectedMethod) {
      setIsSubmitting(false)
      toast.error("Por favor, seleccione un método de envío")
      return
    }

    if (!paymentMethod) {
      setIsSubmitting(false)
      toast.error("Por favor, seleccione un método de pago")
      return
    }

    try {
      const currencyId = formData.payment.currencyId

      // Update the handleSubmit function to correctly structure the data
      // In the handleSubmit function, replace the completeFormData preparation with:
      const completeFormData: CheckoutFormData = {
        ...formData,
        customer: {
          ...formData.customer,
          id: customer ? customer.id : formData.customer.id,
          addresses: customer ? customer.addresses.map((addr) => ({ ...addr })) : formData.customer.addresses,
        },
        cartItems: cartItems.map((item) => ({
          variantId: item.variant.id,
          title: item.product.title,
          quantity: item.quantity,
          price: Number(item.variant.prices.find((p) => p.currencyId === currencyId)?.price || 0),
        })),
        payment: {
          ...formData.payment,
          currencyId: currencyId,
          subtotal: subtotal,
          tax: tax,
          shippingCost: shippingCost,
          total: finalTotal,
        },
        orderDetails: {
          ...formData.orderDetails,
          customerNotes: formData.orderDetails.customerNotes,
          preferredDeliveryDate: formData.orderDetails.preferredDeliveryDate,
          paymentProviderId: selectedPaymentIdProvider,
          shippingMethodId: selectedMethod?.id || null,
          financialStatus: OrderFinancialStatus.PENDING,
          fulfillmentStatus: OrderFulfillmentStatus.UNFULFILLED,
          paymentStatus: "PENDING",
          // Remove shippingStatus from here as it's not part of the orderDetails type
        },
      }

      // Add console log to verify the data being sent
      console.log("Complete form data:", JSON.stringify(completeFormData, null, 2))

      // Agregar console.log para depuración
      console.log("Enviando datos de orden:", JSON.stringify(completeFormData, null, 2))

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

          const order = await createOrderFromCart(completeFormData)
          console.log("Orden creada exitosamente:", order)

          // Send admin notification email
          await sendAdminNotificationEmail(order)

          const init_point = await mercadopagoService.createPreference(mercadoPagoItems, completeFormData, order.id)

          // Redirect to MercadoPago payment page
          window.location.href = init_point
        } catch (error) {
          console.error("Error creating MercadoPago preference:", error)
          toast.error("Error al crear la preferencia de pago. Por favor, inténtelo de nuevo.")
        }
      } else {
        // Proceed with other payment methods (create order directly)
        const order = await createOrderFromCart(completeFormData)
        console.log("Orden creada exitosamente:", order)

        // Send order confirmation email for authenticated users
        if (isAuthenticated() && order) {
          try {
            // Generate HTML for the order confirmation email
            const formatCurrency = (amount: number) => {
              return `${selectedCurrency?.symbol || "S/"} ${amount.toFixed(2)}`
            }

            const formatDate = (dateString: string) => {
              const date = new Date(dateString)
              return date.toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            }

            // Generate line items HTML
            const lineItemsHtml = order.lineItems
              .map(
                (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eaeaea;">
        <div style="font-weight: 500;">${item.title}</div>
        <div style="color: #666; font-size: 14px;">Cantidad: ${item.quantity}</div>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #eaeaea; text-align: right;">
        ${selectedCurrency?.symbol || "S/"} ${(Number(item.price) * item.quantity).toFixed(2)}
      </td>
    </tr>
  `,
              )
              .join("")

            // Generate shipping address HTML
            const shippingAddressHtml = order.shippingAddress
              ? `
  <p style="margin: 0; line-height: 1.5;">
    ${order.customer?.firstName} ${order.customer?.lastName}<br>
    ${order.shippingAddress.address1}
    ${order.shippingAddress.address2 ? `<br>${order.shippingAddress.address2}` : ""}
    <br>${order.shippingAddress.city}, ${order.shippingAddress.province} ${order.shippingAddress.zip}
    <br>${order.shippingAddress.country}
  </p>
`
              : "<p>No se proporcionó dirección de envío</p>"

            // Create WhatsApp link for order delivery coordination
            const phoneNumber = shopConfig?.phone || ""
            const whatsappNumber = phoneNumber?.replace(/[^\w\s]/gi, "").replace(/ /g, "") || ""
            const whatsappMessage = encodeURIComponent(
              `Hola, quisiera coordinar la entrega de mi pedido #${order.orderNumber || order.id}`,
            )
            const whatsappUrl = `https://api.whatsapp.com/send/?phone=${whatsappNumber}&text=${whatsappMessage}`

            const confirmationHtml = `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmación de Pedido</title>
  </head>
  <body style="font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; color: #333333; background-color: #f7f7f7;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f7f7f7">
      <tr>
        <td align="center" style="padding: 40px 0;">
          <table width="600" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff" style="border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); max-width: 600px; width: 100%;">
            <!-- Header -->
            <tr>
              <td align="center" bgcolor="#ff0066" style="padding: 30px 30px; border-radius: 8px 8px 0 0;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Confirmación de Pedido</h1>
              </td>
            </tr>
            
            <!-- Content -->
            <tr>
              <td style="padding: 30px;">
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <!-- Thank you message -->
                  <tr>
                    <td align="center" style="padding-bottom: 30px;">
                      <h2 style="margin: 0 0 15px 0; font-size: 22px; color: #333333;">¡Gracias por tu compra!</h2>
                      <p style="margin: 0; color: #666666; font-size: 16px; line-height: 1.5;">
                        Hemos recibido tu pedido y está siendo procesado.
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Order details -->
                  <tr>
                    <td style="background-color: #f9f9f9; border-radius: 6px; padding: 20px; margin-bottom: 30px;">
                      <h3 style="margin: 0 0 15px 0; font-size: 18px; color: #333333;">Detalles del pedido</h3>
                      <p style="margin: 5px 0; color: #666666; font-size: 15px;">
                        <strong>Número de pedido:</strong> ${order.orderNumber || order.id}
                      </p>
                      <p style="margin: 5px 0; color: #666666; font-size: 15px;">
                        <strong>Fecha:</strong> ${formatDate(order.createdAt)}
                      </p>
                      <p style="margin: 5px 0; color: #666666; font-size: 15px;">
                        <strong>Estado del pago:</strong> ${order.paymentStatus}
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Spacer -->
                  <tr><td height="30"></td></tr>
                  
                  <!-- Products summary -->
                  <tr>
                    <td>
                      <h3 style="margin: 0 0 15px 0; font-size: 18px; color: #333333;">Resumen de productos</h3>
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                        <thead>
                          <tr style="background-color: #f3f4f6;">
                            <th style="padding: 12px; text-align: left; border-bottom: 1px solid #eaeaea; font-size: 15px;">Producto</th>
                            <th style="padding: 12px; text-align: right; border-bottom: 1px solid #eaeaea; font-size: 15px;">Precio</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${lineItemsHtml}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td style="padding: 12px; text-align: right; font-weight: 500; font-size: 15px;">Subtotal:</td>
                            <td style="padding: 12px; text-align: right; font-size: 15px;">${selectedCurrency?.symbol || "S/"} ${Number(order.subtotalPrice).toFixed(2)}</td>
                          </tr>
                          <tr>
                            <td style="padding: 12px; text-align: right; font-weight: 500; font-size: 15px;">Impuestos:</td>
                            <td style="padding: 12px; text-align: right; font-size: 15px;">${selectedCurrency?.symbol || "S/"} ${Number(order.totalTax).toFixed(2)}</td>
                          </tr>
                          <tr>
                            <td style="padding: 12px; text-align: right; font-weight: 500; font-size: 15px;">Envío:</td>
                            <td style="padding: 12px; text-align: right; font-size: 15px;">${selectedCurrency?.symbol || "S/"} ${(Number(order.totalPrice) - Number(order.subtotalPrice) - Number(order.totalTax)).toFixed(2)}</td>
                          </tr>
                          <tr style="font-weight: bold; font-size: 16px;">
                            <td style="padding: 12px; text-align: right; border-top: 2px solid #eaeaea; font-size: 16px;">Total:</td>
                            <td style="padding: 12px; text-align: right; border-top: 2px solid #eaeaea; font-size: 16px;">${selectedCurrency?.symbol || "S/"} ${Number(order.totalPrice).toFixed(2)}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Spacer -->
                  <tr><td height="30"></td></tr>
                  
                  <!-- Shipping information -->
                  <tr>
                    <td>
                      <h3 style="margin: 0 0 15px 0; font-size: 18px; color: #333333;">Información de envío</h3>
                      ${shippingAddressHtml}
                      ${
                        order.shippingMethod
                          ? `
                        <p style="margin: 10px 0 0; color: #666666; font-size: 15px;">
                          <strong>Método de envío:</strong> ${order.shippingMethod.name}
                        </p>
                        <p style="margin: 5px 0; color: #666666; font-size: 15px;">
                          <strong>Tiempo estimado de entrega:</strong> ${order.shippingMethod.estimatedDeliveryTime || "No especificado"}
                        </p>
                      `
                          : ""
                      }
                    </td>
                  </tr>
                  
                  <!-- Spacer -->
                  <tr><td height="20"></td></tr>
                  
                  <!-- WhatsApp Button -->
                  <tr>
                    <td align="center" style="padding: 20px 0;">
                      <p style="margin: 0 0 15px 0; color: #666666; font-size: 15px;">
                        Para coordinar la entrega de tu pedido, puedes contactarnos directamente:
                      </p>
                      <a href="${whatsappUrl}" style="display: inline-block; background-color: #25D366; color: white; font-weight: bold; text-decoration: none; padding: 12px 25px; border-radius: 6px; font-size: 16px;">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/240px-WhatsApp.svg.png" alt="WhatsApp" style="height: 18px; vertical-align: middle; margin-right: 8px;">
                        Coordinar entrega por WhatsApp
                      </a>
                    </td>
                  </tr>
                  
                  ${
                    order.customerNotes
                      ? `
                    <!-- Customer Notes -->
                    <tr>
                      <td style="padding-top: 20px;">
                        <h3 style="margin: 0 0 15px 0; font-size: 18px; color: #333333;">Notas del pedido</h3>
                        <p style="color: #666666; background-color: #f9f9f9; padding: 15px; border-radius: 6px; margin: 0; font-size: 15px;">${order.customerNotes}</p>
                      </td>
                    </tr>
                  `
                      : ""
                  }
                </table>
              </td>
            </tr>
            
            <!-- Footer -->
            <tr>
              <td style="background-color: #f3f4f6; padding: 30px; border-radius: 0 0 8px 8px; text-align: center;">
                <p style="margin: 0 0 15px 0; color: #666666; font-size: 14px;">
                  Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos.
                </p>
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}" style="display: inline-block; background-color: #ff0066; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 14px;">
                  Ver mi pedido
                </a>
                <p style="margin: 20px 0 0 0; color: #999999; font-size: 13px;">
                  © ${new Date().getFullYear()} ${shopConfig?.name || "Tu Tienda"}. Todos los derechos reservados.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
`

            // Send the email using the API endpoint directly
            console.log("Sending order confirmation email to:", formData.customer.email)

            const emailData = {
              to: formData.customer.email,
              subject: `Confirmación de pedido #${order.orderNumber || order.id}`,
              html: confirmationHtml,
            }

            console.log("Email data:", emailData)

            const emailResponse = await api.post("/email/send", emailData)
            console.log("Email API response:", emailResponse.data)

            if (emailResponse.data.success) {
              console.log("Order confirmation email sent successfully")
            } else {
              console.error("Error sending email:", emailResponse.data.message)
            }
          } catch (emailError) {
            console.error("Error sending order confirmation email:", emailError)
            // Don't block the checkout process if email fails
          }
        }

        // Send admin notification email
        await sendAdminNotificationEmail(order)

        setOrderId(order.id)
        setOrderComplete(true)
        clearCart()

        // Only redirect to order confirmation if user is authenticated
        if (isAuthenticated()) {
          router.push(`/order-confirmation/${order.id}`)
        } else {
          toast.success("¡Orden creada con éxito!")
        }
      }
    } catch (error) {
      console.error("Error creating order:", error)
      toast.error(error instanceof Error ? error.message : "Error al crear la orden. Por favor, inténtelo de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isAuthLoading) {
    return <div>Loading...</div>
  }

  // Show order confirmation screen
  if (orderComplete) {
    return (
      <>
        <SiteHeader />
        <main className="container-section py-12 md:py-16">
          <div className="content-section max-w-2xl mx-auto">
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl font-bold">¡Gracias por tu compra!</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4 pt-4">
                <p className="text-gray-600">Tu pedido ha sido recibido y está siendo procesado.</p>

                {orderId && (
                  <div className="bg-gray-50 p-4 rounded-lg inline-block">
                    <p className="text-sm text-gray-500">Número de pedido</p>
                    <p className="font-medium text-gray-900">{orderId}</p>
                  </div>
                )}

                <div className="bg-green-50 p-4 rounded-lg mt-6">
                  <p className="text-sm text-green-800 mb-4">
                    Para coordinar la entrega de tu pedido, puedes contactarnos directamente por WhatsApp.
                  </p>
                  <Button onClick={handleWhatsAppInquiry} className="bg-green-600 hover:bg-green-700 text-white">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Coordinar entrega por WhatsApp
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <Button variant="outline" asChild>
                  <Link href="/" className="inline-flex items-center">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver a la tienda
                  </Link>
                </Button>
                {isAuthenticated() && (
                  <Button asChild>
                    <Link href={`/order-confirmation/${orderId}`}>Ver detalles del pedido</Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </main>
        <SiteFooter />
      </>
    )
  }

  return (
    <>
      <SiteHeader />
      <main className="container-section py-8">
        <div className="content-section grid md:grid-cols-[1fr_400px] gap-8">
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
                    value={customer?.email ?? formData.customer.email ?? ""}
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
              </div>
            </section>

            {/* Delivery Section */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Métodos de envío</h2>
              {availableShippingMethods.length > 0 ? (
                <RadioGroup value={selectedMethod?.id} onValueChange={handleShippingMethodChange} className="space-y-2">
                  {availableShippingMethods.map((method) => {
                    const price = method.prices.find((p) => p.currency.code === selectedCurrency?.code)
                    if (!price) return null // No mostrar si no hay precio en la moneda actual
                    return (
                      <div key={method.id} className="border">
                        <RadioGroupItem value={method.id} id={method.id} className="peer sr-only" />
                        <Label
                          htmlFor={method.id}
                          className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer peer-data-[state=checked]:border-pink-500"
                        >
                          <div className="flex items-center gap-2">
                            {Number(price.price) === 0 ? <Store className="h-5 w-5" /> : <Truck className="h-5 w-5" />}
                          </div>
                          <span>{method.name}</span>
                          <span>
                            {selectedCurrency?.symbol} {Number(price.price)}
                          </span>
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
                            customer: {
                              ...prevData.customer,
                              addresses: [selectedAddress],
                            },
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
                    <Checkbox id="saveInfo" name="saveInfo" onCheckedChange={handleCheckboxChange} />
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
                  <RadioGroup value={paymentMethod?.id} onValueChange={handlePaymentMethodChange}>
                    {availablePaymentProviders.map((provider) => (
                      <div key={provider.id} className="p-4 border-b last:border-b-0">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value={provider.id} id={provider.id} />
                          <Label htmlFor={provider.id} className="flex-1">
                            <div className="flex items-center justify-between">
                              <span>
                                {provider.name} 
                              </span>
                            </div>
                          </Label>
                        </div>
                        {selectedPaymentIdProvider === provider.id && (
                          <div className="mt-4 pl-6">
                            <div className="text-sm text-muted-foreground">{provider.description}</div>
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
                    <div className="absolute top-0 right-0 bg-gray-500 z-[10] text-white w-5 h-5 flex items-center justify-center rounded-bl-lg text-xs">
                      {item.quantity}
                    </div>
                    <Image
                      src={item.product?.imageUrls[0] || "/placeholder.svg"}
                      alt={item.product.title}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.product.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.product.vendor}</p>
                  </div>
                  <div className="font-medium">
                    {selectedCurrency?.symbol} {getPrice(item).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

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
      <SiteFooter />
    </>
  )
}

