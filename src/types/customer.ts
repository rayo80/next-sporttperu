export interface Address {
  id: string
  company: string
  address1: string
  address2?: string
  city: string
  province: string
  zip: string
  country: string
  phone: string
  isDefault?: boolean
}

export interface Customer {
  id: string
  firstName: string
  lastName: string
  phone: string
  email: string | null
  acceptsMarketing: boolean
  extrainfo?: JSON
  addresses: Address[]
}

export interface CreateCustomerDto {
  firstName: string
  lastName: string
  phone: string
  email?: string | null
  acceptsMarketing: boolean
  extrainfo?:  Record<string, any> 
  password?: string
  addresses: Omit<Address, "id">[]
}
