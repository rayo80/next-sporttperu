import { NextResponse } from "next/server"
import { MercadoPagoConfig, Payment } from "mercadopago"
import { orderService } from "../../../api/order"


export const mercadopago = new MercadoPagoConfig({accessToken: process.env.NEXT_PUBLIC_MP_ACCESS_TOKEN!});

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (body.type === "payment") {
      const paymentId = body.data.id
      const payment = await new Payment(mercadopago).get(paymentId)

      if (payment.status === "approved") {
        const externalReference = JSON.parse(payment.external_reference)
        const { formData, items, orderDetails } = externalReference

        // Create the order
        const order = await orderService.create('/order',{
          customerId: formData.id, // Asume que el cliente ya existe, si no, deberías crearlo primero
          email: formData.email,
          phone: formData.phone,
          currencyId: "PEN", // Ajusta según sea necesario
          totalPrice: payment.transaction_amount,
          subtotalPrice: payment.transaction_amount - payment.taxes_amount,
          totalTax: payment.taxes_amount,
          totalDiscounts: 0, // Implementa la lógica de descuentos si es necesario
          lineItems: items.map((item: any) => ({
            productId: item.id,
            variantId: item.id,
            quantity: item.quantity,
            price: item.unit_price,
          })),
          shippingAddressId: formData.addresses[0].id, // Asume que la dirección ya existe, si no, deberías crearla primero
          billingAddressId: formData.addresses[0].id,
          paymentProviderId: "provider_mercadopago",
          shippingMethodId: "shipping_standard",
          customerNotes: orderDetails.customerNotes,
          preferredDeliveryDate: orderDetails.preferredDeliveryDate,
          source: "web",
        })

        return NextResponse.json({ success: true, orderId: order.id })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing MercadoPago webhook:", error)
    return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 })
  }
}