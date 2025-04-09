// utils/email-utils.ts
 
import { CheckoutFormData } from "@/types/checkout";
import type { EmailSendParams, EmailFormData, EmailResponse } from "@/types/email";
import { Order } from "@/types/order";
import { PaymentProvider } from "@/types/payment-provider";
import { Currency } from "@/types/product";

// Define the types needed for order processing
 
// Function to generate modern, elegant email template with black and pink accents
export const generateOrderConfirmationEmailHTML = (
  formData: CheckoutFormData,
  order: Order,
  currency: Currency
): string => {
  // Calculate total price
  const totalPrice = formData.cartItems!.reduce(
    (sum, item) => sum + (item.price * item.quantity),
    0
  ).toFixed(2);

  // Generate items HTML
  const itemsHTML = formData.cartItems!.map(item => `
    <tr>
      <td style="padding: 16px 8px; border-bottom: 1px solid #f0f0f0;">${item.title}</td>
      <td style="padding: 16px 8px; border-bottom: 1px solid #f0f0f0; text-align: center;">${item.quantity}</td>
      <td style="padding: 16px 8px; border-bottom: 1px solid #f0f0f0; text-align: right;">${currency.symbol}${item.price.toFixed(2)}</td>
      <td style="padding: 16px 8px; border-bottom: 1px solid #f0f0f0; text-align: right;">${currency.symbol}${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('');

  // Create email HTML with black and pink accents
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmación de Pedido</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; line-height: 1.6;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header with logo area -->
        <div style="background-color: #000000; padding: 30px 0; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-weight: 300; letter-spacing: 2px; font-size: 28px;">CONFIRMACIÓN DE PEDIDO</h1>
          <div style="width: 50px; height: 3px; background-color: #ff69b4; margin: 15px auto;"></div>
        </div>
        
        <!-- Main content -->
        <div style="padding: 40px 30px; background-color: #ffffff;">
          <p style="margin-bottom: 25px; font-size: 16px;">Hola <strong>${formData.customer.firstName}</strong>,</p>
          
          <p style="margin-bottom: 25px; font-size: 16px;">¡Gracias por tu compra! Hemos recibido tu pedido correctamente. A continuación encontrarás un resumen:</p>
          
          <div style="background-color: #f9f9f9; border-left: 4px solid #ff69b4; padding: 15px; margin-bottom: 30px;">
            <h2 style="margin: 0 0 10px; color: #000000; font-size: 18px;">Pedido #${order.id}</h2>
            <p style="margin: 0; color: #666666; font-size: 14px;">Fecha: ${new Date().toLocaleDateString()}</p>
          </div>
          
          <!-- Order summary -->
          <h3 style="color: #000000; font-size: 18px; margin-bottom: 15px; border-bottom: 1px solid #eaeaea; padding-bottom: 10px;">Detalle de productos</h3>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
            <thead>
              <tr>
                <th style="text-align: left; padding: 12px 8px; border-bottom: 2px solid #ff69b4; font-size: 14px; color: #000000;">Producto</th>
                <th style="text-align: center; padding: 12px 8px; border-bottom: 2px solid #ff69b4; font-size: 14px; color: #000000;">Cantidad</th>
                <th style="text-align: right; padding: 12px 8px; border-bottom: 2px solid #ff69b4; font-size: 14px; color: #000000;">Precio</th>
                <th style="text-align: right; padding: 12px 8px; border-bottom: 2px solid #ff69b4; font-size: 14px; color: #000000;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="padding: 20px 8px 8px; text-align: right; font-weight: bold;">Total:</td>
                <td style="padding: 20px 8px 8px; text-align: right; font-weight: bold; color: #ff69b4;">${currency.symbol}${totalPrice}</td>
              </tr>
            </tfoot>
          </table>
          
          <!-- Shipping information -->
          <h3 style="color: #000000; font-size: 18px; margin-bottom: 15px; border-bottom: 1px solid #eaeaea; padding-bottom: 10px;">Información de entrega</h3>
          
          <div style="background-color: #f9f9f9; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
            <p style="margin: 0 0 5px; font-size: 15px;">
              <strong>${formData.customer.firstName} ${formData.customer.lastName}</strong>
            </p>
            <p style="margin: 0 0 5px; font-size: 15px; color: #666666;">
              ${formData.customer.addresses[0].address1}<br>
              ${formData.customer.addresses[0].city}, ${formData.customer.addresses[0].address1} ${formData.customer.addresses[0].zip}<br>
              ${formData.customer.addresses[0].country}
            </p>
          </div>
          
          <p style="margin-bottom: 25px; font-size: 16px;">Te mantendremos informado sobre el estado de tu pedido. Si tienes alguna pregunta, no dudes en contactarnos.</p>
          
          <div style="text-align: center; margin-top: 40px;">
            <p style="margin-bottom: 5px; font-size: 16px;">¡Gracias por tu compra!</p>
            <div style="width: 30px; height: 2px; background-color: #ff69b4; margin: 15px auto;"></div>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #000000; color: #ffffff; text-align: center; padding: 25px; font-size: 14px;">
          <p style="margin: 0 0 10px;">© ${new Date().getFullYear()} Tu Tienda. Todos los derechos reservados.</p>
          <p style="margin: 0; font-size: 13px; color: #999999;">Este correo fue enviado a ${formData.customer.email}</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Function to send order confirmation email to the customer (only for registered users)
export const sendCustomerConfirmationEmail = async (
  formData: CheckoutFormData, 
  order: Order, 
  sendEmail: (params: EmailSendParams) => Promise<EmailResponse>,
  currency: Currency
): Promise<void> => {
  try {
    const customerEmail = formData.customer.email;
    
    // Generate email HTML using the dedicated function
    const emailHTML = generateOrderConfirmationEmailHTML(formData, order, currency);

    // Send the email
    await sendEmail({
      to: customerEmail!,
      subject: `Confirmación de Pedido #${order.id}`,
      html: emailHTML
    });

    console.log("Confirmation email sent to customer");
  } catch (error) {
    console.error("Error sending confirmation email to customer:", error);
  }
};

