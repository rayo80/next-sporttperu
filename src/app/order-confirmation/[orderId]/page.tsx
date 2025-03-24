"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { CheckCircle, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { Order } from "@/types/order"
import { use } from "react"
import { useOrder } from "@/contexts/order.context"

const generateUrl = (url: string) => {
    return url;
  }

export default function OrderConfirmationPage({ params }: { params: Promise<{ orderId: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const { getOrder } = useOrder()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const fetchedOrder = await getOrder(resolvedParams.orderId)
        setOrder(fetchedOrder)
      } catch (err) {
        setError("Failed to fetch order details. Please try again later.")
        console.error("Error fetching order:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrder()
  }, [resolvedParams.orderId, getOrder])

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Cargando detalles de la Orden...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>
  }

  if (!order) {
    return <div className="flex justify-center items-center h-screen">Order not found</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
          <h1 className="mt-3 text-3xl font-extrabold text-gray-900">Gracias por tu Pedido!</h1>
          <p className="mt-2 text-lg text-gray-600">
            Tu pedido #{order.orderNumber} ha sido recibido y esta siendo procesado.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Resumen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Items</h3>
              <ul className="mt-2 divide-y divide-gray-200">
                {order.lineItems.map((item) => (
                  <li key={item.id} className="py-4 flex items-center space-x-4">
                    <div className="flex-shrink-0 h-16 w-16 relative">
                      <Image
                        src={item.variant.imageUrl || "/placeholder.svg"}
                        alt={item.title}
                        fill
                        className="rounded-md object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                      <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                    </div>
                    <div className="flex-shrink-0 text-sm font-medium text-gray-900">
                      {order.currency.symbol} {(Number(item.price) * item.quantity).toFixed(2)}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Subtotal</span>
                <span className="text-sm font-medium text-gray-900">
                  {order.currency.symbol} {Number(order.subtotalPrice).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tax</span>
                <span className="text-sm font-medium text-gray-900">
                  {order.currency.symbol} {Number(order.totalTax).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Shipping</span>
                <span className="text-sm font-medium text-gray-900">
                  {order.currency.symbol}{" "}
                  {(Number(order.totalPrice) - Number(order.subtotalPrice) - Number(order.totalTax)).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-base font-medium text-gray-900">Total</span>
                <span className="text-base font-medium text-gray-900">
                  {order.currency.symbol} {Number(order.totalPrice).toFixed(2)}
                </span>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Direccioon de Envio</h3>
              <p className="text-sm text-gray-600">
                {order.customer.firstName} {order.customer.lastName}
                <br />
                {order.shippingAddress.address1}
                {order.shippingAddress.address2 && <>, {order.shippingAddress.address2}</>}
                <br />
                {order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.zip}
                <br />
                {order.shippingAddress.country}
              </p>
            </div>

            <Separator />

            {order.shippingMethod && (<div className="space-y-2">
              <h3 className="text-lg font-medium">Metodo de Envio</h3>
              <p className="text-sm text-gray-600">
                {order.shippingMethod.name} - {order.shippingMethod.estimatedDeliveryTime}
              </p>
            </div>)}

            <Separator />

            {order.paymentProvider && (<div className="space-y-2">
              <h3 className="text-lg font-medium">Informacion del Pago</h3>
              <p className="text-sm text-gray-600">
                Payment Method: {order.paymentProvider?.name}
                <br />
                Payment Status: {order.paymentStatus}
              </p>
            </div>)}

            {order.customerNotes && (
              <>
                <Separator />
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Notas de Pedido</h3>
                  <p className="text-sm text-gray-600">{order.customerNotes}</p>
                </div>
              </>
            )}

            {order.preferredDeliveryDate && (
              <>
                <Separator />
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Fecha de envio por defecto</h3>
                  <p className="text-sm text-gray-600">{new Date(order.preferredDeliveryDate).toLocaleDateString()}</p>
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/" className="inline-flex items-center">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Continua Comprando
              </Link>
            </Button>
            <Button asChild>
              {/* <Link href="/account/orders">View All Orders</Link> */}
              <Link href="/account/orders">Ver todas mis ordenes</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}