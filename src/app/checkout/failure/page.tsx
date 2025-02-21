
import Link from "next/link"
import { XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CheckoutFailurePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">Error en el pago</h1>
        <p className="text-gray-600 mb-6">
          Lo sentimos, hubo un problema al procesar tu pago. Por favor, intenta nuevamente o contacta a nuestro servicio
          de atención al cliente.
        </p>
        <Button asChild className="w-full mb-4">
          <Link href="/checkout">Volver al checkout</Link>
        </Button>
        <Button variant="outline" asChild className="w-full">
          <Link href="/">Volver a la tienda</Link>
        </Button>
      </div>
    </div>
  )
}