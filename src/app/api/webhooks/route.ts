import { NextResponse } from "next/server"
import { MercadoPagoConfig, Payment } from "mercadopago"
import { orderService } from "../../../api/order"
import { CheckoutFormData } from "@/types/checkout";
import { CreateOrderDto } from "@/types/order";
import { customerService } from "@/api/customers";
import { Customer } from "@/types/customer";


export const mercadopago = new MercadoPagoConfig({accessToken: process.env.MP_ACCESS_TOKEN!});

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('body', body)
    if (body.type === "payment") {
      const paymentId = body.data.id
      const payment = await new Payment(mercadopago).get(paymentId)
      console.log('payment', payment)
      if (payment.status === "approved") {
        console.log(payment)
        const completeFormData: CheckoutFormData = JSON.parse(payment.external_reference)
        const { customer: formCustomer, orderDetails, payment: paymentInfo, cartItems } = completeFormData

        
        // Buscar o crear el cliente
        let orderCustomer: Customer
        let customerId: string
        const customerData = formCustomer

        try {
          // Si ya tenemos el ID del cliente desde el frontend, lo usamos directamente
          if (customerData.id) {
            // Podríamos verificar que el cliente existe, pero asumimos que es válido
            customerId = customerData.id
          } else {
            // Si no hay ID, crear un nuevo cliente
            orderCustomer = await customerService.create(customerData)
            customerId = orderCustomer.id
          }
        } catch (error) {
          console.error("Error managing customer:", error)
          throw new Error("Failed to process customer data")
        }
        
        // Create the order
        const orderData: CreateOrderDto = {
          customerId: customerId,
          currencyId: paymentInfo.currencyId,
          totalPrice: paymentInfo.total,
          subtotalPrice: paymentInfo.subtotal,
          totalTax: paymentInfo.tax,
          totalDiscounts: 0,
          lineItems: cartItems!,
          shippingAddressId: formCustomer.addresses[0]?.id,
          billingAddressId: formCustomer.addresses[0]?.id,
          paymentProviderId: orderDetails.paymentProviderId,
          shippingMethodId: orderDetails.shippingMethodId,
          customerNotes: orderDetails.customerNotes,
          preferredDeliveryDate: orderDetails.preferredDeliveryDate,
          source: "web",
        }



        const order = await orderService.create('/order', orderData)

        return NextResponse.json({ success: true, orderId: order.id })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing MercadoPago webhook:", error)
    return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 })
  }
}