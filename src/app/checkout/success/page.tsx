"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart.context"


export default function CheckoutSuccessPage() {
  const router = useRouter()
  const { clearCart } = useCart()

  useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">¡Pago exitoso!</h1>
        <p className="text-gray-600 mb-6">
          Gracias por tu compra. Hemos recibido tu pago y estamos procesando tu pedido.
        </p>
        <Button asChild className="w-full mb-4">
          <Link href="/">Volver a la tienda</Link>
        </Button>
        <Button variant="outline" asChild className="w-full">
          <Link href="/account/orders">Ver mis pedidos</Link>
        </Button>
      </div>
    </div>
  )
}
