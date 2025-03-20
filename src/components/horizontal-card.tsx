"use client"

import Image from "next/image"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Product, VariantPrice } from "@/types/product"
import { toast } from "sonner"
import { useCart } from "@/contexts/cart.context"
import { useShop } from "@/contexts/shop.context"

interface HorizontalProductCardProps {
  product: Product
}

export function HorizontalProductCard({ product }: HorizontalProductCardProps) {
  const { addItem } = useCart()
  const { title, slug, imageUrls, variants } = product
  const defaultVariant = variants[0]
  const { selectedCurrency } = useShop()
  const priceObject = defaultVariant?.prices.find((p: VariantPrice) => p.currency.code === selectedCurrency?.code)
  const price = Number.parseFloat(priceObject?.price || "0")
  const inventoryQuantity = variants[0]?.inventoryQuantity || 0

  const handleAddToCart = () => {
    if (defaultVariant){
      addItem(product, defaultVariant)
      toast.success("Producto añadido al carrito")
      console.log("Añadir al carrito")
    }
  }

  // const generate_url = (url: string) => {
  //   return `${process.env.BASE_IMAGE_URL}/uploads/${url}`;
  // }

  const generate_url = (url: string) => {
    return url;
  }

  const validUrl = imageUrls && imageUrls.length > 0 && imageUrls[0]
    ? generate_url(imageUrls[0])
    : "/assets/image.png";

  return (
    <Link href={`/product/${slug}`} className="block group">
      <div className="flex flex-col md:flex-row items-start 
      gap-6 p-4 bg-white rounded-lg border transition-shadow hover:shadow-lg relative">
        <div className="relative w-full md:w-48 aspect-square md:aspect-[4/3] flex-shrink-0">
          <Image
            src={validUrl}
            alt={title}
            fill
            className="object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="flex-grow space-y-2">
          <h3 className="text-lg font-medium mb-2">{title}</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-pink-500">{selectedCurrency?.symbol} {price.toFixed(2)}</span>
          </div>
          {inventoryQuantity > 0 && (
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-gray-300" />
              <p className="text-sm text-muted-foreground">{inventoryQuantity} en stock</p>
            </div>
          )}
        </div>
        <Button size="icon" 
          className="absolute top-4 right-4 bg-pink-500 hover:bg-pink-600" 
          onClick={handleAddToCart}>
          <ShoppingCart className="h-4 w-4" />
          <span className="sr-only">Añadir al carrito</span>
        </Button>
      </div>
    </Link>
  )
}
