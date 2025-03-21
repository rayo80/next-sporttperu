import { CheckoutFormData } from '@/types/checkout';

import axios from "axios"


export const mercadopagoService = {
    createPreference: async (items: any[], checkoutFormData: any, orderId: string): Promise<string> => {
      console.log('aqui en service', items, checkoutFormData)
        try {
        const response = await axios.post(`/api/mp-preference`, {
          items,
          checkoutFormData,
          orderId,
          // back_urls: {
          //   success: `${NEXT_PUBLIC_HOST}/checkout/success`,
          //   failure: `${NEXT_PUBLIC_HOST}/checkout/failure`,
          //   pending: `${NEXT_PUBLIC_HOST}/checkout/pending`,
          // },
        })
        console.log('response', response)
        return response.data.init_point
      } catch (error) {
        console.error("Error creating MercadoPago preference:", error)
        throw new Error("Failed to create MercadoPago preference")
      }
    },
  
    getPaymentStatus: async (paymentId: string): Promise<string> => {
      try {
        const response = await axios.get(`/api/mp-payment-status/${paymentId}`)
        return response.data.status
      } catch (error) {
        console.error("Error fetching payment status:", error)
        throw new Error("Failed to fetch payment status")
      }
    },
  }
  



// import MercadoPagoConfig, { Payment, Preference } from "mercadopago";


// // Initialize MercadoPago with your access token
// export const mercadopago = new MercadoPagoConfig({accessToken: process.env.NEXT_PUBLIC_MP_ACCESS_TOKEN!});


// interface MercadoPagoItem {
//   id: string
//   title: string
//   unit_price: number
//   quantity: number
// }

// export const mercadopagoService = {
//   createPreference: async (items: MercadoPagoItem[], orderId: string): Promise<string> => {
//     try {
//       const preference = await new Preference(mercadopago).create({
//         body: {
//           items,
//           metadata: {
//             order_id: orderId,
//           },
//           back_urls: {
//             success: `${process.env.NEXT_PUBLIC_API}/order-confirmation/${orderId}`,
//             failure: `${process.env.NEXT_PUBLIC_API}/checkout`,
//             pending: `${process.env.NEXT_PUBLIC_API}/order-pending/${orderId}`,
//           },
//           auto_return: "approved",
//         },
//       })

//       return preference.init_point!
//     } catch (error) {
//       console.error("Error creating MercadoPago preference:", error)
//       throw new Error("Failed to create MercadoPago preference")
//     }
//   },

//   getPaymentStatus: async (paymentId: string): Promise<string | undefined> => {
//     try {
//       const payment = await new Payment(mercadopago).get({id: paymentId})
//       return payment.status
//     } catch (error) {
//       console.error("Error fetching payment status:", error)
//       throw new Error("Failed to fetch payment status")
//     }
//   },
// }


// import {readFileSync, writeFileSync} from "node:fs";

// import {MercadoPagoConfig, Preference} from "mercadopago";

// interface Message {
//   id: number;
//   text: string;
// }

// export const mercadopago = new MercadoPagoConfig({accessToken: process.env.MP_ACCESS_TOKEN!});

// const api = {
//   message: {
//     async list(): Promise<Message[]> {
//       // Leemos el archivo de la base de datos de los mensajes
//       const db = readFileSync("db/message.db");

//       // Devolvemos los datos como un array de objetos
//       return JSON.parse(db.toString());
//     },
//     async add(message: Message): Promise<void> {
//       // Obtenemos los mensajes
//       const db = await api.message.list();

//       // Si ya existe un mensaje con ese id, lanzamos un error
//       if (db.some((_message) => _message.id === message.id)) {
//         throw new Error("Message already added");
//       }

//       // Agregamos el nuevo mensaje
//       const draft = db.concat(message);

//       // Guardamos los datos
//       writeFileSync("db/message.db", JSON.stringify(draft, null, 2));
//     },
//     async submit(text: Message["text"]) {
//       // Creamos la preferencia incluyendo el precio, titulo y metadata. La información de `items` es standard de Mercado Pago. La información que nosotros necesitamos para nuestra DB debería vivir en `metadata`.
//       const preference = await new Preference(mercadopago).create({
//         body: {
//           items: [
//             {
//               id: "message",
//               unit_price: 100,
//               quantity: 1,
//               title: "Mensaje de muro",
//             },
//           ],
//           metadata: {
//             text,
//           },
//         },
//       });

//       // Devolvemos el init point (url de pago) para que el usuario pueda pagar
//       return preference.init_point!;
//     },
//   },
// };

// export default api;

// import { db } from "@/lib/db";
// import { currentUser } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";
// import MercadoPago, { Payment }from "mercadopago"
 
// const client = new MercadoPago({accessToken: process.env['MP_ACCESS_TOKEN']!, options: { timeout: 5000 }})

// export async function POST(request: Request) {
//   try {
//     const body = await request.json().then(data => data as {data : {id:string}})
//     console.log({id: body.data.id}) 
//     const payment = await new Payment(client).get({id: body.data.id})
    
//     const courseId = payment.metadata.course_id;
//     const userId = payment.metadata.user_id;
//     const paymentStatus = payment.status;
//     const isApproved = paymentStatus === 'approved';

//     console.log("Course ID:", courseId);
//     console.log("User ID:", userId);
//     console.log("Payment Approved:", isApproved);

//     if (isApproved) {

//       const course = await db.course.findUnique({
//         where: {
//           id: courseId,
//           isPublished: true, // Verificar que el curso esté publicado
//         },
//       });
  
//       if (!course) {
//         return new NextResponse("Course not found", { status: 404 });
//       }
  
//       // Verificar si el usuario ya compró el curso
//       const purchase = await db.purchase.findUnique({
//         where: {
//           userId_courseId: {
//             userId: userId,
//             courseId: courseId,
//           },
//         },
//       });
  
//       if (purchase) {
//         return new NextResponse("Course already purchased", { status: 400 });
//       }
  
//       // Buscar si ya existe un cliente de Stripe asociado al usuario
//       let stripeCustomer = await db.stripeCustomer.findUnique({
//         where: {
//           userId: userId,
//         },
//         select: {
//           stripeCustomerId: true,
//         },
//       });
  
//       // Si no existe, crear un nuevo cliente de Stripe
//       if (!stripeCustomer) {
//         const newStripeCustomerId = "XDD"; // Generar un UUID único
  
//         stripeCustomer = await db.stripeCustomer.create({
//           data: {
//             userId: userId,
//             stripeCustomerId: newStripeCustomerId, // Usar el nuevo UUID como StripeCustomerId
//           },
//         });
//       }
  
//       // Registrar la compra en la base de datos
//       await db.purchase.create({
//         data: {
//           courseId: courseId,
//           userId: userId,
//         },
//       });

//       return new NextResponse("Course purchased successfully", { status: 200 });
//     }

    
 
    
//     return new NextResponse("Payment Denied", {status : 200});
//   } catch (error) {
//     console.error("Error parsing request body:", error);
    
//     return new NextResponse("Unauthorized", {status : 401});
//   }
// }