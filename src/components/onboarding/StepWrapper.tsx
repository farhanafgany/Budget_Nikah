'use client'

import type { ReactNode } from 'react'
import { BrandLogo } from '@/components/ui/BrandLogo'

const TOTAL_STEPS = 7

const STEP_LABELS = [
  { label: 'Pasangan',  hint: 'Nama kalian berdua' },
  { label: 'Kota',      hint: 'Lokasi pernikahan' },
  { label: 'Tanggal',   hint: 'Hari H acara' },
  { label: 'Budget',    hint: 'Total biaya yang disiapkan' },
  { label: 'Tamu',      hint: 'Jumlah undangan' },
  { label: 'Gaya',      hint: 'Visi dan karakter acara' },
  { label: 'Prioritas', hint: 'Yang paling penting buat kalian' },
]

const SERIF = 'var(--font-playfair), "Cormorant Garamond", Georgia, serif'

interface StepWrapperProps {
  children: ReactNode
  onNext: () => void
  onBack?: () => void
  nextLabel?: string
  nextDisabled?: boolean
  stepIndex: number
}

export function StepWrapper({
  children,
  onNext,
  onBack,
  nextLabel = 'Lanjut →',
  nextDisabled = false,
  stepIndex,
}: StepWrapperProps) {
  const progress = ((stepIndex + 1) / TOTAL_STEPS) * 100

  return (
    <div className="min-h-screen bg-nikah-bg flex flex-col lg:flex-row">

      {/* ── Desktop left panel ── */}
      <aside
        className="hidden lg:flex lg:flex-col lg:w-[300px] xl:w-[340px] lg:min-h-screen lg:flex-shrink-0 border-r border-nikah-border"
        style={{ background: 'var(--landing-band, #EFE4DE)', padding: '40px 32px' }}
      >
        <div className="flex-1">
          <BrandLogo size="md" />

          <p
            className="text-nikah-text"
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontWeight: 500,
              fontSize: 22,
              lineHeight: 1.25,
              margin: '32px 0 28px',
            }}
          >
            Rencana nikah kalian, lebih jelas dalam 2 menit.
          </p>

          <nav aria-label="Langkah onboarding">
            <ol className="space-y-1">
              {STEP_LABELS.map((step, i) => {
                const done    = i < stepIndex
                const current = i === stepIndex
                return (
                  <li
                    key={step.label}
                    className="flex items-center gap-3 rounded-xl transition-colors"
                    style={{
                      padding: '10px 12px',
                      background: current ? 'rgba(255,255,255,0.72)' : 'transparent',
                    }}
                  >
                    <span
                      className="flex items-center justify-center flex-shrink-0 rounded-full font-extrabold"
                      style={{
                        width: 26,
                        height: 26,
                        fontSize: 11,
                        background: done || current ? 'var(--nikah-deep)' : 'var(--nikah-border)',
                        color: done || current ? '#fff' : 'var(--nikah-muted)',
                      }}
                      aria-hidden="true"
                    >
                      {done ? '✓' : i + 1}
                    </span>
                    <div className="min-w-0">
                      <p
                        className="font-bold truncate"
                        style={{
                          fontSize: 13,
                          color: current ? 'var(--nikah-text)' : done ? 'var(--nikah-muted)' : 'var(--nikah-muted)',
                        }}
                      >
                        {step.label}
                      </p>
                      {current && (
                        <p className="text-nikah-muted truncate" style={{ fontSize: 11, marginTop: 1 }}>
                          {step.hint}
                        </p>
                      )}
                    </div>
                  </li>
                )
              })}
            </ol>
          </nav>
        </div>

        <p className="text-nikah-muted" style={{ fontSize: 11, marginTop: 24 }}>
          ✓ Tanpa daftar &nbsp;·&nbsp; ✓ Data tersimpan lokal
        </p>
      </aside>

      {/* ── Main content column ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Progress bar — mobile only */}
        <div className="lg:hidden h-1 bg-nikah-border w-full">
          <div
            className="h-full bg-gradient-to-r from-nikah-mauve to-nikah-deep transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Nav row */}
        <div className="flex items-center justify-between px-5 py-3 lg:px-12 lg:py-5">
          {onBack ? (
            <button
              onClick={onBack}
              aria-label="Kembali ke langkah sebelumnya"
              className="text-nikah-muted text-sm font-medium hover:text-nikah-text transition-colors"
            >
              ← Kembali
            </button>
          ) : <div />}
          <span className="text-nikah-muted text-xs font-medium lg:hidden">
            {stepIndex + 1} dari {TOTAL_STEPS} · selesai dalam 2 menit
          </span>
          <div className="hidden lg:block" />
        </div>

        {/* Step content */}
        <div className="flex-1 px-6 py-4 overflow-y-auto lg:px-12 lg:py-8 lg:flex lg:items-center">
          <div className="w-full max-w-lg">
            {children}
          </div>
        </div>

        {/* Sticky CTA */}
        <div
          className="px-6 py-5 border-t border-nikah-border lg:px-12 lg:py-8"
          style={{ background: 'var(--nikah-bg)' }}
        >
          <div className="max-w-lg">
            <button
              onClick={onNext}
              disabled={nextDisabled}
              className="w-full bg-nikah-deep text-white font-bold py-4 rounded-full text-sm disabled:opacity-40 hover:opacity-90 transition"
            >
              {nextLabel}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
