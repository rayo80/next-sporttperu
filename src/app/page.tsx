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
  sm: 2,    // 2 cards for mobile (up to 639px)
  md: 2,  // 2 cards for small tablets (640px - 767px)
  lg: 3,  // 3 cards for tablets (768px - 1023px)
  xl: 3  // 4 cards for large desktop (1280px and above)
}

const sliderRowBreakpoints = {
  sm: 2,    // 2 cards for mobile (up to 639px)
  md: 2,  // 2 cards for small tablets (640px - 767px)
  lg: 3,  // 3 cards for tablets (768px - 1023px)
  xl: 5  // 4 cards for large desktop (1280px and above)
}

export default function Home() {
  const { availableProducts: products, isLoading, error, getProducts } = useProducts();
  const { items: categories} = useCategories();
  const { items: collections} = useCollections();
  const firstCollection = 0;
  const jebeCategory = 3;
  const summerCollection = collections?.[firstCollection] ?? null;

  const collectionProducts = useMemo(() => {
    if (!summerCollection) return products;
    const selected = summerCollection;
    return products.filter(product =>
      product.collections.some((val: any) => val.id === selected.id)
    );
  }, [products, collections]);

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
      <main className="container-full px-10 py-10">
        <div className="flex gap-6 flex-wrap p-auto justify-center">
          <div className="w-full md:w-[20%]">
            <CategoriesSidebar />
          </div>
          <div className="w-full md:w-[75%]">
            <ProductSlider products={products} breakpoints={sliderBreakpoints} />
          </div>
        </div>
        {/* Jebe Section */}
        <section className="py-12 ">
          <div className="container-full px-4">
            <h2 className="text-4xl font-bold text-center mb-8">
              <span className="font-normal">Jebe</span>{" "}
              <span className="font-bold">Butterfly</span>
            </h2>
            <ProductSlider products={jebesProducts} breakpoints={sliderRowBreakpoints} />
            <div className="flex justify-center">
                <Button asChild variant="outline" className="rounded-full px-8">
                    <Link href="/categories/gomas">Explora</Link>
                </Button>
            </div>
          </div>
        </section>
        {
          summerCollection && (
            <section className="py-12 ">
            <div className="container-full px-4">
              <h2 className="text-4xl font-bold text-center mb-8">
                <span className="font-normal">{summerCollection.title}</span>{" "}
                <span className="font-bold">{summerCollection.description}</span>
              </h2>
              <ProductSlider products={collectionProducts} breakpoints={sliderRowBreakpoints} />
              <div className="flex justify-center">
                  <Button asChild variant="outline" className="rounded-full px-8">
                      <Link href="/collections/maderas">Explora</Link>
                  </Button>
              </div>
            </div>
          </section>
          )
        }
        <PromoBanners />
        <SportsClothingSection />
      </main>
      <CurrencySelector/>
      <SiteFooter />
    </>
  )
}

