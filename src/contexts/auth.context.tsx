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
  register: (userData: CreateCustomerDto) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: () => boolean
  getToken: () => string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true)
      try {
        const basicUser = authService.getCurrentUser()
        if (basicUser) {
          const completeUser = await authService.getCompleteCustomerData(basicUser.id)
          if (completeUser) {
            setCustomer(completeUser)
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
        setError("Failed to fetch user data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [])

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true)
    setError(null)
    try {
      const { access_token, userInfo } = await authService.login(credentials)
      localStorage.setItem("token", access_token)
      setCustomer(userInfo)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during login")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: CreateCustomerDto) => {
    setIsLoading(true)
    setError(null)
    try {
      const customer = await authService.register(userData)
      // setCustomer(customer)
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
      localStorage.removeItem("token")
      setCustomer(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during logout")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const isAuthenticated = () => {
    return !!localStorage.getItem("token")
  }

  const getToken = () => {
    return localStorage.getItem("token")
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
        isAuthenticated,
        getToken,
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
