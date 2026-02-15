"use client";

import { Plane, PlaneLanding, MapPin, User } from "lucide-react";
import type { BookingState } from "@/lib/booking-store";
import type { ServiceType } from "@/lib/validators";
import { serviceTypeLabels } from "@/lib/validators";
import { ExecutiveToursFooterBrand } from "@/components/booking/executive-tours-brand";

interface Props {
  state: BookingState;
  update: (p: Partial<BookingState>) => void;
  onNext: () => void;
}

const serviceIcons: Record<ServiceType, React.ReactNode> = {
  to_airport: <Plane className="h-5 w-5" />,
  from_airport: <PlaneLanding className="h-5 w-5" />,
  any_destination: <MapPin className="h-5 w-5" />,
  chauffeur: <User className="h-5 w-5" />,
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function StepServiceType({ state, update, onNext }: Props) {
  const handleSelect = (type: ServiceType) => {
    const isAirportService = type === "to_airport" || type === "from_airport";
    update({
      serviceType: type,
      // Pre-fill pickup for "from_airport"
      pickupAddress:
        type === "from_airport"
          ? "Cape Town International Airport (CPT), Matroosfontein, Cape Town, South Africa"
          : "",
      // Pre-fill destination for "to_airport"
      destinationAddress:
        type === "to_airport"
          ? "Cape Town International Airport (CPT), Matroosfontein, Cape Town, South Africa"
          : "",
      flightNumber: isAirportService ? state.flightNumber : "",
      meetOnArrival: type === "from_airport" ? true : false,
    });
    onNext();
  };

  return (
    <div className="flex flex-col">
      <h1 className="mb-1 text-2xl font-semibold text-foreground text-balance">
        {getGreeting()},
      </h1>
      <h2 className="mb-8 text-2xl font-semibold text-muted-foreground text-balance">
        what would you like to book?
      </h2>

      <div className="flex flex-col gap-3">
        {(Object.keys(serviceTypeLabels) as ServiceType[]).map((type) => {
          const label = serviceTypeLabels[type];
          const selected = state.serviceType === type;

          return (
            <button
              key={type}
              type="button"
              onClick={() => handleSelect(type)}
              className={`flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all ${
                selected
                  ? "border-foreground bg-card"
                  : "border-border bg-card hover:border-muted-foreground/30"
              }`}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                {serviceIcons[type]}
              </span>
              <div>
                <p className="font-semibold text-foreground">{label.title}</p>
                <p className="text-sm text-muted-foreground">
                  {label.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <ExecutiveToursFooterBrand />
    </div>
  );
}

