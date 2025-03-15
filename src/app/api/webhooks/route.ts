import { Order } from './../../../types/order';
import { NextResponse } from "next/server"
import { MercadoPagoConfig, Payment } from "mercadopago"
import { orderService } from "../../../api/order"
import { CheckoutFormData } from "@/types/checkout";
import { CreateOrderDto } from "@/types/order";
import { customerService } from "@/api/customers";
import { Customer } from "@/types/customer";
import { OrderFinancialStatus } from '@/types/commom';


export const mercadopago = new MercadoPagoConfig({accessToken: process.env.MP_ACCESS_TOKEN!});

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('body', body)
    if (body.type === "payment") {
      //Obtenemos el ID del pago de la rspuesta de mercadoPago
      const paymentId = body.data.id
      const payment = await new Payment(mercadopago).get({id: paymentId})
      console.log('payment', payment)
      if (payment.status === "approved") {
        console.log(payment)
        const orderId = payment.external_reference
        if (!orderId) {
          throw new Error("Missing order ID in external_reference")
        }
        // Obtener la orden existente
        // no es necesario hacer esto..solo queremos updatear...
        // pero aqui el get y update usa el token de customers
        // const existingOrder = await orderService.getById('/order', orderId)

        // Actualizar el estado de pago de la orden
        const updatedOrder = await orderService.update('/order', orderId, {
          paymentStatus: OrderFinancialStatus.PAID,
          // atributo X: detalle mercado pago
          
        })

        return NextResponse.json({ success: true, orderId: updatedOrder.id })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing MercadoPago webhook:", error)
    return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 })
  }
}