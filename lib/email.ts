import { formatZAR } from "./pricing";

interface BookingEmailData {
  bookingId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  pickupAddress: string;
  destinationAddress: string;
  pickupDate: string;
  vehicleType: string;
  totalAmount: number;
  extras: Array<{ name: string; price: number }>;
  flightNumber?: string | null;
  passengers: number;
  bags: number;
}

export async function sendConfirmationEmail(data: BookingEmailData) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set, skipping confirmation email");
    return;
  }

  const extrasText =
    data.extras.length > 0
      ? data.extras.map((e) => `- ${e.name}: ${formatZAR(e.price)}`).join("\n")
      : "None";

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: "Executive Tours <bookings@Executivetours.co.za>",
      to: [data.customerEmail],
      subject: `Booking Confirmed - ${data.bookingId
        .slice(0, 8)
        .toUpperCase()}`,
      html: `
        <h2>Your booking is confirmed!</h2>
        <p>Thank you, ${data.customerName}. Here are your booking details:</p>
        <table style="border-collapse:collapse;width:100%;">
          <tr><td style="padding:8px;font-weight:bold;">Ref</td><td style="padding:8px;">${data.bookingId
            .slice(0, 8)
            .toUpperCase()}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Pickup</td><td style="padding:8px;">${
            data.pickupAddress
          }</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Destination</td><td style="padding:8px;">${
            data.destinationAddress
          }</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Date/Time</td><td style="padding:8px;">${
            data.pickupDate
          }</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Vehicle</td><td style="padding:8px;">${
            data.vehicleType
          }</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Passengers</td><td style="padding:8px;">${
            data.passengers
          }</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Bags</td><td style="padding:8px;">${
            data.bags
          }</td></tr>
          ${
            data.flightNumber
              ? `<tr><td style="padding:8px;font-weight:bold;">Flight</td><td style="padding:8px;">${data.flightNumber}</td></tr>`
              : ""
          }
          <tr><td style="padding:8px;font-weight:bold;">Extras</td><td style="padding:8px;">${extrasText}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Total</td><td style="padding:8px;font-size:18px;font-weight:bold;">${formatZAR(
            data.totalAmount
          )}</td></tr>
        </table>
        <p style="margin-top:24px;">A driver will be in contact with you before your pickup. If you have any questions, reply to this email or contact us on WhatsApp.</p>
        <p>Transport provided by <strong>Executive Tours</strong></p>
      `,
    }),
  });
}

export async function sendAdminNotificationEmail(data: BookingEmailData) {
  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (!apiKey || !adminEmail) {
    console.warn(
      "RESEND_API_KEY or ADMIN_NOTIFICATION_EMAIL not set, skipping admin email"
    );
    return;
  }

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: "Executive Tours Bookings <bookings@Executivetours.co.za>",
      to: [adminEmail],
      subject: `New Booking - ${data.customerName} - ${formatZAR(
        data.totalAmount
      )}`,
      html: `
        <h2>New Booking Received</h2>
        <table style="border-collapse:collapse;width:100%;">
          <tr><td style="padding:8px;font-weight:bold;">Ref</td><td style="padding:8px;">${data.bookingId
            .slice(0, 8)
            .toUpperCase()}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Customer</td><td style="padding:8px;">${
            data.customerName
          }</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Phone</td><td style="padding:8px;">${
            data.customerPhone
          }</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Email</td><td style="padding:8px;">${
            data.customerEmail
          }</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Pickup</td><td style="padding:8px;">${
            data.pickupAddress
          }</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Destination</td><td style="padding:8px;">${
            data.destinationAddress
          }</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Date/Time</td><td style="padding:8px;">${
            data.pickupDate
          }</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Vehicle</td><td style="padding:8px;">${
            data.vehicleType
          }</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Passengers</td><td style="padding:8px;">${
            data.passengers
          }</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Bags</td><td style="padding:8px;">${
            data.bags
          }</td></tr>
          ${
            data.flightNumber
              ? `<tr><td style="padding:8px;font-weight:bold;">Flight</td><td style="padding:8px;">${data.flightNumber}</td></tr>`
              : ""
          }
          <tr><td style="padding:8px;font-weight:bold;">Total</td><td style="padding:8px;font-size:18px;font-weight:bold;">${formatZAR(
            data.totalAmount
          )}</td></tr>
        </table>
      `,
    }),
  });
}

