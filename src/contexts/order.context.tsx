"use client"

import { createContext, useContext, useState, useCallback } from "react"
import type { Order, CreateOrderDto, OrderError } from "@/types/order"
import type { CartState } from "@/types/cart"
import type { Customer, CreateCustomerDto } from "@/types/customer"
import { customerService } from "@/services/customers"
import { useCart } from "./cart.context"
import { useAuth } from "./auth.context"
import { orderService } from "@/services/order"
import { CheckoutFormData } from "@/types/checkout"
import { OrderFinancialStatus, OrderFulfillmentStatus } from "@/types/commom"


interface OrderContextType {
  currentOrder: Order | null
  isLoading: boolean
  orders: Order[]
  error: OrderError | null
  createOrderFromCart: (checkoutData: CheckoutFormData) => Promise<Order>
  clearOrder: () => void
  getOrder: (orderId: string) => Promise<Order>
  fetchOrders: () => Promise<void>
}

const OrderContext = createContext<OrderContextType | undefined>(undefined)

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<OrderError | null>(null)
  const { clearCart } = useCart()
  const { customer } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])


  const createOrderFromCart = useCallback(
    async (
      checkoutData: CheckoutFormData): Promise<Order> => {
      setIsLoading(true)
      setError(null)

      try {
        // Calculate tax (IGV 18%)
        const { customer:formCustomer, orderDetails, payment, cartItems } = checkoutData
        const { subtotal, tax, total, currencyId } = checkoutData.payment


        let orderCustomer: Customer

        if (customer) {
          orderCustomer = customer
        } else {
          try {
            // Create a new customer
            checkoutData.customer.extrainfo = {email: formCustomer.email}
            checkoutData.customer.email = null
            orderCustomer = await customerService.create(formCustomer)
          } catch (error) {
            console.error("Error creating customer:", error)
            throw new Error("Failed to create customer. Please try again.")
          }
        }

        const orderData: CreateOrderDto = {
          customerId: orderCustomer.id,
          currencyId: currencyId,
          totalPrice: total,
          subtotalPrice: subtotal,
          totalTax: tax,
          totalDiscounts: 0, // Implement discount logic if needed
          lineItems: cartItems!,
          shippingAddressId: orderCustomer.addresses[0]?.id,
          billingAddressId: orderCustomer.addresses[0]?.id,
          paymentProviderId: checkoutData.orderDetails.paymentProviderId,
          shippingMethodId: checkoutData.orderDetails.shippingMethodId,
          customerNotes: checkoutData.orderDetails.customerNotes,
          paymentStatus: checkoutData.orderDetails.paymentStatus,
          fulfillmentStatus: OrderFulfillmentStatus.PENDING_FULFILLMENT, // FIXED VALUE
          preferredDeliveryDate: checkoutData.orderDetails.preferredDeliveryDate,
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
    [clearCart, customer],
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

  const fetchOrders = useCallback(async (): Promise<void> => {
    if (!customer) return

    setIsLoading(true)
    setError(null)
    try {
      const fetchedOrders = await orderService.getAll('/order')
      const customerOrders = fetchedOrders.filter((order) => order.customerId === customer.id)
      setOrders(customerOrders)
    } catch (err) {
      const orderError: OrderError = {
        code: "ORDERS_FETCH_FAILED",
        message: err instanceof Error ? err.message : "Failed to fetch orders",
      }
      setError(orderError)
    } finally {
      setIsLoading(false)
    }
  }, [customer])

  return (
    <OrderContext.Provider
      value={{
        currentOrder,
        isLoading,
        orders,
        error,
        createOrderFromCart,
        fetchOrders,
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