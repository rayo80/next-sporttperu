"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Grid, List, ChevronLeft, ChevronRight } from 'lucide-react'
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ProductCard } from "@/components/product-card"
import { FilterAccordion } from "@/components/custom/filter-accordion"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useProducts } from "@/contexts/product.context"
import { SiteFooter } from "@/components/site-footer"
import { useParams } from "next/navigation"
import { useCategories } from "@/contexts/categories.context"
import { CurrencySelector } from "@/components/currency-selector"

const sortOptions = [
  { label: "Destacados", value: "featured" },
  { label: "Precio: Menor a Mayor", value: "price-asc" },
  { label: "Precio: Mayor a Menor", value: "price-desc" },
  { label: "Más Nuevos", value: "newest" },
]

const filterOptions = {
  color: [
    { id: "red", label: "Rojo" },
    { id: "black", label: "Negro" },
  ],
  category: [
    { id: "offensive", label: "Ofensiva" },
    { id: "defensive", label: "Defensiva" },
  ],
  brand: [
    { id: "butterfly", label: "Butterfly" },
    { id: "donic", label: "Donic" },
  ],
}

export default function CategoriesPage({ params }: { params: { slug: string } }) {
  const rparams = useParams<{slug: string }>()
  const { availableProducts: products, isLoading, error, getProducts } = useProducts()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    color: [] as string[],
    category: [] as string[],
    brand: [] as string[],
  })
  // const [filteredProducts, setFilteredProducts] = useState(allProducts)

  const {getCategorySlug} = useCategories()

  const category = getCategorySlug(rparams.slug)

  const filteredProducts = useMemo(() => {
    if (!category) {
      return products
    }
    return products.filter(product =>
      product.categories.some((cat: any) => cat.slug === rparams.slug)
    );
  }, [products]);

  const totalPages = Math.ceil(products.length / 4)



  const handleFilterChange = (filterType: keyof typeof filters) => (selectedOptions: string[]) => {
    setFilters(prev => ({ ...prev, [filterType]: selectedOptions }))
  }

  const currentProducts = filteredProducts.slice((currentPage - 1) * 4, currentPage * 4)


  return (
    <>
      <SiteHeader />
      <main className="container px-4 py-8">
        <div className="mb-8 space-y-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Inicio</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{category?.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-3xl font-bold text-center">{category?.name}</h1>
        </div>

        <div className="grid md:grid-cols-[240px_1fr] gap-8">
          {/* Filters */}
          <div className="space-y-6">
            {(Object.entries(filterOptions) as [keyof typeof filters, typeof filterOptions[keyof typeof filters]][]).map(([key, options]) => (
              <FilterAccordion
                key={key}
                title={key.charAt(0).toUpperCase() + key.slice(1)}
                options={options}
                onFilterChange={handleFilterChange(key)}
              />
            ))}
          </div>

          {/* Products */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  Ordenar por:
                </span>
                <Select defaultValue="featured">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  Mostrando resultados {(currentPage - 1) * 4 + 1} - {Math.min(currentPage * 4, products.length)} de {products.length}
                </span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setViewMode("grid")}
                    className={viewMode === "grid" ? "text-pink-500" : ""}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setViewMode("list")}
                    className={viewMode === "list" ? "text-pink-500" : ""}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className={`grid gap-6 ${
              viewMode === "grid" ? "sm:grid-cols-2 lg:grid-cols-4" : "grid-cols-1"
            }`}>
              {currentProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="flex justify-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  onClick={() => setCurrentPage(page)}
                  className={currentPage === page ? "bg-pink-500" : ""}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>
      <CurrencySelector/>
      <SiteFooter />
    </>
  )
}
