"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Slide {
  title: string
  subtitle: string
  mobileImage: string
  desktopImage: string
  alignment: "left" | "center" | "right"
  href: string
}

const slides: Slide[] = [
  {
    title: "RAQUETAS",
    subtitle: "TIMO BOOL ALC",
    desktopImage: "/images/sportt-web.webp",
    mobileImage: "/images/sportt-web-movil.webp",
    alignment: "center",
    href: "http://localhost:3000/product/timo-boll-alc"
  },
  {
    title: "ZAPATILLAS",
    subtitle: "BUTTERFLY LEZOLINE UNIZES",
    desktopImage: "/images/sportt-web2.webp",
    mobileImage: "/images/sportt-web2-movil.webp",
    alignment: "left",
    href: "http://localhost:3000/product/timo-boll-alc"
  },
]

interface HeroSliderProps {
  mobileHeight?: string   // Clase Tailwind para el alto en móvil (por defecto: h-[400px])
  desktopHeight?: string  // Clase Tailwind para el alto en desktop (por defecto: md:h-[600px])
  imagePosition?: string  // Valor CSS para object-position de la imagen (por defecto: "center")
  imageClassName?: string // Clases adicionales para la imagen
}

export function HeroSlider({
  mobileHeight = "h-[600px]",
  desktopHeight = "md:h-[600px]",
  imagePosition = "center",
  imageClassName = "",
}: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detectar viewport para elegir la imagen adecuada
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const nextSlide = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [isAnimating])

  // Clases para alinear el contenido (texto) sobre la imagen
  const alignmentClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }

  return (
    <div className={cn("relative overflow-hidden", mobileHeight, desktopHeight)}>
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className={cn(
            "absolute inset-0 transition-transform duration-700 ease-in-out",
            idx === currentSlide
              ? "translate-x-0"
              : idx < currentSlide
              ? "-translate-x-full"
              : "translate-x-full"
          )}
          onTransitionEnd={() => setIsAnimating(false)}
        >
          <Image
            src={isMobile ? slide.mobileImage : slide.desktopImage}
            alt="Hero background"
            fill
            style={{ objectPosition: imagePosition }}
            className={cn("object-cover", imageClassName)}
            priority
          />
          <div className="absolute inset-0 bg-black/10" />
          {/* Contenedor del contenido de texto */}
          <div className="relative container-section h-full flex items-center">
            <div className="w-full transform -translate-y-24 md:translate-y-0">
              <div className={cn(alignmentClasses[slide.alignment], "content-section text-white")}>
                <h2
                  className={cn(
                    "text-xl md:text-2xl font-medium mb-2 transition-all duration-700 delay-300",
                    idx === currentSlide ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  )}
                >
                  {slide.title}
                </h2>
                <h1
                  className={cn(
                    "text-4xl md:text-5xl lg:text-6xl font-bold transition-all duration-700 delay-500",
                    idx === currentSlide ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  )}
                >
                  {slide.subtitle}
                </h1>
                <Button
                  className={cn(
                    "mt-4 bg-pink-500 hover:bg-pink-600 transition-all duration-700 delay-700",
                    idx === currentSlide ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  )}
                >
                  VER AHORA
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Controles del slider */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-20"
        onClick={prevSlide}
        disabled={isAnimating}
      >
        <ChevronLeft className="h-8 w-8" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-20"
        onClick={nextSlide}
        disabled={isAnimating}
      >
        <ChevronRight className="h-8 w-8" />
      </Button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            className={`w-2 h-2 rounded-full transition-colors ${
              idx === currentSlide ? "bg-pink-500" : "bg-white/50"
            }`}
            onClick={() => {
              if (!isAnimating) setCurrentSlide(idx)
            }}
          />
        ))}
      </div>
    </div>
  )
}
