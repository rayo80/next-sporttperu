import { Currency } from "./product"

  export interface ShopConfig {
    id: string
    name: string
    domain: string
    email: string
    shopOwner: string
    logo: string
    description: string | null
    address1: string
    address2: string | null
    city: string
    province: string | null
    provinceCode: string | null
    country: string
    countryCode: string
    zip: string
    phone: string
    defaultCurrencyId: string
    multiCurrencyEnabled: boolean
    shippingZones: any | null
    defaultShippingRate: any | null
    freeShippingThreshold: number | null
    taxesIncluded: boolean
    taxValue: string
    timezone: string
    weightUnit: string
    primaryColor: string
    secondaryColor: string | null
    theme: string | null
    facebookUrl: string | null
    instagramUrl: string | null
    twitterUrl: string | null
    tiktokUrl: string | null
    youtubeUrl: string | null
    googleAnalyticsId: string | null
    facebookPixelId: string | null
    supportEmail: string | null
    supportPhone: string | null
    liveChatEnabled: boolean
    status: string
    maintenanceMode: boolean
    multiLanguageEnabled: boolean
    createdAt: string
    updatedAt: string
    defaultCurrency: Currency
    acceptedCurrencies: Currency[]
  }
  