import axios from "axios"
import type { Customer, CreateCustomerDto } from "@/types/customer"
import api from "./base"

interface LoginCredentials {
  email: string
  password: string
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<Customer> => {
    try {
      const response = await api.post("/auth/login", credentials)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data.message || "Error during login")
      }
      throw error
    }
  },

  register: async (userData: CreateCustomerDto & { password: string }): Promise<Customer> => {
    try {
      const response = await api.post("/auth/register", userData)
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

  getCurrentUser: async (): Promise<Customer | null> => {
    try {
      const response = await api.get("/auth/me")
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        return null
      }
      throw error
    }
  },
}