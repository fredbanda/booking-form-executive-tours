"use client"

import { VEHICLES, formatZAR } from "@/lib/pricing"
import type { BookingState } from "@/lib/booking-store"

interface Props {
  state: BookingState
  update: (p: Partial<BookingState>) => void
}

export function StepVehicle({ state, update }: Props) {
  return (
    <div className="flex flex-col gap-3">
      {VEHICLES.map((vehicle) => {
        const selected = state.vehicleId === vehicle.id
        return (
          <button
            key={vehicle.id}
            type="button"
            onClick={() =>
              update({
                vehicleId: vehicle.id,
                vehicleType: vehicle.name,
                vehiclePrice: vehicle.price,
              })
            }
            className={`flex items-center justify-between rounded-xl border-2 px-5 py-4 text-left transition-all ${
              selected
                ? "border-foreground bg-card shadow-sm"
                : "border-border bg-card hover:border-muted-foreground/30"
            }`}
          >
            <div>
              <p className="font-semibold text-foreground">{vehicle.name}</p>
              <p className="text-sm text-muted-foreground">
                {formatZAR(vehicle.price)}
              </p>
            </div>
          </button>
        )
      })}
    </div>
  )
}
