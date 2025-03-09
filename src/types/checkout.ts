import type { CreateCustomerDto } from "@/types/customer"
import { Currency } from "./product"

export interface CheckoutFormData {
    // Customer information
    customer: CreateCustomerDto

    // Order details
    orderDetails: {
        customerNotes?: string
        preferredDeliveryDate?: string
        paymentProviderId?: string | null
        shippingMethodId?: string | null
        deliveryMethod: "shipping" | "pickup"
    }

    // Payment information
    payment: {
        currencyId: string
        subtotal: number
        tax: number
        shippingCost: number
        total: number
    }
  
    // Discount code
    discountCode?: string
}
