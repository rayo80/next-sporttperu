"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Pencil, X, Minus, Plus } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useCart } from "@/contexts/cart.context"
import { SiteFooter } from "@/components/site-footer"
import { ProductVariant, VariantPrice, VariantPriceModel } from "@/types/product"
import { useShop } from "@/contexts/shop.context"
import jsPDF from "jspdf"
import autoTable, { UserOptions } from "jspdf-autotable"
import { CartItem } from "@/types/cart"
import { get } from "http"


export default function CartPage() {
  const { items, total, removeItem, updateQuantity, clearCart, currency} = useCart()
  const [date, setDate] = useState<Date>()
  const [specialInstructions, setSpecialInstructions] = useState("")
  const { shopConfig } = useShop()
  const handleQuantityChange = (slug: string, newQuantity: number) => {
    if (newQuantity >= 0) {
      updateQuantity(slug, newQuantity)
    }
  }
  
  const getPrice = (item: CartItem) => {
    const priceObject = item.variant.prices.find((p: VariantPrice) => p.currency.code === currency?.code)
    const price = Number.parseFloat(priceObject?.price || "0")
    return price
  }

  
  const generateQuotePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
  
    // Fondo rosado para la página
    doc.setFillColor(255, 236, 239);
    doc.rect(0, 0, pageWidth, pageHeight, "F");
  
    // Rectángulo blanco con esquinas redondeadas para el contenido
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(10, 10, pageWidth - 20, pageHeight - 20, 3, 3, "F");
  
    // Título principal
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("COTIZACIÓN", pageWidth / 2, 30, { align: "center" });
  
    // Número de cotización (comentado, se puede habilitar según necesidad)
    // doc.setFontSize(12);
    // doc.text("00X", pageWidth / 2, 40, { align: "center" });
  
    // Fecha actual
    doc.setFontSize(12);
    doc.text(`Fecha: ${format(new Date(), "dd/MM/yyyy")}`, pageWidth / 2, 50, { align: "center" });
  
    // Información del cliente (comentada, se puede habilitar si se requiere)
    /*
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(
      [
        `Nombre: ${shopConfig?.name || "Cliente"}`,
        `Documento: ${shopConfig?.id || ""}`,
        `Dirección: ${shopConfig?.address1 || ""}`,
        `${shopConfig?.city || ""}, ${shopConfig?.province || ""}`,
        `Correo: ${shopConfig?.email || ""}`,
        `Teléfono: ${shopConfig?.phone || ""}`,
      ],
      20,
      80,
    );
    */
  
    // Íconos de redes sociales (comentados, agregar rutas reales a los iconos)
    /*
    doc.addImage("/instagram-icon.png", "PNG", pageWidth - 60, 70, 8, 8);
    doc.addImage("/web-icon.png", "PNG", pageWidth - 40, 70, 8, 8);
    */
  
    // Preparar datos de la tabla de productos
    const tableData = items.map((item) => {
      const variant = item.variant;
      const variantAttributes = Object.entries(variant.attributes)
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ");
      const productName = `${item.product.title}\n${variantAttributes}`;
  
      return [
        productName,
        item.quantity,
        `${currency?.symbol} ${getPrice(item).toFixed(2)}`,
        `${currency?.symbol} ${(item.quantity * getPrice(item)).toFixed(2)}`,
      ];
    });
  
    // Configuración de estilos para la tabla (se usa type assertion para los arrays de color)
    const tableStyles = {
      headStyles: { 
        fillColor: [255, 236, 239] as [number, number, number], 
        textColor: [0, 0, 0] as [number, number, number], 
        fontStyle: "bold" 
      },
      bodyStyles: { fillColor: [255, 255, 255] as [number, number, number] },
      alternateRowStyles: { fillColor: [252, 252, 252] as [number, number, number] },
      margin: { top: 60 },
    };
  
    const tableOptions: UserOptions = {
      head: [["PRODUCTO", "CANTIDAD", "PRECIO", "TOTAL"]],
      body: tableData,
      headStyles: {
        fillColor: [255, 236, 239] as [number, number, number],
        textColor: [0, 0, 0] as [number, number, number],
        fontStyle: "bold" as "bold", // Especificando el tipo correcto
      },
      bodyStyles: { fillColor: [255, 255, 255] as [number, number, number] },
      alternateRowStyles: { fillColor: [252, 252, 252] as [number, number, number] },
      margin: { top: 60 },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 30, halign: "center" },
        2: { cellWidth: 35, halign: "right" },
        3: { cellWidth: 35, halign: "right" },
      },
    };
  
    autoTable(doc, tableOptions);
  
    // Calcular totales
    const subtotal = total;
    const iva = total * 0.18; // 18% IGV
    const finalTotal = subtotal + iva;
  
    // Ubicación para mostrar totales, debajo de la tabla
    const finalY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 10 : 10;
  
    // Crear un recuadro rosado para los totales
    doc.setFillColor(255, 236, 239);
    doc.rect(pageWidth - 90, finalY, 70, 40, "F");
  
    // Agregar textos de los totales
    doc.setFont("helvetica", "normal");
    doc.text("Sub Total", pageWidth - 85, finalY + 10);
    doc.text("IVA", pageWidth - 85, finalY + 20);
    doc.setFont("helvetica", "bold");
    doc.text("Total", pageWidth - 85, finalY + 30);
  
    // Agregar montos
    doc.setFont("helvetica", "normal");
    doc.text(`${currency?.symbol} ${subtotal.toFixed(2)}`, pageWidth - 25, finalY + 10, { align: "right" });
    doc.text(`${currency?.symbol} ${iva.toFixed(2)}`, pageWidth - 25, finalY + 20, { align: "right" });
    doc.setFont("helvetica", "bold");
    doc.text(`${currency?.symbol} ${finalTotal.toFixed(2)}`, pageWidth - 25, finalY + 30, { align: "right" });
  
    // Nota de validez (comentada, personalizar según sea necesario)
    /*
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Validez de la cotización: 30 días", 20, finalY + 60);
    */
  
    // Pie de página con logo e información de contacto
    const footerY = pageHeight - 40;
    doc.addImage("assets/logo.png", "PNG", 20, footerY, 40, 15);
  
    doc.setFontSize(10);
    doc.text(
      [
        `Dirección: ${shopConfig?.address1 || ""}`,
        `${shopConfig?.city || ""}, ${shopConfig?.province || ""}`,
        `Correo: ${shopConfig?.email || ""}`,
        `Teléfono: ${shopConfig?.phone || ""}`,
      ],
      pageWidth - 20,
      footerY,
      { align: "right" },
    );
  
    // Guardar el PDF
    doc.save("cotizacion.pdf");
  };
  
  function getPricesAsModels(variant: ProductVariant): VariantPriceModel[] {
    return variant.prices.map((p) => VariantPriceModel.fromInterface(p));
  }
  
  const validUrl = (imagePath: any) => {
    return imagePath ? `${process.env.BASE_IMAGE_URL}/uploads/${imagePath}` : '/default-image.png';
  }

  const handleUpdateCart = () => {
    // In a real app, this would sync with the backend
    console.log("Cart updated")
  }

  return (
    <>
      <SiteHeader />
      <main className="container-section py-16">
        <div className="content-section ">
        <h2 className="text-3xl font-medium mb-8">Carrito de Compras</h2>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Tu carrito está vacío</p>
            <Button asChild>
              <Link href="/">Continuar Comprando</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="rounded-lg border overflow-hidden mb-8">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-4">Imagen</th>
                    <th className="text-left p-4">Producto</th>
                    <th className="text-left p-4">Precio</th>
                    <th className="text-left p-4">Cantidad</th>
                    <th className="text-left p-4">Total</th>
                    <th className="text-left p-4">Eliminar</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {items.map((item) => {
                    const priceModels = getPricesAsModels(item.variant);
                    const price = getPrice(item)
                    const itemTotal = price * item.quantity
                    

                    return (
                      <tr key={item.variant.id} className="bg-white">
                        <td className="p-4">
                          <div className="w-24 h-24 relative">
                            <Image
                              src={item.product.imageUrls[0]}
                              alt={item.variant.title}
                              fill
                              className="object-contain"
                            />
                          </div>
                        </td>
                        <td className="p-4">
                          <h3 className="font-medium">{item.product.title}</h3>
                          {item.variant.title && (
                            <p className="text-sm text-muted-foreground">{item.variant.title}</p>
                          )}
                        </td>
                        <td className="p-4">{currency?.symbol} {price.toFixed(2)}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleQuantityChange(item.product.slug, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <Input
                              type="number"
                              min="0"
                              value={item.quantity}
                              onChange={(e) =>
                                handleQuantityChange(item.product.slug, Number.parseInt(e.target.value) || 0)
                              }
                              className="w-16 text-center"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleQuantityChange(item.product.slug, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                        <td className="p-4">{currency?.symbol} {itemTotal.toFixed(2)}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => removeItem(item.variant.id)}>
                              <X className="h-4 w-4" />
                            </Button>
                            {/* <Button variant="ghost" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button> */}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center mb-8">
              <Button asChild variant="outline">
                <Link href="/">CONTINUAR COMPRANDO</Link>
              </Button>
              <div className="flex gap-4">
                <Button variant="outline" className="bg-gradient-to-br from-white to-pink-300" onClick={generateQuotePDF}>
                  GENERAR COTIZACIÓN
                </Button>
                <Button variant="outline" onClick={clearCart}>
                  LIMPIAR CARRITO
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="border rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">Fecha de entrega</h2>
                  <div className="space-y-4">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                        >
                          {date ? format(date, "PPP", { locale: es }) : "Escoger una Fecha de entrega"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                          disabled={(date) => date.getDay() === 0 || date.getDay() === 6}
                        />
                      </PopoverContent>
                    </Popover>
                    <p className="text-sm text-muted-foreground">No hacemos delivery los fines de semana</p>
                  </div>
                </div>

                <div className="border rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">Instrucciones especiales para el vendedor</h2>
                  <Textarea
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="Escribe aquí tus instrucciones especiales..."
                    className="min-h-[100px]"
                  />
                </div>
              </div>

              <div className="border rounded-lg p-6 h-fit">
                <h2 className="text-xl font-semibold mb-4">Precio Total</h2>
                <div className="space-y-4">
                  <div className="flex justify-between py-2 border-b">
                    <span>Subtotal</span>
                    <span>{currency?.symbol} {total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b font-medium">
                    <span>Total</span>
                    <span>{currency?.symbol} {total.toFixed(2)}</span>
                  </div>
                  <Button className="w-full bg-pink-500 hover:bg-pink-600"><Link href="/checkout">Proceder a pagar</Link></Button>
                </div>
              </div>
            </div>
          </>
        )}
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
