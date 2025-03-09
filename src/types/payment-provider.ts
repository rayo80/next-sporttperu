import { Currency } from "./product"

export enum PaymentProviderType {
    CREDIT_CARD = "CREDIT_CARD",
    PAYPAL = "PAYPAL",
    STRIPE = "STRIPE",
    BANK_TRANSFER = "BANK_TRANSFER",
    CASH_ON_DELIVERY = "CASH_ON_DELIVERY",
    OTHER = "OTHER",
    MERCADO_PAGO = "MERCADOPAGO",
  }
  
  
  export interface PaymentProvider {
    id: string
    name: string
    type: PaymentProviderType
    description: string
    isActive: boolean
    credentials: Record<string, string>
    currencyId: string
    createdAt: string
    updatedAt: string
    currency: Currency
  }
  
  