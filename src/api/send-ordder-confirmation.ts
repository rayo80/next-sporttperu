"use client"

import { useEmail } from "@/contexts/email.context"
import type { Order } from "@/types/order"

export async function sendOrderConfirmationEmail(order: Order, email: string) {
  const { sendEmail } = useEmail()

  // Format currency
  const formatCurrency = (amount: number, symbol: string) => {
    return `${symbol} ${amount.toFixed(2)}`
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Generate line items HTML
  const lineItemsHtml = order.lineItems
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eaeaea;">
        <div style="font-weight: 500;">${item.title}</div>
        <div style="color: #666; font-size: 14px;">Cantidad: ${item.quantity}</div>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #eaeaea; text-align: right;">
        ${order.currency?.symbol} ${(Number(item.price) * item.quantity).toFixed(2)}
      </td>
    </tr>
  `,
    )
    .join("")

  // Generate shipping address HTML
  const shippingAddressHtml = order.shippingAddress
    ? `
    <p style="margin: 0; line-height: 1.5;">
      ${order.customer?.firstName} ${order.customer?.lastName}<br>
      ${order.shippingAddress.address1}
      ${order.shippingAddress.address2 ? `<br>${order.shippingAddress.address2}` : ""}
      <br>${order.shippingAddress.city}, ${order.shippingAddress.province} ${order.shippingAddress.zip}
      <br>${order.shippingAddress.country}
    </p>
  `
    : "<p>No se proporcionó dirección de envío</p>"

  const confirmationHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #333; margin-bottom: 10px;">¡Gracias por tu compra!</h1>
        <p style="color: #666; font-size: 16px;">
          Hemos recibido tu pedido y está siendo procesado.
        </p>
      </div>

      <div style="background-color: #f9f9f9; border-radius: 4px; padding: 15px; margin-bottom: 20px;">
        <h2 style="color: #333; margin-top: 0; font-size: 18px;">Detalles del pedido</h2>
        <p style="margin: 5px 0; color: #666;">
          <strong>Número de pedido:</strong> ${order.orderNumber || order.id}
        </p>
        <p style="margin: 5px 0; color: #666;">
          <strong>Fecha:</strong> ${formatDate(order.createdAt)}
        </p>
        <p style="margin: 5px 0; color: #666;">
          <strong>Estado del pago:</strong> ${order.paymentStatus}
        </p>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="color: #333; font-size: 18px;">Resumen de productos</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f3f4f6;">
              <th style="padding: 12px; text-align: left; border-bottom: 1px solid #eaeaea;">Producto</th>
              <th style="padding: 12px; text-align: right; border-bottom: 1px solid #eaeaea;">Precio</th>
            </tr>
          </thead>
          <tbody>
            ${lineItemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td style="padding: 12px; text-align: right; font-weight: 500;">Subtotal:</td>
              <td style="padding: 12px; text-align: right;">${order.currency?.symbol} ${Number(order.subtotalPrice).toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding: 12px; text-align: right; font-weight: 500;">Impuestos:</td>
              <td style="padding: 12px; text-align: right;">${order.currency?.symbol} ${Number(order.totalTax).toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding: 12px; text-align: right; font-weight: 500;">Envío:</td>
              <td style="padding: 12px; text-align: right;">${order.currency?.symbol} ${(Number(order.totalPrice) - Number(order.subtotalPrice) - Number(order.totalTax)).toFixed(2)}</td>
            </tr>
            <tr style="font-weight: bold; font-size: 16px;">
              <td style="padding: 12px; text-align: right; border-top: 2px solid #eaeaea;">Total:</td>
              <td style="padding: 12px; text-align: right; border-top: 2px solid #eaeaea;">${order.currency?.symbol} ${Number(order.totalPrice).toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="color: #333; font-size: 18px;">Información de envío</h2>
        ${shippingAddressHtml}
        ${
          order.shippingMethod
            ? `
          <p style="margin: 10px 0 0; color: #666;">
            <strong>Método de envío:</strong> ${order.shippingMethod.name}
          </p>
          <p style="margin: 5px 0; color: #666;">
            <strong>Tiempo estimado de entrega:</strong> ${order.shippingMethod.estimatedDeliveryTime || "No especificado"}
          </p>
        `
            : ""
        }
      </div>

      ${
        order.customerNotes
          ? `
        <div style="margin-bottom: 30px;">
          <h2 style="color: #333; font-size: 18px;">Notas del pedido</h2>
          <p style="color: #666; background-color: #f9f9f9; padding: 10px; border-radius: 4px;">${order.customerNotes}</p>
        </div>
      `
          : ""
      }

      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eaeaea;">
        <p style="color: #666; margin-bottom: 20px;">
          Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos.
        </p>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}" style="display: inline-block; background-color: #f06; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">
          Ver mi pedido
        </a>
      </div>
    </div>
  `

  try {
    const result = await sendEmail({
      to: email,
      subject: `Confirmación de pedido #${order.orderNumber || order.id}`,
      html: confirmationHtml,
    })

    return result.success
  } catch (error) {
    console.error("Error sending order confirmation email:", error)
    return false
  }
}

