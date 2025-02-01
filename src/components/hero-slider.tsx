"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const slides = [
  {
    title: "RAQUETAS",
    subtitle: "TIMO BOOL ALC",
    image: "/images/sportt-web.webp",
    alignment: 'center' as const
  },
  {
    title: "ZAPATILLAS",
    subtitle: "BUTTERFLY LEZOLINE UNIZES",
    image: "/images/sportt-web2.webp",
    alignment: 'left' as const
  },
]

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

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
  }, [])

  const alignmentClasses = {
    left: 'ml-20',
    center: 'mx-auto text-center',
    right: 'items-end mr-20'
  };

  return (
    <div className="relative h-[80vh] overflow-hidden">
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className={cn(
            "absolute inset-0 transition-transform duration-700 ease-in-out",
            idx === currentSlide ? "translate-x-0" : idx < currentSlide ? "-translate-x-full" : "translate-x-full"
          )}
          onTransitionEnd={() => setIsAnimating(false)}
        >
          <Image
            src={slide.image}
            alt="Hero background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/10" />
          <div className={`relative container h-full flex items-center`}>
            <div className={`${alignmentClasses[slide.alignment]} text-white `}>
              <h2 
                className={cn(
                  "text-xl font-medium mb-2 transition-all duration-700 delay-300",
                  idx === currentSlide ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
              >
                {slide.title}
              </h2>
              <h1 
                className={cn(
                  "text-5xl font-bold transition-all duration-700 delay-500",
                  idx === currentSlide ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
              >
                {slide.subtitle}
              </h1>
              <Button 
                className={cn(
                  "mt-6 bg-pink-500 hover:bg-pink-600 transition-all duration-700 delay-700",
                  idx === currentSlide ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
              >
                VER AHORA
              </Button>
            </div>
          </div>
        </div>
      ))}
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

