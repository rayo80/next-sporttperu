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
import { motion } from "framer-motion"

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
  xl: 4  // 4 cards for large desktop (1280px and above)
}

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
}

export default function Home() {
  console.log("Home component rendering");
  
  const { availableProducts: products, isLoading, error, getProducts } = useProducts();
  console.log("Products data:", { products, isLoading, error });
  
  const { items: categories} = useCategories();
  console.log("Categories data:", categories);
  
  const { items: collections} = useCollections();
  console.log("Collections data:", collections);
 
  const featuredCollections = collections?.filter((col) => col.isFeatured) || [];
  console.log("Featured collections:", featuredCollections);

  return (
    <>
      <SiteHeader />
      <HeroSlider />
      <main>
        <motion.div 
          className="container-section py-8 md:pt-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
        >
          <div className="content-section flex flex-wrap justify-between mb-8">
            <motion.div 
              className="w-full md:w-[25%]"
              variants={fadeInUp}
            >
              <CategoriesSidebar />
            </motion.div>
            <motion.div 
              className="w-full md:w-[75%] pt-10 pl-0 md:pl-5 md:pt-0"
              variants={fadeInUp}
            >
              <ProductSlider 
                products={products} 
                breakpoints={sliderBreakpoints} 
                isLoading={isLoading}
              />
            </motion.div>
          </div>
        </motion.div>
 
        {/* Featured Collections */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {featuredCollections.map((collection, index) => {
            console.log("Processing collection:", collection.id, collection.title);
            
            const collectionProducts = products?.filter((product) => {
              if (!product.collections) {
                console.log("Product has no collections:", product);
                return false;
              }
              return product.collections.some((col) => col.id === collection.id);
            }) || [];
            
            console.log("Collection products count:", collectionProducts.length);

            return (
              <motion.section 
                key={collection.id} 
                className="container-section pb-8 md:py-8"
                variants={fadeInUp}
                custom={index}
              >
                <div className="content-section">
                  <motion.h2 
                    className="text-3xl font-semibold text-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    {collection.title} {" "}
                  </motion.h2>
                  <ProductSlider 
                    products={collectionProducts} 
                    breakpoints={sliderRowBreakpoints} 
                    isLoading={isLoading}
                  />
                  <motion.div 
                    className="flex justify-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    <Button 
                      asChild 
                      variant="outline" 
                      className="rounded-full transition-all mt-8 md:mt-16 px-8 bg-gradient-to-tr from-white to-gray-200 shadow-md shadow-slate-100 hover:to-gray-300"
                    >
                      <Link href={`/shop`}>Explora</Link>
                    </Button>
                  </motion.div>
                </div>
              </motion.section>
            );
          })}
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
        >
          <PromoBanners />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
        >
          <SportsClothingSection />
        </motion.div>
      </main>
 
      <SiteFooter />
    </>
  );
}