"use client"

import { createContext, useContext, useState, useCallback } from "react"
import type { Order, CreateOrderDto, OrderError, OrderAddress } from "@/types/order"
import type { CartState } from "@/types/cart"


import { orderService } from "@/api/order"
import { useCart } from "./cart.context"

interface OrderContextType {
  currentOrder: Order | null
  isLoading: boolean
  error: OrderError | null
  createOrderFromCart: (
    cartState: CartState,
    customerInfo: {
      email: string
      phone: string
      shippingAddress: OrderAddress
      billingAddress?: OrderAddress
      customerNotes?: string
      preferredDeliveryDate?: string
    },
  ) => Promise<Order>
  clearOrder: () => void
  getOrder: (orderId: string) => Promise<Order>
}

const OrderContext = createContext<OrderContextType | undefined>(undefined)

const DEFAULT_CURRENCY_ID = "curr_f62e7f75-f8f4" // PEN
const DEFAULT_PAYMENT_PROVIDER = "provider_mercadopago"
const DEFAULT_SHIPPING_METHOD = "shipping_standard"

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<OrderError | null>(null)
  const { clearCart } = useCart()

  const createOrderFromCart = useCallback(
    async (
      cartState: CartState,
      customerInfo: {
        email: string
        phone: string
        shippingAddress: OrderAddress
        billingAddress?: OrderAddress
        customerNotes?: string
        preferredDeliveryDate?: string
      },
    ): Promise<Order> => {
      setIsLoading(true)
      setError(null)

      try {
        // Calculate tax (IGV 18%)
        const subtotalPrice = cartState.total
        const totalTax = subtotalPrice * 0.18
        const totalPrice = subtotalPrice + totalTax

        // Convert cart items to order items
        const lineItems = cartState.items.map((item) => ({
          productId: item.product.slug,
          variantId: item.variant.id,
          quantity: item.quantity,
          title: item.product.title,
          price: Number(item.variant.prices[0]?.price || 0),
          totalDiscount: 0, // Implement discount logic if needed
        }))

        const orderData: CreateOrderDto = {
          customerId: `cu_${Date.now()}`, // Generate temporary customer ID
          email: customerInfo.email,
          phone: customerInfo.phone,
          currencyId: DEFAULT_CURRENCY_ID,
          totalPrice,
          subtotalPrice,
          totalTax,
          totalDiscounts: 0, // Implement discount logic if needed
          lineItems,
          shippingAddressId: customerInfo.shippingAddress.id,
          billingAddressId: customerInfo.billingAddress?.id || customerInfo.shippingAddress.id,
          paymentProviderId: DEFAULT_PAYMENT_PROVIDER,
          shippingMethodId: DEFAULT_SHIPPING_METHOD,
          customerNotes: customerInfo.customerNotes,
          preferredDeliveryDate: customerInfo.preferredDeliveryDate,
          source: "web",
        }

        const createdOrder = await orderService.create('/order', orderData)
        setCurrentOrder(createdOrder)
        clearCart() // Clear the cart after successful order creation
        return createdOrder
      } catch (err) {
        const orderError: OrderError = {
          code: "ORDER_CREATION_FAILED",
          message: err instanceof Error ? err.message : "Failed to create order",
        }
        setError(orderError)
        throw orderError
      } finally {
        setIsLoading(false)
      }
    },
    [clearCart],
  )

  const getOrder = useCallback(async (orderId: string): Promise<Order> => {
    setIsLoading(true)
    setError(null)

    try {
      const order = await orderService.getById('/order', orderId)
      setCurrentOrder(order)
      return order
    } catch (err) {
      const orderError: OrderError = {
        code: "ORDER_FETCH_FAILED",
        message: err instanceof Error ? err.message : "Failed to fetch order",
      }
      setError(orderError)
      throw orderError
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearOrder = useCallback(() => {
    setCurrentOrder(null)
    setError(null)
  }, [])

  return (
    <OrderContext.Provider
      value={{
        currentOrder,
        isLoading,
        error,
        createOrderFromCart,
        clearOrder,
        getOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  )
}

export function useOrder() {
  const context = useContext(OrderContext)
  if (context === undefined) {
    throw new Error("useOrder must be used within an OrderProvider")
  }
  return context
}

