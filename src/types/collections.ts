import { Product } from "./product";

export type Collection = {
  isFeatured: boolean;
  id: string;
  title: string;
  description: string;
  slug: string;
  products: Product[]
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  metaTitle: string | null;
  metaDescription: string | null;
};