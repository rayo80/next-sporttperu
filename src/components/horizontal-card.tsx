"use client"

import Image from "next/image"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
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
  const priceObject = defaultVariant?.prices.find(
    (p: VariantPrice) => p.currency.code === selectedCurrency?.code
  )
  const price = Number.parseFloat(priceObject?.price || "0")
  const inventoryQuantity = variants[0]?.inventoryQuantity || 0

  const handleAddToCart = () => {
    if (defaultVariant) {
      addItem(product, defaultVariant)
      toast.success("Producto añadido al carrito", {
        duration: 2000,
      })
    }
  }

  const generate_url = (url: string) => {
    return url
  }

  const validUrl = imageUrls && imageUrls.length > 0 && imageUrls[0]
    ? generate_url(imageUrls[0])
    : "/assets/image.png"

  return (
    <Card className="group h-52 overflow-hidden border border-gray-100 bg-gradient-to-b from-white to-gray-50 shadow-sm transition-all hover:shadow-md">
      <div className="flex h-full flex-row">
        <div className="relative h-full w-40">
          <Link href={`/productos/${slug}`}>
            <div className="relative h-full w-full overflow-hidden">
              <Image
                src={validUrl}
                alt={title}
                fill
                className="object-contain  rounded-md p-2 transition-transform group-hover:scale-102"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          </Link>
        </div>
        
        <div className="flex flex-1 flex-col justify-between p-4">
          <CardContent className="p-0">
            <Link href={`/productos/${slug}`} className="no-underline">
              <h3 className="mb-2 text-sm font-medium text-gray-800 transition-colors hover:text-gray-600">{title}</h3>
            </Link>
            
            <div className="mt-1 flex items-baseline">
              <span className="text-sm font-medium text-pink-500">
                {selectedCurrency?.symbol} {price.toFixed(2)}
              </span>
            </div>
            
            {inventoryQuantity > 0 && (
              <div className="mt-2">
                <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-normal text-gray-500">
                  {inventoryQuantity} en stock
                </span>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="p-0 pt-3">
            <Button 
              onClick={handleAddToCart}
              disabled={inventoryQuantity <= 0}
              variant="outline"
              className="group flex w-full items-center justify-center gap-2 border border-gray-200 bg-gradient-to-r from-white to-gray-100 text-xs text-gray-700 shadow-sm transition-all hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-200"
            >
              <ShoppingCart className="h-3 w-3" />
              Añadir al carrito
            </Button>
          </CardFooter>
        </div>
      </div>
    </Card>
  )
}