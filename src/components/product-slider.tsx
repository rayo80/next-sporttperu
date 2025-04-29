"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { ProductCard } from "./product-card"
import { Product } from "@/types/product"
import { motion, AnimatePresence } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"

interface ProductSliderProps {
  products: Product[]
  productsPerView?: number
  breakpoints?: {
    [key: string]: number
  }
  compact?: boolean
  isLoading?: boolean
}

export function ProductSlider({ 
  products = [], 
  breakpoints = { sm: 1, md: 2, lg: 4, xl: 4 }, 
  compact = false,
  isLoading = false
}: ProductSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const sliderRef = useRef<HTMLDivElement>(null)
  const [productsPerView, setProductsPerView] = useState(breakpoints.sm || 1)

  // Añade estas variables para rastrear el inicio del toque y la dirección
  const [touchStartX, setTouchStartX] = useState(0)
  const [touchStartY, setTouchStartY] = useState(0)
  const [isHorizontalSwipe, setIsHorizontalSwipe] = useState(false)

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev + 1 >= products.length - productsPerView + 1 ? 0 : prev + 1
    )
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev - 1 < 0 ? products.length - productsPerView : prev - 1
    )
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartX(e.pageX - (sliderRef.current?.offsetLeft || 0))
    setScrollLeft(currentIndex * ((sliderRef.current?.offsetWidth || 0) / productsPerView))
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    setTouchStartX(e.touches[0].pageX)
    setTouchStartY(e.touches[0].pageY)
    setStartX(e.touches[0].pageX - (sliderRef.current?.offsetLeft || 0))
    setScrollLeft(currentIndex * ((sliderRef.current?.offsetWidth || 0) / productsPerView))
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

    const touchX = e.touches[0].pageX
    const touchY = e.touches[0].pageY

    // Calcular la distancia recorrida en ambas direcciones
    const deltaX = Math.abs(touchX - touchStartX)
    const deltaY = Math.abs(touchY - touchStartY)

    // Si aún no hemos determinado la dirección principal del deslizamiento
    if (!isHorizontalSwipe && (deltaX > 10 || deltaY > 10)) {
      // Si el movimiento horizontal es mayor que el vertical, es un deslizamiento horizontal
      setIsHorizontalSwipe(deltaX > deltaY)

      // Si es un deslizamiento vertical, detener la captura de este evento
      if (deltaY > deltaX) {
        setIsDragging(false)
        return
      }
    }

    if (isHorizontalSwipe) {
      if (!isDragging) return
      const x = e.touches[0].pageX - (sliderRef.current?.offsetLeft || 0)
      const walk = (x - startX) * 2
      const newIndex = Math.round((scrollLeft - walk) / ((sliderRef.current?.offsetWidth || 0) / productsPerView))
      if (newIndex >= 0 && newIndex <= products.length - productsPerView) {
        setCurrentIndex(newIndex)
      }
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    setIsHorizontalSwipe(false)
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
      let newProductsPerView = breakpoints.sm || 1

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

    handleResize() // Estado inicial
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [breakpoints])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  }

  // Render skeleton loading state
  if (isLoading) {
    return (
      <div className="relative overflow-hidden">
        <motion.div 
          className="flex gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {Array(productsPerView).fill(0).map((_, idx) => (
            <motion.div 
              key={idx} 
              className="flex-shrink-0 px-2"
              style={{ width: `${100 / productsPerView}%`}}
              variants={itemVariants}
            >
              <div className="border rounded-lg p-4 h-full">
                <Skeleton className="w-full h-48 rounded-md mb-4" />
                <Skeleton className="w-3/4 h-6 mb-2" />
                <Skeleton className="w-1/2 h-4 mb-4" />
                <Skeleton className="w-1/3 h-8" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden">
      <div 
        ref={sliderRef}
        className="overflow-hidden touch-pan-x"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <motion.div 
          className="flex"
          initial={false}
          animate={{
            x: `-${currentIndex * (100 / productsPerView)}%`
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            mass: 1
          }}
        >
          <AnimatePresence>
            {products.map((product, idx) => (
              <motion.div 
                key={product.id || idx} 
                className="flex-shrink-0 px-2"
                style={{ width: `${100 / productsPerView}%`}}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: {
                    delay: idx * 0.05,
                    duration: 0.5
                  }
                }}
              >
                <ProductCard product={product} compact={compact} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Button
          variant="outline"
          size="icon"
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white transition-colors shadow-md"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-5 w-5 text-gray-800" />
        </Button>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Button
          variant="outline"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white transition-colors shadow-md"
          onClick={nextSlide}
        >
          <ChevronRight className="h-5 w-5 text-gray-800" />
        </Button>
      </motion.div>
    </div>
  )
}