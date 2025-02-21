"use client"

import Image from "next/image"
import Link from "next/link"
import { Facebook, Instagram, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CurrencySelector } from "./currency-selector"

export function SiteFooter() {
  return (
    <footer className="w-full bg-zinc-900 text-white py-4 h-40 flex items-center">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4">
          <Link href="/" className="flex-shrink-0">
            <Image
                src="/assets/logo.png"
                alt="SPORT T"
                width={120}
                height={40}
                className="h-auto w-auto"
                priority
            />
          </Link>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-2 text-lg">
            <Phone className="h-5 w-5" />
            <span>Llámanos: +51 959 051 109</span>
          </div>

          {/* Social Media */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-white hover:text-pink-500" asChild>
              <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:text-pink-500" asChild>
              <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  )
}