import { OrderFinancialStatus } from "./commom"

export interface OrderCustomer {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
  acceptsMarketing: boolean
  createdAt: string
  updatedAt: string
}

export interface OrderShippingMethod {
  id: string
  name: string
  description: string
  estimatedDeliveryTime: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface OrderPaymentProvider {
  id: string
  name: string
  type: string
  description: string
  isActive: boolean
  credentials: Record<string, unknown>
  currencyId: string
  createdAt: string
  updatedAt: string
}

export interface OrderCurrency {
  id: string
  code: string
  name: string
  symbol: string
  decimalPlaces: number
  symbolPosition: "BEFORE" | "AFTER"
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface OrderLineItemVariant {
  id: string
  productId: string
  title: string
  sku: string
  isActive: boolean
  attributes: {
    [key: string]: string
  }
  imageUrl: string
  compareAtPrice: number | null
  inventoryQuantity: number
  weightValue: string
  position: number
  createdAt: string
  updatedAt: string
}

export interface OrderLineItem {
  id: string
  orderId: string
  variantId: string
  title: string
  quantity: number
  price: string
  totalDiscount: string
  createdAt: string
  updatedAt: string
  variant: OrderLineItemVariant
}

export interface Order {
  id: string
  customerId: string
  orderNumber: number
  financialStatus: string
  fulfillmentStatus: string
  currencyId: string
  totalPrice: string
  subtotalPrice: string
  totalTax: string
  totalDiscounts: string
  shippingAddressId: string
  billingAddressId: string
  couponId: string | null
  paymentProviderId: string
  paymentStatus: string
  paymentDetails: string | null
  shippingMethodId: string
  shippingStatus: string
  trackingNumber: string | null
  trackingUrl: string | null
  estimatedDeliveryDate: string | null
  shippedAt: string | null
  deliveredAt: string | null
  customerNotes: string
  internalNotes: string
  source: string
  preferredDeliveryDate: string
  createdAt: string
  updatedAt: string
  customer: OrderCustomer
  lineItems: OrderLineItem[]
  shippingAddress: OrderAddress
  billingAddress: OrderAddress
  coupon: null | any
  paymentProvider: OrderPaymentProvider
  shippingMethod: OrderShippingMethod
  currency: OrderCurrency
}

  
  export interface OrderItem  {
    productId: string; // ID del producto
    variantId: string; // ID de la variante del producto
    quantity: number; // Cantidad solicitada
    title: string; // Nombre del producto
    price: number; // Precio por unidad
    totalDiscount: number; // Descuento total aplicado al producto
  };


  export interface CreateOrderLineItem {
    variantId: string
    quantity: number
    price: number
  }

  export interface CreateOrderDto {
    customerId: string
    currencyId: string
    totalPrice: number
    subtotalPrice: number
    totalTax: number
    totalDiscounts: number
    paymentStatus?: OrderFinancialStatus
    lineItems: CreateOrderLineItem[]
    shippingAddressId?: string | null
    billingAddressId?: string | null
    paymentProviderId?: string | null
    shippingMethodId?: string | null
    customerNotes?: string
    preferredDeliveryDate?: string
    source: string
  }
  
  export interface OrderAddress {
    id: string
    isDefault: boolean
    company: string
    address1: string
    address2?: string
    city: string
    province: string
    zip: string
    country: string
    phone: string
    customerId: string
    createdAt: string
    updatedAt: string
  }
  
  export interface OrderError {
    code: string
    message: string
    field?: string
  }