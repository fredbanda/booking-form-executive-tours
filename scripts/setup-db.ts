import { neon } from "@neondatabase/serverless"
import dotenv from "dotenv"

dotenv.config()

const sql = neon(process.env.DATABASE_URL!)

async function setupDatabase() {
  try {
    await sql`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`

    await sql`
      CREATE TABLE IF NOT EXISTS bookings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        service_type TEXT NOT NULL,
        pickup_address TEXT NOT NULL,
        pickup_lat DECIMAL,
        pickup_lng DECIMAL,
        destination_address TEXT NOT NULL,
        destination_lat DECIMAL,
        destination_lng DECIMAL,
        stop_address TEXT,
        pickup_date TIMESTAMP NOT NULL,
        passengers INTEGER NOT NULL DEFAULT 1,
        bags INTEGER NOT NULL DEFAULT 1,
        flight_number TEXT,
        meet_on_arrival BOOLEAN NOT NULL DEFAULT false,
        vehicle_type TEXT NOT NULL,
        vehicle_price INTEGER NOT NULL,
        extras JSONB DEFAULT '[]'::jsonb,
        special_requests TEXT,
        customer_name TEXT NOT NULL,
        customer_phone TEXT NOT NULL,
        customer_alt_phone TEXT,
        customer_email TEXT NOT NULL,
        subtotal INTEGER NOT NULL,
        vat_amount INTEGER NOT NULL,
        total_amount INTEGER NOT NULL,
        promo_code TEXT,
        payment_status TEXT NOT NULL DEFAULT 'pending',
        yoco_checkout_id TEXT,
        yoco_payment_id TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `

    await sql`CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON bookings(payment_status)`
    await sql`CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC)`
    await sql`CREATE INDEX IF NOT EXISTS idx_bookings_yoco_checkout_id ON bookings(yoco_checkout_id)`

    console.log("✅ Database tables created successfully!")
  } catch (error) {
    console.error("❌ Error setting up database:", error)
    process.exit(1)
  }
}

setupDatabase()
