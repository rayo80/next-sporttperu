"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { ProductCard } from "./product-card"
import { Product } from "@/types/product"

// interface Product {
//   title: string
//   price: number
//   originalPrice?: number
//   images: string[]
//   stockAvailable?: number
//   isOutOfStock?: boolean
//   isOnSale?: boolean
//   discount?: number
// }

interface ProductSliderProps {
  products: Product[]
  productsPerView?: number
  breakpoints?: {
    [key: string]: number
  }
  compact?: boolean
}

export function ProductSlider({ products, breakpoints = { sm: 1, md: 2, lg: 3, xl: 4 }, compact = false }  : ProductSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const sliderRef = useRef<HTMLDivElement>(null)
  const [productsPerView, setProductsPerView] = useState(breakpoints.sm || 1)

  const nextSlide = () => {
    console.log("per view", productsPerView)
    setCurrentIndex((prev) => 
      prev + 1 >= products.length - productsPerView + 1 ? 0 : prev + 1
    )
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev - 1 < 0 ? products.length - productsPerView  : prev - 1
    )
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartX(e.pageX - (sliderRef.current?.offsetLeft || 0))
    setScrollLeft(currentIndex * (sliderRef.current?.offsetWidth || 0) / productsPerView)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    setStartX(e.touches[0].pageX - (sliderRef.current?.offsetLeft || 0))
    setScrollLeft(currentIndex * (sliderRef.current?.offsetWidth || 0) / productsPerView)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    e.preventDefault()
    const x = e.pageX - (sliderRef.current?.offsetLeft || 0)
    const walk = (x - startX) * 2
    const newIndex = Math.round((scrollLeft - walk) / ((sliderRef.current?.offsetWidth || 0) / productsPerView))
    if (newIndex >= 0 && newIndex <= products.length - productsPerView) {
      setCurrentIndex(newIndex)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    const x = e.touches[0].pageX - (sliderRef.current?.offsetLeft || 0)
    const walk = (x - startX) * 2
    const newIndex = Math.round((scrollLeft - walk) / ((sliderRef.current?.offsetWidth || 0) / productsPerView))
    if (newIndex >= 0 && newIndex <= products.length - productsPerView) {
      setCurrentIndex(newIndex)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    const slider = sliderRef.current
    if (!slider) return

    slider.addEventListener('touchend', handleMouseUp)
    slider.addEventListener('touchcancel', handleMouseLeave)

    return () => {
      slider.removeEventListener('touchend', handleMouseUp)
      slider.removeEventListener('touchcancel', handleMouseLeave)
    }
  }, [])

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      console.log("width", width)
      let newProductsPerView = breakpoints.sm || 1 // Default to 1 if sm is not defined

      if (width >= 1280) { // xl
        newProductsPerView = breakpoints.xl || 4
      } else if (width >= 1024) { // lg
        newProductsPerView = breakpoints.lg || 3
      } else if (width >= 768) { // md
        newProductsPerView = breakpoints.md || 2
      } else if (width >= 640) { // sm
        newProductsPerView = breakpoints.sm || 1
      }

      setProductsPerView(newProductsPerView)
    }

    handleResize() // Call once to set initial state
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [breakpoints])





  return (
    <div className="relative">
      <div 
        ref={sliderRef}
        className="overflow-hidden touch-pan-x"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        <div 
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${currentIndex * (100 / productsPerView)}%)` }}
        >
          {products.map((product, idx) => (
            <div 
              key={idx} 
              className="flex-shrink-0 px-2"
              // className={`w-full sm:w-1/2 flex-shrink-0 px-2 ${
              //   productsPerView === 3 ? 'md:w-1/3' : 
              //   productsPerView === 4 ? 'md:w-1/4' : 
              //   productsPerView === 5 ? 'md:w-1/5' : ''
              // }`}
              style={{ width: `${100 / productsPerView}%`}}
              >
              <ProductCard product={product} compact={compact} />
            </div>
          ))}
        </div>
      </div>
      <Button
        variant="outline"
        size="icon"
        className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white shadow-md hover:bg-gray-100"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white shadow-md hover:bg-gray-100"
        onClick={nextSlide}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

