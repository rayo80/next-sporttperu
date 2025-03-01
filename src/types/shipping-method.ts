import { Currency } from "./product"

  
  export interface ShippingMethodPrice {
    id: string
    shippingMethodId: string
    currencyId: string
    price: string
    createdAt: string
    updatedAt: string
    currency: Currency
  }
  
  export interface ShippingMethod {
    id: string
    name: string
    description: string
    estimatedDeliveryTime: string
    isActive: boolean
    createdAt: string
    updatedAt: string
    prices: ShippingMethodPrice[]
  }
  