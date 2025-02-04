"use client"
import Image from "next/image"
import { Heart, Search, RefreshCw, ShoppingCart } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { ButtonCard } from "./button-card"
import { useCart } from "@/contexts/cart.context"
import { Product } from "@/types/product"
import { toast } from "sonner"

interface ProductCardProps {
  product: Product
  compact?: boolean
}

export function ProductCard({
  product,
  compact = false,
}: ProductCardProps) {
  const { addItem } = useCart()
  const { title, slug, imageUrls, inventoryQuantity, prices, status, variants} = product
  const url = `${process.env.BASE_IMAGE_URL}/uploads/${imageUrls[0]}`;
  const validUrl = imageUrls && imageUrls.length > 0 && imageUrls[0]
    ? url
    : "/assets/image.png";
  // const imagePath = imageUrls[0]
  // const fullImageUrl = imagePath
  // ? `${process.env.BASE_IMAGE_URL}/${imagePath}`
  // : '/default-image.png';
  // const new_url = imagePath == "" ? '/image.png' : imagePath;
  // const new_url = "https://cdn.shopify.com/s/files/1/0678/9618/0971/files/IMG_6073.jpg?v=1714077954"
  const defaultVariant = variants[0]
  const price = defaultVariant?.prices[0]?.price ? Number.parseFloat(defaultVariant.prices[0].price) : 0
  const mainPrice = prices?.find(p => p.currencyId === 'PEN')
  const isOutOfStock = inventoryQuantity === 0
  const isOnSale = status === "PUBLISHED" && price < (variants[0]?.price || price)
  const discount = isOnSale ? Math.round(((variants[0]?.price || price) - price) / (variants[0]?.price || price) * 100) : 0

  const handleAddToCart = () => {
    if (defaultVariant){
      console.log("Añadiendo", defaultVariant)
      addItem(product, defaultVariant)
      toast.success("Producto añadido al carrito")
      console.log("Añadir al carrito")
    }
  }


  return (
  <Link href={`/product/${slug}`}>
    <Card className={cn(
      "group relative overflow-hidden transition-all duration-300 hover:shadow-lg",
      compact ? "p-2" : "p-0"
    )}>
      <CardContent className={compact ? "p-2" : "p-0"}>
        <div className={cn(
          "relative overflow-hidden w-full",
          compact ? "aspect-[3/4] p-2" : "aspect-square p-6"
        )}>
          <Image
            src={validUrl}
            alt={title}
            fill
            className="object-contain p-2"
            sizes="transition-transform duration-300 group-hover:scale-105 
            (max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={90}
          />
          {isOutOfStock && (
            <Badge variant="destructive" className="absolute top-2 left-2">
              AGOTADO
            </Badge>
          )}
          {isOnSale && (
            <Badge variant="default" className="absolute top-2 left-2 bg-pink-500">
              OFERTA
            </Badge>
          )}
          {discount && (
            <Badge variant="default" className="absolute top-14 left-2 bg-pink-500">
              -{discount}%
            </Badge>
          )}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3">
            {[
              // { icon: Heart, label: "Favorito" },
              { icon: Search, label: "Buscar" },
              // { icon: RefreshCw, label: "Comparar" },
              { icon: ShoppingCart, label: "Añadir al carrito", action: handleAddToCart }
            ].map((item, index) => (
                <ButtonCard
                  key={index}
                  item={item}
                  action={() => {item.action && item.action()}}
                />
            ))}
          </div>
        </div>
        <div className="p-4 w-full">
          <h5 className="text-sm">{title}</h5>
          <div className="flex items-baseline gap-2 mt-1">
            {price && (
              <span className="text-sm text-muted-foreground line-through">
                S/. {price.toFixed(2)}
              </span>
            )}
            <span className="text-lg font-bold text-pink-500">
              S/. {price?.toFixed(2)}
            </span>
          </div>
          {inventoryQuantity > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                <p className={cn(
                  "text-muted-foreground",
                  compact ? "text-xs" : "text-sm"
                )}>
                  {inventoryQuantity} en stock
                </p>
              </div>
            )}
        </div>
      </CardContent>
    </Card>
  </Link>
  )
}

