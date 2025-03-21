"use client"
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

import { productService } from '@/services/products';
import { Product } from '@/types/product';
import { Category } from '@/types/category';
import { categoryService } from '@/services/categories';

export interface CreateCategoryDto {
    title: string;
    name: string;
}

export interface CategoryContextType {
  items: Category[];
  isLoading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  getCategories: () => Promise<void>;
  addCategory: (category: CreateCategoryDto) => Promise<void>;
  updateCategory: (slug: string, category: Partial<CreateCategoryDto>) => Promise<void>;
  deleteCategory: (slug: string) => Promise<void>;
  getCategory: (id: string) => Category | undefined;
  getCategorySlug: (slug: string) => Category | undefined;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export function CategoryProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);


  const fetchCategories = useCallback(async () => {
    if (isInitialized) return;
    try {
      setIsLoading(true);
      setError(null);
      const data = await categoryService.getAll('/categories');
      setIsInitialized(true);
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized]);

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    const data = await categoryService.getAll('/categories');
    setItems(data);
  };

  const addCategory = async (newProduct: CreateCategoryDto) => {
    try {
      setError(null);
      const created = await categoryService.create('/categories', newProduct);
      setItems((prev) => [...prev, created]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create product');
      throw err;
    }
  };

  const updateCategory = async (slug: string, updatedProduct: Partial<CreateCategoryDto>) => {
    try {
      setError(null);
      const updated = await categoryService.update('/categories', slug, updatedProduct);
      setItems((prev) =>
        prev.map((cat) => (cat.slug === slug ? updated : cat))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product');
      throw err;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      setError(null);
      await categoryService.delete('/products', id);
      setItems((prev) => prev.filter((CAT) => CAT.slug !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
      throw err;
    }
  };

  const getCategory = (id: string) => {
    return items.find((product) => product.id === id);
  };

  const getCategorySlug = (slug: string) => {
    return items.find((product) => product.slug === slug);
  };

  return (
    <CategoryContext.Provider
      value={{
        items,
        isLoading,
        error,
        fetchCategories,
        getCategory,
        addCategory,
        updateCategory,
        deleteCategory,
        getCategories,
        getCategorySlug,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a ProductProvider');
  }
  return context;
}
