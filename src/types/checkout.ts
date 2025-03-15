import type { Address, CreateCustomerDto } from "@/types/customer"
import { Currency } from "./product"
import { OrderFinancialStatus } from "./commom"

export interface OrderItemData {
    variantId: string
    title: string
    quantity: number
    price: number
    // imageUrl: string
    // attributes: Record<string, string>
  }

  // Tipo modificado para permitir direcciones con ID
type CustomerWithOptionalId = Omit<CreateCustomerDto, "addresses"> & {
    id?: string
    addresses: (Omit<Address, "id"> & { id?: string })[]
  }
  
export interface CheckoutFormData {
    // Customer information
    customer: CustomerWithOptionalId
    // Order details
    orderDetails: {
        customerNotes?: string
        preferredDeliveryDate?: string
        paymentProviderId?: string | null
        shippingMethodId?: string | null
        deliveryMethod: "shipping" | "pickup"
        paymentStatus?: OrderFinancialStatus
    }

    // Payment information
    payment: {
        currencyId: string
        subtotal: number
        tax: number
        shippingCost: number
        total: number
    }
  
    // Cart items
    cartItems?: OrderItemData[]
  
    // Discount code
    discountCode?: string
}
