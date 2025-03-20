import axios from 'axios';
import { Product, CreateProductDto } from '../types/product';
import api from './base';


export const productService = {
  getAll: async (endpoint: string): Promise<Product[]> => {
    const response = await api.get(endpoint);
    return response.data;
  },

  create: async (endpoint: string, data: CreateProductDto): Promise<Product> => {
    const response = await api.post(endpoint, data);
    return response.data;
  },

  update: async (endpoint: string, slug: string, data: Partial<CreateProductDto>): Promise<Product> => {
    const response = await api.put(`${endpoint}/${slug}`, data);
    return response.data;
  },

  delete: async (endpoint: string, slug: string): Promise<void> => {
    await api.delete(`${endpoint}/${slug}`);
  },
};

