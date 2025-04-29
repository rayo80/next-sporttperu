"use client"

import { useState, useMemo, useEffect } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Grid, List, ChevronLeft, ChevronRight, Filter, X } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProductCard } from "@/components/product-card"
import { FilterAccordion } from "@/components/shop-accordion"
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
import { useCategories } from "@/contexts/categories.context"
import { useCollections } from "@/contexts/collections.context"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
// Define the FilterOption type to match what's expected in FilterAccordion
interface FilterOption {
  id: string
  label: string
}

const sortOptions = [
  { label: "Destacados", value: "featured" },
  { label: "Precio: Menor a Mayor", value: "price-asc" },
  { label: "Precio: Mayor a Menor", value: "price-desc" },
  { label: "Más Nuevos", value: "newest" },
  { label: "Nombre: A-Z", value: "name-asc" },
  { label: "Nombre: Z-A", value: "name-desc" },
]

export default function ShopPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { availableProducts: products, isLoading, error } = useProducts()
  const { items: categories } = useCategories()
  const { items: collections } = useCollections()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const [filtersOpen, setFiltersOpen] = useState(false) ///
  const [activeFiltersCount, setActiveFiltersCount] = useState(0) ////
  const [filters, setFilters] = useState({
    category: searchParams.get("category")?.split(",") || [],
    color: searchParams.get("color")?.split(",") || [],
    size: searchParams.get("size")?.split(",") || [],
    collection: searchParams.get("collection")?.split(",") || [],
  })
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "featured")

  // Calcular el número de filtros activos
  useEffect(() => {
    const count = Object.values(filters).reduce((acc, filterValues) => acc + filterValues.length, 0)
    setActiveFiltersCount(count)
  }, [filters])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    console.log("URL Params:", params.toString())
    // Actualizar el estado de los filtros cuando los parámetros de URL cambien
    const categoryParam = params.get("category")?.split(",") || []
    const colorParam = params.get("color")?.split(",") || []
    const sizeParam = params.get("size")?.split(",") || []
    const collectionParam = params.get("collection")?.split(",") || []
    const sortParam = params.get("sort") || "featured"

    // Solo actualizar si hay cambios para evitar bucles infinitos
    const hasFilterChanges =
      !arraysEqual(categoryParam, filters.category) ||
      !arraysEqual(colorParam, filters.color) ||
      !arraysEqual(sizeParam, filters.size) ||
      !arraysEqual(collectionParam, filters.collection)

    const hasSortChanges = sortParam !== sortBy

    if (hasFilterChanges) {
      setFilters({
        category: categoryParam,
        color: colorParam,
        size: sizeParam,
        collection: collectionParam,
      })
    }

    if (hasSortChanges) {
      setSortBy(sortParam)
    }

    // Función auxiliar para comparar arrays
    function arraysEqual(a: string[], b: string[]) {
      if (a.length !== b.length) return false
      return a.every((val, index) => val === b[index])
    }
  }, [searchParams]) // Dependencia en searchParams para que se ejecute cuando cambie la URL


  // Type-safe filter options generation
  const filterOptions = useMemo(() => {
    // Function to collect unique attribute values with proper type safety
    const collectAttributeValues = (attributeName: string): FilterOption[] => {
      const allValues = new Set<string>()
      
      products.forEach(product => {
        product.variants.forEach(variant => {
          if (variant.attributes && variant.attributes[attributeName] !== undefined) {
            // Ensure we're only adding string values
            const value = String(variant.attributes[attributeName])
            if (value) {
              allValues.add(value)
            }
          }
        })
      })
      
      return Array.from(allValues).map(value => ({
        id: value,
        label: value,
      }))
    }

    // Collect size values, accounting for both "Size" and "Talla" attributes
    const sizeOptions: FilterOption[] = [
      ...collectAttributeValues("Size"),
      ...collectAttributeValues("Talla")
    ].filter((value, index, self) => 
      // Remove duplicates that might exist between "Size" and "Talla"
      index === self.findIndex(t => t.id === value.id)
    )

    return {
      category: categories.map((cat) => ({ 
        id: cat.slug, 
        label: cat.name 
      })) as FilterOption[],
      color: collectAttributeValues("Color"),
      size: sizeOptions,
      collection: collections.map((collection) => ({
        id: collection.slug,
        label: collection.title,
      })) as FilterOption[],
    }
  }, [categories, collections, products])

  const filteredProducts = useMemo(() => {
    return products.filter(
      (product) =>
        (filters.category.length === 0 || product.categories.some((cat) => filters.category.includes(cat.slug))) &&
        (filters.color.length === 0 || product.variants.some((v) => 
          v.attributes && filters.color.includes(String(v.attributes.Color)))) &&
        (filters.size.length === 0 || product.variants.some((v) => 
          v.attributes && (
            filters.size.includes(String(v.attributes.Size)) || 
            filters.size.includes(String(v.attributes.Talla))
          ))) &&
        (filters.collection.length === 0 || product.collections.some((col) => filters.collection.includes(col.slug))),
    )
  }, [products, filters])

  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts]
    switch (sortBy) {
      case "price-asc":
        sorted.sort((a, b) => {
          const priceA = Number(a.variants[0]?.prices[0]?.price) || 0
          const priceB = Number(b.variants[0]?.prices[0]?.price) || 0
          return priceA - priceB
        })
        break
      case "price-desc":
        sorted.sort((a, b) => {
          const priceA = Number(a.variants[0]?.prices[0]?.price) || 0
          const priceB = Number(b.variants[0]?.prices[0]?.price) || 0
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
    setFilters((prev) => ({ ...prev, [filterType]: selectedOptions }))
    updateURL({ ...filters, [filterType]: selectedOptions }, sortBy)
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    updateURL(filters, value)
  }

  const updateURL = (newFilters: typeof filters, newSortBy: string) => {
    const params = new URLSearchParams()
    Object.entries(newFilters).forEach(([key, value]) => {
        if (value.length > 0) {
            params.set(key, value.join(","))
        }
    })
    if (newSortBy !== "featured") {
      params.set("sort", newSortBy)
    }
    router.push(`/shop?${params.toString().replace(/%2C/g, ",")}`, { scroll: false })
  }

  const clearAllFilters = () => {
    const emptyFilters = {
      category: [],
      color: [],
      size: [],
      collection: [],
    }
    setFilters(emptyFilters)
    updateURL(emptyFilters, sortBy)
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [filters, sortBy])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <>
      <SiteHeader />
      <main className="container-section py-8">
        <div className="content-section">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Inicio</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Tienda</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-3xl font-bold text-center">Tienda</h1>
        </div>

        {/* Filtros para móvil */}
        <div className="md:hidden mb-4 mt-4">
          <div className="flex items-center justify-between">
            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filtros
                  {activeFiltersCount > 0 && (
                    <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium rounded-full bg-pink-500 text-white">
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[85%] sm:w-[350px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="flex justify-between items-center">
                    <span>Filtros</span>
                    {activeFiltersCount > 0 && (
                      <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-xs">
                        Limpiar filtros
                      </Button>
                    )}
                  </SheetTitle>
                </SheetHeader>
                <div className="py-4 space-y-6">
                  {(
                    Object.entries(filterOptions) as [
                      keyof typeof filters,
                      (typeof filterOptions)[keyof typeof filters],
                    ][]
                  ).map(([key, options]) => (
                    <FilterAccordion
                      key={key}
                      title={key.charAt(0).toUpperCase() + key.slice(1)}
                      options={options}
                      selectedOptions={filters[key]}
                      onFilterChange={handleFilterChange(key)}
                      compact={true}
                    />
                  ))}
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <Button className="w-full bg-pink-500 hover:bg-pink-600" onClick={() => setFiltersOpen(false)}>
                    Ver {filteredProducts.length} productos
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[140px] h-9 text-xs">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="text-sm">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Chips de filtros activos */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2 mt-3 overflow-x-auto pb-2">
              {Object.entries(filters).map(([key, values]) =>
                values.map((value) => {
                  const option = filterOptions[key as keyof typeof filters].find((opt) => opt.id === value)
                  return option ? (
                    <div
                      key={`${key}-${value}`}
                      className="flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1 text-xs"
                    >
                      <span>{option.label}</span>
                      <button
                        onClick={() => {
                          const newValues = filters[key as keyof typeof filters].filter((v) => v !== value)
                          handleFilterChange(key as keyof typeof filters)(newValues)
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : null
                }),
              )}
            </div>
          )}
        </div>

        <div className="content-section grid md:grid-cols-[240px_1fr] gap-8">
          {/* Filters */}
          <div className="hidden md:block space-y-6">
            {(
              Object.entries(filterOptions) as [keyof typeof filters, FilterOption[]][]
            ).map(([key, options]) => (
                <FilterAccordion
                    key={key}
                    title={key.charAt(0).toUpperCase() + key.slice(1)}
                    options={options}
                    selectedOptions={filters[key]}
                    onFilterChange={handleFilterChange(key)}
                />
            ))}

            {activeFiltersCount > 0 && (
              <Button variant="outline" size="sm" onClick={clearAllFilters} className="w-full">
                Limpiar filtros
              </Button>
            )}
          </div>

          {/* Products */}
          <div className="space-y-6">
            <div className="hidden md:flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Ordenar por */}
              <div className="flex items-center space-x-2 w-full md:w-auto">
                <span className="text-sm text-muted-foreground whitespace-nowrap">Ordenar por:</span>
                <Select value={sortBy} onValueChange={handleSortChange}>
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
                  Mostrando resultados {(currentPage - 1) * 16 + 1} -{" "}
                  {Math.min(currentPage * 16, sortedProducts.length)} de {sortedProducts.length}
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
                  {/* <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setViewMode("list")}
                    className={viewMode === "list" ? "text-pink-500" : ""}
                  >
                    <List className="h-4 w-4" />
                  </Button> */}
                </div>
              </div>
            </div>

            {/* Contador de resultados para móvil */}
            <div className="md:hidden text-sm text-muted-foreground text-center">
              {sortedProducts.length} productos encontrados
            </div>

            {/* Product List */}
            <div
              className={`grid gap-2 md:gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" // Responsive grid
                  : "grid-cols-1" // List view
              }`}
            >
              {currentProducts.map((product) => (
                <ProductCard key={product.id} product={product}  />
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
                  className={cn(currentPage === page ? "bg-pink-500" : "", "h-9 w-9 p-0 hidden sm:inline-flex")}
                >
                  {page}
                </Button>
              ))}
              {/* Mostrar solo página actual en móvil */}
              <span className="flex items-center justify-center sm:hidden">
                {currentPage} de {totalPages}
              </span>
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