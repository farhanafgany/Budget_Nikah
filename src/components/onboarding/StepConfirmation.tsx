'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { clearOnboardingStore, useOnboardingStore } from '@/stores/onboardingStore'
import { bucketBudget, bucketGuests, track } from '@/lib/analytics'
import { isProfileReplacementRequired } from '@/lib/authFlow'
import { getCityTier } from '@/lib/cityTiers'
import { createClient } from '@/lib/supabase/client'
import { ProfileReplacementDialog } from '@/components/auth/ProfileReplacementDialog'
import { StepWrapper } from './StepWrapper'

const STYLE_LABELS: Record<string, string> = {
  simple:      'Simple',
  elegant:     'Elegant',
  luxury:      'Luxury',
  traditional: 'Traditional',
  modern:      'Modern',
}

const EVENT_LABELS: Record<string, string> = {
  akad_resepsi: 'Akad + Resepsi',
  resepsi:      'Resepsi Saja',
  akad:         'Akad Saja',
  intimate:     'Intimate',
}

const PRIORITY_LABELS: Record<string, string> = {
  hemat:      'Hemat Cerdas',
  balanced:   'Seimbang',
  experience: 'Kesan Tak Terlupakan',
}

function shortRupiah(value: number) {
  if (value >= 1_000_000_000) return `Rp ${(value / 1_000_000_000).toFixed(1).replace('.0', '')}M`
  if (value >= 1_000_000) return `Rp ${Math.round(value / 1_000_000)}jt`
  if (value >= 1_000) return `Rp ${Math.round(value / 1_000)}rb`
  return `Rp ${value.toLocaleString('id-ID')}`
}

function formatDate(dateStr: string) {
  if (!dateStr) return null
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return null
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function StepConfirmation() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [replacementRequired, setReplacementRequired] = useState(false)
  const {
    partnerOneName,
    partnerTwoName,
    weddingCity,
    weddingDate,
    totalBudget,
    guestCount,
    weddingStyle,
    eventType,
    planningPriority,
    prevStep,
  } = useOnboardingStore()

  const dateLabel = formatDate(weddingDate)

  const summaryRows = [
    { label: 'Nama',    value: partnerTwoName ? `${partnerOneName} & ${partnerTwoName}` : partnerOneName },
    { label: 'Lokasi',  value: weddingCity },
    ...(dateLabel ? [{ label: 'Tanggal', value: dateLabel }] : []),
    { label: 'Budget',  value: shortRupiah(totalBudget) },
    { label: 'Tamu',    value: `${guestCount.toLocaleString('id-ID')} orang` },
    ...(weddingStyle  ? [{ label: 'Gaya',     value: STYLE_LABELS[weddingStyle]     ?? weddingStyle }]     : []),
    ...(eventType     ? [{ label: 'Acara',    value: EVENT_LABELS[eventType]        ?? eventType }]        : []),
    ...(planningPriority ? [{ label: 'Prioritas', value: PRIORITY_LABELS[planningPriority] ?? planningPriority }] : []),
  ]

  async function handleNext(replaceExisting = false) {
    if (saving) return
    setError('')
    setSaving(true)
    if (!replaceExisting) {
      track('onboarding_completed', {
        budget_bucket: bucketBudget(totalBudget),
        guest_bucket: bucketGuests(guestCount),
        city_tier: weddingCity ? getCityTier(weddingCity) : 'unknown',
        wedding_style: weddingStyle,
        event_type: eventType,
        planning_priority: planningPriority,
      })
    }

    const supabase = createClient()
    const { data } = await supabase.auth.getSession()
    if (data.session?.user) {
      const response = await fetch('/api/onboarding/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          onboarding: {
            partnerOneName,
            partnerTwoName,
            weddingCity,
            weddingDate,
            totalBudget,
            guestCount,
            weddingStyle,
            eventType,
            planningPriority,
          },
          replaceExisting,
        }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        if (isProfileReplacementRequired(response.status, data)) {
          setSaving(false)
          setReplacementRequired(true)
          return
        }

        setSaving(false)
        setError('Data belum tersimpan. Coba lagi sebentar lagi.')
        return
      }

      const result = await response.json() as { isPremium?: boolean }
      if (result.isPremium) {
        await clearOnboardingStore()
        router.replace('/dashboard')
        return
      }
    }

    router.push('/result')
  }

  function keepStoredPlan() {
    setReplacementRequired(false)
    router.push('/result')
  }

  function replaceStoredPlan() {
    setReplacementRequired(false)
    void handleNext(true)
  }

  return (
    <StepWrapper
      stepIndex={6}
      onNext={() => { void handleNext() }}
      onBack={prevStep}
      nextLabel={saving ? 'Menyimpan...' : 'Lihat hasilnya →'}
      hideStepCounter
    >
      <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve mb-1">Hampir selesai</p>
      <h2 className="text-2xl font-extrabold text-nikah-text mb-1">
        Rencana kalian sudah lengkap.
      </h2>
      <p className="text-nikah-muted text-sm mb-6 font-light" style={{ lineHeight: 1.55 }}>
        Kami sudah punya semua yang dibutuhkan. Siap lihat gambaran lengkapnya?
      </p>

      <div
        className="border border-nikah-border"
        style={{
          borderRadius: 18,
          overflow: 'hidden',
          background: 'linear-gradient(160deg, #FFFCF8 0%, #F8F1EA 100%)',
        }}
      >
        {summaryRows.map((row, i) => (
          <div
            key={row.label}
            className="flex items-center justify-between"
            style={{
              padding: '12px 18px',
              borderTop: i > 0 ? '1px solid var(--nikah-border)' : 'none',
              gap: 12,
            }}
          >
            <span className="text-nikah-muted font-bold" style={{ fontSize: 12, flexShrink: 0 }}>
              {row.label}
            </span>
            <span className="text-nikah-text font-bold text-right" style={{ fontSize: 13.5 }}>
              {row.value}
            </span>
          </div>
        ))}
      </div>

      <p className="text-xs text-nikah-muted" style={{ marginTop: 14, lineHeight: 1.5 }}>
        Ingin ubah sesuatu?{' '}
        <button
          onClick={prevStep}
          className="text-nikah-deep font-semibold underline underline-offset-2"
        >
          ← Kembali edit
        </button>
      </p>
      {error && (
        <p className="text-xs text-red-600 font-medium" style={{ marginTop: 12, lineHeight: 1.5 }}>
          {error}
        </p>
      )}
      {replacementRequired && (
        <ProfileReplacementDialog
          busy={saving}
          keepLabel="Lihat hasil tanpa mengganti data"
          onKeepExisting={keepStoredPlan}
          onReplace={replaceStoredPlan}
        />
      )}
    </StepWrapper>
  )
}
