import axios from "axios"

import api from "./base"
import { ShippingMethod } from "@/types/shipping-method"


export const shippingMethodService = {

  getAll: async (): Promise<ShippingMethod[]> => {
    try {
      const response = await api.get("/shipping-methods")
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data.message || "Error fetching shipping methods")
      }
      throw error
    }
  },

  // Puedes agregar más métodos aquí según sea necesario, por ejemplo:
  // getById, create, update, delete, etc.
}

