"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HorizontalProductCard } from "./horizontal-card";
import { useProducts } from "@/contexts/product.context";
import { useCategories } from "@/contexts/categories.context";
import { useEffect, useMemo, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SportsClothingSection() {
  const { products, isLoading } = useProducts();
  const { items: categories } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const tabsRef = useRef<HTMLDivElement>(null);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const featuredCategories = useMemo(() => {
    return [0, 2, 3, 4]
      .filter((index) => index < categories.length)
      .map((index) => categories[index]);
  }, [categories]);

  useEffect(() => {
    if (featuredCategories.length > 0 && !selectedCategory) {
      setSelectedCategory(featuredCategories[0].id);
    }
  }, [featuredCategories]);

  useEffect(() => {
    if (selectedCategory) {
      const filtered = products
        .filter((product) =>
          product.categories.some((cat: any) => cat.id === selectedCategory)
        )
        .slice(0, 8);
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [selectedCategory, products]);

  const scrollLeft = () => {
    if (tabsRef.current) {
      tabsRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (tabsRef.current) {
      tabsRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30
      }
    }
  };

  return (
    <section className="py-16 sm:py-20 lg:py-24 relative overflow-hidden bg-gradient-to-b from-white to-gray-50">
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute -top-[10%] -right-[5%] w-[40%] h-[50%] bg-gradient-to-br from-pink-50 to-gray-100 rounded-full blur-xl"></div>
        <div className="absolute -bottom-[10%] -left-[5%] w-[30%] h-[40%] bg-gradient-to-tr from-blue-50 to-gray-100 rounded-full blur-xl"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6 md:mb-0 max-w-xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-3">
              Productos <span className="text-pink-600">Destacados</span>
            </h2>
            <p className="text-gray-600">
              Descubre nuestra selección de productos de tenis de mesa, cuidadosamente elegidos para satisfacer tus necesidades.
            </p>
          </div>
          
          <Link href="/shop" className="group inline-flex items-center text-pink-600 font-medium hover:text-pink-700 transition-colors">
            Ver todo el catálogo
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {featuredCategories.length > 0 && (
          <Tabs
            defaultValue={featuredCategories[0]?.id}
            className="w-full"
            onValueChange={(value) => {
              setSelectedCategory(value);
              const newIndex = featuredCategories.findIndex(cat => cat.id === value);
              if (newIndex !== -1) setActiveTabIndex(newIndex);
            }}
          >
            {/* Categorías con scroll horizontal */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mb-8 md:mb-10 relative"
            >
              {/* Scroll buttons - Only visible on larger screens */}
              <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 z-20">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-sm text-gray-600 hover:text-pink-600 hover:bg-white transition-all"
                  onClick={scrollLeft}
                >
                  <ChevronLeft className="h-5 w-5" />
                </motion.button>
              </div>
              
              <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 z-20">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-sm text-gray-600 hover:text-pink-600 hover:bg-white transition-all"
                  onClick={scrollRight}
                >
                  <ChevronRight className="h-5 w-5" />
                </motion.button>
              </div>
              
              {/* Gradient fades for scroll indication - Only on larger screens */}
              <div className="hidden md:block absolute left-8 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
              <div className="hidden md:block absolute right-8 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
              
              {/* Scrollable tabs container */}
              <div className="md:mx-10 relative">
                <div 
                  ref={tabsRef}
                  className="overflow-x-auto scrollbar-hide max-w-full mx-auto py-2"
                >
                  <TabsList className="inline-flex w-full justify-start md:justify-center whitespace-nowrap px-2 py-1 bg-white/80 backdrop-blur-sm border border-gray-100 rounded-full shadow-sm">
                    {featuredCategories.map((category, index) => (
                      <TabsTrigger
                        key={category.id}
                        value={category.id}
                        className="min-w-[120px] px-4 py-2 mx-1 rounded-full text-sm font-medium transition-all 
                          data-[state=active]:bg-pink-600 data-[state=active]:text-white data-[state=active]:shadow-sm
                          data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-700
                          data-[state=inactive]:hover:bg-gray-50"
                        onClick={() => setActiveTabIndex(index)}
                      >
                        {category.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
                
                {/* Active tab indicator dots - Minimal and subtle */}
                <div className="flex justify-center mt-3 gap-1">
                  {featuredCategories.map((_, index) => (
                    <motion.div
                      key={index}
                      className={`h-1 rounded-full ${index === activeTabIndex ? 'bg-pink-600 w-4' : 'bg-gray-200 w-1'}`}
                      animate={{ 
                        width: index === activeTabIndex ? 16 : 4,
                        backgroundColor: index === activeTabIndex ? '#db2777' : '#e5e7eb'
                      }}
                      transition={{ duration: 0.2 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Productos */}
            <AnimatePresence mode="wait">
              {featuredCategories.map((category) => (
                <TabsContent key={category.id} value={category.id} className="w-full">
                  {isLoading ? (
                    // Skeleton loading state - More minimal and elegant
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                      {Array(8).fill(0).map((_, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                          <Skeleton className="w-full aspect-square sm:aspect-[4/3]" />
                          <div className="p-4">
                            <Skeleton className="h-3 w-16 mb-2" />
                            <Skeleton className="h-5 w-2/3 mb-2" />
                            <Skeleton className="h-4 w-full mb-3" />
                            <Skeleton className="h-6 w-1/3" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <motion.div 
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0 }}
                    >
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map((product, index) => (
                          <motion.div 
                            key={product.slug} 
                            variants={itemVariants}
                            custom={index}
                            className="h-full"
                          >
                            <HorizontalProductCard product={product} />
                          </motion.div>
                        ))
                      ) : (
                        <motion.div 
                          variants={itemVariants}
                          className="col-span-full text-center py-12 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-100 shadow-sm"
                        >
                          <div className="flex flex-col items-center justify-center max-w-md mx-auto px-4">
                            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-8 w-8 text-gray-400" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                              >
                                <path 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round" 
                                  strokeWidth={1.5} 
                                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" 
                                />
                              </svg>
                            </div>
                            <h3 className="text-xl font-medium text-gray-800 mb-2">No hay productos disponibles</h3>
                            <p className="text-gray-500 mb-5">No encontramos productos en esta categoría. Por favor, selecciona otra categoría o vuelve más tarde.</p>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="rounded-full hover:bg-pink-600 hover:text-white hover:border-pink-600 transition-colors"
                              onClick={() => {
                                if (featuredCategories.length > 0) {
                                  setSelectedCategory(featuredCategories[0].id);
                                  setActiveTabIndex(0);
                                }
                              }}
                            >
                              Ver otras categorías
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                  
                  {/* View all products in category button - More subtle and elegant */}
                  {filteredProducts.length > 0 && (
                    <motion.div 
                      className="flex justify-center mt-10"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Link href={`/shop?category=${category.slug}`}>
                        <Button 
                          variant="outline" 
                          className="rounded-full px-6 py-2 border-gray-200 text-gray-700
                          hover:border-pink-600 hover:bg-pink-600 hover:text-white 
                          transition-all duration-200 shadow-sm hover:shadow"
                        >
                          Ver {category.name}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </motion.div>
                  )}
                </TabsContent>
              ))}
            </AnimatePresence>
          </Tabs>
        )}
      </div>
    </section>
  );
}

// Add this to your global CSS or as a style tag
// This hides the scrollbar but maintains scroll functionality
const scrollbarHideStyles = `
  /* Hide scrollbar for Chrome, Safari and Opera */
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  
  /* Hide scrollbar for IE, Edge and Firefox */
  .scrollbar-hide {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
`;