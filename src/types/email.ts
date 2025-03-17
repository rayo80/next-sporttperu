export interface EmailSendParams {
  to: string
  subject: string
  html: string
}

// EmailFormData can be any JSON object
export interface EmailFormData {
  [key: string]: any
}

export interface EmailResponse {
  success: boolean
  message: string
}

