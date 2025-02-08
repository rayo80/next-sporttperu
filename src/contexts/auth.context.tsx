"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { authService } from "@/api/auth"
import { CreateCustomerDto, Customer } from "@/types/customer"


interface LoginCredentials {
  email: string
  password: string
}

interface AuthContextType {
  customer: Customer | null
  isLoading: boolean
  error: string | null
  login: (credentials: LoginCredentials) => Promise<void>
  register: (userData: CreateCustomerDto & { password: string }) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    authService
      .getCurrentUser()
      .then(setCustomer)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false))
  }, [])

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true)
    setError(null)
    try {
      const customer = await authService.login(credentials)
      setCustomer(customer)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during login")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: CreateCustomerDto & { password: string }) => {
    setIsLoading(true)
    setError(null)
    try {
      const customer = await authService.register(userData)
      setCustomer(customer)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during registration")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    setError(null)
    try {
      await authService.logout()
      setCustomer(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during logout")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        customer,
        isLoading,
        error,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
