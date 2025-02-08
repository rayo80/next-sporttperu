"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"

import { addressService } from "@/api/address"
import { Address, CreateAddressDto } from "@/types/address"


interface AddressContextType {
  addresses: Address[]
  isLoading: boolean
  error: string | null
  createAddress: (addressData: CreateAddressDto) => Promise<Address>
  getAddresses: (customerId: string) => Promise<void>
  updateAddress: (addressId: string, addressData: Partial<Address>) => Promise<Address>
  deleteAddress: (addressId: string) => Promise<void>
}

const AddressContext = createContext<AddressContextType | undefined>(undefined)

export function AddressProvider({ children }: { children: React.ReactNode }) {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createAddress = useCallback(async (addressData: CreateAddressDto): Promise<Address> => {
    setIsLoading(true)
    setError(null)
    try {
      const newAddress = await addressService.create(addressData)
      setAddresses((prev) => [...prev, newAddress])
      return newAddress
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while creating the address")
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getAddresses = useCallback(async (customerId: string): Promise<void> => {
    setIsLoading(true)
    setError(null)
    try {
      const fetchedAddresses = await addressService.getByCustomerId(customerId)
      setAddresses(fetchedAddresses)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while fetching addresses")
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateAddress = useCallback(async (addressId: string, addressData: Partial<Address>): Promise<Address> => {
    setIsLoading(true)
    setError(null)
    try {
      const updatedAddress = await addressService.update(addressId, addressData)
      setAddresses((prev) => prev.map((addr) => (addr.id === addressId ? updatedAddress : addr)))
      return updatedAddress
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while updating the address")
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const deleteAddress = useCallback(async (addressId: string): Promise<void> => {
    setIsLoading(true)
    setError(null)
    try {
      await addressService.delete(addressId)
      setAddresses((prev) => prev.filter((addr) => addr.id !== addressId))
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while deleting the address")
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  return (
    <AddressContext.Provider
      value={{
        addresses,
        isLoading,
        error,
        createAddress,
        getAddresses,
        updateAddress,
        deleteAddress,
      }}
    >
      {children}
    </AddressContext.Provider>
  )
}

export function useAddress() {
  const context = useContext(AddressContext)
  if (context === undefined) {
    throw new Error("useAddress must be used within an AddressProvider")
  }
  return context
}