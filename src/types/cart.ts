import { Product, ProductVariant } from "./product"

export interface CartItem {
    variant: ProductVariant
    product: Product
    quantity: number
  }

export interface CartState {
    items: CartItem[]
    total: number
  }