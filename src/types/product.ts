
export interface Currency {
  id: string
  code: string
  name: string
  symbol: string
  decimalPlaces: number
  symbolPosition: "BEFORE" | "AFTER"
  isActive: boolean
  createdAt: string
  updatedAt: string
}


export interface VariantPrice {
  id: string
  variantId: string
  currencyId: string
  price: string
  createdAt: string
  updatedAt: string
  currency: Currency
}

export interface ProductVariant {
  id: string
  productId: string
  title: string
  sku: string
  attributes: {
    [key: string]: string
  }
  imageUrl: string
  compareAtPrice: number | null
  inventoryQuantity: number
  weightValue: string
  position: number
  createdAt: string
  updatedAt: string
  prices: VariantPrice[]
}


export interface Product {
    id: string;
    title: string
    description: string
    slug: string
    vendor: string
    status: "DRAFT" | "PUBLISHED"
    categories: string[]
    collectionIds: string[]
    imageUrls: string[]
    sku: string
    inventoryQuantity: number
    weightValue: number
    weightUnit: string
    price?: number //////////
    image?: string //////////
    name?: string //////////
    prices: {
      currencyId: string
      price: number
    }[]
    variants: any[] // You might want to define a more specific type for variants
  }

export interface  CreateProductDto {
    title: string
    description: string
    slug: string
    vendor: string
}
