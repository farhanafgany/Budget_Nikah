'use client'

const TOTAL_STEPS = 7

interface StepWrapperProps {
  children: React.ReactNode
  onNext: () => void
  onBack?: () => void
  nextLabel?: string
  nextDisabled?: boolean
  stepIndex: number
}

export function StepWrapper({ children, onNext, onBack, nextLabel = 'Lanjut →', nextDisabled, stepIndex }: StepWrapperProps) {
  const progress = ((stepIndex + 1) / TOTAL_STEPS) * 100

  return (
    <div className="min-h-screen bg-nikah-bg flex flex-col">
      {/* Progress bar */}
      <div className="h-1 bg-nikah-border w-full">
        <div
          className="h-full bg-gradient-to-r from-nikah-mauve to-nikah-deep transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Nav row */}
      <div className="flex items-center justify-between px-5 py-3">
        {onBack ? (
          <button onClick={onBack} className="text-nikah-muted text-sm font-medium">
            ← Kembali
          </button>
        ) : <div />}
        <span className="text-nikah-muted text-xs">
          {stepIndex + 1} / {TOTAL_STEPS}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-4 overflow-y-auto">
        {children}
      </div>

      {/* Sticky CTA */}
      <div className="px-6 py-5 bg-nikah-bg border-t border-nikah-border">
        <button
          onClick={onNext}
          disabled={nextDisabled}
          className="w-full bg-nikah-deep text-white font-bold py-4 rounded-full text-sm disabled:opacity-40 transition"
        >
          {nextLabel}
        </button>
      </div>
    </div>
  )
}
