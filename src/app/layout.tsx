import { ProductProvider } from "@/contexts/product.context"
import '@/app/globals.css';
import { CartProvider } from "@/contexts/cart.context";
import { CategoryProvider } from "@/contexts/categories.context";
import { SiteFooter } from "@/components/site-footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="w-full container-full ">
        
        <ProductProvider>
          <CartProvider>
            <CategoryProvider>
              {children}
            </CategoryProvider>
          </CartProvider>
        </ProductProvider>
      </body>
    </html>
  )
}

