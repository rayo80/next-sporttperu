"use client"

import { useShop } from "@/contexts/shop.context"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, ClipboardList, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ReclamacionForm } from "@/components/reclamaciones"

export default function ReclamacionesPage() {
  const { shopConfig } = useShop()
  const shopName = shopConfig?.name || "Nuestra Tienda"

  const handleWhatsAppInquiry = () => {
    if (!shopConfig) return
    const phoneNumber = shopConfig.phone
    const message = encodeURIComponent("Hola, quisiera presentar una reclamación sobre un producto/servicio.")
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
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Libro de Reclamaciones</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              En {shopName} valoramos tu opinión y trabajamos constantemente para mejorar nuestros productos y
              servicios. Si tienes alguna queja o reclamación, estamos aquí para ayudarte.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto bg-pink-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <ClipboardList className="h-6 w-6 text-pink-600" />
                </div>
                <CardTitle>Presenta tu Reclamación</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground">
                  Completa nuestro formulario de reclamaciones para registrar formalmente tu queja o insatisfacción.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto bg-pink-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <AlertCircle className="h-6 w-6 text-pink-600" />
                </div>
                <CardTitle>Seguimiento</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground">
                  Realiza un seguimiento del estado de tu reclamación con el número de referencia proporcionado.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto bg-pink-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-pink-600" />
                </div>
                <CardTitle>Contacto Directo</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground">
                  Comunícate directamente con nuestro equipo de atención al cliente para resolver tu problema.
                </p>
                <Button variant="outline" className="mt-4" onClick={handleWhatsAppInquiry}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contactar por WhatsApp
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-[2fr_1fr] gap-8 items-start">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Procedimiento de Reclamaciones</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-medium text-lg mb-2">¿Qué es una reclamación?</h3>
                    <p className="text-muted-foreground">
                      Una reclamación es la manifestación de insatisfacción o disconformidad relacionada con los
                      productos o servicios adquiridos en nuestra tienda. Puede estar relacionada con la calidad del
                      producto, el servicio recibido, incumplimiento de condiciones, entre otros.
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium text-lg mb-2">Pasos para presentar una reclamación</h3>
                    <ol className="list-decimal pl-6 mt-2 space-y-2 text-muted-foreground">
                      <li>
                        <span className="font-medium">Completa el formulario:</span> Proporciona todos los detalles
                        relevantes sobre tu reclamación, incluyendo información de contacto, detalles de la compra y
                        descripción del problema.
                      </li>
                      <li>
                        <span className="font-medium">Adjunta documentación:</span> Si es posible, adjunta comprobantes
                        de compra, fotografías del producto o cualquier otra evidencia que respalde tu reclamación.
                      </li>
                      <li>
                        <span className="font-medium">Envía tu reclamación:</span> Una vez completado el formulario,
                        envíalo a través de nuestra plataforma o directamente a nuestro correo de atención al cliente.
                      </li>
                      <li>
                        <span className="font-medium">Recibe confirmación:</span> Recibirás un número de referencia para
                        dar seguimiento a tu caso.
                      </li>
                      <li>
                        <span className="font-medium">Resolución:</span> Nuestro equipo evaluará tu caso y te contactará
                        con una respuesta o solución en un plazo máximo de 30 días calendario.
                      </li>
                    </ol>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium text-lg mb-2">Plazos de respuesta</h3>
                    <p className="text-muted-foreground">
                      Nos comprometemos a responder a todas las reclamaciones en un plazo máximo de 30 días calendario
                      desde su recepción. En casos complejos que requieran una investigación más detallada, te
                      informaremos sobre el estado de tu reclamación y el tiempo adicional necesario para su resolución.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Formulario de Reclamación</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">
                    Para presentar una reclamación formal, por favor completa el siguiente formulario con todos los
                    detalles relevantes. Nos pondremos en contacto contigo lo antes posible.
                  </p>

                  <ReclamacionForm />

                  <p className="text-sm text-muted-foreground mt-6">
                    También puedes presentar tu reclamación directamente en nuestra tienda física o enviando un correo a{" "}
                    {shopConfig?.email || "reclamaciones@tutienda.com"}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle>Preguntas Frecuentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>¿Cuánto tiempo tardará en resolverse mi reclamación?</AccordionTrigger>
                      <AccordionContent>
                        Nos comprometemos a resolver todas las reclamaciones en un plazo máximo de 30 días calendario.
                        Sin embargo, la mayoría de los casos se resuelven en un plazo de 7 a 15 días.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                      <AccordionTrigger>¿Qué información debo incluir en mi reclamación?</AccordionTrigger>
                      <AccordionContent>
                        Es importante incluir tus datos de contacto, detalles de la compra (fecha, número de pedido),
                        descripción detallada del problema y, si es posible, fotografías o documentos que respalden tu
                        reclamación.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                      <AccordionTrigger>¿Puedo solicitar un reembolso?</AccordionTrigger>
                      <AccordionContent>
                        Sí, puedes solicitar un reembolso como parte de tu reclamación. La aprobación dependerá de la
                        naturaleza del problema, el tiempo transcurrido desde la compra y nuestra política de
                        devoluciones.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4">
                      <AccordionTrigger>¿Qué ocurre si no estoy satisfecho con la resolución?</AccordionTrigger>
                      <AccordionContent>
                        Si no estás conforme con la resolución propuesta, puedes solicitar una revisión de tu caso o
                        acudir a las entidades de protección al consumidor correspondientes.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm mt-6">
                <CardHeader>
                  <CardTitle>Contacto Directo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Si prefieres contactarnos directamente para resolver tu problema, puedes hacerlo a través de:
                  </p>

                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Email:</span> {shopConfig?.email || "reclamaciones@tutienda.com"}
                    </p>
                    <p>
                      <span className="font-medium">Teléfono:</span> {shopConfig?.phone || "+51 999 888 777"}
                    </p>
                    <p>
                      <span className="font-medium">Horario de atención:</span> Lunes a Viernes de 9:00 AM a 6:00 PM
                    </p>
                  </div>

                  <div className="pt-2">
                    <Button variant="outline" className="w-full" onClick={handleWhatsAppInquiry}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Contactar por WhatsApp
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm mt-6">
                <CardHeader>
                  <CardTitle>Entidades Reguladoras</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Si no estás satisfecho con nuestra respuesta, puedes acudir a las siguientes entidades:
                  </p>

                  <ul className="space-y-2 text-muted-foreground">
                    <li>
                      <span className="font-medium">INDECOPI:</span> Instituto Nacional de Defensa de la Competencia y
                      de la Protección de la Propiedad Intelectual
                    </li>
                    <li>
                      <span className="font-medium">Libro de Reclamaciones Virtual:</span> Plataforma oficial del
                      gobierno
                    </li>
                  </ul>
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

