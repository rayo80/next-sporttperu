import { Category } from "./category"
import { Collection } from "./collections"

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
    createdAt: string | number | Date
    id: string;
    title: string
    description: string
    slug: string
    vendor: string
    status: "DRAFT" | "PUBLISHED"
    categories: Category[]
    collections: Collection[]
    imageUrls: string[]
    allowBackorder: boolean,
    sku: string
    weightValue: number
    weightUnit: string
 
    image?: string //////////
    name?: string //////////
 
    variants: ProductVariant[] // You might want to define a more specific type for variants
  }

export interface  CreateProductDto {
    title: string
    description: string
    slug: string
    vendor: string
}

export class ProductModel {
  id: string;
  title: string;
  description: string;
  slug: string;
  vendor: string;
  status: "DRAFT" | "PUBLISHED";
  categories: Category[];
  collections: Collection[];
  imageUrls: string[];
  allowBackorder: boolean;
  sku: string;
  weightValue: number;
  weightUnit: string;
  createdAt: string | number | Date;
  image?: string;
  name?: string;
  variants: ProductVariantModel[];

  constructor(data: Product) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.slug = data.slug;
    this.vendor = data.vendor;
    this.status = data.status;
    this.categories = data.categories;
    this.collections = data.collections;
    this.imageUrls = data.imageUrls;
    this.allowBackorder = data.allowBackorder;
    this.sku = data.sku;
    this.weightValue = data.weightValue;
    this.weightUnit = data.weightUnit;
    this.createdAt = data.createdAt;
    this.image = data.image;
    this.name = data.name;
    this.variants = data.variants.map((v) => new ProductVariantModel(v));
  }

  get mainImage(): string{
    return this.imageUrls.length > 0 ? this.imageUrls[0] : "/assets/image.png";
  }

  get allPrices(): VariantPriceModel[] {
    return this.variants.flatMap(v => v.prices);
  }

  get minPrice(): number | null {
    const prices = this.allPrices.map(p => p.priceAsNumber);
    return prices.length > 0 ? Math.min(...prices) : null;
  }

  get totalInventory(): number {
    return this.variants.reduce((sum, variant) => sum + variant.inventoryQuantity, 0);
  }

  get defaultVariant(): ProductVariantModel {
    return this.variants[0]; // Se asume que siempre existe
  }

  static fromInterface(data: Product): ProductModel {
    return new ProductModel(data);
  }
}