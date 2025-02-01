"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HorizontalProductCard } from "./horizontal-card"
import type { Product } from "@/types/product"
import { useProducts } from "@/contexts/product.context"
import { useCategories } from "@/contexts/categories.context"
import { useEffect, useState } from "react"



export function SportsClothingSection() {
    const { products: products, getProducts } = useProducts()
    const { items: categories,  getCategories } = useCategories()
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
    
    useEffect(() => {
        console.log("products", products)
        if (selectedCategory) {
          const filtered = products.filter(product =>
            product.categories.some((cat: any) => cat.id === selectedCategory)
          );
          console.log("prodcuts", products)
          console.log("filtered", filtered)
          setFilteredProducts(filtered);
        } else {
          setFilteredProducts(products); // Muestra todos los productos si no hay categoría seleccionada
        }
      }, [selectedCategory, products]);
    
      const clothingCategories = [0, 4, 5, 7]  // Índices deseados
        .filter(index => index < categories.length)  // Evitar índices fuera del rango
        .map(index => categories[index]);

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category)
      }
    return (
        <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">Ropa Deportiva</h2>
            </div>

            <Tabs defaultValue={clothingCategories[0]?.id} className="w-full"
            onValueChange={handleCategoryChange}>
            <TabsList className="flex justify-center mb-8 bg-transparent border-b w-full gap-8">
                {clothingCategories.map((category) => (
                    <TabsTrigger
                        key={category.id}
                        value={category.id}
                        className="data-[state=active]:text-pink-500 data-[state=active]:border-b-2 data-[state=active]:border-pink-500 rounded-none border-transparent pb-2 -mb-px"
                    >
                        {category.name}
                    </TabsTrigger>
                ))}
            </TabsList>

            {clothingCategories.map((category) => (
                <TabsContent key={category.id} value={category.id}>
                <div className="grid lg:grid-cols-2 gap-4">
                    {filteredProducts.map((product) => (
                    <HorizontalProductCard key={product.slug} product={product} />
                    ))}
                    {filteredProducts.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                        No hay productos disponibles en esta categoría
                    </div>
                    )}
                </div>
                </TabsContent>
            ))}
            </Tabs>
        </div>
        </section>
    )
}