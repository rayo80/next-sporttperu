"use client"

import { useState, useEffect } from "react"
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

const allProducts = [
  {
    id:1,
    title: "Viscaria Pro",
    description: "Raqueta de tenis de mesa Viscaria Pro",
    slug: "viscaria-pro",
    vendor: "Butterfly",
    status: "PUBLISHED",
    categoryIds: ["raquetas"],
    collectionIds: ["destacados"],
    imageUrls: ["/placeholder.svg?height=400&width=400"],
    sku: "VIS-002",
    inventoryQuantity: 2,
    weightValue: 92,
    weightUnit: "g",
    prices: [{ currencyId: "PEN", price: 785.00 }],
    variants: []
  },
  {
    id:2,
    title: "INNERFORCE ZLC Plus",
    description: "Raqueta de tenis de mesa INNERFORCE ZLC Plus",
    slug: "innerforce-zlc-plus",
    vendor: "Butterfly",
    status: "PUBLISHED",
    categoryIds: ["raquetas"],
    collectionIds: ["destacados"],
    imageUrls: ["/placeholder.svg?height=400&width=400"],
    sku: "INN-002",
    inventoryQuantity: 1,
    weightValue: 87,
    weightUnit: "g",
    prices: [{ currencyId: "PEN", price: 785.00 }],
    variants: []
  },
]

const sortOptions = [
  { label: "Destacados", value: "featured" },
  { label: "Precio: Menor a Mayor", value: "price-asc" },
  { label: "Precio: Mayor a Menor", value: "price-desc" },
  { label: "Más Nuevos", value: "newest" },
]

const filterOptions = {
  color: [
    { id: "blue", label: "Azul" },
    { id: "red", label: "Rojo" },
    { id: "black", label: "Negro" },
    { id: "white", label: "Blanco" },
  ],
  size: [
    { id: "Pequeña", label: "Pequeña" },
    { id: "Mediana", label: "Mediana" },
    { id: "Grande", label: "Grande" },
  ],
  brand: [
    { id: "butterfly", label: "Butterfly" },
    { id: "stiga", label: "Stiga" },
    { id: "donic", label: "Donic" },
    { id: "xiom", label: "Xiom" },
  ],
}


export default function ToallasPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    color: [] as string[],
    size: [] as string[],
    brand: [] as string[],
  })
  const [filteredProducts, setFilteredProducts] = useState(allProducts)

  const totalPages = Math.ceil(filteredProducts.length / 4)

  useEffect(() => {
    const newFilteredProducts = allProducts.filter(product => {
      return (
        (filters.color.length === 0 || filters.color.includes(product.color)) &&
        (filters.size.length === 0 || filters.size.includes(product.size)) &&
        (filters.brand.length === 0 || filters.brand.includes(product.brand))
      )
    })
    setFilteredProducts(newFilteredProducts)
    setCurrentPage(1)
  }, [filters])

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
                <BreadcrumbPage>Toallas</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-3xl font-bold text-center">Toallas</h1>
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
                  Mostrando resultados {(currentPage - 1) * 4 + 1} - {Math.min(currentPage * 4, filteredProducts.length)} de {filteredProducts.length}
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
    </>
  )
}
