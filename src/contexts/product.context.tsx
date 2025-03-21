"use client"
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

import { productService } from '@/services/products';
import { Product } from '@/types/product';

export interface CreateProductDto {
  title: string;
  description: string;
  slug: string;
  vendor: string;
  status: "DRAFT" | "PUBLISHED";
  categoryIds: string[];
  collectionIds: string[];
  imageUrls: string[];
  sku: string;
  inventoryQuantity: number;
  weightValue: number;
  weightUnit: string;
  prices: {
    currencyId: string;
    price: number;
  }[];
  variants: any[]; // You might want to define a more specific type for variants
}

export interface ProductContextType {
  products: Product[];
  availableProducts: Product[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  getProducts: () => Promise<void>;
  addProduct: (product: CreateProductDto) => Promise<void>;
  updateProduct: (slug: string, product: Partial<CreateProductDto>) => Promise<void>;
  deleteProduct: (slug: string) => Promise<void>;
  getProduct: (id: string) => Product | undefined;
  getProductSlug: (slug: string) => Product | undefined;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);


  const fetchProducts = useCallback(async () => {
    if (isInitialized) return;
    try {
      setIsLoading(true);
      setError(null);
      const data = await productService.getAll('/products');
      setIsInitialized(true);
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized]);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    const data = await productService.getAll('/products');
    setProducts(data);
  };




  const addProduct = async (newProduct: CreateProductDto) => {
    try {
      setError(null);
      const created = await productService.create('/products', newProduct);
      setProducts((prev) => [...prev, created]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create product');
      throw err;
    }
  };

  const updateProduct = async (slug: string, updatedProduct: Partial<CreateProductDto>) => {
    try {
      setError(null);
      const updated = await productService.update('/products', slug, updatedProduct);
      setProducts((prev) =>
        prev.map((product) => (product.slug === slug ? updated : product))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product');
      throw err;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      setError(null);
      await productService.delete('/products', id);
      setProducts((prev) => prev.filter((product) => product.slug !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
      throw err;
    }
  };

  const getProduct = (id: string) => {
    return products.find((product) => product.id === id);
  };

  const getProductSlug = (slug: string) => {
    return products.find((product) => product.slug === slug);
  };

  const getAvailableProducts = () => {
    return products.filter((product) => {
      const totalStock = product.variants.reduce((sum, variant) => sum + variant.inventoryQuantity, 0)
      return totalStock > 0 || product.allowBackorder
    })
  }
  const availableProducts = getAvailableProducts()

  return (
    <ProductContext.Provider
      value={{
        products,
        availableProducts,
        isLoading,
        error,
        fetchProducts,
        getProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        getProduct,
        getProductSlug,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}