// Interface for item summary in owner notification
interface ItemSummary {
  title: string;
  quantity: number;
  price: number;
  subtotal: number;
}

// Function to send notification email to the store owner (always sent)
export const sendOwnerNotificationEmail = async (
  formData: CheckoutFormData, 
  order: Order, 
  submitForm: (formData: EmailFormData) => Promise<EmailResponse>,
  currency: Currency,
  paymentMethod: PaymentProvider,
  isCustomerRegistered: boolean
): Promise<void> => {
  try {
    // Calculate total price
    const totalPrice = formData.cartItems!.reduce(
      (sum, item) => sum + (item.price * item.quantity), 
      0
    ).toFixed(2);
    
    // Generate items summary
    const itemsSummary: ItemSummary[] = formData.cartItems!.map(item => ({
      title: item.title,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.price * item.quantity
    }));
    
    // Prepare order data for the store owner
    const orderData: EmailFormData = {
      orderId: order.id,
      orderDate: new Date().toISOString(),
      customerInfo: {
        name: `${formData.customer.firstName} ${formData.customer.lastName}`,
        email: formData.customer.email,
        phone: formData.customer.phone || "No proporcionado",
        isRegistered: isCustomerRegistered
      },
      shippingAddress: formData.customer.addresses[0],
      items: itemsSummary,
      total: totalPrice,
      currency: currency.code,
      paymentMethod: paymentMethod?.name || "No especificado",
      paymentStatus: formData.orderDetails.paymentStatus
    };
    
    // Submit the form with order data
    await submitForm(orderData);
    
    console.log("Order notification sent to store owner");
  } catch (error) {
    console.error("Error sending notification to store owner:", error);
  }
};