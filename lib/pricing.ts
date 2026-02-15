export interface Vehicle {
  id: string
  name: string
  price: number // in ZAR cents
  image?: string
}

export interface Extra {
  id: string
  name: string
  price: number // in ZAR cents (0 = free)
}

export const VEHICLES: Vehicle[] = [
  { id: "toyota-corolla", name: "Toyota Corolla", price: 51000 },
  { id: "7-seater", name: "7-Seater", price: 94000 },
  { id: "quantum-9", name: "Toyota Quantum \u00b7 9 Pax", price: 104000 },
  { id: "luxury-sedan", name: "Luxury Sedan", price: 115000 },
  { id: "luxury-suv", name: "Luxury SUV", price: 115000 },
  { id: "luxury-7-seater", name: "Luxury 7-Seater", price: 119000 },
  { id: "quantum-13", name: "Toyota Quantum \u00b7 13 Pax", price: 142000 },
  { id: "mercedes-sprinter", name: "Mercedes Sprinter", price: 211000 },
]

export const EXTRAS: Extra[] = [
  { id: "trailer", name: "Trailer", price: 40000 },
  { id: "baby-seat", name: "Baby Seat", price: 0 },
  { id: "bottled-water", name: "Bottled water", price: 1500 },
]

export const VAT_RATE = 0.15
export const INTERNATIONAL_FLIGHT_SURCHARGE = 10000 // 100 ZAR in cents

export function isInternationalFlight(flightNumber: string | null | undefined): boolean {
  if (!flightNumber) return false
  const trimmed = flightNumber.trim().toUpperCase()
  // Domestic South African airline prefixes
  const domesticPrefixes = ["SA", "FA", "MN", "4Z", "CE"]
  // If it starts with a known domestic prefix, it's not international
  for (const prefix of domesticPrefixes) {
    if (trimmed.startsWith(prefix)) return false
  }
  // If it has a flight number format (letters + numbers), assume international
  return /^[A-Z]{2}\d+/.test(trimmed)
}

export function formatZAR(cents: number): string {
  return `ZAR ${(cents / 100).toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function calculatePricing(
  vehiclePrice: number,
  selectedExtras: Extra[],
  flightNumber?: string | null
) {
  let subtotal = vehiclePrice

  for (const extra of selectedExtras) {
    subtotal += extra.price
  }

  if (isInternationalFlight(flightNumber)) {
    subtotal += INTERNATIONAL_FLIGHT_SURCHARGE
  }

  // VAT is 0 for now as shown in the screenshot, but we keep the calculation ready
  const vatAmount = 0
  const total = subtotal + vatAmount

  return {
    subtotal,
    vatAmount,
    total,
  }
}
