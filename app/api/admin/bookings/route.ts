import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { sql } from "@/lib/db"

async function isAuthenticated() {
  const cookieStore = await cookies()
  return cookieStore.get("admin_session")?.value === "authenticated"
}

export async function GET(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")
  const page = parseInt(searchParams.get("page") || "1")
  const limit = 20
  const offset = (page - 1) * limit

  let bookings
  let countResult

  if (status && status !== "all") {
    bookings = await sql`
      SELECT * FROM bookings
      WHERE payment_status = ${status}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `
    countResult = await sql`
      SELECT COUNT(*) as count FROM bookings WHERE payment_status = ${status}
    `
  } else {
    bookings = await sql`
      SELECT * FROM bookings
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `
    countResult = await sql`
      SELECT COUNT(*) as count FROM bookings
    `
  }

  const total = parseInt(countResult[0].count)

  return NextResponse.json({
    bookings,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  })
}
