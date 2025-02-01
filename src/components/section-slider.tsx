"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { ProductCard } from "./product-card"
import { Product } from "@/types/product"


interface ProductSliderProps {
  products: Product[]
}

export function ProductSlider({ products }: ProductSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const sliderRef = useRef<HTMLDivElement>(null)

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev + 1 >= products.length - 2 ? 0 : prev + 1
    )
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev - 1 < 0 ? products.length - 3 : prev - 1
    )
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartX(e.pageX - (sliderRef.current?.offsetLeft || 0))
    setScrollLeft(currentIndex * (sliderRef.current?.offsetWidth || 0) / 3)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    setStartX(e.touches[0].pageX - (sliderRef.current?.offsetLeft || 0))
    setScrollLeft(currentIndex * (sliderRef.current?.offsetWidth || 0) / 3)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    e.preventDefault()
    const x = e.pageX - (sliderRef.current?.offsetLeft || 0)
    const walk = (x - startX) * 2
    const newIndex = Math.round((scrollLeft - walk) / ((sliderRef.current?.offsetWidth || 0) / 3))
    if (newIndex >= 0 && newIndex <= products.length - 3) {
      setCurrentIndex(newIndex)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    const x = e.touches[0].pageX - (sliderRef.current?.offsetLeft || 0)
    const walk = (x - startX) * 2
    const newIndex = Math.round((scrollLeft - walk) / ((sliderRef.current?.offsetWidth || 0) / 3))
    if (newIndex >= 0 && newIndex <= products.length - 3) {
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
          style={{ transform: `translateX(-${currentIndex * 33.333}%)` }}
        >
          {products.map((product, idx) => (
            <div key={idx} className="min-w-[33.333%] px-3">
              <ProductCard product={product} />
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
