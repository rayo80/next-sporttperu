"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Truck, Store, Currency } from 'lucide-react'
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

import { VariantPrice, VariantPriceModel } from "@/types/product"
import { useShop } from "@/contexts/shop.context"
import { usePaymentProvider } from "@/contexts/payment-provider.context"
import { PaymentProvider, PaymentProviderType } from "@/types/payment-provider"
import { useShippingMethod } from "@/contexts/shipping-method.context"
import { CheckoutFormData } from "@/types/checkout"
import { OrderFinancialStatus } from "@/types/commom"
import { mercadopagoService } from "@/services/mercado-pago"
import { SiteFooter } from "@/components/site-footer"
import { useEmail } from "@/contexts/email.context"
import { EmailFormData, EmailResponse, EmailSendParams } from "@/types/email"

interface FormErrors {
  email?: string
  lastName?: string
  address1?: string
  city?: string
  province?: string
  phone?: string
}

const defaultImage = (imageUrls: string[]) => {
  return imageUrls && imageUrls.length > 0 && imageUrls[0]
  ? imageUrls[0]
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
  const{sendEmail,submitForm} =useEmail()
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


// Import useEmail at component level, not inside the function
// const { sendEmail, submitForm } = useEmail(); - Move this outside handleSubmit

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

    // Get email context

    if (paymentMethod?.type === PaymentProviderType.MERCADO_PAGO) {
      // Create MercadoPago preference
      try {
        const mercadoPagoItems = completeFormData.cartItems!.map((item) => ({
          id: item.variantId,
          title: item.title,
          description: item.title,
          unit_price: item.price,
          quantity: item.quantity,
          currency_id: selectedCurrency?.code,
        }))

        const order = await createOrderFromCart(
          completeFormData
        )
        console.log("completeFormData", completeFormData)
        
        // Send confirmation email only if customer is registered
        if (customer) {
          await sendCustomerConfirmationEmail(completeFormData, order, sendEmail);
        }
        
        // Always send notification email to store owner
        await sendOwnerNotificationEmail(completeFormData, order, submitForm);
        
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
      // Proceed with other payment methods (create order directly)
        const order = await createOrderFromCart(completeFormData)
        
        // Send confirmation email only if customer is registered
        if (customer) {
          await sendCustomerConfirmationEmail(completeFormData, order, sendEmail);
        }
        
        // Always send notification email to store owner
        await sendOwnerNotificationEmail(completeFormData, order, submitForm);
      
        toast.success("¡Orden creada con éxito!")
        clearCart()
        router.push(`/order-confirmation/${order.id}`)
    }
  } catch (error) {
    console.log("Error creating order:", error)
    toast.error(error instanceof Error ? error.message : "Error al crear la orden. Por favor, inténtelo de nuevo.")
  } finally {
    setIsSubmitting(false)
  }
}

