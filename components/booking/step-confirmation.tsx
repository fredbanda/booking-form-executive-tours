"use client"

import { useState } from "react"
import { ArrowLeft, MapPin, Users, Briefcase, Plane, User, Phone, Mail, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { calculatePricing, formatZAR, isInternationalFlight, INTERNATIONAL_FLIGHT_SURCHARGE } from "@/lib/pricing"
import type { BookingState } from "@/lib/booking-store"
import { toast } from "sonner"

interface Props {
  state: BookingState
  update: (p: Partial<BookingState>) => void
}

export function StepConfirmation({ state, update }: Props) {
  const [loading, setLoading] = useState(false)
  const [showPromo, setShowPromo] = useState(false)

  const { subtotal, vatAmount, total } = calculatePricing(
    state.vehiclePrice,
    state.selectedExtras,
    state.flightNumber
  )

  const internationalFlight = isInternationalFlight(state.flightNumber)

  const formattedDate = state.pickupDate
    ? new Date(state.pickupDate + "T" + (state.pickupTime || "00:00")).toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    : ""

  const formattedTime = state.pickupTime
    ? state.pickupTime.replace(":", ":")
    : ""

  const handleConfirmAndPay = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceType: state.serviceType,
          pickupAddress: state.pickupAddress,
          pickupLat: state.pickupLat,
          pickupLng: state.pickupLng,
          destinationAddress: state.destinationAddress,
          destinationLat: state.destinationLat,
          destinationLng: state.destinationLng,
          stopAddress: state.stopAddress,
          pickupDate: `${state.pickupDate}T${state.pickupTime || "00:00"}`,
          passengers: state.passengers,
          bags: state.bags,
          flightNumber: state.flightNumber || null,
          meetOnArrival: state.meetOnArrival,
          vehicleType: state.vehicleType,
          vehiclePrice: state.vehiclePrice,
          extras: state.selectedExtras,
          specialRequests: state.specialRequests || null,
          customerName: state.customerName,
          customerPhone: state.customerPhone,
          customerAltPhone: state.customerAltPhone || null,
          customerEmail: state.customerEmail,
          promoCode: state.promoCode || null,
          subtotal,
          vatAmount,
          totalAmount: total,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Failed to create booking")
      }

      const data = await res.json()

      // Redirect to Yoco checkout
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col">
      <h1 className="mb-6 text-2xl font-semibold text-foreground text-balance">
        Confirm your booking
      </h1>

      {/* Trip Details Card */}
      <div className="rounded-xl border border-border bg-card p-5">
        {/* Date & Time */}
        <p className="mb-4 text-center text-sm font-medium text-muted-foreground">
          {formattedDate
            ? `Today, ${formattedDate} at ${formattedTime}PM`
            : `${state.pickupDate} at ${state.pickupTime}`}
        </p>

        {/* Route */}
        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-xs font-medium text-muted-foreground">Pick up</p>
              <p className="text-sm text-foreground">{state.pickupAddress}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-xs font-medium text-muted-foreground">Destination</p>
              <p className="text-sm text-foreground">{state.destinationAddress}</p>
            </div>
          </div>
        </div>

        {/* Trip info row */}
        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Users className="h-4 w-4" /> {state.passengers} Pax
          </span>
          <span className="flex items-center gap-1.5">
            <Briefcase className="h-4 w-4" /> {state.bags} Bag
          </span>
          {state.flightNumber && (
            <span className="flex items-center gap-1.5">
              <Plane className="h-4 w-4" /> {state.flightNumber}
            </span>
          )}
        </div>
      </div>

      {/* Customer details card */}
      <div className="mt-3 rounded-xl border border-border bg-card p-5">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-foreground">{state.customerName}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-foreground">{state.customerPhone}</span>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-foreground">{state.customerEmail}</span>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6">
        <h2 className="mb-4 text-xl font-semibold text-foreground">Summary</h2>

        <div className="flex flex-col gap-2.5">
          {/* Vehicle */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">{state.vehicleType}</span>
            <span className="text-sm text-foreground">{formatZAR(state.vehiclePrice)}</span>
          </div>

          {/* Extras */}
          {state.selectedExtras.map((extra) => (
            <div key={extra.id} className="flex items-center justify-between">
              <span className="text-sm text-foreground">{extra.name}</span>
              <span className="text-sm text-foreground">
                {extra.price === 0 ? "Free" : formatZAR(extra.price)}
              </span>
            </div>
          ))}

          {/* International flight surcharge */}
          {internationalFlight && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">International flight surcharge</span>
              <span className="text-sm text-foreground">{formatZAR(INTERNATIONAL_FLIGHT_SURCHARGE)}</span>
            </div>
          )}
        </div>

        <Separator className="my-4" />

        {/* Subtotal */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Subtotal</span>
          <span className="text-sm text-foreground">{formatZAR(subtotal)}</span>
        </div>

        {/* VAT */}
        <div className="mt-1 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            VAT (15%)
            <Info className="h-3.5 w-3.5" />
          </span>
          <span className="text-sm text-muted-foreground">{formatZAR(vatAmount)}</span>
        </div>

        {/* Promo code */}
        {showPromo ? (
          <div className="mt-3">
            <Input
              placeholder="Enter promo code"
              value={state.promoCode}
              onChange={(e) => update({ promoCode: e.target.value })}
              className="h-10 rounded-lg"
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowPromo(true)}
            className="mt-3 rounded-full border border-border px-4 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted"
          >
            Add promo code
          </button>
        )}

        <Separator className="my-4" />

        {/* Total */}
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-foreground">Total</span>
          <span className="text-xl font-bold text-foreground">{formatZAR(total)}</span>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-8 flex items-center gap-3">
        <button
          type="button"
          onClick={() => update({ step: state.step - 1 })}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-muted"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <Button
          onClick={handleConfirmAndPay}
          disabled={loading}
          className="h-12 flex-1 rounded-lg text-base font-semibold"
        >
          {loading ? "Processing..." : "Confirm & Pay"}
        </Button>
      </div>
    </div>
  )
}
