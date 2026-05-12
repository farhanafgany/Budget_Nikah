import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { calculatePressureLevel } from '@/lib/scoring'
import type { PressureLevel } from '@/lib/scoring'
import { formatRupiah } from '@/lib/utils'
import { PremiumCTA } from '@/components/dashboard/PremiumCTA'
import { TabunganNikah } from '@/components/dashboard/TabunganNikah'
import { ChecklistPernikahan } from '@/components/dashboard/ChecklistPernikahan'
import { SeserahanList } from '@/components/dashboard/SeserahanList'

const LABEL_COLORS: Record<string, string> = {
  Healthy:     'text-green-700 bg-green-100',
  Moderate:    'text-orange-700 bg-orange-100',
  'High Risk': 'text-red-700 bg-red-100',
}

const PRESSURE_COLORS: Record<PressureLevel, string> = {
  Low:    'text-green-700',
  Medium: 'text-orange-700',
  High:   'text-red-700',
}

function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return null
  const diff = date.getTime() - Date.now()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('wedding_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!profile) {
    return (
      <div className="min-h-screen bg-nikah-bg flex items-center justify-center px-6">
        <div className="max-w-sm w-full text-center bg-white rounded-3xl p-8 shadow-sm border border-nikah-border">
          <div className="text-4xl mb-4" aria-hidden="true">💍</div>
          <h2 className="text-xl font-extrabold text-nikah-text mb-2">Belum ada data</h2>
          <p className="text-nikah-muted text-sm mb-6 font-light">
            Mulai susun wedding plan kamu agar semuanya terasa lebih terarah.
          </p>
          <Link href="/onboarding" className="block w-full bg-nikah-deep text-white font-bold py-4 rounded-full text-sm text-center">
            Mulai Wedding Plan →
          </Link>
        </div>
      </div>
    )
  }

  const days      = daysUntil(profile.wedding_date as string | null)
  const score     = (profile.readiness_score as number | null) ?? 0
  const label     = score >= 70 ? 'Healthy' : score >= 40 ? 'Moderate' : 'High Risk'
  const pressure  = calculatePressureLevel(score)
  const alloc     = profile.allocation_result as Record<string, unknown> | null
  const top3 = alloc
    ? (Object.entries(alloc) as [string, unknown][])
        .filter((e): e is [string, { percentage: number; estimatedAmount: number }] => {
          const v = e[1] as Record<string, unknown>
          return typeof v?.percentage === 'number' && typeof v?.estimatedAmount === 'number'
        })
        .sort((a, b) => b[1].percentage - a[1].percentage)
        .slice(0, 3)
    : []
  const isPremium = (profile.is_premium as boolean | null) ?? false

  const CATEGORY_LABELS: Record<string, string> = {
    catering:'Catering', venue:'Venue', decoration:'Dekorasi',
    documentation:'Dokumentasi', mua:'MUA', souvenir:'Souvenir',
    entertainment:'Hiburan', emergencyFund:'Dana Darurat',
  }

  return (
    <main className="min-h-screen bg-nikah-bg pb-10">
      <div className="max-w-md mx-auto px-4 py-8 space-y-4">

        {/* Header */}
        <div className="mb-2">
          <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve mb-1">Dashboard</p>
          <h1 className="text-2xl font-extrabold text-nikah-text">
            {profile.partner_one_name} & {profile.partner_two_name}
          </h1>
        </div>

        {/* Readiness score */}
        <div className="bg-white rounded-2xl p-5 border border-nikah-border shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve mb-3">Kesiapan Wedding</p>
          <div className="flex items-center gap-4">
            <div className="text-[48px] font-extrabold text-nikah-deep leading-none">{score}</div>
            <div>
              <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${LABEL_COLORS[label] ?? ''}`}>
                {label}
              </span>
              <p className="text-nikah-muted text-xs mt-1">Wedding Readiness Score</p>
            </div>
          </div>
        </div>

        {/* Countdown */}
        {days !== null && days > 0 && (
          <div className="bg-white rounded-2xl p-5 border border-nikah-border shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve mb-1">Hitung Mundur</p>
              <p className="text-nikah-muted text-sm">Hari menuju hari H</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-extrabold text-nikah-deep">{days}</div>
              <div className="text-xs text-nikah-muted">hari lagi</div>
            </div>
          </div>
        )}

        {/* Pressure */}
        <div className="bg-white rounded-2xl p-5 border border-nikah-border shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve mb-2">Tekanan Budget</p>
          <div className="flex items-center justify-between">
            <p className="text-sm text-nikah-text">Level tekanan saat ini</p>
            <span className={`font-extrabold text-sm ${PRESSURE_COLORS[pressure]}`}>{pressure}</span>
          </div>
        </div>

        {/* Budget summary */}
        {top3.length > 0 && (
          <div className="bg-white rounded-2xl p-5 border border-nikah-border shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve mb-3">Ringkasan Budget</p>
            <p className="text-nikah-muted text-xs mb-3">Total: <strong className="text-nikah-text">{formatRupiah((profile.total_budget as number | null) ?? 0)}</strong></p>
            <div className="space-y-2">
              {top3.map(([key, val]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-nikah-text">{CATEGORY_LABELS[key] ?? key}</span>
                  <div className="text-right">
                    <span className="text-sm font-bold text-nikah-text">{val.percentage}%</span>
                    <span className="text-xs text-nikah-muted ml-2">{formatRupiah(val.estimatedAmount)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tabungan Nikah */}
        <TabunganNikah
          isPremium={isPremium}
          collected={(profile.savings_collected as number | null) ?? 0}
          target={(profile.total_budget as number | null) ?? 0}
          weddingDate={(profile.wedding_date as string | null)}
        />

        {/* Checklist Pernikahan */}
        <ChecklistPernikahan
          isPremium={isPremium}
          checkedIds={(profile.checklist_checked as string[] | null) ?? []}
        />

        {/* Seserahan List */}
        <SeserahanList
          isPremium={isPremium}
          checkedIds={(profile.seserahan_checked as string[] | null) ?? []}
        />

        {/* Premium CTA — shown only to non-premium users */}
        {!isPremium && <PremiumCTA />}

        {/* Simulation shortcut */}
        <Link
          href="/result"
          className="block w-full bg-nikah-deep text-white font-bold py-4 rounded-full text-sm text-center hover:opacity-90 transition"
        >
          <span aria-hidden="true">🎛️</span> Buka Simulasi →
        </Link>

      </div>
    </main>
  )
}
