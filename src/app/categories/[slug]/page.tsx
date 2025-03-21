"use client"

import { useState, useMemo } from "react"
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
  

const sortOptions = [
  { label: "Destacados", value: "featured" },
  { label: "Precio: Menor a Mayor", value: "price-asc" },
  { label: "Precio: Mayor a Menor", value: "price-desc" },
  { label: "Más Nuevos", value: "newest" },
  { label: "Nombre: A-Z", value: "name-asc" },
  { label: "Nombre: Z-A", value: "name-desc" },
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

export default function CategoriesPage({ params }: { params: Promise<{ slug: string }> }) {
  const rparams = useParams<{ slug: string }>()
  const { availableProducts: products, isLoading, error, getProducts } = useProducts()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    color: [] as string[],
    category: [] as string[],
    brand: [] as string[],
  })
  const [sortBy, setSortBy] = useState("featured")

  const { getCategorySlug } = useCategories()
  const category = getCategorySlug(rparams.slug)

  const filteredProducts = useMemo(() => {
    if (!category) {
      return products
    }
    return products.filter(product =>
      product.categories.some((cat: any) => cat.slug === rparams.slug)
    )
  }, [products, category, rparams.slug])

  const sortedProducts = useMemo(() => {
    let sorted = [...filteredProducts]
    switch (sortBy) {
      case "price-asc":
        sorted.sort((a, b) => {
          const priceA = Number(a.variants[0]?.prices[0]!.price) || 0
          const priceB = Number(b.variants[0]?.prices[0]!.price) || 0
          return priceA - priceB
        })
        break
      case "price-desc":
        sorted.sort((a, b) => {
          const priceA =  Number(a.variants[0]?.prices[0]!.price) || 0
          const priceB = Number(b.variants[0]?.prices[0]!.price) || 0
          return priceB - priceA
        })
        break
      case "newest":
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case "name-asc":
        sorted.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "name-desc":
        sorted.sort((a, b) => b.title.localeCompare(a.title))
        break
      default:
        break
    }
    return sorted
  }, [filteredProducts, sortBy])

  const totalPages = Math.ceil(sortedProducts.length / 16)
  const currentProducts = sortedProducts.slice((currentPage - 1) * 16, currentPage * 16)

  const handleFilterChange = (filterType: keyof typeof filters) => (selectedOptions: string[]) => {
    setFilters(prev => ({ ...prev, [filterType]: selectedOptions }))
  }

  return (
    <>
      <SiteHeader />
      <main className="container-section py-8">
        <div className="content-section ">
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

        <div className="content-section grid md:grid-cols-[240px_1fr] gap-8">
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
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
  {/* Ordenar por */}
  <div className="flex items-center space-x-2 w-full md:w-auto">
    <span className="text-sm text-muted-foreground whitespace-nowrap">
      Ordenar por:
    </span>
    <Select defaultValue="featured" onValueChange={setSortBy}>
      <SelectTrigger className="w-full md:w-[180px]">
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

  {/* Mostrando resultados y botones de vista */}
  <div className="flex items-center justify-between w-full md:w-auto space-x-4">
    <span className="text-sm text-muted-foreground whitespace-nowrap">
      Mostrando resultados {(currentPage - 1) * 16 + 1} - {Math.min(currentPage * 16, sortedProducts.length)} de {sortedProducts.length}
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

            {/* Product List */}
            <div className={`grid gap-2 md:gap-6 ${
              viewMode === "grid" 
                ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" // Responsive grid
                : "grid-cols-1" // List view
            }`}>
              {currentProducts.map((product) => (
                viewMode === "grid" ? (
                  <ProductCard key={product.id} product={product} />
                ) : (
                  <div key={product.id} className="flex items-center p-4 border rounded-lg">
                    <img
                      src={product.imageUrls[0]}
                      alt={product.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="ml-4 flex-1">
                      <h2 className="text-lg font-semibold">{product.title}</h2>
                      <p className="text-sm text-gray-500">{product.description}</p>
                      <div className="mt-2">
                        <span className="text-lg font-bold">
                          {product.variants[0]?.prices[0]?.currency.symbol}
                          {Number(product.variants[0]?.prices[0]?.price).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              ))}
            </div>

            {/* Pagination */}
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
      <SiteFooter />
    </>
  )
}