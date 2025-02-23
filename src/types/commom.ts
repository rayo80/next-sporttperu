// Common enums
export enum CurrencyPosition {
    BEFORE = 'BEFORE',
    AFTER = 'AFTER'
  }
  
  export enum OrderFinancialStatus {
    PENDING = 'PENDING',
    AUTHORIZED = 'AUTHORIZED',
    PARTIALLY_PAID = 'PARTIALLY_PAID',
    PAID = 'PAID',
    PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED',
    REFUNDED = 'REFUNDED',
    VOIDED = 'VOIDED'
  }
  
  export enum OrderFulfillmentStatus {
    UNFULFILLED = 'UNFULFILLED',
    PARTIALLY_FULFILLED = 'PARTIALLY_FULFILLED',
    FULFILLED = 'FULFILLED',
    RESTOCKED = 'RESTOCKED',
    PENDING_FULFILLMENT = 'PENDING_FULFILLMENT',
    OPEN = 'OPEN',
    IN_PROGRESS = 'IN_PROGRESS',
    ON_HOLD = 'ON_HOLD',
    SCHEDULED = 'SCHEDULED'
  }
  
  export enum ProductStatus {
    DRAFT = 'DRAFT',
    ACTIVE = 'ACTIVE',
    ARCHIVED = 'ARCHIVED'
  }
  
  export enum DiscountType {
    PERCENTAGE = 'PERCENTAGE',
    FIXED_AMOUNT = 'FIXED_AMOUNT',
    BUY_X_GET_Y = 'BUY_X_GET_Y',
    FREE_SHIPPING = 'FREE_SHIPPING'
  }
  
  export enum FulfillmentStatus {
    PENDING = 'PENDING',
    OPEN = 'OPEN',
    SUCCESS = 'SUCCESS',
    CANCELLED = 'CANCELLED',
    ERROR = 'ERROR',
    FAILURE = 'FAILURE'
  }
  
  export enum PaymentProviderType {
    CREDIT_CARD = 'CREDIT_CARD',
    PAYPAL = 'PAYPAL',
    STRIPE = 'STRIPE',
    BANK_TRANSFER = 'BANK_TRANSFER',
    CASH_ON_DELIVERY = 'CASH_ON_DELIVERY',
    OTHER = 'OTHER',
    MERCADO_PAGO = 'MERCADO_PAGO',
  }
  
  export enum ShippingMethodType {
    STANDARD = 'STANDARD',
    EXPRESS = 'EXPRESS',
    OVERNIGHT = 'OVERNIGHT',
    FREE = 'FREE',
    PICKUP = 'PICKUP',
    CUSTOM = 'CUSTOM'
  }
  export enum ShippingStatus {
    PENDING = "PENDING",
    READY_FOR_SHIPPING = "READY_FOR_SHIPPING",
    IN_TRANSIT = "IN_TRANSIT",
    DELIVERED = "DELIVERED",
    RETURNED = "RETURNED",
  }
  
  export enum ContentType {
    PAGE = 'PAGE',
    BLOG_POST = 'BLOG_POST'
  }
  
  export enum UserRole {
    ADMIN = 'ADMIN',
    MANAGER = 'MANAGER',
    EDITOR = 'EDITOR',
    CUSTOMER_SERVICE = 'CUSTOMER_SERVICE'
  }
  
  // Common interfaces
  export interface Timestamps {
    createdAt: string;
    updatedAt: string;
  }