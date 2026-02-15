"use client";

import { MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { BookingState } from "@/lib/booking-store";
import { ExecutiveToursFooterBrand } from "@/components/booking/executive-tours-brand";

interface Props {
  state: BookingState;
  update: (p: Partial<BookingState>) => void;
}

export function StepDestination({ state, update }: Props) {
  // For "to_airport" the destination is pre-filled, so we need pickup
  // For "from_airport" the pickup is pre-filled, so we need destination
  // For "any_destination" / "chauffeur", both are needed but destination label stays
  const needsPickup =
    state.serviceType === "to_airport" ||
    state.serviceType === "any_destination" ||
    state.serviceType === "chauffeur";

  const destinationPreFilled = state.serviceType === "to_airport";

  return (
    <div className="flex flex-col gap-4">
      {/* Static map placeholder */}
      <div className="relative h-44 w-full overflow-hidden rounded-xl bg-muted">
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sky-100 to-sky-50">
          <span className="text-sm text-muted-foreground">Cape Town Area</span>
        </div>
      </div>

      {/* Destination input */}
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        {destinationPreFilled ? (
          <div className="flex h-12 w-full items-center rounded-lg border border-border bg-muted pl-10 pr-4 text-sm text-muted-foreground">
            {state.destinationAddress}
          </div>
        ) : (
          <Input
            placeholder="Enter destination"
            value={state.destinationAddress}
            onChange={(e) => update({ destinationAddress: e.target.value })}
            className="h-12 pl-10"
          />
        )}
      </div>

      {/* Optional stop */}
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Add a stop along the way (optional)"
          value={state.stopAddress}
          onChange={(e) => update({ stopAddress: e.target.value })}
          className="h-12 pl-10"
        />
      </div>

      {/* If service type needs pickup entry here too (for to_airport/any_dest) */}
      {needsPickup && !state.pickupAddress && (
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Enter pickup address"
            value={state.pickupAddress}
            onChange={(e) => update({ pickupAddress: e.target.value })}
            className="h-12 pl-10"
          />
        </div>
      )}

      <ExecutiveToursFooterBrand />
    </div>
  );
}