// Function to send order confirmation email to the customer (only for registered users)
const sendCustomerConfirmationEmail = async (
  formData: CheckoutFormData, 
  order: any, 
  sendEmail: (params: EmailSendParams) => Promise<EmailResponse>
  ) => {
  try {
    const customerEmail = formData.customer.email;
    
    // Calculate total price
    const totalPrice = formData.cartItems!.reduce(
      (sum, item) => sum + (item.price * item.quantity), 
      0
    ).toFixed(2);
  
    // Create WhatsApp message with order details
    const whatsappMessage = encodeURIComponent(`Hola Sportt Peru. Tengo una consulta sobre mi pedido #${order.id} realizado el ${new Date().toLocaleDateString('es-ES')}. ¿Podrían ayudarme?`);
    const whatsappLink = `https://wa.me/51959051109?text=${whatsappMessage}`;
  
    // Generate items HTML
    const itemsHTML = formData.cartItems!.map(item => `
      <tr>
        <td style="padding: 16px; border-bottom: 1px solid #eaeaea; color: #424242;">${item.title}</td>
        <td style="padding: 16px; border-bottom: 1px solid #eaeaea; text-align: center; color: #424242;">${item.quantity}</td>
        <td style="padding: 16px; border-bottom: 1px solid #eaeaea; text-align: right; color: #424242;">${selectedCurrency?.symbol}${item.price.toFixed(2)}</td>
        <td style="padding: 16px; border-bottom: 1px solid #eaeaea; text-align: right; font-weight: 500; color: #424242;">${selectedCurrency?.symbol}${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');
  
    // Create email HTML with elegant gray design for Sportt Peru
    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmación de Pedido - Sportt Peru</title>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&display=swap" rel="stylesheet">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Montserrat', 'Helvetica Neue', Arial, sans-serif; color: #4a4a4a; line-height: 1.6; background-color: #f5f5f5;">
        <div style="max-width: 650px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
          <!-- Header with Logo -->
          <div style="background: linear-gradient(135deg, #5a5a5a, #3a3a3a); padding: 35px 40px; text-align: center;">
            <div style="margin-bottom: 15px;">
              <!-- Logo actual -->
              <img src="https://sporttperu.com/assets/logo.png" alt="Sportt Peru" style="max-height: 60px;">
            </div>
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 500; letter-spacing: 0.5px;">Confirmación de Pedido</h1>
            <p style="color: #f0f0f0; margin-top: 10px; font-size: 15px; font-weight: 300; opacity: 0.9;">Gracias por confiar en nosotros</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px; background-color: #ffffff;">
            <!-- Greeting -->
            <p style="font-size: 16px; color: #4a4a4a; margin-bottom: 25px;">
              Hola <span style="font-weight: 500; color: #333333;">${formData.customer.firstName}</span>,
            </p>
            
            <p style="font-size: 16px; color: #4a4a4a; margin-bottom: 30px; line-height: 1.6;">
              Tu pedido ha sido procesado correctamente. A continuación encontrarás los detalles de tu compra:
            </p>
            
            <!-- Order Info Box -->
            <div style="background-color: #f9f9f9; border-left: 3px solid #e091a9; padding: 20px 25px; margin-bottom: 35px; border-radius: 5px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <h2 style="color: #3a3a3a; font-size: 18px; margin: 0 0 10px 0; font-weight: 500;">Pedido #${order.id}</h2>
                  <p style="font-size: 14px; color: #6b6b6b; margin: 0;">
                    Fecha: ${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <div>
                  <a href="https://sporttperu.com/order-confirmation/${order.id}" style="display: inline-block; padding: 8px 15px; background-color: #f0f0f0; color: #4a4a4a; text-decoration: none; border-radius: 20px; font-size: 13px; font-weight: 500; transition: all 0.2s ease; border: 1px solid #e8e8e8;">
                    Ver pedido
                  </a>
                </div>
              </div>
            </div>
            
            <!-- Products -->
            <h3 style="color: #3a3a3a; font-size: 18px; margin-bottom: 20px; font-weight: 500; position: relative; padding-bottom: 8px; display: inline-block;">
              Detalle de tu pedido
              <span style="position: absolute; bottom: 0; left: 0; width: 100%; height: 2px; background: linear-gradient(to right, #e091a9, #e091a960);"></span>
            </h3>
            
            <div style="background-color: #ffffff; border: 1px solid #eaeaea; border-radius: 5px; overflow: hidden; margin-bottom: 35px; box-shadow: 0 2px 5px rgba(0,0,0,0.02);">
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="background-color: #f5f5f5;">
                    <th style="padding: 14px 16px; text-align: left; color: #3a3a3a; font-weight: 500; font-size: 14px;">Producto</th>
                    <th style="padding: 14px 16px; text-align: center; color: #3a3a3a; font-weight: 500; font-size: 14px;">Cantidad</th>
                    <th style="padding: 14px 16px; text-align: right; color: #3a3a3a; font-weight: 500; font-size: 14px;">Precio</th>
                    <th style="padding: 14px 16px; text-align: right; color: #3a3a3a; font-weight: 500; font-size: 14px;">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHTML}
                </tbody>
                <tfoot>
                  <tr style="background-color: #f9f9f9;">
                    <td colspan="3" style="padding: 16px; text-align: right; color: #3a3a3a; font-weight: 500;">Total:</td>
                    <td style="padding: 16px; text-align: right; font-size: 16px; color: #3a3a3a; font-weight: 600;">${selectedCurrency?.symbol}${totalPrice}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            <!-- Shipping Info -->
            <h3 style="color: #3a3a3a; font-size: 18px; margin-bottom: 20px; font-weight: 500; position: relative; padding-bottom: 8px; display: inline-block;">
              Información de entrega
              <span style="position: absolute; bottom: 0; left: 0; width: 100%; height: 2px; background: linear-gradient(to right, #e091a9, #e091a960);"></span>
            </h3>
            
            <div style="background-color: #f9f9f9; padding: 25px; margin-bottom: 35px; border-radius: 5px; border: 1px solid #eaeaea;">
              <p style="font-size: 15px; line-height: 1.7; margin: 0; color: #4a4a4a;">
                <span style="font-weight: 500; color: #3a3a3a;">${formData.customer.firstName} ${formData.customer.lastName}</span><br>
                ${formData.customer.addresses[0].address1}<br>
                ${formData.customer.addresses[0].city}, ${formData.customer.addresses[0].province} ${formData.customer.addresses[0].zip}<br>
                ${formData.customer.addresses[0].country}
              </p>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 35px; color: #4a4a4a;">
              Te mantendremos informado sobre el estado de tu pedido. Si tienes alguna pregunta, no dudes en contactarnos.
            </p>
            
            <!-- Buttons -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin: 40px 0; flex-wrap: wrap; gap: 15px;">
              <!-- WhatsApp Button con ícono base64 para asegurar visualización -->
              <a href="${whatsappLink}" style="flex: 1; min-width: 200px; background-color: #25D366; color: white; text-decoration: none; padding: 14px 20px; border-radius: 5px; font-weight: 500; display: inline-block; font-size: 15px; text-align: center; box-shadow: 0 2px 5px rgba(37, 211, 102, 0.2); transition: all 0.3s ease;">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white" style="vertical-align: middle; margin-right: 10px;">
                  <path d="M12 2C6.5 2 2 6.5 2 12c0 1.4.3 2.7.8 3.9l-1 3.5c-.1.6.4 1.1 1 1l3.5-1c1.2.5 2.5.8 3.9.8 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18c-1.2 0-2.4-.3-3.5-.7l-.6-.3-2.5.7.7-2.5-.3-.6c-.5-1-.7-2.2-.7-3.5 0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8zm4.7-11.9c-.2-.1-1.3-.6-1.5-.7-.2-.1-.3-.1-.5.1-.1.2-.6.7-.7.8-.1.1-.2.1-.4 0s-.8-.3-1.6-.9c-.6-.5-1-1.2-1.1-1.4-.1-.2 0-.3.1-.4.1-.1.2-.2.3-.3.1-.1.1-.2.2-.3.1-.1.1-.2 0-.3-.1-.1-.5-1.2-.7-1.6-.2-.4-.3-.3-.5-.4h-.4c-.1 0-.3.1-.5.3-.2.2-.7.7-.7 1.8s.7 2.1.8 2.2c.1.1 1.4 2.1 3.3 2.9 1.9.8 1.9.5 2.2.5.3 0 1.1-.5 1.3-.9.2-.5.2-.8.1-.9z"/>
                </svg>
                Consultar por WhatsApp
              </a>
              
              <!-- Visit Store Button -->
              <a href="https://sporttperu.com" style="flex: 1; min-width: 200px; background-color: #f5f5f5; border: 1px solid #e0e0e0; color: #4a4a4a; text-decoration: none; padding: 14px 20px; border-radius: 5px; font-weight: 500; display: inline-block; font-size: 15px; text-align: center; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05); transition: all 0.3s ease;">
                Visitar tienda
              </a>
            </div>
          </div>
          
 
          
          <!-- Footer -->
          <div style="background-color: #4a4a4a; padding: 25px; text-align: center; color: #f5f5f5;">
            <p style="margin: 0 0 10px 0; font-size: 14px; opacity: 0.9;">&copy; ${new Date().getFullYear()} Sportt Peru. Todos los derechos reservados.</p>
            <p style="margin: 0; font-size: 12px; opacity: 0.7;">Este correo fue enviado a ${formData.customer.email}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  
    // Send the email
    await sendEmail({
      to: customerEmail!,
      subject: `Sportt Peru: Confirmación de Pedido #${order.id}`,
      html: emailHTML
    });
  
    console.log("Confirmation email sent to customer");
  } catch (error) {
    console.error("Error sending confirmation email to customer:", error);
  }
  };

