import { CreateCustomerDto, Customer } from "@/types/customer"
import axios from "axios"

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