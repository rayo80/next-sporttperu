"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { authService } from "@/api/auth"
import type { User, LoginCredentials } from "@/types/user"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  error: string | null
  login: (credentials: LoginCredentials) => Promise<void>
  register: (userData: Omit<User, "id"> & { password: string }) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    authService
      .getCurrentUser()
      .then(setUser)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false))
  }, [])

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true)
    setError(null)
    try {
      const user = await authService.login(credentials)
      setUser(user)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during login")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: Omit<User, "id"> & { password: string }) => {
    setIsLoading(true)
    setError(null)
    try {
      const user = await authService.register(userData)
      setUser(user)
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
      setUser(null)
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
        user,
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
