import { sql } from "@/lib/db"
import { formatZAR } from "@/lib/pricing"
import { generateWhatsAppLink, generateCustomerWhatsAppMessage } from "@/lib/whatsapp"
import { BookingConfirmedClient } from "@/components/booking/booking-confirmed-client"

interface Props {
  searchParams: Promise<{ id?: string }>
}

export default async function BookingConfirmedPage({ searchParams }: Props) {
  const params = await searchParams
  const bookingId = params.id

  if (!bookingId) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-background px-5">
        <div className="text-center">
          <p className="text-muted-foreground">Booking not found.</p>
        </div>
      </main>
    )
  }

  const result = await sql`SELECT * FROM bookings WHERE id = ${bookingId} LIMIT 1`
  const booking = result[0]

  if (!booking) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-background px-5">
        <div className="text-center">
          <p className="text-muted-foreground">Booking not found.</p>
        </div>
      </main>
    )
  }

  const ref = booking.id.slice(0, 8).toUpperCase()
  const whatsappLink = generateWhatsAppLink(
    process.env.ADMIN_WHATSAPP_NUMBER || "27000000000",
    generateCustomerWhatsAppMessage(ref)
  )

  return (
    <BookingConfirmedClient
      ref_={ref}
      customerName={booking.customer_name}
      pickupAddress={booking.pickup_address}
      destinationAddress={booking.destination_address}
      pickupDate={booking.pickup_date}
      vehicleType={booking.vehicle_type}
      passengers={booking.passengers}
      bags={booking.bags}
      flightNumber={booking.flight_number}
      totalAmount={formatZAR(booking.total_amount)}
      extras={booking.extras || []}
      whatsappLink={whatsappLink}
    />
  )
}
