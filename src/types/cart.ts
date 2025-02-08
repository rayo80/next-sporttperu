import { Product, ProductVariant, ProductVariantModel } from "./product"

export interface CartItem {
    variant: ProductVariant
    product: Product
    quantity: number
  }
  
export class CartItemModel {
  quantity: number;
  product: Product;
  variant: ProductVariantModel;

  constructor(data: CartItem) {
    this.variant = new ProductVariantModel(data.variant);
    this.product = data.product;
    this.quantity = data.quantity;
  }
}

export interface CartState {
    items: CartItem[]
    total: number
  }