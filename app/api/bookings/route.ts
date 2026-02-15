import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { createYocoCheckout } from "@/lib/yoco"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const {
      serviceType,
      pickupAddress,
      pickupLat,
      pickupLng,
      destinationAddress,
      destinationLat,
      destinationLng,
      stopAddress,
      pickupDate,
      passengers,
      bags,
      flightNumber,
      meetOnArrival,
      vehicleType,
      vehiclePrice,
      extras,
      specialRequests,
      customerName,
      customerPhone,
      customerAltPhone,
      customerEmail,
      promoCode,
      subtotal,
      vatAmount,
      totalAmount,
    } = body

    // Basic server-side validation
    if (!serviceType || !pickupAddress || !destinationAddress || !customerName || !customerEmail || !vehicleType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Insert booking into DB
    const result = await sql`
      INSERT INTO bookings (
        service_type, pickup_address, pickup_lat, pickup_lng,
        destination_address, destination_lat, destination_lng,
        stop_address, pickup_date, passengers, bags,
        flight_number, meet_on_arrival, vehicle_type, vehicle_price,
        extras, special_requests, customer_name, customer_phone,
        customer_alt_phone, customer_email, subtotal, vat_amount,
        total_amount, promo_code, payment_status
      ) VALUES (
        ${serviceType}, ${pickupAddress}, ${pickupLat || null}, ${pickupLng || null},
        ${destinationAddress}, ${destinationLat || null}, ${destinationLng || null},
        ${stopAddress || null}, ${pickupDate}, ${passengers}, ${bags},
        ${flightNumber || null}, ${meetOnArrival || false}, ${vehicleType}, ${vehiclePrice},
        ${JSON.stringify(extras || [])}, ${specialRequests || null}, ${customerName}, ${customerPhone},
        ${customerAltPhone || null}, ${customerEmail}, ${subtotal}, ${vatAmount},
        ${totalAmount}, ${promoCode || null}, 'pending'
      )
      RETURNING id
    `

    const bookingId = result[0].id

    // Build line items for Yoco
    const lineItems = [
      {
        displayName: vehicleType,
        quantity: 1,
        pricingDetails: { price: vehiclePrice },
      },
    ]

    if (extras && extras.length > 0) {
      for (const extra of extras) {
        if (extra.price > 0) {
          lineItems.push({
            displayName: extra.name,
            quantity: 1,
            pricingDetails: { price: extra.price },
          })
        }
      }
    }

    // Create Yoco checkout
    const checkout = await createYocoCheckout({
      amountInCents: totalAmount,
      bookingId,
      customerEmail,
      customerName,
      lineItems,
    })

    // Update booking with Yoco checkout ID
    await sql`
      UPDATE bookings
      SET yoco_checkout_id = ${checkout.id}, updated_at = NOW()
      WHERE id = ${bookingId}
    `

    return NextResponse.json({
      bookingId,
      checkoutUrl: checkout.redirectUrl,
    })
  } catch (error) {
    console.error("Booking creation error:", error)
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    )
  }
}