// Function to send notification email to the store owner with flat JSON structure
const sendOwnerNotificationEmail = async (
formData: CheckoutFormData, 
order: any, 
submitForm: (formData: EmailFormData) => Promise<EmailResponse>
) => {
try {
  // Calculate total price
  const totalPrice = formData.cartItems!.reduce(
    (sum, item) => sum + (item.price * item.quantity), 
    0
  ).toFixed(2);
  
  // Prepare flat order data for the store owner (JSON without hierarchy)
  const orderData = {
    orderId: order.id,
    orderDate: new Date().toISOString(),
    customerName: `${formData.customer.firstName} ${formData.customer.lastName}`,
    customerEmail: formData.customer.email,
    customerPhone: formData.customer.phone || "No proporcionado",
    customerIsRegistered: customer ? true : false,
    shippingAddress: `${formData.customer.addresses[0].address1}, ${formData.customer.addresses[0].city}, ${formData.customer.addresses[0].province}, ${formData.customer.addresses[0].zip}, ${formData.customer.addresses[0].country}`,
    totalAmount: totalPrice,
    currency: selectedCurrency?.code,
    paymentMethod: paymentMethod?.name || "No especificado",
    paymentStatus: formData.orderDetails.paymentStatus,
    items: JSON.stringify(formData.cartItems!.map(item => `${item.title} x ${item.quantity} - ${selectedCurrency?.symbol}${(item.price * item.quantity).toFixed(2)}`)),
    store: "Sportt Peru",
    notificationSentDate: new Date().toISOString()
  };
  
  // Submit the form with flat order data
  await submitForm(orderData);
  
  console.log("Order notification sent to store owner");
} catch (error) {
  console.error("Error sending notification to store owner:", error);
}
};

  if (isAuthLoading) {
    return <div>Loading...</div>
  }

  return (
    <>
    <SiteHeader />
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
                                <span>{provider.name}</span>
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
                    <div className="absolute top-0 right-0 z-[10] bg-gray-500 text-white w-5 h-5 flex items-center justify-center rounded-bl-lg text-xs">
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
      <SiteFooter />
    </>
  )
}


