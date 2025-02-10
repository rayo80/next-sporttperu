
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

export class VariantPriceModel{
  id: string = "";
  variantId: string = "";
  currencyId: string = "";
  price!: string;
  createdAt!: string;
  updatedAt!: string;
  currency!: Currency;

  constructor(data: VariantPrice) {
      Object.assign(this, data);
  }

  get priceAsNumber(): number {
      return parseFloat(this.price);
  }

  static fromInterface(data: VariantPrice): VariantPriceModel {
    return new VariantPriceModel(data);
  }
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

export class ProductVariantModel {
  id: string;
  productId: string;
  title: string;
  sku: string;
  attributes: { [key: string]: string };
  imageUrl: string;
  compareAtPrice: number | null;
  inventoryQuantity: number;
  weightValue: string;
  position: number;
  createdAt: string;
  updatedAt: string;
  prices: VariantPriceModel[];

  constructor(data: ProductVariant) {
    this.id = data.id;
    this.productId = data.productId;
    this.title = data.title;
    this.sku = data.sku;
    this.attributes = data.attributes;
    this.imageUrl = data.imageUrl;
    this.compareAtPrice = data.compareAtPrice;
    this.inventoryQuantity = data.inventoryQuantity;
    this.weightValue = data.weightValue;
    this.position = data.position;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.prices = data.prices.map((p) => new VariantPriceModel(p)); // Convierte a modelos
  }
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
