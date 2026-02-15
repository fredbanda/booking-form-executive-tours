"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { BookingState } from "@/lib/booking-store";
import { ExecutiveToursFooterBrand } from "@/components/booking/executive-tours-brand";

interface Props {
  state: BookingState;
  update: (p: Partial<BookingState>) => void;
}

export function StepCustomerDetails({ state, update }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="mb-2 text-2xl font-semibold text-foreground text-balance">
        {"Let's add your details"}
      </h1>

      <div className="flex flex-col gap-1">
        <Label htmlFor="name" className="sr-only">
          Full name
        </Label>
        <Input
          id="name"
          placeholder="Full name"
          value={state.customerName}
          onChange={(e) => update({ customerName: e.target.value })}
          className="h-12 rounded-lg"
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="phone" className="sr-only">
          Mobile number
        </Label>
        <div className="flex items-center gap-2">
          <span className="flex h-12 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-sm text-muted-foreground">
            <span className="text-base">🇿🇦</span>
            <span>+27</span>
          </span>
          <Input
            id="phone"
            type="tel"
            placeholder="Mobile"
            value={state.customerPhone}
            onChange={(e) => update({ customerPhone: e.target.value })}
            className="h-12 flex-1 rounded-lg"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="alt-phone" className="sr-only">
          Alternative mobile (optional)
        </Label>
        <Input
          id="alt-phone"
          type="tel"
          placeholder="Alternative mobile (optional)"
          value={state.customerAltPhone}
          onChange={(e) => update({ customerAltPhone: e.target.value })}
          className="h-12 rounded-lg"
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="email" className="sr-only">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="Email"
          value={state.customerEmail}
          onChange={(e) => update({ customerEmail: e.target.value })}
          className="h-12 rounded-lg"
        />
      </div>

      <ExecutiveToursFooterBrand />

      <p className="text-xs leading-relaxed text-muted-foreground">
        By proceeding, you consent to get calls, WhatsApp or SMS messages,
        including by automated means, from Executive Tours and its affiliates.
      </p>
    </div>
  );
}

