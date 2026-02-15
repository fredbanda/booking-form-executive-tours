"use client"

import { EXTRAS, formatZAR, type Extra } from "@/lib/pricing"
import { Textarea } from "@/components/ui/textarea"
import type { BookingState } from "@/lib/booking-store"

interface Props {
  state: BookingState
  update: (p: Partial<BookingState>) => void
}

export function StepExtras({ state, update }: Props) {
  const toggleExtra = (extra: Extra) => {
    const isSelected = state.selectedExtras.some((e) => e.id === extra.id)
    if (isSelected) {
      update({
        selectedExtras: state.selectedExtras.filter((e) => e.id !== extra.id),
      })
    } else {
      update({
        selectedExtras: [...state.selectedExtras, extra],
      })
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-foreground text-balance">
        Would you like to add any extras?
      </h1>

      <div className="grid grid-cols-2 gap-3">
        {EXTRAS.map((extra) => {
          const selected = state.selectedExtras.some((e) => e.id === extra.id)
          return (
            <button
              key={extra.id}
              type="button"
              onClick={() => toggleExtra(extra)}
              className={`flex flex-col items-start rounded-xl border-2 px-4 py-4 text-left transition-all ${
                selected
                  ? "border-foreground bg-card shadow-sm"
                  : "border-border bg-card hover:border-muted-foreground/30"
              }`}
            >
              <p className="font-semibold text-foreground">{extra.name}</p>
              <p className="text-sm text-muted-foreground">
                {extra.price === 0 ? "Free" : formatZAR(extra.price)}
              </p>
            </button>
          )
        })}
      </div>

      <Textarea
        placeholder="Any special requests?"
        value={state.specialRequests}
        onChange={(e) => update({ specialRequests: e.target.value })}
        className="mt-2 min-h-24 resize-none rounded-xl bg-muted/50"
      />
    </div>
  )
}
