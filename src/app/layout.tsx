import { ProductProvider } from "@/contexts/product.context"
import '@/app/globals.css';
import { CartProvider } from "@/contexts/cart.context";
import { CategoryProvider } from "@/contexts/categories.context";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="w-full m-0">
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

