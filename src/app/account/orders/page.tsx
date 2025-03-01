"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"


import type { Order } from "@/types/order"
import { useAuth } from "@/contexts/auth.context"
import { useOrder } from "@/contexts/order.context"

export default function OrdersPage() {
    const router = useRouter()
    const { customer, isLoading: isAuthLoading } = useAuth()

    const [isLoadingOrders, setIsLoadingOrders] = useState(true)
    const { orders, isLoading: isOrdersLoading, fetchOrders } = useOrder()

    useEffect(() => {
        if (customer) {
        fetchOrders()
        }
    }, [customer, fetchOrders])


    useEffect(() => {
          if (!isAuthLoading && !customer) {
          router.push("/login")
          }
      }, [customer, isAuthLoading, router])

    if (isAuthLoading || isOrdersLoading) {
        return <div>Cargando...</div>
    }

    if (!customer) {
        return <div>Redirigiendo...</div>
    }

  return (
    <>
      <SiteHeader />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Mis Pedidos</h1>
        <Card>
          <CardHeader>
            <CardTitle>Historial de Pedidos</CardTitle>
            <CardDescription>Aquí puedes ver todos tus pedidos anteriores</CardDescription>
          </CardHeader>
          <CardContent>
            {orders.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número de Pedido</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.orderNumber}</TableCell>
                      <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>{order.fulfillmentStatus}</TableCell>
                      <TableCell>{order.currency.code} {order.totalPrice}</TableCell>
                      <TableCell>
                        <Button asChild variant="link">
                          <Link href={`/order-confirmation/${order.id}`}>Ver Detalles</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p>No tienes pedidos anteriores.</p>
            )}
          </CardContent>
        </Card>
      </main>
    </>
  )
}

