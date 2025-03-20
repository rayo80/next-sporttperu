import MercadoPagoConfig, { Preference } from "mercadopago";
import { NextResponse } from "next/server"


// Initialize MercadoPago with your access token
const NEXT_PUBLIC_HOST = process.env.NEXT_PUBLIC_HOST || 'http://localhost:3000'

const mercadopago = new MercadoPagoConfig({accessToken: process.env.MP_ACCESS_TOKEN!});

export async function POST(request: Request) {
  try {
    const { items, checkoutFormData: formData, orderId } = await request.json()
    console.log('items', items,)
    console.log('formData', formData)
    console.log('adresses', orderId)
    // Create the MercadoPago preference
    const preference = await new Preference(mercadopago).create({
      body: {
        items,
        payer: {
          name: formData.firstName,
          surname: formData.lastName,
          email: formData.email,
          phone: {
            area_code: "",
            number: formData.phone,
          },
          address: {
            street_name: formData.customer.addresses[0].address1,
            street_number: "",
            zip_code: formData.customer.addresses[0].zip,
          },
        },
        back_urls: {
          success: `${NEXT_PUBLIC_HOST}/checkout/success`,
          failure: `${NEXT_PUBLIC_HOST}/checkout/failure`,
          pending: `${NEXT_PUBLIC_HOST}/checkout/pending`,
        },
        auto_return: "approved",
        external_reference: orderId,
      },
    })

    return NextResponse.json({ init_point: preference.init_point })
  } catch (error) {
    console.error("Error creating MercadoPago preference:", error)
    return NextResponse.json({ error: "Failed to create MercadoPago preference" }, { status: 500 })
  }
}
