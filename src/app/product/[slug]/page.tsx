"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Facebook, Twitter, Share2, Ruler, Truck, HelpCircle, Minus, Plus, Heart, RefreshCw } from 'lucide-react'
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { cn } from "@/lib/utils"
import { useProducts } from "@/contexts/product.context"
import { Product } from "@/types/product"
import { useCart } from "@/contexts/cart.context"
import {use} from "react"

import { useParams } from 'next/navigation'
import { SiteFooter } from "@/components/site-footer"
interface ColorOption {
  id: string
  label: string
  value: string
  className: string
}

const colorOptions: ColorOption[] = [
  { id: "pink", label: "Rosa", value: "pink", className: "bg-pink-500" },
  { id: "black", label: "Negro", value: "black", className: "bg-gray-700" },
]

const ProductPage = ({ params }: { params: { slug: string } }) => {
  const rparams = useParams<{slug: string }>()
  const { addItem } = useCart()
  const [selectedColor, setSelectedColor] = useState<string>("pink")
  const [quantity, setQuantity] = useState(1)
  const { getProductSlug } = useProducts()
  // params = React.use(params)
  console.log('rparams', rparams)
  const product = getProductSlug(rparams.slug)
  const imageUrls = product?.imageUrls
  const url = `${process.env.BASE_IMAGE_URL}/uploads/${imageUrls[0]}`;
  const validUrl = imageUrls && imageUrls.length > 0 && imageUrls[0]
    ? url
    : "/assets/image.png";
  
  const incrementQuantity = () => {
    setQuantity(prev => Math.min(prev + 1, 99))
  }

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(prev - 1, 1))
  }

  return (
    <>
      <SiteHeader />
      <main className="container px-4 py-8">
        <div className="mb-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Inicio</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/shop/gomas">Gomas</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Tenergy 05 FX</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square relative border rounded-lg overflow-hidden">
              <Image
                src={validUrl}
                alt="Tenergy 05 FX"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{product?.title}</h1>
              <div className="mt-4">
                <span className="text-3xl font-bold text-pink-500">S/. 285.00</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              <p className="text-sm text-muted-foreground">
                Disponible: {product?.inventoryQuantity} en stock
              </p>
            </div>

            <p className="text-muted-foreground">
              {product?.description}
            </p>

            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-4">
                <span className="font-medium">Distribuidor:</span>
                <span>Sportt</span>
              </div>

              <div className="space-y-2">
                <Label>Color:</Label>
                <RadioGroup
                  value={selectedColor}
                  onValueChange={setSelectedColor}
                  className="flex gap-2"
                >
                  {colorOptions.map((option) => (
                    <Label
                      key={option.id}
                      htmlFor={option.id}
                      className="cursor-pointer"
                    >
                      <RadioGroupItem
                        id={option.id}
                        value={option.value}
                        className="peer sr-only"
                      />
                      <div className={cn(
                        "h-8 w-8 rounded-full border-2 border-transparent ring-offset-background transition-all hover:scale-110",
                        option.className,
                        "peer-data-[state=checked]:border-white peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-pink-500"
                      )} />
                      <span className="sr-only">{option.label}</span>
                    </Label>
                  ))}
                </RadioGroup>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-none"
                    onClick={decrementQuantity}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="w-12 text-center">{quantity}</div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-none"
                    onClick={incrementQuantity}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <Button 
                  className="flex-1 bg-zinc-900 hover:bg-zinc-800" 
                  onClick={()=>addItem(product)}>
                  AÑADIR A CARRITO
                </Button>
              </div>

              <Button className="w-full bg-pink-500 hover:bg-pink-600">
                Comprar ahora
              </Button>

              <div className="flex items-center justify-center gap-6 py-4">
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  <Ruler className="h-4 w-4 mr-2" />
                  Guía De Tamaño
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  <Truck className="h-4 w-4 mr-2" />
                  Envío
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Pregunta Sobre Este Producto
                </Button>
              </div>

              <div className="flex items-center gap-4 border-t pt-4">
                <Button variant="outline" size="icon">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <div className="flex-1" />
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  <Facebook className="h-4 w-4 mr-2" />
                  Compartir
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  <Twitter className="h-4 w-4 mr-2" />
                  Tweet
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  <Share2 className="h-4 w-4 mr-2" />
                  Pin
                </Button>
              </div>

              <div className="border-t pt-4">
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Truck className="h-4 w-4" />
                  Fecha de delivery estimada: 14 - 16 January 2025
                </p>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Pago seguro garantizado:
                </p>
                <div className="flex gap-2">
                  <Image
                    src="/placeholder.svg"
                    alt="Amazon"
                    width={40}
                    height={24}
                    className="h-6 w-auto"
                  />
                  <Image
                    src="/placeholder.svg"
                    alt="American Express"
                    width={40}
                    height={24}
                    className="h-6 w-auto"
                  />
                  <Image
                    src="/placeholder.svg"
                    alt="PayPal"
                    width={40}
                    height={24}
                    className="h-6 w-auto"
                  />
                  <Image
                    src="/placeholder.svg"
                    alt="Visa"
                    width={40}
                    height={24}
                    className="h-6 w-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}

export default ProductPage
