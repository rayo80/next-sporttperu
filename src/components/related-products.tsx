"use client"

import { useProducts } from "@/contexts/product.context"
import { HorizontalProductCard } from "./horizontal-card"
import { Product } from "@/types/product"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef, useState } from "react"

interface RelatedProductsProps {
  currentProduct: Product
  maxProducts?: number
}

export function RelatedProducts({ currentProduct, maxProducts = 4 }: RelatedProductsProps) {
  const { products } = useProducts()
  const sliderRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  // Get related products based on the same category
  const relatedProducts = products
    .filter(product => 
      // Don't include the current product
      product.id !== currentProduct.id && 
      // Include products that share at least one category with the current product
      product.categories.some(category => 
        currentProduct.categories.some(currentCategory => 
          currentCategory.id === category.id
        )
      )
    )
    .slice(0, maxProducts)

  const checkScrollability = () => {
    if (!sliderRef.current) return
    
    setCanScrollLeft(sliderRef.current.scrollLeft > 0)
    setCanScrollRight(
      sliderRef.current.scrollLeft < 
      sliderRef.current.scrollWidth - sliderRef.current.clientWidth - 10
    )
  }

  const scroll = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return
    
    const scrollAmount = sliderRef.current.clientWidth * 0.8
    sliderRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    })
    
    // Update scroll buttons state after scrolling
    setTimeout(checkScrollability, 300)
  }

  if (relatedProducts.length === 0) return null

  return (
    <section className="py-16 border-t border-gray-100">
      <div className="content-section">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Productos relacionados</h2>
            <p className="text-gray-500 mt-1">Basados en la misma categoría</p>
          </div>
          
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2 rounded-full border ${canScrollLeft 
                ? 'bg-white text-gray-900 border-gray-200' 
                : 'bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed'}`}
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
            >
              <ChevronLeft className="h-5 w-5" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2 rounded-full border ${canScrollRight 
                ? 'bg-white text-gray-900 border-gray-200' 
                : 'bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed'}`}
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
            >
              <ChevronRight className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
        
        <div 
          ref={sliderRef}
          className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide"
          onScroll={checkScrollability}
        >
          {relatedProducts.map(product => (
            <div key={product.id} className="min-w-[300px] flex-shrink-0">
              <HorizontalProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}