import axios from 'axios';
import { CreateCategoryDto } from '@/contexts/categories.context';
import { Category } from '@/types/category';
import api from './base';



export const categoryService = {
  getAll: async (endpoint: string): Promise<Category[]> => {
    const response = await api.get(endpoint);
    return response.data;
  },

  create: async (endpoint: string, data: CreateCategoryDto): Promise<Category> => {
    const response = await api.post(endpoint, data);
    return response.data;
  },

  update: async (endpoint: string, slug: string, data: Partial<CreateCategoryDto>): Promise<Category> => {
    const response = await api.put(`${endpoint}/${slug}`, data);
    return response.data;
  },

  delete: async (endpoint: string, slug: string): Promise<void> => {
    await api.delete(`${endpoint}/${slug}`);
  },
};
