import axios from 'axios';
import { Product, CreateProductDto } from '../types/product';
import { CreateOrderDto, Order } from '@/types/order';
import api from './base';


export const orderService = {
  getAll: async (endpoint: string): Promise<Order[]> => {
    const response = await api.get(endpoint);
    return response.data;
  },

  create: async (endpoint: string, data: CreateOrderDto): Promise<Order> => {
    const response = await api.post(endpoint, data);
    return response.data;
  },

  getById: async (endpoint: string, orderId: string): Promise<Order> => {
    console.log('getById', endpoint, orderId)
    try {
      const response = await api.get(`${endpoint}/${orderId}`)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data.message || "Error fetching order")
      }
      throw error
    }
  },

};

