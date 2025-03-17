"use client"

import Image from "next/image"
import Link from "next/link"
import { Plus } from 'lucide-react'
import type { Product, VariantPrice } from "@/types/product"
import { toast } from "sonner"
import { useCart } from "@/contexts/cart.context"
import { useShop } from "@/contexts/shop.context"
import { motion } from "framer-motion"

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
  
  // Check if there's a sale price (randomly for demo)
  const hasSale = Math.random() > 0.7
  const originalPrice = hasSale ? price * 1.2 : null

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (defaultVariant){
      addItem(product, defaultVariant)
      toast.success("Producto añadido al carrito")
    }
  }

  return (
    <motion.div 
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="h-full"
    >
      <Link href={`/product/${slug}`} className="block h-full">
        <div className="flex h-full bg-white rounded-xl overflow-hidden transition-all duration-300 group relative border border-gray-100">
          {/* Image container */}
          <div className="relative w-1/3 aspect-square overflow-hidden bg-white">
            {imageUrls && imageUrls[0] ? (
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full"
              >
                <Image
                  src={imageUrls[0] || "/placeholder.svg"}
                  alt={title}
                  fill
                  className="object-contain p-2"
                />
              </motion.div>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <span className="text-gray-400">Sin imagen</span>
              </div>
            )}
            
            {/* Status indicator - subtle dot */}
            {inventoryQuantity > 0 ? (
              <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-green-500"></div>
            ) : (
              <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-gray-400"></div>
            )}
          </div>
          
          {/* Content */}
          <div className="flex-1 p-4 flex flex-col justify-between">
            <div>
              {/* Optional sale tag */}
              {hasSale && (
                <span className="inline-block text-xs font-medium text-pink-600 mb-1">Oferta</span>
              )}
              
              {/* Product title */}
              <h3 className="font-medium text-gray-800 line-clamp-1 group-hover:text-gray-900 transition-colors">
                {title}
              </h3>
              
              {/* Price */}
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-base font-semibold text-gray-900">{selectedCurrency?.symbol} {price.toFixed(2)}</span>
                {originalPrice && (
                  <span className="text-xs text-gray-500 line-through">{selectedCurrency?.symbol} {originalPrice.toFixed(2)}</span>
                )}
              </div>
            </div>
            
            {/* Add to cart button - minimal */}
            <div className="mt-auto flex justify-end">
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: '#000' }}
                whileTap={{ scale: 0.95 }}
                className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center transition-colors"
                onClick={handleAddToCart}
              >
                <Plus className="h-4 w-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}