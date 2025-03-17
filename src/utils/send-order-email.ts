import { emailService } from "@/api/email"
import type { Order } from "@/types/order"
import type { Customer } from "@/types/customer"
import type { ShopConfig } from "@/types/shop"
import { generateAdminOrderEmail, generateCustomerOrderEmail } from "./email-template"

/**
 * Sends order confirmation emails to both customer and admin
 */
export async function sendOrderEmails(order: Order, customer: Customer, shopConfig?: ShopConfig): Promise<boolean> {
  try {
    // Send email to customer
    await emailService.sendEmail({
      to: customer.email || "",
      subject: `Confirmación de Pedido #${order.orderNumber}`,
      html: generateCustomerOrderEmail(order, customer, shopConfig),
    })

    // Send email to admin
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || shopConfig?.email || "admin@tutienda.com"
    await emailService.sendEmail({
      to: adminEmail,
      subject: `Nuevo Pedido #${order.orderNumber}`,
      html: generateAdminOrderEmail(order, customer, shopConfig),
    })

    return true
  } catch (error) {
    console.error("Error sending order emails:", error)
    return false
  }
}

