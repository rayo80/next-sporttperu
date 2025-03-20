"use server"
import type { OrderAddress } from "@/types/order"

export async function submitOrder(formData: FormData) {
  try {
    // Create shipping address
    const shippingAddress: OrderAddress = {
      id: `addr_${Date.now()}`,
      address1: formData.get("address") as string,
      address2: (formData.get("apartment") as string) || undefined,
      city: formData.get("city") as string,
      country: "PE",
      phone: formData.get("phone") as string,
      isDefault: false,
      company: "",
      province: "",
      zip: "",
      customerId: "",
      createdAt: "",
      updatedAt: ""
    }

    // Return the shipping address to be used by the client component
    return { success: true, shippingAddress }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to process order",
    }
  }
}