"use client"

import { useShop } from "@/contexts/shop.context"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Shield, Lock, FileText } from "lucide-react"

export default function PrivacidadPage() {
  const { shopConfig } = useShop()
  const shopName = shopConfig?.name || "Nuestra Tienda"

  return (
    <>
      <SiteHeader />
      <main className="container-section py-12 md:py-16">
        <div className="content-section">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Política de Privacidad</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              En {shopName} nos comprometemos a proteger tu privacidad y tus datos personales. Esta política describe
              cómo recopilamos, utilizamos y protegemos tu información.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto bg-pink-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-pink-600" />
                </div>
                <CardTitle>Protección de Datos</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground">
                  Cumplimos con todas las normativas de protección de datos aplicables y tomamos medidas para garantizar
                  la seguridad de tu información.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto bg-pink-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Lock className="h-6 w-6 text-pink-600" />
                </div>
                <CardTitle>Seguridad</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground">
                  Implementamos medidas técnicas y organizativas para proteger tus datos contra accesos no autorizados o
                  pérdidas.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto bg-pink-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-pink-600" />
                </div>
                <CardTitle>Transparencia</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground">
                  Te informamos claramente sobre cómo utilizamos tus datos y respetamos tus derechos de privacidad en
                  todo momento.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-[2fr_1fr] gap-8 items-start">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Información que recopilamos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-medium text-lg mb-2">Datos personales</h3>
                    <p className="text-muted-foreground">Podemos recopilar la siguiente información personal:</p>
                    <ul className="list-disc pl-6 mt-2 space-y-1 text-muted-foreground">
                      <li>Nombre y apellidos</li>
                      <li>Dirección de correo electrónico</li>
                      <li>Número de teléfono</li>
                      <li>Dirección postal</li>
                      <li>Información de pago (procesada de forma segura por nuestros proveedores de pago)</li>
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium text-lg mb-2">Información de uso</h3>
                    <p className="text-muted-foreground">
                      También podemos recopilar información sobre cómo utilizas nuestro sitio web:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-1 text-muted-foreground">
                      <li>Dirección IP</li>
                      <li>Tipo de navegador y dispositivo</li>
                      <li>Páginas visitadas</li>
                      <li>Tiempo de permanencia en el sitio</li>
                      <li>Referencias y enlaces de salida</li>
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium text-lg mb-2">Cómo utilizamos tu información</h3>
                    <p className="text-muted-foreground">Utilizamos la información recopilada para:</p>
                    <ul className="list-disc pl-6 mt-2 space-y-1 text-muted-foreground">
                      <li>Procesar tus pedidos y transacciones</li>
                      <li>Mejorar nuestros productos y servicios</li>
                      <li>Personalizar tu experiencia en nuestro sitio</li>
                      <li>Enviarte información sobre productos, ofertas o novedades (si has dado tu consentimiento)</li>
                      <li>Cumplir con nuestras obligaciones legales</li>
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium text-lg mb-2">Cookies y tecnologías similares</h3>
                    <p className="text-muted-foreground">
                      Utilizamos cookies y tecnologías similares para mejorar tu experiencia, analizar el tráfico y
                      personalizar el contenido. Puedes controlar el uso de cookies a través de la configuración de tu
                      navegador.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Tus derechos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    De acuerdo con las leyes de protección de datos aplicables, tienes los siguientes derechos:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>
                      <span className="font-medium">Derecho de acceso:</span> Puedes solicitar una copia de los datos
                      personales que tenemos sobre ti.
                    </li>
                    <li>
                      <span className="font-medium">Derecho de rectificación:</span> Puedes solicitar que corrijamos
                      información inexacta o incompleta.
                    </li>
                    <li>
                      <span className="font-medium">Derecho de supresión:</span> Puedes solicitar que eliminemos tus
                      datos personales en determinadas circunstancias.
                    </li>
                    <li>
                      <span className="font-medium">Derecho de oposición:</span> Puedes oponerte al procesamiento de tus
                      datos personales en determinadas circunstancias.
                    </li>
                    <li>
                      <span className="font-medium">Derecho a la limitación del tratamiento:</span> Puedes solicitar que
                      limitemos el procesamiento de tus datos.
                    </li>
                    <li>
                      <span className="font-medium">Derecho a la portabilidad:</span> Puedes solicitar una copia de tus
                      datos en un formato estructurado.
                    </li>
                  </ul>
                  <p className="text-muted-foreground mt-4">
                    Para ejercer cualquiera de estos derechos, por favor contáctanos a través de{" "}
                    {shopConfig?.email || "info@tutienda.com"}.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle>Compartir información</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    No vendemos ni alquilamos tu información personal a terceros. Podemos compartir tu información con:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Proveedores de servicios que nos ayudan a operar nuestro negocio</li>
                    <li>Empresas de transporte para entregar tus pedidos</li>
                    <li>Procesadores de pago para gestionar transacciones</li>
                    <li>Autoridades cuando sea requerido por ley</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm mt-6">
                <CardHeader>
                  <CardTitle>Retención de datos</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Conservamos tus datos personales solo durante el tiempo necesario para los fines para los que fueron
                    recopilados, o según lo requiera la ley aplicable.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm mt-6">
                <CardHeader>
                  <CardTitle>Cambios en esta política</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Podemos actualizar esta política de privacidad periódicamente. Te notificaremos cualquier cambio
                    significativo publicando la nueva política en nuestro sitio web.
                  </p>
                  <p className="text-muted-foreground mt-4">Última actualización: Marzo 2024</p>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm mt-6">
                <CardHeader>
                  <CardTitle>Contacto</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Si tienes preguntas sobre esta política de privacidad o sobre cómo manejamos tus datos personales,
                    por favor contáctanos:
                  </p>
                  <p className="mt-4">
                    <span className="font-medium">Email:</span> {shopConfig?.email || "info@tutienda.com"}
                  </p>
                  <p>
                    <span className="font-medium">Teléfono:</span> {shopConfig?.phone || "+51 999 888 777"}
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
