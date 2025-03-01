"use client"
import Image from "next/image"
import Link from "next/link"
import { LogOut, ShoppingCart, User, Menu, Search, ChevronDown } from 'lucide-react'
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { useAuth } from "@/contexts/auth.context"
import { CurrencySelector } from "./currency-selector"

export function SiteHeader() {
  const { items: shopCategories } = useCategories()
  const [cartOpen, setCartOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false) // Estado para el menú móvil
  const [mobileTiendaOpen, setMobileTiendaOpen] = useState(false) // Estado para desplegar sub ítems de Tienda
  const { customer, logout } = useAuth()
  const { items } = useCart()

  const itemCount = items.reduce((total, item) => total + item.quantity, 0)

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }
  
  return (
    <header className="w-full bg-black text-white">
      <div className="container-section">
        {/* Header superior: Logo, buscador (desktop) e íconos */}
        <div className="content-section flex h-20 items-center justify-between">
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/assets/logo.png"
              alt="SPORT T"
              width={200}
              height={50}
              className="h-auto w-auto"
              priority
            />
          </Link>

          {/* Buscador desktop (oculto en móvil) */}
          <div className="flex-1 max-w-2xl mx-4 hidden md:block">
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

          {/* Íconos y menú */}
          <div className="flex items-center gap-4">
                  <CurrencySelector />
            
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:text-pink-500"
                onClick={() => setCartOpen(true)}>
                <ShoppingCart className="h-6 w-6" />
                <span className="sr-only">Carrito</span>
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-pink-500 text-[10px] font-medium flex items-center justify-center animate-in zoom-in hover:text-white">
                    {itemCount}
                  </span>
                )}
              </Button>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:text-pink-500">
                  <User className="h-6 w-6" />
                  <span className="sr-only">Cuenta</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Cuenta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {customer ? (
                  <>
                    <DropdownMenuItem className="text-muted-foreground" disabled>
                      {customer.email}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/account">Mi cuenta</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/account/orders">Mis pedidos</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Cerrar sesión
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/login" className="text-pink-500 font-medium">
                        Ingresar
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/register">Crear Cuenta</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Botón hamburger para móviles */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:text-pink-500 md:hidden"
              onClick={() => setMobileMenuOpen(true)}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menú</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Navegación Desktop */}
      <div className="border-t border-gray-800 hidden md:block">
        <nav className="container-section">
          <div className="content-section flex items-center h-16">
            <NavigationMenu>
              <NavigationMenuList className="gap-5">
                <NavigationMenuItem>
                  <Link href="/" legacyBehavior passHref>
                    <NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-base font-medium transition-colors hover:bg-gray-800 hover:text-white">
                      Inicio
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-800 hover:text-white focus:bg-gray-800 focus:text-white focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-800 data-[state=open]:bg-gray-800">
                    <Link href={"/categories/all"}>Tienda</Link>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2  ">
                      {shopCategories.map((category) => (
                        <li key={category.slug}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={`/categories/${category.slug}`}
                              className="block select-none space-y-1 rounded-md p-3 leading-none transition-colors hover:bg-gray-100 hover:text-gray-900"
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
                    <NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-800 hover:text-white">
                      Contacto
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </nav>
      </div>

      {/* Menú móvil con fondo blur, buscador con ícono y sub ítems en Tienda */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 backdrop-blur-md bg-black bg-opacity-75">
          <div className="absolute top-4 right-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white"
              onClick={() => setMobileMenuOpen(false)}>
              <span className="text-2xl">&times;</span>
            </Button>
          </div>
          <div className="flex flex-col items-center justify-center h-full px-4">
            {/* Buscador en el menú móvil con ícono de lupa */}
            <div className="w-full max-w-md mb-6 flex justify-center">
              <div className="flex items-center w-[300px] gap-2 justify-center">
                <Input
                  placeholder="Buscar en nuestra tienda"
                  className="flex-1 rounded-l-md bg-white text-black "
                />
                <Button className="rounded-r-md bg-pink-500 hover:bg-pink-600">
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </div>
            {/* Enlaces de navegación */}
            <nav className="flex flex-col items-center space-y-6">
              <Link 
                href="/" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-white text-2xl font-semibold hover:text-pink-500 transition-colors">
                Inicio
              </Link>
              {/* Sección Tienda con sub ítems */}
              <div className="flex flex-col items-center">
                <button 
                  onClick={() => setMobileTiendaOpen(!mobileTiendaOpen)}
                  className="flex items-center gap-2 text-white text-2xl font-semibold hover:text-pink-500 transition-colors">
                  <span className="pl-6">Tienda</span>
                  <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${mobileTiendaOpen ? 'rotate-180' : ''}`} />
                </button>
                {mobileTiendaOpen && (
                  <div className="mt-4 flex flex-col items-center space-y-4">
                    {shopCategories.map((category) => (
                      <Link 
                        key={category.slug}
                        href={`/categories/${category.slug}`} 
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-white/70 text-lg font-light hover:text-pink-500 transition-colors">
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <Link 
                href="/contact" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-white text-2xl font-semibold hover:text-pink-500 transition-colors">
                Contacto
              </Link>
            </nav>
          </div>
        </div>
      )}

      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </header>
  )
}
