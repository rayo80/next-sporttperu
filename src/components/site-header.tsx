"use client"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, User } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { useState } from "react"
import { useCart } from "@/contexts/cart.context"
import { CartDrawer } from "./cart-drawer"
import { useCategories } from "@/contexts/categories.context"


export function SiteHeader() {
  const {items: shopCategories} = useCategories()
  const [cartOpen, setCartOpen] = useState(false)
  const { items } = useCart()
  const itemCount = items.reduce((total, item) => total + item.quantity, 0)
  return (
    <header className="w-full bg-black text-white">
      <div className="container-full flex h-14 items-center justify-between px-10">
        {/* Logo */}
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

        {/* Search Bar - Centered */}
        <div className="flex-1 max-w-2xl mx-4">
          <div className="flex w-full">
            <Input
              placeholder="Buscar en nuestra tienda"
              className="flex-1 rounded-r-none bg-white text-black"
            />
            <Button className="rounded-l-none bg-pink-500 hover:bg-pink-600">
              Buscar
            </Button>
          </div>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:text-pink-500"
              onClick={()=>setCartOpen(true)}>
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Cart</span>
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-pink-500 
                    text-[10px] font-medium flex items-center justify-center animate-in zoom-in">
                    {itemCount}
                  </span>
                )}
            </Button>
          </div>
          <Button variant="ghost" size="icon" className="text-white hover:text-pink-500">
            <User className="h-5 w-5" />
            <span className="sr-only">Account</span>
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-t border-gray-800">
        <nav className="container h-12 flex items-center px-10">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-800 hover:text-white focus:bg-gray-800 focus:text-white focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-800 data-[state=open]:bg-gray-800">
                    Inicio
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-800 hover:text-white focus:bg-gray-800 focus:text-white focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-800 data-[state=open]:bg-gray-800">
                  Tienda
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 bg-white">
                    {shopCategories.map((category) => (
                      <li key={category.slug}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={"/collections/"+category.slug}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900"
                          >
                            {category.name}
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/contact" legacyBehavior passHref>
                  <NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-800 hover:text-white focus:bg-gray-800 focus:text-white focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-800 data-[state=open]:bg-gray-800">
                    Contacto
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>
      </div>
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </header>
  )
}
