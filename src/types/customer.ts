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
}

export interface Customer {
  id: string
  firstName: string
  lastName: string
  phone: string
  email?: string
  acceptsMarketing: boolean
  extrainfo?: JSON
  addresses: Address[]
}

export interface CreateCustomerDto {
  firstName: string
  lastName: string
  phone: string
  email?: string
  acceptsMarketing: boolean
  extrainfo?: JSON
  password?: string
  addresses: Omit<Address, "id">[]
}
