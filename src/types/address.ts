export interface Address {
    id: string
    customerId?: string
    firstName: string
    lastName: string
    address1: string
    address2?: string
    city: string
    state: string
    postalCode: string
    country: string
    phone: string
    isDefault?: boolean
  }
  
  export interface CreateAddressDto extends Omit<Address, "id"> {}