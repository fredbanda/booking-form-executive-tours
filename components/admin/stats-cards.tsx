import { CalendarDays, CreditCard, Clock, AlertTriangle } from "lucide-react"

interface Stats {
  total: number
  paid: number
  pending: number
  failed: number
  revenue: number
}

export function StatsCards({ stats }: { stats: Stats }) {
  const cards = [
    {
      label: "Total Bookings",
      value: stats.total,
      icon: CalendarDays,
      format: "number" as const,
    },
    {
      label: "Revenue",
      value: stats.revenue,
      icon: CreditCard,
      format: "currency" as const,
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: Clock,
      format: "number" as const,
    },
    {
      label: "Failed",
      value: stats.failed,
      icon: AlertTriangle,
      format: "number" as const,
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-border bg-card p-4"
        >
          <div className="flex items-center gap-2 text-muted-foreground">
            <card.icon className="h-4 w-4" />
            <span className="text-xs font-medium">{card.label}</span>
          </div>
          <p className="mt-2 text-2xl font-semibold text-foreground">
            {card.format === "currency"
              ? `ZAR ${(card.value / 100).toLocaleString("en-ZA", {
                  minimumFractionDigits: 2,
                })}`
              : card.value}
          </p>
        </div>
      ))}
    </div>
  )
}
