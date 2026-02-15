import crypto from "crypto"

const YOCO_API_URL = "https://payments.yoco.com/api/checkouts"

interface CreateCheckoutParams {
  amountInCents: number
  bookingId: string
  customerEmail: string
  customerName: string
  lineItems: Array<{
    displayName: string
    quantity: number
    pricingDetails: {
      price: number
    }
  }>
}

export async function createYocoCheckout({
  amountInCents,
  bookingId,
  customerEmail,
  customerName,
  lineItems,
}: CreateCheckoutParams) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  const response = await fetch(YOCO_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.YOCO_SECRET_KEY}`,
    },
    body: JSON.stringify({
      amount: amountInCents,
      currency: "ZAR",
      successUrl: `${appUrl}/booking-confirmed?id=${bookingId}`,
      cancelUrl: `${appUrl}`,
      failureUrl: `${appUrl}/booking-failed?id=${bookingId}`,
      metadata: {
        bookingId,
        customerEmail,
        customerName,
      },
      lineItems,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Yoco checkout creation failed: ${error}`)
  }

  return response.json()
}

export function verifyYocoWebhook(
  rawBody: string,
  webhookId: string,
  webhookTimestamp: string,
  webhookSignature: string
): boolean {
  const secret = process.env.YOCO_WEBHOOK_SECRET
  if (!secret) {
    console.error("YOCO_WEBHOOK_SECRET not set")
    return false
  }

  // Check timestamp is within 5 minutes to prevent replay attacks
  const timestampSeconds = parseInt(webhookTimestamp, 10)
  const nowSeconds = Math.floor(Date.now() / 1000)
  if (Math.abs(nowSeconds - timestampSeconds) > 300) {
    console.error("Webhook timestamp too old or too far in the future")
    return false
  }

  // Compute signature: HMAC-SHA256 of "webhookId.webhookTimestamp.rawBody"
  const signedContent = `${webhookId}.${webhookTimestamp}.${rawBody}`

  // The secret from Yoco is base64-encoded after the "whsec_" prefix
  const secretBytes = Buffer.from(secret.replace("whsec_", ""), "base64")
  const computedSignature = crypto
    .createHmac("sha256", secretBytes)
    .update(signedContent)
    .digest("base64")

  // Yoco may send multiple signatures separated by spaces
  const expectedSignatures = webhookSignature.split(" ")
  for (const sig of expectedSignatures) {
    const sigValue = sig.split(",")[1] // format: "v1,base64signature"
    if (sigValue === computedSignature) {
      return true
    }
  }

  return false
}
