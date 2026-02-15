import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { sql } from "@/lib/db"

async function isAuthenticated() {
  const cookieStore = await cookies()
  return cookieStore.get("admin_session")?.value === "authenticated"
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const [totalResult, paidResult, pendingResult, failedResult, revenueResult, todayResult] =
    await Promise.all([
      sql`SELECT COUNT(*) as count FROM bookings`,
      sql`SELECT COUNT(*) as count FROM bookings WHERE payment_status = 'paid'`,
      sql`SELECT COUNT(*) as count FROM bookings WHERE payment_status = 'pending'`,
      sql`SELECT COUNT(*) as count FROM bookings WHERE payment_status = 'failed'`,
      sql`SELECT COALESCE(SUM(total_amount), 0) as total FROM bookings WHERE payment_status = 'paid'`,
      sql`SELECT COUNT(*) as count FROM bookings WHERE created_at >= CURRENT_DATE`,
    ])

  return NextResponse.json({
    total: parseInt(totalResult[0].count),
    paid: parseInt(paidResult[0].count),
    pending: parseInt(pendingResult[0].count),
    failed: parseInt(failedResult[0].count),
    revenue: parseInt(revenueResult[0].total),
    today: parseInt(todayResult[0].count),
  })
}
