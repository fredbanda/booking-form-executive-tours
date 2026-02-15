import Link from "next/link"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function BookingFailedPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-background px-5">
      <div className="flex w-full max-w-lg flex-col items-center">
        {/* Error icon */}
        <div className="mb-6 rounded-xl border border-border bg-card p-8">
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-7 w-7 text-destructive" />
            </div>
            <p className="text-center text-sm leading-relaxed text-foreground">
              {"Your booking couldn't be completed as your payment was not successful"}
            </p>
          </div>
        </div>

        <Link href="/" className="w-full">
          <Button className="h-12 w-full rounded-lg text-base font-semibold">
            Try again
          </Button>
        </Link>
      </div>
    </main>
  )
}
