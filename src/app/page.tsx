"use client"
import { CategoriesSidebar } from "@/components/categories-sidebar"
import { SportsClothingSection } from "@/components/clothing-section"
import { CurrencySelector } from "@/components/currency-selector"
import { HeroSlider } from "@/components/hero-slider"
import { ProductSlider } from "@/components/product-slider"
import { PromoBanners } from "@/components/promo-banners"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { useCategories } from "@/contexts/categories.context"
import { useCollections } from "@/contexts/collections.context"
import { useProducts } from "@/contexts/product.context"
import { Product } from "@/types/product"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"



const sliderBreakpoints = {
  sm: 1,    // 2 cards for mobile (up to 639px)
  md: 2,  // 2 cards for small tablets (640px - 767px)
  lg: 3,  // 3 cards for tablets (768px - 1023px)
  xl: 3  // 4 cards for large desktop (1280px and above)
}

const sliderRowBreakpoints = {
  sm: 1,    // 2 cards for mobile (up to 639px)
  md: 2,  // 2 cards for small tablets (640px - 767px)
  lg: 3,  // 3 cards for tablets (768px - 1023px)
  xl: 5  // 4 cards for large desktop (1280px and above)
}

export default function Home() {
  const { availableProducts: products, isLoading, error, getProducts } = useProducts();
  const { items: categories} = useCategories();
  const { items: collections} = useCollections();
 
  const jebeCategory = 3;
 
  const featuredCollections = collections?.filter((col) => col.isFeatured) || [];

  
 

  const jebesProducts = useMemo(() => {
    if (!jebeCategory) return products;
    if (jebeCategory < 0 || jebeCategory >= categories.length) {
      return products; // Evita acceder a un índice fuera de rango
    }

    const selectedCategory = categories[jebeCategory];
    return products.filter(product =>
      product.categories.some((cat: any) => cat.id === selectedCategory.id)
    );
  }, [products, categories]);

  return (
    <>
      <SiteHeader />
      <HeroSlider />
      <main className=" ">
        <div className="container-section py-8 md:pt-16  ">
          <div className="content-section flex   flex-wrap  justify-between mb-8">
          <div className="w-full md:w-[25%] ">
            <CategoriesSidebar />
          </div>
          <div className="w-full md:w-[75%] pt-10 pl-0 md:pl-5 md:pt-0">
            <ProductSlider products={products} breakpoints={sliderBreakpoints} />
          </div>
        </div>
      </div>
 
 
       {/* Featured Collections */}
       {featuredCollections.map((collection) => {
          const collectionProducts = products.filter((product) =>
            product.collections.some((col) => col.id === collection.id)
          );

          return (
            <section key={collection.id} className=" container-section pb-8 md:py-8">
              <div className="content-section">
                <h2 className="text-3xl font-semibold text-center mb-12">
                   {collection.title} {" "}
                </h2>
                <ProductSlider products={collectionProducts} breakpoints={sliderRowBreakpoints} />
                <div className="flex justify-center">
                  <Button asChild variant="outline" className="rounded-full transition-all mt-8 md:mt-16 px-8 bg-gradient-to-tr from-white to-gray-200 shadow-md shadow-slate-100  hover:to-gray-300 ">
                    <Link href={`/categories/all`}>Explora</Link>
                  </Button>
                </div>
              </div>
            </section>
          );
        })}

        <PromoBanners />
        <SportsClothingSection />
      </main>
 
      <SiteFooter />
    </>
  );
}