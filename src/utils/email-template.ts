/**
 * Email template utilities for order notifications
 */

import type { Order } from "@/types/order"
import type { Customer } from "@/types/customer"
import type { ShopConfig } from "@/types/shop"

/**
 * Generates HTML email content for customer order confirmation
 */
export function generateCustomerOrderEmail(order: Order, customer: Customer, shopConfig?: ShopConfig): string {
  const formatCurrency = (amount: number) => {
    return `${order.currency?.symbol || "$"} ${amount.toFixed(2)}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #e91e63; margin-bottom: 5px;">¡Gracias por tu compra!</h1>
        <p style="font-size: 16px; color: #666;">Tu pedido ha sido recibido y está siendo procesado.</p>
      </div>

      <div style="background-color: #f9f9f9; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
        <h2 style="color: #333; margin-top: 0; border-bottom: 1px solid #eee; padding-bottom: 10px;">Detalles del Pedido</h2>
        <p><strong>Número de Pedido:</strong> ${order.orderNumber}</p>
        <p><strong>Fecha:</strong> ${formatDate(order.createdAt)}</p>
        <p><strong>Estado del Pago:</strong> ${order.paymentStatus === "paid" ? "Pagado" : "Pendiente"}</p>
        <p><strong>Método de Pago:</strong> ${order.paymentProvider?.name || "No especificado"}</p>
      </div>

      <div style="margin-bottom: 20px;">
        <h2 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">Productos</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f5f5f5;">
              <th style="text-align: left; padding: 10px; border-bottom: 1px solid #eee;">Producto</th>
              <th style="text-align: center; padding: 10px; border-bottom: 1px solid #eee;">Cantidad</th>
              <th style="text-align: right; padding: 10px; border-bottom: 1px solid #eee;">Precio</th>
            </tr>
          </thead>
          <tbody>
            ${order.lineItems
              .map(
                (item) => `
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.title}</td>
                <td style="text-align: center; padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
                <td style="text-align: right; padding: 10px; border-bottom: 1px solid #eee;">${formatCurrency(Number(item.price) * item.quantity)}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="text-align: right; padding: 10px;"><strong>Subtotal:</strong></td>
              <td style="text-align: right; padding: 10px;">${formatCurrency(Number(order.subtotalPrice))}</td>
            </tr>
            <tr>
              <td colspan="2" style="text-align: right; padding: 10px;"><strong>Impuestos:</strong></td>
              <td style="text-align: right; padding: 10px;">${formatCurrency(Number(order.totalTax))}</td>
            </tr>
            <tr>
              <td colspan="2" style="text-align: right; padding: 10px;"><strong>Envío:</strong></td>
              <td style="text-align: right; padding: 10px;">${formatCurrency(Number(order.totalPrice) - Number(order.subtotalPrice) - Number(order.totalTax))}</td>
            </tr>
            <tr>
              <td colspan="2" style="text-align: right; padding: 10px; font-weight: bold; font-size: 16px;">Total:</td>
              <td style="text-align: right; padding: 10px; font-weight: bold; font-size: 16px;">${formatCurrency(Number(order.totalPrice))}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div style="background-color: #f9f9f9; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
        <h2 style="color: #333; margin-top: 0; border-bottom: 1px solid #eee; padding-bottom: 10px;">Información de Envío</h2>
        <p><strong>Nombre:</strong> ${customer.firstName} ${customer.lastName}</p>
        <p><strong>Dirección:</strong> ${order.shippingAddress?.address1 || ""}</p>
        ${order.shippingAddress?.address2 ? `<p><strong>Detalles adicionales:</strong> ${order.shippingAddress.address2}</p>` : ""}
        <p><strong>Ciudad:</strong> ${order.shippingAddress?.city || ""}</p>
        <p><strong>Región:</strong> ${order.shippingAddress?.province || ""}</p>
        <p><strong>Código Postal:</strong> ${order.shippingAddress?.zip || ""}</p>
        <p><strong>País:</strong> ${order.shippingAddress?.country || ""}</p>
        <p><strong>Teléfono:</strong> ${customer.phone || ""}</p>
      </div>

      ${
        order.customerNotes
          ? `
        <div style="background-color: #f9f9f9; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
          <h2 style="color: #333; margin-top: 0; border-bottom: 1px solid #eee; padding-bottom: 10px;">Notas del Pedido</h2>
          <p>${order.customerNotes}</p>
        </div>
      `
          : ""
      }

      <div style="text-align: center; margin-top: 30px; padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
        <p style="margin-bottom: 15px;">Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos:</p>
        <p style="margin-bottom: 5px;"><strong>Email:</strong> ${shopConfig?.email || "info@tutienda.com"}</p>
        <p style="margin-bottom: 5px;"><strong>Teléfono:</strong> ${shopConfig?.phone || "+51 999 888 777"}</p>
        <p style="margin-bottom: 5px;"><strong>WhatsApp:</strong> ${shopConfig?.phone || "+51 999 888 777"}</p>
        <p style="margin-top: 20px; font-size: 12px; color: #999;">
          © ${new Date().getFullYear()} ${shopConfig?.name || "Tu Tienda"}. Todos los derechos reservados.
        </p>
      </div>
    </div>
  `
}

/**
 * Generates HTML email content for admin order notification
 */
export function generateAdminOrderEmail(order: Order, customer: Customer, shopConfig?: ShopConfig): string {
  const formatCurrency = (amount: number) => {
    return `${order.currency?.symbol || "$"} ${amount.toFixed(2)}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #e91e63; margin-bottom: 5px;">¡Nuevo Pedido Recibido!</h1>
        <p style="font-size: 16px; color: #666;">Se ha recibido un nuevo pedido que requiere tu atención.</p>
      </div>

      <div style="background-color: #f9f9f9; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
        <h2 style="color: #333; margin-top: 0; border-bottom: 1px solid #eee; padding-bottom: 10px;">Detalles del Pedido</h2>
        <p><strong>Número de Pedido:</strong> ${order.orderNumber}</p>
        <p><strong>Fecha:</strong> ${formatDate(order.createdAt)}</p>
        <p><strong>Estado del Pago:</strong> ${order.paymentStatus === "paid" ? "Pagado" : "Pendiente"}</p>
        <p><strong>Método de Pago:</strong> ${order.paymentProvider?.name || "No especificado"}</p>
        <p><strong>Total:</strong> ${formatCurrency(Number(order.totalPrice))}</p>
      </div>

      <div style="background-color: #f9f9f9; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
        <h2 style="color: #333; margin-top: 0; border-bottom: 1px solid #eee; padding-bottom: 10px;">Información del Cliente</h2>
        <p><strong>Nombre:</strong> ${customer.firstName} ${customer.lastName}</p>
        <p><strong>Email:</strong> ${customer.email}</p>
        <p><strong>Teléfono:</strong> ${customer.phone || "No especificado"}</p>
      </div>

      <div style="margin-bottom: 20px;">
        <h2 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">Productos</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f5f5f5;">
              <th style="text-align: left; padding: 10px; border-bottom: 1px solid #eee;">Producto</th>
              <th style="text-align: center; padding: 10px; border-bottom: 1px solid #eee;">Cantidad</th>
              <th style="text-align: right; padding: 10px; border-bottom: 1px solid #eee;">Precio</th>
            </tr>
          </thead>
          <tbody>
            ${order.lineItems
              .map(
                (item) => `
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.title}</td>
                <td style="text-align: center; padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
                <td style="text-align: right; padding: 10px; border-bottom: 1px solid #eee;">${formatCurrency(Number(item.price) * item.quantity)}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="text-align: right; padding: 10px;"><strong>Subtotal:</strong></td>
              <td style="text-align: right; padding: 10px;">${formatCurrency(Number(order.subtotalPrice))}</td>
            </tr>
            <tr>
              <td colspan="2" style="text-align: right; padding: 10px;"><strong>Impuestos:</strong></td>
              <td style="text-align: right; padding: 10px;">${formatCurrency(Number(order.totalTax))}</td>
            </tr>
            <tr>
              <td colspan="2" style="text-align: right; padding: 10px;"><strong>Envío:</strong></td>
              <td style="text-align: right; padding: 10px;">${formatCurrency(Number(order.totalPrice) - Number(order.subtotalPrice) - Number(order.totalTax))}</td>
            </tr>
            <tr>
              <td colspan="2" style="text-align: right; padding: 10px; font-weight: bold; font-size: 16px;">Total:</td>
              <td style="text-align: right; padding: 10px; font-weight: bold; font-size: 16px;">${formatCurrency(Number(order.totalPrice))}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div style="background-color: #f9f9f9; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
        <h2 style="color: #333; margin-top: 0; border-bottom: 1px solid #eee; padding-bottom: 10px;">Dirección de Envío</h2>
        <p><strong>Dirección:</strong> ${order.shippingAddress?.address1 || ""}</p>
        ${order.shippingAddress?.address2 ? `<p><strong>Detalles adicionales:</strong> ${order.shippingAddress.address2}</p>` : ""}
        <p><strong>Ciudad:</strong> ${order.shippingAddress?.city || ""}</p>
        <p><strong>Región:</strong> ${order.shippingAddress?.province || ""}</p>
        <p><strong>Código Postal:</strong> ${order.shippingAddress?.zip || ""}</p>
        <p><strong>País:</strong> ${order.shippingAddress?.country || ""}</p>
      </div>

      ${
        order.customerNotes
          ? `
        <div style="background-color: #f9f9f9; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
          <h2 style="color: #333; margin-top: 0; border-bottom: 1px solid #eee; padding-bottom: 10px;">Notas del Cliente</h2>
          <p>${order.customerNotes}</p>
        </div>
      `
          : ""
      }

      <div style="text-align: center; margin-top: 30px;">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/orders/${order.id}" 
           style="display: inline-block; background-color: #e91e63; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
          Ver Detalles del Pedido
        </a>
      </div>
    </div>
  `
}

