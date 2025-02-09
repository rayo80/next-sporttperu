export interface Order {
    customerId: string; // ID del cliente, ej: "cu_04a71a2a-dbbc"
    email: string; // Email del cliente
    phone: string; // Teléfono del cliente
    currencyId: string; // ID de la moneda, ej: "curr_111b1883-19fe"
    totalPrice: number; // Precio total del pedido
    subtotalPrice: number; // Precio subtotal antes de impuestos y descuentos
    totalTax: number; // Total de impuestos aplicados
    totalDiscounts: number; // Total de descuentos aplicados
    lineItems: OrderItem[]; // Lista de productos en el pedido
    shippingAddressId?: string; // ID de la dirección de envío
    billingAddressId?: string; // ID de la dirección de facturación
    couponId?: string; // ID del cupón aplicado (opcional)
    paymentProviderId: string; // ID del proveedor de pago
    shippingMethodId: string; // ID del método de envío
    financialStatus: "PENDING" | "PAID" | "FAILED"; // Estado financiero
    fulfillmentStatus: "UNFULFILLED" | "FULFILLED" | "CANCELLED"; // Estado de cumplimiento
    shippingStatus: "PENDING" | "SHIPPED" | "DELIVERED"; // Estado del envío
    customerNotes?: string; // Notas del cliente (opcional)
    internalNotes?: string; // Notas internas del sistema (opcional)
    source: string; // Origen del pedido, ej: "admin", "web", etc.
    preferredDeliveryDate?: string; // Fecha preferida de entrega (ISO string, opcional)
  };
  
  export interface OrderItem  {
    productId: string; // ID del producto
    variantId: string; // ID de la variante del producto
    quantity: number; // Cantidad solicitada
    title: string; // Nombre del producto
    price: number; // Precio por unidad
    totalDiscount: number; // Descuento total aplicado al producto
  };

  export interface CreateOrderDto extends Omit<Order, "financialStatus" | "fulfillmentStatus" | "shippingStatus"> {
    // Omit status fields as they will be set by the backend
  }
  
  export interface OrderAddress {
    id: string
    firstName: string
    lastName: string
    address1: string
    address2?: string
    city: string
    state: string
    postalCode: string
    country: string
    phone: string
  }
  
  export interface OrderError {
    code: string
    message: string
    field?: string
  }