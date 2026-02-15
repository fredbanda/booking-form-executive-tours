"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { AdminHeader } from "@/components/admin/admin-header"
import { StatsCards } from "@/components/admin/stats-cards"
import { BookingsTable } from "@/components/admin/bookings-table"

interface Stats {
  total: number
  paid: number
  pending: number
  failed: number
  revenue: number
}

interface Booking {
  id: string
  service_type: string
  pickup_address: string
  destination_address: string
  pickup_date: string
  vehicle_type: string
  customer_name: string
  customer_phone: string
  customer_email: string
  total_amount: number
  payment_status: string
  created_at: string
  flight_number: string | null
  passengers: number
  extras: Array<{ name: string; price: number }>
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, bookingsRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch(`/api/admin/bookings?status=${filter}`),
      ])

      if (statsRes.status === 401 || bookingsRes.status === 401) {
        router.push("/admin")
        return
      }

      const statsData = await statsRes.json()
      const bookingsData = await bookingsRes.json()

      setStats(statsData)
      setBookings(bookingsData.bookings || [])
    } catch {
      router.push("/admin")
    } finally {
      setLoading(false)
    }
  }, [filter, router])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted-foreground border-t-foreground" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-semibold text-foreground">Dashboard</h1>

        {stats && <StatsCards stats={stats} />}

        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium text-foreground">Bookings</h2>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Bookings</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <BookingsTable bookings={bookings} />
        </div>
      </main>
    </div>
  )
}
