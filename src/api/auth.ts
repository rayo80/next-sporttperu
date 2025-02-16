import axios from "axios"
import type { Customer, CreateCustomerDto } from "@/types/customer"
import api from "./base"
import { decodeJWT } from "@/utils/jwt"

interface LoginCredentials {
  email: string
  password: string
}

interface LoginResponse {
  access_token: string
  userInfo: Customer
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await api.post("/customers/login", credentials)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data.message || "Error during login")
      }
      throw error
    }
  },

  register: async (userData: CreateCustomerDto): Promise<Customer> => {
    try {
      const response = await api.post("/customers", userData)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data.message || "Error during registration")
      }
      throw error
    }
  },

  logout: async (): Promise<void> => {
    try {
      await api.post("/auth/logout")
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data.message || "Error during logout")
      }
      throw error
    }
  },

  getCustomerById: async (customerId: string): Promise<Customer> => {
    try {
      const response = await api.get(`/customers/${customerId}`)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data.message || "Error fetching customer data")
      }
      throw error
    }
  },


  getCurrentUser: (): { id: string } | null => {
    const token = localStorage.getItem("token")
    if (!token) return null

    const decodedToken = decodeJWT(token)
    if (!decodedToken || Date.now() >= decodedToken.exp * 1000) {
      localStorage.removeItem("token")
      return null
    }

    return { id: decodedToken.id }
  },

  getCompleteCustomerData: async (customerId: string): Promise<Customer | null> => {
    try {
      const customerData = await authService.getCustomerById(customerId)
      return customerData
    } catch (error) {
      console.error("Error fetching complete customer data:", error)
      return null
    }
  },
}