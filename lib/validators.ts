import { z } from "zod"

export const serviceTypes = [
  "to_airport",
  "from_airport",
  "any_destination",
  "chauffeur",
] as const

export type ServiceType = (typeof serviceTypes)[number]

export const serviceTypeLabels: Record<ServiceType, { title: string; description: string }> = {
  to_airport: {
    title: "Transport to Airport",
    description: "We'll take you to the airport",
  },
  from_airport: {
    title: "Transport from Airport",
    description: "We'll take you from the airport",
  },
  any_destination: {
    title: "Transport to any destination",
    description: "We'll take you where you need to go",
  },
  chauffeur: {
    title: "Chauffeur hire",
    description: "Hire a personal driver for the day",
  },
}

export const bookingSchema = z.object({
  serviceType: z.enum(serviceTypes),
  pickupAddress: z.string().min(1, "Pickup address is required"),
  pickupLat: z.number().optional(),
  pickupLng: z.number().optional(),
  destinationAddress: z.string().min(1, "Destination is required"),
  destinationLat: z.number().optional(),
  destinationLng: z.number().optional(),
  stopAddress: z.string().optional(),
  pickupDate: z.string().min(1, "Date is required"),
  pickupTime: z.string().min(1, "Time is required"),
  passengers: z.number().min(1).max(50),
  bags: z.number().min(0).max(50),
  flightNumber: z.string().optional(),
  meetOnArrival: z.boolean(),
  vehicleId: z.string().min(1, "Please select a vehicle"),
  vehicleType: z.string().min(1),
  vehiclePrice: z.number().min(0),
  selectedExtras: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      price: z.number(),
    })
  ),
  specialRequests: z.string().optional(),
  customerName: z.string().min(1, "Full name is required"),
  customerPhone: z.string().min(10, "Valid phone number required"),
  customerAltPhone: z.string().optional(),
  customerEmail: z.string().email("Valid email is required"),
  promoCode: z.string().optional(),
})

export type BookingFormData = z.infer<typeof bookingSchema>

export const customerDetailsSchema = z.object({
  customerName: z.string().min(1, "Full name is required"),
  customerPhone: z.string().min(10, "Valid phone number required"),
  customerAltPhone: z.string().optional(),
  customerEmail: z.string().email("Valid email is required"),
})
