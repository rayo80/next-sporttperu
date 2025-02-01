"use client"
import { CategoriesSidebar } from "@/components/categories-sidebar"
import { SportsClothingSection } from "@/components/clothing-section"
import { HeroSlider } from "@/components/hero-slider"
import { ProductSlider } from "@/components/product-slider"
import { PromoBanners } from "@/components/promo-banners"
import { SiteHeader } from "@/components/site-header"
import { useProducts } from "@/contexts/product.context"
import { Product } from "@/types/product"


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
  const { products, isLoading, error, getProducts } = useProducts()  
  return (
    <>
      <SiteHeader />
      <HeroSlider />
      <main className="container-full px-0 py-10 md:px-10">
        <div className="flex gap-12 flex-wrap">
          <div className="w-full md:w-[22%]">
            <CategoriesSidebar />
          </div>
          <div className="w-full md:w-[78%]">
            <ProductSlider products={products} breakpoints={sliderBreakpoints} />
          </div>
        </div>
        {/* Jebe Section */}
        <section className="py-12 ">
          <div className="container-full px-4">
            <h2 className="text-3xl font-bold text-center mb-8">
              <span className="font-normal">Jebe</span>{" "}
              <span className="font-bold">Profesional</span>
            </h2>
            <ProductSlider products={products} breakpoints={sliderRowBreakpoints} />
          </div>
        </section>
        <PromoBanners />
        <ProductSlider products={products} breakpoints={sliderBreakpoints} />
      </main>
    </>
  )
}

