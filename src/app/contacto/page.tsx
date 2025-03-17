"use client"

import { useShop } from "@/contexts/shop.context"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ContactForm } from "@/components/contact-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock, MessageSquare } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { EmailProvider } from "@/contexts/email.context"

export default function ContactoPage() {
  const { shopConfig } = useShop()

  const handleWhatsAppInquiry = () => {
    if (!shopConfig) return
    const phoneNumber = shopConfig.phone
    const message = encodeURIComponent("Hola, me gustaría obtener más información sobre sus productos.")
    const number = phoneNumber?.replace(/[^\w\s]/gi, "").replace(/ /g, "") || ""
    const whatsappUrl = `https://api.whatsapp.com/send/?phone=${number}&text=${message}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <>
      <SiteHeader />
      <main className="container-section py-12 md:py-16">
        <div className="content-section">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Contáctanos</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Estamos aquí para ayudarte. Ponte en contacto con nosotros para cualquier consulta, sugerencia o
              información sobre nuestros productos.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto bg-pink-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Phone className="h-6 w-6 text-pink-600" />
                </div>
                <CardTitle>Llámanos</CardTitle>
                <CardDescription>Atención telefónica</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="font-medium text-lg">{shopConfig?.phone || "+51 999 888 777"}</p>
                <p className="text-sm text-muted-foreground mt-1">Lunes a Viernes: 9am - 6pm</p>
                <Button variant="outline" className="mt-4" onClick={handleWhatsAppInquiry}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Enviar WhatsApp
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto bg-pink-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Mail className="h-6 w-6 text-pink-600" />
                </div>
                <CardTitle>Escríbenos</CardTitle>
                <CardDescription>Correo electrónico</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="font-medium text-lg">{shopConfig?.email || "info@tutienda.com"}</p>
                <p className="text-sm text-muted-foreground mt-1">Respondemos en 24-48 horas</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => (window.location.href = `mailto:${shopConfig?.email || "info@tutienda.com"}`)}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Enviar Email
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto bg-pink-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-pink-600" />
                </div>
                <CardTitle>Visítanos</CardTitle>
                <CardDescription>Tienda física</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="font-medium">{shopConfig?.address1 || "Av. Principal 123, Lima"}</p>
                <p className="text-sm text-muted-foreground mt-1">Lunes a Sábado: 10am - 8pm</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() =>
                    window.open(`https://maps.google.com/?q=${shopConfig?.address1 || "Lima, Peru"}`, "_blank")
                  }
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Ver en Mapa
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-[1fr_400px] gap-8 items-start">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Envíanos un mensaje</CardTitle>
                  <CardDescription>Completa el formulario y te responderemos a la brevedad.</CardDescription>
                </CardHeader>
                <CardContent>
                  <EmailProvider>
                    <ContactForm />
                  </EmailProvider>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle>Horarios de Atención</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Lunes - Viernes</span>
                    </div>
                    <span>9:00 AM - 6:00 PM</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Sábado</span>
                    </div>
                    <span>10:00 AM - 4:00 PM</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Domingo</span>
                    </div>
                    <span>Cerrado</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm mt-6">
                <CardHeader>
                  <CardTitle>Preguntas Frecuentes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium">¿Cuál es el tiempo de entrega?</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      El tiempo de entrega varía según tu ubicación, generalmente entre 1-3 días hábiles.
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="font-medium">¿Cómo puedo hacer un seguimiento de mi pedido?</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Recibirás un correo con el número de seguimiento una vez que tu pedido sea enviado.
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="font-medium">¿Cuál es la política de devoluciones?</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Aceptamos devoluciones dentro de los 14 días posteriores a la recepción del producto.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}

