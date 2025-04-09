import { ProductProvider } from "@/contexts/product.context"
import "@/app/globals.css";
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
import { CollectionProvider } from "@/contexts/collections.context";
import { ShippingMethodProvider } from "@/contexts/shipping-method.context";
import { EmailProvider } from "@/contexts/email.context";

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
            <CategoryProvider>
              <CartProvider>
                <CollectionProvider>
                  <ShippingMethodProvider>
                    <PaymentProviderProvider>
                      <AuthProvider>
                        <AddressProvider>
                          <OrderProvider>
                            <EmailProvider>
                          {children}
                          </EmailProvider>
                          <Toaster />
                          </OrderProvider>
                        </AddressProvider>
                      </AuthProvider>
                    </PaymentProviderProvider>
                  </ShippingMethodProvider>
                </CollectionProvider>
              </CartProvider>
            </CategoryProvider>
            
          </ProductProvider>
        </ShopProvider>
      </body>
    </html>
  )
}

