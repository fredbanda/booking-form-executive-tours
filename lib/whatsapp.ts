/**
 * Generate a wa.me link for WhatsApp messaging.
 * @param phone - Phone number in international format (e.g., "27787295836")
 * @param message - Pre-filled message text
 */
export function generateWhatsAppLink(phone: string, message: string): string {
  // Strip all non-digit chars
  const cleanPhone = phone.replace(/\D/g, "");
  // If starts with 0, replace with 27 (South Africa)
  const internationalPhone = cleanPhone.startsWith("0")
    ? `27${cleanPhone.slice(1)}`
    : cleanPhone;
  return `https://wa.me/${internationalPhone}?text=${encodeURIComponent(
    message
  )}`;
}

export function generateCustomerWhatsAppMessage(bookingRef: string): string {
  return `Hi Executive Tours! I've just booked a transfer (Ref: ${bookingRef}). Please confirm my booking details.`;
}

export function generateAdminWhatsAppMessage(
  customerName: string,
  customerPhone: string,
  bookingRef: string
): string {
  return `Hi ${customerName}, this is Executive Tours. We've received your booking (Ref: ${bookingRef}). A driver will contact you shortly.`;
}

