import { ProductProvider } from "@/contexts/product.context"
import '@/app/globals.css';
import { CartProvider } from "@/contexts/cart.context";
import { CategoryProvider } from "@/contexts/categories.context";
import { SiteFooter } from "@/components/site-footer";
import { OrderProvider } from "@/contexts/order.context";
import { AuthProvider } from "@/contexts/auth.context";
import { AddressProvider } from "@/contexts/address.context";
import { Toaster } from "sonner";

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
              <AuthProvider>
                <AddressProvider>
                  <OrderProvider>
                  {children}
                  <Toaster />
                  </OrderProvider>
                </AddressProvider>
              </AuthProvider>
            </CategoryProvider>
          </CartProvider>
        </ProductProvider>
      </body>
    </html>
  )
}

