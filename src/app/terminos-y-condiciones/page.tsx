"use client"

import { useShop } from "@/contexts/shop.context"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { FileText, ShoppingBag, Truck } from "lucide-react"

export default function TerminosCondicionesPage() {
  const { shopConfig } = useShop()
  const shopName = shopConfig?.name || "Nuestra Tienda"

  return (
    <>
      <SiteHeader />
      <main className="container-section py-12 md:py-16">
        <div className="content-section">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Términos y Condiciones</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Estos términos y condiciones establecen las reglas y regulaciones para el uso del sitio web de {shopName}.
              Al acceder a este sitio, aceptas estos términos y condiciones en su totalidad.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto bg-pink-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-pink-600" />
                </div>
                <CardTitle>Condiciones de Uso</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground">
                  Normas y regulaciones que rigen el uso de nuestro sitio web y servicios.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto bg-pink-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <ShoppingBag className="h-6 w-6 text-pink-600" />
                </div>
                <CardTitle>Compras y Pagos</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground">
                  Información sobre el proceso de compra, métodos de pago y facturación.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto bg-pink-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Truck className="h-6 w-6 text-pink-600" />
                </div>
                <CardTitle>Envíos y Entregas</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground">
                  Detalles sobre nuestras políticas de envío, plazos de entrega y seguimiento de pedidos.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-[2fr_1fr] gap-8 items-start">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Condiciones Generales</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-medium text-lg mb-2">1. Aceptación de los términos</h3>
                    <p className="text-muted-foreground">
                      Al acceder y utilizar este sitio web, usted acepta estar legalmente vinculado por estos términos y
                      condiciones. Si no está de acuerdo con alguno de estos términos, le recomendamos que no utilice
                      nuestro sitio.
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium text-lg mb-2">2. Modificaciones</h3>
                    <p className="text-muted-foreground">
                      {shopName} se reserva el derecho de modificar estos términos y condiciones en cualquier momento.
                      Los cambios entrarán en vigor inmediatamente después de su publicación en el sitio web. El uso
                      continuado del sitio después de dichos cambios constituirá su aceptación de los mismos.
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium text-lg mb-2">3. Uso del sitio</h3>
                    <p className="text-muted-foreground">
                      Usted se compromete a utilizar nuestro sitio web únicamente para fines legales y de manera que no
                      infrinja los derechos de terceros ni restrinja o impida el uso y disfrute del sitio por parte de
                      terceros. Queda prohibido cualquier uso del sitio o su contenido con fines comerciales sin nuestro
                      consentimiento previo.
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium text-lg mb-2">4. Propiedad intelectual</h3>
                    <p className="text-muted-foreground">
                      Todo el contenido de este sitio web, incluyendo pero no limitado a textos, gráficos, logotipos,
                      iconos, imágenes, clips de audio, descargas digitales y software, es propiedad de {shopName} o de
                      sus proveedores de contenido y está protegido por las leyes de propiedad intelectual nacionales e
                      internacionales.
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium text-lg mb-2">5. Cuentas de usuario</h3>
                    <p className="text-muted-foreground">
                      Al crear una cuenta en nuestro sitio, usted es responsable de mantener la confidencialidad de su
                      cuenta y contraseña, así como de restringir el acceso a su computadora. Usted acepta la
                      responsabilidad por todas las actividades que ocurran bajo su cuenta o contraseña.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Condiciones de Compra</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-medium text-lg mb-2">6. Productos y precios</h3>
                    <p className="text-muted-foreground">
                      Nos esforzamos por mostrar con precisión los colores y características de nuestros productos. Sin
                      embargo, no podemos garantizar que la visualización de los colores en su dispositivo sea exacta.
                      Todos los precios están sujetos a cambios sin previo aviso y pueden variar según promociones o
                      descuentos.
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium text-lg mb-2">7. Proceso de compra</h3>
                    <p className="text-muted-foreground">
                      Al realizar un pedido, usted declara que tiene al menos 18 años de edad y que la información
                      proporcionada durante el proceso de compra es verdadera y precisa. Nos reservamos el derecho de
                      rechazar o cancelar cualquier pedido por cualquier motivo, incluyendo limitaciones de cantidad o
                      errores en la información del producto o precio.
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium text-lg mb-2">8. Métodos de pago</h3>
                    <p className="text-muted-foreground">
                      Aceptamos diversos métodos de pago, incluyendo tarjetas de crédito, débito y transferencias
                      bancarias. Toda la información de pago se procesa de forma segura a través de nuestros proveedores
                      de servicios de pago. No almacenamos datos completos de tarjetas de crédito en nuestros
                      servidores.
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium text-lg mb-2">9. Envíos y entregas</h3>
                    <p className="text-muted-foreground">
                      Los plazos de entrega son estimados y pueden variar según la ubicación y disponibilidad del
                      producto. No nos hacemos responsables por retrasos causados por eventos fuera de nuestro control.
                      El riesgo de pérdida y título de los productos pasa a usted en el momento de la entrega.
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium text-lg mb-2">10. Política de devoluciones</h3>
                    <p className="text-muted-foreground">
                      Aceptamos devoluciones dentro de los 14 días posteriores a la recepción del producto, siempre que
                      el artículo se encuentre en su estado original, sin usar y con todas las etiquetas y embalajes
                      originales. Los gastos de envío para devoluciones corren por cuenta del cliente, excepto en casos
                      de productos defectuosos.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle>Limitación de responsabilidad</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {shopName} no será responsable por daños indirectos, incidentales, especiales, consecuentes o
                    punitivos, incluyendo pérdida de beneficios, datos, uso o cualquier otra pérdida intangible,
                    resultante de:
                  </p>
                  <ul className="list-disc pl-6 mt-4 space-y-2 text-muted-foreground">
                    <li>El uso o la imposibilidad de usar nuestro sitio o servicios</li>
                    <li>Cualquier cambio realizado en el sitio o interrupción del servicio</li>
                    <li>Acceso no autorizado o alteración de sus transmisiones o datos</li>
                    <li>Declaraciones o conductas de terceros en el sitio</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm mt-6">
                <CardHeader>
                  <CardTitle>Ley aplicable</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Estos términos y condiciones se rigen e interpretan de acuerdo con las leyes de Perú, sin tener en
                    cuenta sus disposiciones sobre conflictos de leyes. Cualquier disputa relacionada con estos términos
                    será sometida a la jurisdicción exclusiva de los tribunales de Lima, Perú.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm mt-6">
                <CardHeader>
                  <CardTitle>Contacto</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Si tiene alguna pregunta sobre estos términos y condiciones, por favor contáctenos:
                  </p>

                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Email:</span> {shopConfig?.email || "legal@tutienda.com"}
                    </p>
                    <p>
                      <span className="font-medium">Teléfono:</span> {shopConfig?.phone || "+51 999 888 777"}
                    </p>
                    <p>
                      <span className="font-medium">Dirección:</span>{" "}
                      {shopConfig?.address1 || "Av. Principal 123, Lima"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm mt-6">
                <CardHeader>
                  <CardTitle>Última actualización</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Estos términos y condiciones fueron actualizados por última vez el 21 de marzo de 2024.
                  </p>
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

