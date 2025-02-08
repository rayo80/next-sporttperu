import axios from "axios"
import type { Customer, CreateCustomerDto } from "@/types/customer"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://sporttnest.emetstudio.com"
const TOKEN =
  "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAv7oK2LrZxTbbZxk3zSTxB0W0dXpJ9UDszX8aFQ9/uNsMZj+v34y6b57Jprds0kZyA8yDmhnxHvR5Ln85YVpP7Zm1fZqV+m1pWn6pSLoQo5X9nM5XwvR9LmUpl9Jl5m6+lM9GHRgVxyN7EHRR+op+Yh7VGpLLftNyP3gf+5RfzHk4vvzLz1XOD+SbV02RHEh5pP/9JBo9CjvZZZ7sFIJh"

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${TOKEN}`,
  },
})

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