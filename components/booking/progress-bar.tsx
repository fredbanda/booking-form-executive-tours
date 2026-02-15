"use client"

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = Math.round((currentStep / totalSteps) * 100)

  return (
    <div className="mb-6">
      <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-foreground transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
