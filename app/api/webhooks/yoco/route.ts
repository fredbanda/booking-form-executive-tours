import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { verifyYocoWebhook } from "@/lib/yoco"
import { sendConfirmationEmail, sendAdminNotificationEmail } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const rawBody = await request.text()

    // Get signature headers
    const webhookId = request.headers.get("webhook-id") || ""
    const webhookTimestamp = request.headers.get("webhook-timestamp") || ""
    const webhookSignature = request.headers.get("webhook-signature") || ""

    // Verify the webhook signature
    const isValid = verifyYocoWebhook(rawBody, webhookId, webhookTimestamp, webhookSignature)
    if (!isValid) {
      console.error("Invalid Yoco webhook signature")
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    const event = JSON.parse(rawBody)

    if (event.type === "payment.succeeded") {
      const checkoutId = event.payload?.metadata?.checkoutId || event.payload?.checkoutId
      const paymentId = event.payload?.paymentId || event.id

      if (!checkoutId) {
        console.error("No checkoutId in webhook payload")
        return NextResponse.json({ error: "Missing checkoutId" }, { status: 400 })
      }

      // Update booking payment status
      const result = await sql`
        UPDATE bookings
        SET payment_status = 'paid', yoco_payment_id = ${paymentId}, updated_at = NOW()
        WHERE yoco_checkout_id = ${checkoutId}
        RETURNING *
      `

      if (result.length > 0) {
        const booking = result[0]

        // Send confirmation emails (fire and forget)
        const emailData = {
          bookingId: booking.id,
          customerName: booking.customer_name,
          customerEmail: booking.customer_email,
          customerPhone: booking.customer_phone,
          pickupAddress: booking.pickup_address,
          destinationAddress: booking.destination_address,
          pickupDate: booking.pickup_date,
          vehicleType: booking.vehicle_type,
          totalAmount: booking.total_amount,
          extras: booking.extras || [],
          flightNumber: booking.flight_number,
          passengers: booking.passengers,
          bags: booking.bags,
        }

        sendConfirmationEmail(emailData).catch(console.error)
        sendAdminNotificationEmail(emailData).catch(console.error)
      }
    } else if (event.type === "payment.failed") {
      const checkoutId = event.payload?.metadata?.checkoutId || event.payload?.checkoutId

      if (checkoutId) {
        await sql`
          UPDATE bookings
          SET payment_status = 'failed', updated_at = NOW()
          WHERE yoco_checkout_id = ${checkoutId}
        `
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook processing error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
