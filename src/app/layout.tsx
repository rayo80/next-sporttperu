import { ProductProvider } from "@/contexts/product.context"
import '@/app/globals.css';
import { CartProvider } from "@/contexts/cart.context";
import { CategoryProvider } from "@/contexts/categories.context";
import { SiteFooter } from "@/components/site-footer";
import { OrderProvider } from "@/contexts/order.context";
import { AuthProvider } from "@/contexts/auth.context";
import { AddressProvider } from "@/contexts/address.context";
import { Toaster } from "sonner";
import { ShopProvider } from "@/contexts/shop.context";
import { CurrencySelector } from "@/components/currency-selector";
import { PaymentProviderProvider } from "@/contexts/payment-provider.context";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="w-full container-full ">
        <ShopProvider>
          <ProductProvider>
            <CartProvider>
              <CategoryProvider>
                <PaymentProviderProvider>
                  <AuthProvider>
                    <AddressProvider>
                      <OrderProvider>
                      {children}
                      <Toaster />
                      </OrderProvider>
                    </AddressProvider>
                  </AuthProvider>
                </PaymentProviderProvider>
              </CategoryProvider>
            </CartProvider>
          </ProductProvider>
        </ShopProvider>
      </body>
    </html>
  )
}

