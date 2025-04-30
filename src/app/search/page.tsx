"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProductCard } from "@/components/product-card"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Link from "next/link"
import { Search } from "lucide-react"
import type { Product } from "@/types/product"
import { HorizontalProductCard } from "@/components/horizontal-card"
import { useProducts } from "@/contexts/product.context"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const { products, isLoading } = useProducts()
  const [searchResults, setSearchResults] = useState<Product[]>([])

  useEffect(() => {
    if (!query || !products.length) return

    // Función para normalizar texto (quitar acentos, convertir a minúsculas)
    const normalize = (text: string) => {
      return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
    }

    const normalizedQuery = normalize(query)

    // Filtrar productos que coincidan con la búsqueda
    const results = products.filter((product) => {
      const normalizedTitle = normalize(product.title)
      const normalizedDescription = product.description ? normalize(product.description) : ""
      const normalizedVendor = normalize(product.vendor)

      // Verificar si la búsqueda coincide con alguna categoría del producto
      const matchesCategory =
        product.categories &&
        product.categories.some((category) => {
          const normalizedCategoryName = normalize(category.name)
          const normalizedCategorySlug = normalize(category.slug)
          const normalizedCategoryDescription = category.description ? normalize(category.description) : ""

          return (
            normalizedCategoryName.includes(normalizedQuery) ||
            normalizedCategorySlug.includes(normalizedQuery) ||
            normalizedCategoryDescription.includes(normalizedQuery)
          )
        })

      // Buscar en título, descripción, vendor, categorías y atributos de variantes
      return (
        normalizedTitle.includes(normalizedQuery) ||
        normalizedDescription.includes(normalizedQuery) ||
        normalizedVendor.includes(normalizedQuery) ||
        matchesCategory ||
        product.variants.some((variant) =>
          Object.values(variant.attributes || {}).some(
            (attr) => typeof attr === "string" && normalize(attr).includes(normalizedQuery),
          ),
        )
      )
    })

    setSearchResults(results)
  }, [query, products])

  return (
    <>
      <SiteHeader />
      <main className="container mx-auto px-4 py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Inicio</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Resultados de búsqueda</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Resultados de búsqueda</h1>
          <p className="text-muted-foreground">
            {isLoading
              ? "Buscando productos..."
              : searchResults.length > 0
                ? `Se encontraron ${searchResults.length} resultados para "${query}"`
                : `No se encontraron resultados para "${query}"`}
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {searchResults.map((product) => (
              <HorizontalProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold">No se encontraron productos</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              No pudimos encontrar productos que coincidan con tu búsqueda. Intenta con otros términos o explora
              nuestras categorías.
            </p>
            <div className="pt-4">
              <Link href="/shop" className="text-pink-500 hover:text-pink-600 font-medium">
                Ver todos los productos
              </Link>
            </div>
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  )
}
