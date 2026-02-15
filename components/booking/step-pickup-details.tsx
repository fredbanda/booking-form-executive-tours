"use client";

import {
  MapPin,
  Calendar,
  Clock,
  Users,
  Briefcase,
  Plane,
  Check,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import type { BookingState } from "@/lib/booking-store";
import { ExecutiveToursFooterBrand } from "@/components/booking/executive-tours-brand";

interface Props {
  state: BookingState;
  update: (p: Partial<BookingState>) => void;
}

export function StepPickupDetails({ state, update }: Props) {
  const isFromAirport = state.serviceType === "from_airport";
  const showFlightField =
    state.serviceType === "from_airport" || state.serviceType === "to_airport";

  // Determine pickup label based on service type
  const pickupLabel = isFromAirport
    ? "Cape Town International Airport"
    : state.pickupAddress || "Enter pickup address";

  return (
    <div className="flex flex-col gap-4">
      {/* Map preview */}
      <div className="relative h-44 w-full overflow-hidden rounded-xl bg-muted">
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sky-100 to-sky-50">
          <div className="flex flex-col items-center gap-1 text-muted-foreground">
            <MapPin className="h-6 w-6" />
            <span className="text-xs">Route preview</span>
          </div>
        </div>
      </div>

      {/* Pickup Location */}
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        {isFromAirport ? (
          <div className="flex h-12 w-full items-center rounded-lg border border-border bg-card pl-10 pr-4 text-sm text-foreground">
            {pickupLabel}
          </div>
        ) : (
          <Input
            placeholder="Enter pickup address"
            value={state.pickupAddress}
            onChange={(e) => update({ pickupAddress: e.target.value })}
            className="h-12 pl-10"
          />
        )}
      </div>

      {/* Date & Time row */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="date"
            value={state.pickupDate}
            onChange={(e) => update({ pickupDate: e.target.value })}
            className="h-12 pl-10"
          />
        </div>
        <div className="relative w-28">
          <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="time"
            value={state.pickupTime}
            onChange={(e) => update({ pickupTime: e.target.value })}
            className="h-12 pl-10"
          />
        </div>
      </div>

      {/* Passengers & Bags */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="number"
            min={1}
            max={50}
            value={state.passengers}
            onChange={(e) =>
              update({ passengers: parseInt(e.target.value) || 1 })
            }
            className="h-12 pl-10"
          />
        </div>
        <div className="relative flex-1">
          <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="number"
            min={0}
            max={50}
            value={state.bags}
            onChange={(e) => update({ bags: parseInt(e.target.value) || 0 })}
            className="h-12 pl-10"
          />
        </div>
      </div>

      {/* Flight number */}
      {showFlightField && (
        <div className="relative">
          <Plane className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Flight number (e.g. DE2290)"
            value={state.flightNumber}
            onChange={(e) =>
              update({ flightNumber: e.target.value.toUpperCase() })
            }
            className="h-12 pl-10"
          />
        </div>
      )}

      {/* Meet on arrival */}
      {isFromAirport && (
        <button
          type="button"
          onClick={() => update({ meetOnArrival: !state.meetOnArrival })}
          className="flex items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-muted"
        >
          <span
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
              state.meetOnArrival
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-card"
            }`}
          >
            {state.meetOnArrival && <Check className="h-3.5 w-3.5" />}
          </span>
          <span className="text-sm font-medium text-foreground">
            Meet me when I arrive
          </span>
        </button>
      )}

      <ExecutiveToursFooterBrand />
    </div>
  );
}

