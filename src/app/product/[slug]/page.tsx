"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Facebook, Twitter, Share2, Ruler, Truck, HelpCircle, Minus, Plus, Heart, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react'
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
import { Product, ProductVariant } from "@/types/product"
import { useCart } from "@/contexts/cart.context"
import {use} from "react"

import { useParams } from 'next/navigation'
import { SiteFooter } from "@/components/site-footer"
import { toast } from "sonner"
interface ColorOption {
  id: string
  label: string
  value: string
  className: string
}

interface VariantAttributeGroup {
  type: string
  values: string[]
  available: { [key: string]: boolean }
}


const colorOptions: ColorOption[] = [
  { id: "pink", label: "Rosa", value: "pink", className: "bg-pink-500" },
  { id: "black", label: "Negro", value: "black", className: "bg-gray-700" },
]

const ProductPage = ({ params }: { params: { slug: string } }) => {
  const [selectedAttributes, setSelectedAttributes] = useState<{ 
    [key: string]: string }>({})
  const rparams = useParams<{slug: string }>()
  const { addItem } = useCart()
  const [selectedColor, setSelectedColor] = useState<string>("pink")
  const [quantity, setQuantity] = useState(1)
  const { getProductSlug } = useProducts()

  // Image selector
  const thumbnailsRef = useRef<HTMLDivElement>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)

  // params = React.use(params)
  console.log('rparams', rparams)

  const product = getProductSlug(rparams.slug)
  const imageUrls = product?.imageUrls

  const generate_url = (url: string) => {
    return `${process.env.BASE_IMAGE_URL}/uploads/${url}`;
  }

  const defaultImage = (imageUrls: string[]) => {
    return imageUrls && imageUrls.length > 0 && imageUrls[0]
    ? generate_url(imageUrls[0])
    : "/assets/image.png";
  }
  const validUrl = imageUrls && imageUrls.length > 0 && imageUrls[0]
    ? generate_url(imageUrls[0])
    : "/assets/image.png";
    
  const productImages = product?.imageUrls.length ? product.imageUrls : ["/placeholdes.svg"]

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % productImages.length)
  }
  
  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartX(e.pageX - (thumbnailsRef.current?.offsetLeft || 0))
    setScrollLeft(thumbnailsRef.current?.scrollLeft || 0)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    e.preventDefault()
    if (!thumbnailsRef.current) return
    const x = e.pageX - (thumbnailsRef.current.offsetLeft || 0)
    const walk = (x - startX) * 2
    thumbnailsRef.current.scrollLeft = scrollLeft - walk
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }


  const scrollThumbnails = (direction: "left" | "right") => {
    if (!thumbnailsRef.current) return
    const scrollAmount = 200
    thumbnailsRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    })
  }

  // Group variants by attribute type
  const attributeGroups =
    product?.variants.reduce((groups: { [key: string]: VariantAttributeGroup }, variant) => {
      Object.entries(variant.attributes).forEach(([type, value]) => {
        if (!groups[type]) {
          groups[type] = {
            type,
            values: [],
            available: {},
          }
        }
        if (!groups[type].values.includes(value)) {
          groups[type].values.push(value)
        }
        groups[type].available[value] = variant.inventoryQuantity > 0
      })
      return groups
    }, {}) || {}

  const handleAttributeSelect = (type: string, value: string) => {
      setSelectedAttributes((prev) => ({
        ...prev,
        [type]: value,
      }))
    }

  // Find the selected variant based on selected attributes
  const findSelectedVariant = (): ProductVariant | undefined => {
    if (!product) return undefined

    return product.variants.find((variant) =>
      Object.entries(selectedAttributes).every(([key, value]) => variant.attributes[key] === value),
    )
  }

  const selectedVariant = findSelectedVariant()
  const variantPrice = selectedVariant?.prices[0]?.price ? 
    Number(selectedVariant.prices[0].price) : 0


  const incrementQuantity = () => {
      if (selectedVariant && quantity < selectedVariant.inventoryQuantity) {
        setQuantity((prev) => prev + 1)
      }
  }

  const decrementQuantity = () => {
    setQuantity((prev) => Math.max(prev - 1, 1))
  }


  const handleAddToCart = () => {
    if (product && selectedVariant) {
      addItem(product, selectedVariant)
      toast.success("Producto añadido al carrito")
    } else {
      toast.error("Por favor selecciona todas las opciones")
    }
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
                src={generate_url(productImages[selectedImageIndex])}
                alt="Tenergy 05 FX"
                fill
                className="object-contain"
              />
              {/* Main Image Navigation */}
                <div className="absolute inset-0 flex items-center justify-between p-4">
                  <Button variant="outline" size="icon" onClick={prevImage} 
                    className="bg-white/80 hover:bg-white">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={nextImage} 
                    className="bg-white/80 hover:bg-white">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
            </div>
            {productImages.length > 0 && (
              <div className="relative">
                {/* Thumbnail Navigation */}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => scrollThumbnails("left")}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => scrollThumbnails("right")}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                {/* Thumbnails Slider */}
                <div
                  ref={thumbnailsRef}
                  className="flex gap-2 overflow-x-auto scrollbar-hide mx-10"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseLeave}
                  style={{ scrollBehavior: isDragging ? "auto" : "smooth" }}
                >
                  {productImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={cn(
                        "relative flex-shrink-0 w-20 aspect-square border rounded-md overflow-hidden bg-white",
                        selectedImageIndex === index && "ring-2 ring-pink-500",
                      )}
                    >
                      <Image
                        src={generate_url(productImages[selectedImageIndex])}
                        alt={`${product?.name} - Vista ${index + 1}`}
                        fill
                        className="object-contain p-1"
                      />
                    </button>
                  ))}
                </div>
                {/* Pagination Dots */}
                <div className="flex justify-center gap-1 mt-4">
                  {productImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={cn(
                        "w-2 h-2 rounded-full transition-colors",
                        selectedImageIndex === index ? "bg-pink-500" : "bg-gray-300",
                      )}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{product?.title}</h1>
              <div className="mt-4">
                <span className="text-3xl font-bold text-pink-500">S/. {variantPrice.toFixed(2)}</span>
              </div>
            </div>

            {selectedVariant && (
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "h-2 w-2 rounded-full",
                    selectedVariant.inventoryQuantity > 0 ? "bg-green-500" : "bg-red-500",
                  )}
                />
                <p className="text-sm text-muted-foreground">
                  {selectedVariant.inventoryQuantity > 0 ? `${selectedVariant.inventoryQuantity} en stock` : "Agotado"}
                </p>
              </div>
            )}

            <p className="text-muted-foreground text-sm">{product?.description.slice(0, 400) + "..." || 
            "Descripción del producto no disponible."}</p>

            <ul>
              <li className="flex items-center border">
                <span className="font-semibold  text-center text-xs w-1/4 border py-2">Distribuidor:</span>
                <span className="text-sm w-3/4 text-center">
                  <a href="/" title="Distribuidor" className="hover:underline">{product?.vendor}</a>
                </span>
              </li>
            </ul>
            {/* Variant Selectors */}
            <div className="space-y-6">
              {Object.entries(attributeGroups).map(([type, group]) => (
                <div key={type} className="space-y-2">
                  <Label className="text-base">{type}:</Label>
                  <div className="flex flex-wrap gap-2">
                    {group.values.map((value) => {
                      const isSelected = selectedAttributes[type] === value
                      const isAvailable = group.available[value]

                      return (
                        <Button
                          key={value}
                          variant="outline"
                          size="sm"
                          className={cn(
                            "h-9 px-4",
                            isSelected && "border-pink-500 bg-pink-50 text-pink-500",
                            !isAvailable && "opacity-50 cursor-not-allowed line-through",
                          )}
                          onClick={() => isAvailable && handleAttributeSelect(type, value)}
                          disabled={!isAvailable}
                        >
                          {value}
                        </Button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-4">

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
                    disabled={!selectedVariant || quantity >= selectedVariant.inventoryQuantity}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  className="flex-1 bg-zinc-900 hover:bg-zinc-800"
                  onClick={handleAddToCart}
                  disabled={!selectedVariant || selectedVariant.inventoryQuantity === 0}
                >
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
                    src="/assets/amazon.svg"
                    alt="Amazon"
                    width={40}
                    height={24}
                    className="h-6 w-auto"
                  />
                  <Image
                    src="/assets/bitcoin.svg"
                    alt="Bitcoin"
                    width={40}
                    height={24}
                    className="h-6 w-auto"
                  />
                  <Image
                    src="/assets/paypal.svg"
                    alt="PayPal"
                    width={40}
                    height={24}
                    className="h-6 w-auto"
                  />
                  <Image
                    src="/assets/visa.svg"
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
