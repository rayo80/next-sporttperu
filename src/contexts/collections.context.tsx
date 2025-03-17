"use client"
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

import { productService } from '@/api/products';
import { Product } from '@/types/product';
import { Category } from '@/types/category';
import { collectionsService } from '@/api/collections';
import { Collection } from '@/types/collections';



export interface CollectionContextType {
  items: Collection[];
  isLoading: boolean;
  error: string | null;
  fetchCollections: () => Promise<void>;
  getCollections: () => Promise<void>;
  getCollection: (id: string) => Collection | undefined;
  getCollectionSlug: (slug: string) => Collection | undefined;
}

const CollectionContext = createContext<CollectionContextType | undefined>(undefined);

export function CollectionProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);


  const fetchCollections = useCallback(async () => {
    if (isInitialized) return;
    try {
      setIsLoading(true);
      setError(null);
      const data = await collectionsService.getAll('/collections');
      setIsInitialized(true);
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized]);

  useEffect(() => {
    getCollections();
    console.log("no pase de arriab",)
  }, []);

  const getCollections = async () => {
    const data = await collectionsService.getAll('/collections');
    setItems(data);
  };

  const getCollection = (id: string) => {
    return items.find((product) => product.id === id);
  };

  const getCollectionSlug = (slug: string) => {
    return items.find((product) => product.slug === slug);
  };

  return (
    <CollectionContext.Provider
      value={{
        items,
        isLoading,
        error,
        fetchCollections,
        getCollection,
        getCollections,
        getCollectionSlug,
      }}
    >
      {children}
    </CollectionContext.Provider>
  );
}

export function useCollections() {
  const context = useContext(CollectionContext);
  if (context === undefined) {
    throw new Error('useCollections must be used within a CollectionsProvider');
  }
  return context;
}

