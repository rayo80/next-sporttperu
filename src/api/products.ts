import axios from 'axios';
import { Product, CreateProductDto } from '../types/product';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://sporttnest.emetstudio.com';
const TOKEN = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAv7oK2LrZxTbbZxk3zSTxB0W0dXpJ9UDszX8aFQ9/uNsMZj+v34y6b57Jprds0kZyA8yDmhnxHvR5Ln85YVpP7Zm1fZqV+m1pWn6pSLoQo5X9nM5XwvR9LmUpl9Jl5m6+lM9GHRgVxyN7EHRR+op+Yh7VGpLLftNyP3gf+5RfzHk4vvzLz1XOD+SbV02RHEh5pP/9JBo9CjvZZZ7sFIJh';


const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${TOKEN}`
  }
});

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

