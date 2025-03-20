import { PaymentProvider } from "@/types/payment-provider"
import axios from "axios"
import api from "./base"



export const paymentProviderService = {
    getPaymentProviders: async (): Promise<PaymentProvider[]> => {
        try {
          const response = await api.get("/payment-providers")
          return response.data
        } catch (error) {
          if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data.message || "Error fetching payment providers")
          }
          throw error
        }
      },

    updatePaymentProvider: async (providerId: string, data: Partial<PaymentProvider>): Promise<PaymentProvider> => {
        try {
        const response = await api.patch(`/payment-providers/${providerId}`, data)
        return response.data
        } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data.message || "Error updating payment provider")
        }
        throw error
        }
    },

  // Puedes agregar más métodos según sea necesario, como crear un nuevo proveedor, eliminar, etc.
}

