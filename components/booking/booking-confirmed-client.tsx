"use client";

import {
  CheckCircle,
  MapPin,
  Users,
  Briefcase,
  Plane,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ExecutiveToursFooterBrand } from "@/components/booking/executive-tours-brand";


interface Props {
  ref_: string;
  customerName: string;
  pickupAddress: string;
  destinationAddress: string;
  pickupDate: string;
  vehicleType: string;
  passengers: number;
  bags: number;
  flightNumber?: string | null;
  totalAmount: string;
  extras: Array<{ name: string; price: number }>;
  whatsappLink: string;
}

export function BookingConfirmedClient({
  ref_,
  customerName,
  pickupAddress,
  destinationAddress,
  pickupDate,
  vehicleType,
  passengers,
  bags,
  flightNumber,
  totalAmount,
  whatsappLink,
}: Props) {
  const formattedDate = new Date(pickupDate).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <main className="flex min-h-dvh flex-col items-center bg-background px-5 py-10">
      <div className="flex w-full max-w-lg flex-col items-center">
        {/* Success icon */}
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle className="h-8 w-8 text-emerald-600" />
        </div>

        <h1 className="mb-1 text-2xl font-bold text-foreground">
          Booking confirmed!
        </h1>
        <p className="mb-6 text-sm text-muted-foreground">Reference: {ref_}</p>

        {/* Booking summary card */}
        <div className="w-full rounded-xl border border-border bg-card p-5">
          <p className="mb-3 text-sm font-medium text-muted-foreground">
            {formattedDate}
          </p>

          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Pick up</p>
                <p className="text-sm text-foreground">{pickupAddress}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Destination</p>
                <p className="text-sm text-foreground">{destinationAddress}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4" /> {passengers} Pax
            </span>
            <span className="flex items-center gap-1.5">
              <Briefcase className="h-4 w-4" /> {bags} Bag
            </span>
            {flightNumber && (
              <span className="flex items-center gap-1.5">
                <Plane className="h-4 w-4" /> {flightNumber}
              </span>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
            <span className="text-sm font-medium text-foreground">
              {vehicleType}
            </span>
            <span className="font-bold text-foreground">{totalAmount}</span>
          </div>
        </div>

        <p className="mt-4 text-center text-sm leading-relaxed text-muted-foreground">
          Thank you, {customerName}. A driver will contact you before your
          pickup. If you have questions, reach out on WhatsApp.
        </p>

        {/* WhatsApp CTA */}
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 w-full"
        >
          <Button
            variant="outline"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-lg text-base"
          >
            <MessageCircle className="h-5 w-5" />
            Contact us on WhatsApp
          </Button>
        </a>

        {/* Book another */}
        <Link href="/" className="mt-3 w-full">
          <Button className="h-12 w-full rounded-lg text-base font-semibold">
            Book another transfer
          </Button>
        </Link>

        <ExecutiveToursFooterBrand />
      </div>
    </main>
  );
}

