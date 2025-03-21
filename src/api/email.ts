import type { EmailSendParams, EmailFormData, EmailResponse } from "@/types/email"
import api from "./base"

export const emailService = {
  /**
   * Send an email to a specific recipient
   * @param params Email parameters including recipient, subject, and HTML content
   * @returns Promise with the response data
   */
  async sendEmail(params: EmailSendParams): Promise<EmailResponse> {
    try {
      const response = await api.post("/email/send", params)
      return response.data
    } catch (error) {
      console.error("Error sending email:", error)
      throw error
    }
  },

  /**
   * Submit a form with email data (newsletter subscription, contact form, etc.)
   * @param formData Form data - can be any JSON object
   * @returns Promise with the response data
   */
  async submitForm(formData: EmailFormData): Promise<EmailResponse> {
    try {
      const response = await api.post("/email/submit-form", formData)
      return response.data
    } catch (error) {
      console.error("Error submitting form:", error)
      throw error
    }
  },
}

