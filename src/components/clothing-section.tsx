"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HorizontalProductCard } from "./horizontal-card";
import { useProducts } from "@/contexts/product.context";
import { useCategories } from "@/contexts/categories.context";
import { useEffect, useMemo, useState } from "react";

export function SportsClothingSection() {
  const { products } = useProducts();
  const { items: categories } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);

  const clothingCategories = useMemo(() => {
    return [0, 2, 3, 4]
      .filter((index) => index < categories.length)
      .map((index) => categories[index]);
  }, [categories]);

  useEffect(() => {
    if (clothingCategories.length > 0 && !selectedCategory) {
      setSelectedCategory(clothingCategories[0].id);
    }
  }, [clothingCategories]);

  useEffect(() => {
    if (selectedCategory) {
      const filtered = products
        .filter((product) =>
          product.categories.some((cat: any) => cat.id === selectedCategory)
        )
        .slice(0, 8); // Máximo 8 productos
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [selectedCategory, products]);

  return (
    <section className="bg-gray-100/70 py-6 sm:py-10 md:py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-6 md:mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold">Ropa Deportiva</h2>
        </div>

        {clothingCategories.length > 0 && (
          <Tabs
            defaultValue={clothingCategories[0].id}
            className="w-full"
            onValueChange={setSelectedCategory}
          >
            {/* Categorías */}
            <TabsList className="flex flex-wrap justify-center gap-2 sm:gap-4 border-b pb-2 overflow-x-auto">
              {clothingCategories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="whitespace-nowrap pb-2 text-sm sm:text-base font-medium border-b-2 border-transparent transition-all data-[state=active]:border-pink-500 data-[state=active]:text-pink-500"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Productos (Máximo 8 - 1/2/3 columnas según el tamaño de la pantalla) */}
            {clothingCategories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <HorizontalProductCard key={product.slug} product={product} />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8 text-muted-foreground">
                      No hay productos disponibles en esta categoría
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </section>
  );
}
