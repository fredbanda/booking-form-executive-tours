import type { Extra } from "./pricing"
import type { ServiceType } from "./validators"

export interface BookingState {
  step: number
  serviceType: ServiceType | null
  pickupAddress: string
  pickupLat: number | null
  pickupLng: number | null
  destinationAddress: string
  destinationLat: number | null
  destinationLng: number | null
  stopAddress: string
  pickupDate: string
  pickupTime: string
  passengers: number
  bags: number
  flightNumber: string
  meetOnArrival: boolean
  vehicleId: string
  vehicleType: string
  vehiclePrice: number
  selectedExtras: Extra[]
  specialRequests: string
  customerName: string
  customerPhone: string
  customerAltPhone: string
  customerEmail: string
  promoCode: string
}

export const initialBookingState: BookingState = {
  step: 0,
  serviceType: null,
  pickupAddress: "",
  pickupLat: null,
  pickupLng: null,
  destinationAddress: "",
  destinationLat: null,
  destinationLng: null,
  stopAddress: "",
  pickupDate: "",
  pickupTime: "",
  passengers: 1,
  bags: 1,
  flightNumber: "",
  meetOnArrival: false,
  vehicleId: "",
  vehicleType: "",
  vehiclePrice: 0,
  selectedExtras: [],
  specialRequests: "",
  customerName: "",
  customerPhone: "",
  customerAltPhone: "",
  customerEmail: "",
  promoCode: "",
}

export const STEP_TITLES = [
  "Choose Service",
  "Where are you going?",
  "Confirm pick-up",
  "Select your vehicle",
  "Extras",
  "Your details",
  "Confirm your booking",
]
