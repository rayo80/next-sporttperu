"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import { emailService } from "@/api/email"
import type { EmailSendParams, EmailFormData, EmailResponse } from "@/types/email"

interface EmailContextType {
  isLoading: boolean
  error: string | null
  sendEmail: (params: EmailSendParams) => Promise<EmailResponse>
  submitForm: (formData: EmailFormData) => Promise<EmailResponse>
  clearError: () => void
}

const EmailContext = createContext<EmailContextType | undefined>(undefined)

export function EmailProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clearError = () => {
    setError(null)
  }

  const sendEmail = async (params: EmailSendParams): Promise<EmailResponse> => {
    setIsLoading(true)
    clearError()

    try {
      const response = await emailService.sendEmail(params)
      return response
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al enviar el email"
      setError(errorMessage)
      return {
        success: false,
        message: errorMessage,
      }
    } finally {
      setIsLoading(false)
    }
  }

  const submitForm = async (formData: EmailFormData): Promise<EmailResponse> => {
    setIsLoading(true)
    clearError()

    try {
      const response = await emailService.submitForm(formData)
      return response
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al enviar el formulario"
      setError(errorMessage)
      return {
        success: false,
        message: errorMessage,
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <EmailContext.Provider
      value={{
        isLoading,
        error,
        sendEmail,
        submitForm,
        clearError,
      }}
    >
      {children}
    </EmailContext.Provider>
  )
}

export function useEmail() {
  const context = useContext(EmailContext)
  if (context === undefined) {
    throw new Error("useEmail must be used within an EmailProvider")
  }
  return context
}
