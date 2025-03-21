import { CreateCustomerDto, Customer } from "@/types/customer"
import axios from "axios"
import api from "./base"


export const customerService = {
  create: async (customerData: CreateCustomerDto): Promise<Customer> => {
    try {
      const response = await api.post("/customers", customerData)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data.message || "Error creating customer")
      }
      throw error
    }
  },
}