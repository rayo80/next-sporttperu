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
    <section className="container-section bg-gray-100/70 py-8 md:py-16">
      <div className="content-section">
        <div className="text-center mb-6 md:mb-10">
          <h2 className="text-2xl md:text-3xl font-bold">Ropa Deportiva</h2>
        </div>

        {clothingCategories.length > 0 && (
          <Tabs
            defaultValue={clothingCategories[0].id}
            className="w-full"
            onValueChange={setSelectedCategory}
          >
            {/* Categorías */}
            <TabsList className="flex justify-center gap-4 border-b pb-2">
              {clothingCategories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="group pb-2 text-sm md:text-base font-medium border-b-2 border-transparent transition-all data-[state=active]:border-pink-500 data-[state=active]:text-pink-500"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Productos (Máximo 8 - 2 columnas) */}
            {clothingCategories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <HorizontalProductCard key={product.slug} product={product} />
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-8 text-muted-foreground">
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
