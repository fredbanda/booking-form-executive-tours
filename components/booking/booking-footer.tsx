"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { BookingState } from "@/lib/booking-store"

interface BookingFooterProps {
  onBack: () => void
  onNext: () => void
  state: BookingState
}

function canProceed(state: BookingState): boolean {
  switch (state.step) {
    case 1: // destination
      return state.destinationAddress.trim().length > 0
    case 2: // pickup details
      return (
        state.pickupAddress.trim().length > 0 &&
        state.pickupDate.trim().length > 0 &&
        state.pickupTime.trim().length > 0
      )
    case 3: // vehicle
      return state.vehicleId.length > 0
    case 4: // extras (always can proceed)
      return true
    case 5: // customer details
      return (
        state.customerName.trim().length > 0 &&
        state.customerPhone.trim().length >= 10 &&
        state.customerEmail.includes("@")
      )
    default:
      return true
  }
}

export function BookingFooter({ onBack, onNext, state }: BookingFooterProps) {
  const valid = canProceed(state)

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background px-5 py-4">
      <div className="mx-auto flex max-w-lg items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-muted"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <Button
          onClick={onNext}
          disabled={!valid}
          className="h-12 flex-1 rounded-lg text-base font-semibold"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
