import axios from "axios"
import type { Address, CreateAddressDto } from "@/types/address"
import api from "./base"

export const addressService = {
  create: async (addressData: CreateAddressDto): Promise<Address> => {
    try {
      const response = await api.post("/addresses", addressData)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data.message || "Error creating address")
      }
      throw error
    }
  },

  getByCustomerId: async (customerId: string): Promise<Address[]> => {
    try {
      const response = await api.get(`/addresses?customerId=${customerId}`)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data.message || "Error fetching addresses")
      }
      throw error
    }
  },

  update: async (addressId: string, addressData: Partial<Address>): Promise<Address> => {
    try {
      const response = await api.patch(`/addresses/${addressId}`, addressData)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data.message || "Error updating address")
      }
      throw error
    }
  },

  delete: async (addressId: string): Promise<void> => {
    try {
      await api.delete(`/addresses/${addressId}`)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data.message || "Error deleting address")
      }
      throw error
    }
  },
}
