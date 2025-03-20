import axios from "axios"
import type { ShopConfig } from "@/types/shop"
import api from './base';


export const shopService = {
  getShopConfig: async (shopId: string): Promise<ShopConfig> => {
    try {
      const response = await api.get(`/shop/${shopId}`)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data.message || "Error fetching shop configuration")
      }
      throw error
    }
  },
}
