"use client"
import Image from "next/image"
import Link from "next/link"
import { Instagram, Phone } from "lucide-react"
import { useCategories } from "@/contexts/categories.context"

export function SiteFooter() {
  const { items: shopCategories } = useCategories()
  const mid = Math.ceil(shopCategories.length / 2)
  const firstHalf = shopCategories.slice(0, mid)
  const secondHalf = shopCategories.slice(mid)

  return (
    <footer className="bg-black text-white pt-12 pb-4 container-section">
      <div className="content-section">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Columna 1: Logo y Descripción */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center">
              <Image
                            src="/assets/logo.png"
                            alt="SPORTT"
                            width={200}
                            height={50}
                            className="h-auto w-auto"
                            priority
                          />
            </Link>
            <p className="text-gray-400 text-sm">
              Bienvenido a Sportt Peru, tu tienda virtual de tenis de mesa. Encuentra la mejor calidad y estilo para alcanzar tus objetivos.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://wa.me/51959051109"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 hover:text-pink-500 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span className="text-sm">+51 959 051 109</span>
              </a>
              <a
                href="https://www.instagram.com/sporttperud/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 hover:text-pink-500 transition-colors"
              >
                <Instagram className="w-4 h-4" />
                <span className="text-sm">@sporttperud</span>
              </a>
            </div>
          </div>

          {/* Columna 2: Información */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Información</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link href="/privacidad" className="hover:text-pink-500 transition-colors">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link href="/reclamaciones" className="hover:text-pink-500 transition-colors">
                  Libro de Reclamaciones
                </Link>
              </li>
              <li>
                <Link href="/terminos-y-condiciones" className="hover:text-pink-500 transition-colors">
                  Términos y Condiciones
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Categorías (divididas en dos columnas) */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Categorías</h3>
            <div className="grid grid-cols-2 gap-4">
              <ul className="space-y-1 text-sm">
                {firstHalf.map((category) => (
                  <li key={category.slug}>
                    <Link
                      href={`/categories/${category.slug}`}
                      className="block select-none space-y-1 rounded-md p-2 leading-none transition-colors hover:bg-gray-100 hover:text-gray-900"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <ul className="space-y-1 text-sm">
                {secondHalf.map((category) => (
                  <li key={category.slug}>
                    <Link
                      href={`/categories/${category.slug}`}
                      className="block select-none space-y-1 rounded-md p-2 leading-none transition-colors hover:bg-gray-100 hover:text-gray-900"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

 
        </div>

        {/* Sección inferior: Copyright */}
        <div className="mt-8 border-t border-gray-800 pt-4 text-center">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Sportt Peru. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
