"use client"

import { useCategories } from "@/contexts/categories.context"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"

export function CategoriesSidebar() {
  const { items: categories, isLoading } = useCategories()
  const limitedCategories = categories?.slice(0, 9) || []

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  }

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.5,
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  }

  return (
    <div className="w-full">
      <motion.h2 
        className="bg-pink-500 text-white rounded-t-md py-3 px-4 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Categorías
      </motion.h2>
      <motion.nav 
        className="border rounded-b-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        {isLoading ? (
          // Skeleton loading state
          <div className="py-1">
            {Array(6).fill(0).map((_, index) => (
              <div key={index} className="px-4 py-2.5">
                <Skeleton className="h-5 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <AnimatePresence>
            <motion.ul 
              className="py-1"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {limitedCategories.length > 0 ? (
                limitedCategories.map((category) => (
                  <motion.li 
                    key={category.slug}
                    variants={itemVariants}
                  >
                    <Link
                      href={`/shop?category=${category.slug}`}
                      className="block px-4 py-2.5 hover:bg-accent text-sm font-light"
                    >
                      {category.name}
                    </Link>
                  </motion.li>
                ))
              ) : (
                <motion.li 
                  variants={itemVariants}
                  className="px-4 py-2.5 text-sm text-gray-500"
                >
                  No hay categorías disponibles
                </motion.li>
              )}
            </motion.ul>
          </AnimatePresence>
        )}
        <div className="px-4 pb-3">
          <motion.div
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
          >
            <Link
              href="/shop"
              className="block bg-gradient-to-br
                from-white to-gray-200 shadow-md
                shadow-slate-100 border border-gray-200 hover:bg-gray-300 text-center text-sm py-2 rounded-md"
            >
              Explorar Tienda
            </Link>
          </motion.div>
        </div>
      </motion.nav>
    </div>
  )
}