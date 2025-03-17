// Define a type for the checkout form data
export interface CheckoutFormData {
  customer: {
    firstName: string
    lastName: string
    phone: string
    email: string
    acceptsMarketing: boolean
    addresses: Array<{
      company?: string
      address1: string
      address2?: string
      city: string
      province: string
      zip: string
      country: string
      phone?: string
    }>
    id?: string
    createdAt?: string
    extrainfo?: JSON
  }
  orderDetails: {
    customerNotes: string
    preferredDeliveryDate: string
    paymentProviderId: string | null
    shippingMethodId: string | null
    deliveryMethod: "shipping" | "pickup"
    paymentStatus?: string
    financialStatus: string,
    fulfillmentStatus: string,
  }
  payment: {
    currencyId: string
    subtotal: number
    tax: number
    shippingCost: number
    total: number
  }
  discountCode: string
  cartItems?: Array<{
    variantId: string
    title: string
    quantity: number
    price: number
  }>
}

