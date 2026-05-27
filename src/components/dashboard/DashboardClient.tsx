'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { useAnimatedNumber } from '@/hooks/useAnimatedNumber'
import { bucketBudget, bucketGuests, scoreBand, track } from '@/lib/analytics'
import { clearOnboardingStore } from '@/stores/onboardingStore'
import { TabunganNikah } from '@/components/dashboard/TabunganNikah'
import { ChecklistPernikahan } from '@/components/dashboard/ChecklistPernikahan'
import { SeserahanList } from '@/components/dashboard/SeserahanList'
import { DashboardNote } from '@/components/dashboard/DashboardNote'
import { VendorPaymentTracker } from '@/components/dashboard/VendorPaymentTracker'
import { CurrentPriorities } from '@/components/dashboard/CurrentPriorities'
import { buildDashboardGuidance, buildDashboardStatusCopy, type DashboardFinance, type DashboardInsight } from '@/lib/dashboardInsights'
import { buildVendorReminderSummary } from '@/lib/dashboardReminders'
import { formatRupiah, formatRupiahExact } from '@/lib/utils'
import type { PressureLevel } from '@/lib/scoring'
import type { CustomChecklistInput, CustomSeserahanInput, SavingsHistoryInput, VendorPaymentInput } from '@/lib/dashboardActions'

interface AllocEntry {
  percentage: number
  estimatedAmount: number
}

interface Props {
  userName1: string
  userName2: string
  score: number
  label: string
  pressure: PressureLevel
  days: number | null
  alloc: Record<string, AllocEntry> | null
  totalBudget: number
  guestCount: number | null
  weddingDate: string | null
  tabunganCollected: number
  savingsHistory: SavingsHistoryInput[]
  checklistChecked: string[]
  customChecklistItems: CustomChecklistInput[]
  hiddenChecklistItemIds: string[]
  seserahanChecked: string[]
  customSeserahanItems: CustomSeserahanInput[]
  hiddenSeserahanItemIds: string[]
  dashboardNote: string
  vendorPayments: VendorPaymentInput[]
}

const LABEL_COLORS: Record<string, string> = {
  Healthy: 'bg-green-100 text-green-700',
  Moderate: 'bg-orange-100 text-orange-700',
  'High Risk': 'bg-red-100 text-red-700',
}

const BAR_COLORS = ['#6E2638', '#C47986', '#B98C54', '#A87B68', '#8C4F62', '#A38C6C']
const SERIF = 'var(--font-playfair), "Cormorant Garamond", Georgia, serif'

function BudgetHealthCard({
  totalBudget,
  vendorPayments,
  tabunganCollected,
  finance,
}: {
  totalBudget: number
  vendorPayments: VendorPaymentInput[]
  tabunganCollected: number
  finance: DashboardFinance
}) {
  const STATUS_LABELS = {
    neutral: 'Mulai Catat',
    good: 'Aman',
    attention: 'Perlu Dana',
    warning: 'Ruang Tipis',
    critical: 'Melewati Budget',
  }
  const STATUS_COLORS = {
    neutral: 'bg-stone-100 text-stone-700',
    good: 'bg-green-100 text-green-700',
    attention: 'bg-orange-100 text-orange-700',
    warning: 'bg-orange-100 text-orange-700',
    critical: 'bg-red-100 text-red-700',
  }
  const status = finance.status
  const barColor = status === 'critical' ? '#B42318' : status === 'warning' ? '#B98C54' : '#6E2638'
  const safeBarPercentage = Math.min(100, Math.max(0, finance.commitmentPercent))
  const headline = status === 'critical'
    ? {
        value: formatRupiahExact(Math.abs(finance.budgetRoom)),
        label: 'Melewati budget',
        color: '#B42318',
      }
    : {
        value: formatRupiahExact(Math.max(0, finance.budgetRoom)),
        label: 'Sisa ruang budget',
        color: 'var(--nikah-deep)',
      }
  const summaryText = vendorPayments.length === 0
    ? 'Catat biaya vendor yang sudah diketahui agar ruang budget ini makin akurat.'
    : finance.savingsGap > 0
      ? `Tagihan belum dibayar lebih besar ${formatRupiahExact(finance.savingsGap)} dari tabungan tersedia.`
      : finance.vendorOutstanding > 0
        ? 'Tabungan saat ini cukup untuk menutup tagihan vendor yang belum lunas.'
        : 'Semua tagihan vendor yang dicatat sudah lunas.'

  return (
    <div
      className="bg-white border border-nikah-border"
      style={{ borderRadius: 'var(--d-radius)', padding: '20px 22px', boxShadow: '0 4px 20px rgba(90,30,42,0.06)' }}
    >
      <div className="flex items-center justify-between" style={{ marginBottom: 14 }}>
        <span className="text-[11px] font-extrabold uppercase tracking-[0.13em] text-nikah-mauve">Kondisi Budget</span>
        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${STATUS_COLORS[status]}`}>
          {STATUS_LABELS[status]}
        </span>
      </div>

      <p className="text-nikah-muted font-bold uppercase" style={{ fontSize: 9.5, letterSpacing: '0.12em', margin: '0 0 4px' }}>
        Total budget nikah
      </p>
      <div className="text-nikah-deep" style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 500, fontSize: 26, lineHeight: 1.1, marginBottom: 14 }}>
        {formatRupiahExact(totalBudget)}
      </div>

      <div className="bg-nikah-bg" style={{ borderRadius: 14, padding: '13px 14px', marginBottom: 14 }}>
        <div style={{ color: headline.color, fontFamily: SERIF, fontStyle: 'italic', fontWeight: 500, fontSize: 30, lineHeight: 1.05 }}>
          {headline.value}
        </div>
        <div className="text-nikah-muted font-bold uppercase" style={{ fontSize: 10, letterSpacing: '0.12em', marginTop: 5 }}>
          {headline.label}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3" style={{ gap: 12, marginBottom: 14 }}>
        {[
          { val: formatRupiahExact(finance.vendorCommitted), lbl: 'Komitmen' },
          { val: formatRupiahExact(finance.vendorOutstanding), lbl: 'Belum dibayar' },
          { val: formatRupiahExact(tabunganCollected), lbl: 'Tabungan' },
        ].map(item => (
          <div key={item.lbl}>
            <div className="font-extrabold text-nikah-deep tabular-nums" style={{ fontSize: 12.5, lineHeight: 1.2 }}>
              {item.val}
            </div>
            <div className="text-nikah-muted font-bold uppercase" style={{ fontSize: 9, letterSpacing: '0.08em', marginTop: 4 }}>
              {item.lbl}
            </div>
          </div>
        ))}
      </div>

      <div className="w-full bg-nikah-border rounded-full overflow-hidden" style={{ height: 6, marginBottom: 6 }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${safeBarPercentage}%`, background: `linear-gradient(90deg, ${barColor}99, ${barColor})` }}
        />
      </div>
      <p className="text-nikah-muted" style={{ fontSize: 11.5, lineHeight: 1.45, margin: 0 }}>
        {vendorPayments.length > 0 && `${finance.commitmentPercent}% budget terikat ke ${vendorPayments.length} vendor. `}
        {summaryText}
      </p>
    </div>
  )
}

function DashboardGuidanceCard({ insights }: { insights: DashboardInsight[] }) {
  const KIND_STYLES = {
    good: { background: '#F0FDF4', border: '#BBF7D0', text: '#166534' },
    info: { background: '#FBF6F1', border: '#E8DACF', text: 'var(--nikah-deep)' },
    warning: { background: '#FFFBEB', border: '#FDE68A', text: '#92400E' },
    critical: { background: '#FEF2F2', border: '#FECACA', text: '#991B1B' },
  }
  const primary = insights[0]

  if (!primary) return null

  return (
    <div className="bg-white border border-nikah-border shadow-sm" style={{ borderRadius: 'var(--d-radius)', padding: 20 }}>
      <CardTitle>Langkah Terbaik Berikutnya</CardTitle>
      <div className="grid" style={{ gap: 9, marginTop: 14, marginBottom: 16 }}>
        {insights.map((insight, index) => {
          const style = KIND_STYLES[insight.kind]
          return (
            <div
              key={insight.title}
              style={{
                background: style.background,
                border: `1px solid ${style.border}`,
                borderRadius: 12,
                padding: index === 0 ? '12px 13px' : '10px 12px',
              }}
            >
              <div style={{ color: style.text, fontSize: 13, fontWeight: 800, lineHeight: 1.35 }}>
                {insight.title}
              </div>
              <p className="text-nikah-muted" style={{ fontSize: 12, lineHeight: 1.45, margin: '4px 0 0' }}>
                {insight.body}
              </p>
            </div>
          )
        })}
      </div>
      <a
        href={primary.href}
        className="w-full inline-flex items-center justify-center bg-nikah-deep text-white font-bold rounded-full text-sm active:scale-[0.97] active:brightness-90 transition-all"
        style={{ padding: '12px 16px' }}
      >
        {primary.actionLabel}
      </a>
    </div>
  )
}

function getTimeGreeting(): string {
  const hour = new Date().getHours()
  if (hour >= 4  && hour < 11) return 'Selamat pagi,'
  if (hour >= 11 && hour < 15) return 'Selamat siang,'
  if (hour >= 15 && hour < 19) return 'Selamat sore,'
  return 'Selamat malam,'
}

function ScoreRing({ score }: { score: number }) {
  const animatedRingScore = useAnimatedNumber(score, { duration: 700 })
  const pct = Math.min(100, Math.max(0, animatedRingScore))

  return (
    <div
      style={{
        width: 92,
        height: 92,
        borderRadius: '50%',
        background: `radial-gradient(circle at center, var(--landing-card-elev, #fff) 58%, transparent 59%), conic-gradient(var(--landing-deep, var(--nikah-deep)) 0% ${pct}%, #EEDCE0 ${pct}% 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <div
        className="text-center bg-white rounded-full flex flex-col items-center justify-center"
        style={{ width: 68, height: 68, boxShadow: 'inset 0 0 0 1px var(--landing-border, var(--nikah-border))' }}
      >
        <div
          className="leading-none text-nikah-deep"
          style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 32, fontWeight: 500 }}
        >
          {score}
        </div>
      </div>
    </div>
  )
}

function CardTitle({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <span className="text-[11px] font-extrabold uppercase tracking-[0.13em] text-nikah-mauve">
      {children}
    </span>
  )
}

function MobileScoreStrip({ score, label, copy }: { score: number; label: string; copy: string }) {
  return (
    <Link
      href="/dashboard/summary"
      className="flex items-center bg-white border border-nikah-border active:scale-[0.985] active:brightness-95 transition-all"
      style={{ borderRadius: 'var(--d-radius)', padding: '16px 18px', gap: 14, boxShadow: '0 2px 12px rgba(90,30,42,0.05)', textDecoration: 'none' }}
    >
      <div
        style={{
          width: 46,
          height: 46,
          borderRadius: '50%',
          background: `radial-gradient(circle at center, white 55%, transparent 56%), conic-gradient(var(--nikah-deep) 0% ${score}%, #EEDCE0 ${score}% 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <span style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 500, fontSize: 17, color: 'var(--nikah-deep)' }}>
          {score}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center" style={{ gap: 8, marginBottom: 4 }}>
          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold ${LABEL_COLORS[label] ?? ''}`}>
            {label}
          </span>
          <span className="text-nikah-muted font-bold uppercase" style={{ fontSize: 10, letterSpacing: '0.1em' }}>
            Rencana budget
          </span>
        </div>
        <p className="text-nikah-muted" style={{ fontSize: 13, lineHeight: 1.4, margin: 0 }}>
          {copy}
        </p>
      </div>
      <ChevronRight size={18} className="text-nikah-muted flex-shrink-0" />
    </Link>
  )
}

function formatTimeLeft(days: number | null) {
  if (days === null || days <= 0) return null
  if (days < 30) return 'kurang 1 bulan'
  return `${Math.ceil(days / 30)} bulan`
}

export function DashboardClient({
  userName1,
  userName2,
  score,
  label,
  days,
  alloc,
  totalBudget,
  guestCount,
  weddingDate,
  tabunganCollected,
  savingsHistory,
  checklistChecked,
  customChecklistItems,
  hiddenChecklistItemIds,
  seserahanChecked,
  customSeserahanItems,
  hiddenSeserahanItemIds,
  dashboardNote,
  vendorPayments,
}: Props) {
  const router = useRouter()
  // Inisialisasi hanya di client agar tidak menyebabkan hydration mismatch
  // akibat perbedaan timezone server (UTC) vs device user (WIB/WITA/WIT).
  const [greeting, setGreeting] = useState('')
  const [isResetting, setIsResetting] = useState(false)
  const [liveSavings, setLiveSavings] = useState(tabunganCollected)
  const [liveChecklistChecked, setLiveChecklistChecked] = useState(checklistChecked)
  const [liveHiddenChecklistItemIds, setLiveHiddenChecklistItemIds] = useState(hiddenChecklistItemIds)
  const [liveVendorPayments, setLiveVendorPayments] = useState(vendorPayments)
  const [vendorFocusRequest, setVendorFocusRequest] = useState<{ vendorId: string; requestId: number } | null>(null)
  const [checklistFocusRequest, setChecklistFocusRequest] = useState<{ checklistId: string; requestId: number } | null>(null)

  function handleSelectVendor(vendorId: string) {
    setVendorFocusRequest(current => ({
      vendorId,
      requestId: (current?.requestId ?? 0) + 1,
    }))
  }

  function handleSelectChecklist(checklistId: string) {
    setChecklistFocusRequest(current => ({
      checklistId,
      requestId: (current?.requestId ?? 0) + 1,
    }))
  }

  async function handleResetPlan() {
    setIsResetting(true)
    track('dashboard_feature_used', {
      feature: 'plan_data',
      action: 'reset_from_dashboard',
    })
    await clearOnboardingStore()
    router.push('/onboarding')
  }

  useEffect(() => {
    setGreeting(getTimeGreeting())
  }, [])

  useEffect(() => {
    track('dashboard_viewed', {
      score_band: scoreBand(score),
      budget_bucket: bucketBudget(totalBudget),
      guest_bucket: bucketGuests(guestCount),
      has_wedding_date: Boolean(weddingDate),
    })
  }, [score, totalBudget, guestCount, weddingDate])

  // Sebaran aktual: agregasi total vendor per kategori
  const spendByCategory: Record<string, number> = {}
  liveVendorPayments.forEach(v => {
    if (v.category) {
      spendByCategory[v.category] = (spendByCategory[v.category] ?? 0) + v.totalAmount
    }
  })
  const spreadEntries = Object.entries(spendByCategory)
    .filter(([, amount]) => amount > 0)
    .sort((a, b) => b[1] - a[1])
  const totalCommitted = spreadEntries.reduce((sum, [, amt]) => sum + amt, 0)

  const weddingDateText = weddingDate
    ? new Date(weddingDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    : null
  const timeLeftText = formatTimeLeft(days)
  const guidance = buildDashboardGuidance({
    totalBudget,
    savingsCollected: liveSavings,
    vendorPayments: liveVendorPayments,
    allocation: alloc,
    weddingDate,
  })
  const statusCopy = buildDashboardStatusCopy({
    score,
    days,
    finance: guidance.finance,
    reminders: buildVendorReminderSummary(liveVendorPayments),
  })

  const OverviewCard = (
    <div
      className="bg-white border border-nikah-border shadow-sm overflow-hidden"
      style={{ borderRadius: 'var(--d-radius)', padding: 24, boxShadow: '0 12px 34px rgba(90, 30, 42, 0.055)' }}
    >
      <div className="flex items-center justify-between" style={{ marginBottom: 17 }}>
        <CardTitle>Kelayakan Rencana Budget</CardTitle>
        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${LABEL_COLORS[label] ?? ''}`}>
          {label}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] items-center" style={{ gap: 18 }}>
        <ScoreRing score={score} />
        <div>
          <h2
            className="text-nikah-text"
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontWeight: 500,
              fontSize: 22,
              lineHeight: 1.22,
              margin: '0 0 8px',
            }}
          >
            {statusCopy.readinessTitle}
          </h2>
          <p className="text-nikah-muted" style={{ fontSize: 13, lineHeight: 1.5, margin: 0 }}>
            {statusCopy.readinessCopy}
          </p>
        </div>
      </div>
      <div style={{ height: 1, background: 'var(--landing-border, var(--nikah-border))', margin: '20px 0 14px' }} />
      <div className="grid grid-cols-3 text-center" style={{ gap: 10 }}>
        {[
          { val: formatRupiah(totalBudget), lbl: 'Estimasi' },
          ...(guestCount ? [{ val: String(guestCount), lbl: 'Undangan' }] : []),
          ...(timeLeftText ? [{ val: timeLeftText.replace(' bulan', ' bln'), lbl: 'Sisa' }] : []),
        ].map(s => (
          <div key={s.lbl}>
            <div
              className="text-nikah-deep"
              style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 18, lineHeight: 1.05 }}
            >
              {s.val}
            </div>
            <div className="text-nikah-muted uppercase font-bold" style={{ fontSize: 10, letterSpacing: '0.12em', marginTop: 4 }}>
              {s.lbl}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const AllocationCard = (
    <div className="bg-white border border-nikah-border shadow-sm" style={{ borderRadius: 'var(--d-radius)', padding: 24 }}>
      <div style={{ marginBottom: 4 }}>
        <CardTitle>Sebaran Budget</CardTitle>
      </div>
      <p className="text-nikah-muted" style={{ fontSize: 11, marginBottom: spreadEntries.length > 0 ? 16 : 10, lineHeight: 1.4 }}>
        Berdasarkan vendor yang sudah dicatat
      </p>
      {spreadEntries.length > 0 ? (
        <div className="grid" style={{ gap: 13 }}>
          {spreadEntries.map(([category, amount], idx) => {
            const pct      = totalBudget > 0 ? Math.min(100, Math.round((amount / totalBudget) * 100)) : 0
            const barColor = BAR_COLORS[idx % BAR_COLORS.length]
            return (
              <div key={category}>
                <div className="flex items-baseline justify-between" style={{ marginBottom: 5, gap: 8 }}>
                  <span className="font-bold text-nikah-text" style={{ fontSize: 13 }}>
                    {category}
                  </span>
                  <div className="flex items-baseline flex-shrink-0" style={{ gap: 6 }}>
                    <span className="text-nikah-muted tabular-nums" style={{ fontSize: 12 }}>
                      {formatRupiah(amount)}
                    </span>
                    <span className="font-bold text-nikah-deep" style={{ fontSize: 11 }}>
                      {pct}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-nikah-border rounded-full overflow-hidden" style={{ height: 5 }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, backgroundColor: barColor }}
                  />
                </div>
              </div>
            )
          })}
          <div style={{ borderTop: '1px solid var(--nikah-border)', paddingTop: 10, marginTop: 2 }}>
            <div className="flex items-center justify-between">
              <span className="text-nikah-muted" style={{ fontSize: 11 }}>Total dicatat</span>
              <div>
                <span className="font-bold text-nikah-deep" style={{ fontSize: 13 }}>
                  {formatRupiah(totalCommitted)}
                </span>
                <span className="text-nikah-muted" style={{ fontSize: 11 }}>
                  {' '}dari {formatRupiah(totalBudget)}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-sm text-nikah-muted" style={{ margin: 0 }}>
          Tambah vendor untuk melihat sebaran budget per kategori.
        </p>
      )}
    </div>
  )

  return (
    <>
      <div className="max-w-[1200px] mx-auto" style={{ padding: '36px var(--d-pad-page) 26px' }}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] items-end" style={{ gap: 24 }}>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve" style={{ marginBottom: 8 }}>
              {greeting}
            </p>
            <h1
              className="text-nikah-text"
              style={{
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontWeight: 500,
                fontSize: 'clamp(30px, 7vw, 58px)',
                letterSpacing: '-0.025em',
                lineHeight: 1.05,
                margin: '0 0 12px',
              }}
            >
              {userName1} &amp; {userName2}
            </h1>
            <div className="flex flex-col" style={{ gap: 8 }}>
              {timeLeftText && weddingDateText && (
                <div
                  className="inline-flex items-center bg-white border border-nikah-border"
                  style={{ borderRadius: 999, padding: '7px 16px', gap: 9 }}
                >
                  <span
                    aria-hidden="true"
                    style={{ width: 8, height: 8, borderRadius: '50%', background: '#C16E73', flexShrink: 0 }}
                  />
                  <span className="font-bold text-nikah-text" style={{ fontSize: 13.5 }}>
                    {weddingDateText}
                  </span>
                  <span className="text-nikah-muted" style={{ fontSize: 13 }}>
                    · {timeLeftText} lagi
                  </span>
                </div>
              )}
              {(() => {
                return statusCopy.countdownNote ? (
                  <p className="text-nikah-muted" style={{ fontSize: 13.5, lineHeight: 1.45, margin: 0 }}>
                    {statusCopy.countdownNote}
                  </p>
                ) : null
              })()}
            </div>
          </div>
          <div id="dashboard-actions" className="hidden lg:flex flex-wrap items-center justify-start lg:justify-end" style={{ gap: 10 }}>
            <Link
              href="/dashboard/summary"
              className="inline-flex items-center justify-center bg-nikah-deep text-white font-bold rounded-full text-sm text-center hover:opacity-90 transition-all active:scale-[0.97] active:brightness-90"
              style={{ padding: '13px 24px' }}
            >
              Lihat Ringkasan
            </Link>
            <button
              type="button"
              onClick={handleResetPlan}
              disabled={isResetting}
              className="hidden lg:inline-flex items-center justify-center border border-nikah-border bg-white text-nikah-deep font-bold rounded-full text-sm text-center hover:bg-nikah-bg transition-all active:scale-[0.97] active:brightness-90 disabled:opacity-60"
              style={{ padding: '13px 24px' }}
            >
              {isResetting ? 'Membuka...' : 'Atur Ulang Data'}
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-[1200px] mx-auto" style={{ padding: '0 var(--d-pad-page) 40px' }}>
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]" style={{ gap: 20, marginBottom: 20 }}>
          <BudgetHealthCard
            totalBudget={totalBudget}
            vendorPayments={liveVendorPayments}
            tabunganCollected={liveSavings}
            finance={guidance.finance}
          />
          <div className="hidden lg:block">{OverviewCard}</div>
        </div>

        <div className="lg:hidden" style={{ marginBottom: 20 }}>
          <MobileScoreStrip score={score} label={label} copy={statusCopy.mobileReadinessCopy} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.7fr_1fr]" style={{ gap: 20, marginBottom: 22 }}>
          <div>
            <DashboardGuidanceCard insights={guidance.insights} />
          </div>
          <div>
            <CurrentPriorities
              days={days}
              checkedIds={liveChecklistChecked}
              vendorPayments={liveVendorPayments}
              hiddenChecklistItemIds={liveHiddenChecklistItemIds}
              onSelectVendor={handleSelectVendor}
              onSelectChecklist={handleSelectChecklist}
            />
          </div>
        </div>

        <div className="flex flex-col">
          <p className="order-1 text-xs font-extrabold uppercase tracking-[0.18em] text-nikah-mauve border-l-[3px] border-nikah-mauve pl-3" style={{ margin: '0 0 14px' }}>
            <span className="lg:hidden">Dana &amp; Pembayaran</span>
            <span className="hidden lg:inline">Dana &amp; Pembayaran</span>
          </p>
          <div className="order-2 grid grid-cols-1 lg:grid-cols-2" style={{ gap: 20, marginBottom: 20, alignItems: 'start' }}>
            <div id="savings">
              <TabunganNikah collected={tabunganCollected} target={totalBudget} weddingDate={weddingDate} history={savingsHistory} onSaved={setLiveSavings} />
            </div>
            <div id="vendor-payments">
              <VendorPaymentTracker
                initialPayments={vendorPayments}
                onSaved={setLiveVendorPayments}
                focusRequest={vendorFocusRequest}
              />
            </div>
          </div>

          <div className="order-3 lg:order-5" style={{ marginBottom: 28 }}>
            <DashboardNote initialNote={dashboardNote} />
          </div>

          <p className="order-4 lg:order-3 text-xs font-extrabold uppercase tracking-[0.18em] text-nikah-mauve border-l-[3px] border-nikah-mauve pl-3" style={{ margin: '0 0 14px' }}>
            <span className="lg:hidden">Persiapan &amp; Referensi</span>
            <span className="hidden lg:inline">Tugas &amp; Referensi</span>
          </p>
          <div className="order-5 lg:order-4 grid grid-cols-1 lg:grid-cols-[1.08fr_0.92fr]" style={{ gap: 20, marginBottom: 28, alignItems: 'start' }}>
            <div id="checklist">
              <ChecklistPernikahan
                checkedIds={checklistChecked}
                days={days}
                customItems={customChecklistItems}
                hiddenDefaultIds={hiddenChecklistItemIds}
                onSaved={setLiveChecklistChecked}
                onHiddenItemsSaved={setLiveHiddenChecklistItemIds}
                focusRequest={checklistFocusRequest}
              />
            </div>
            <div className="grid" style={{ gap: 20 }}>
              <SeserahanList checkedIds={seserahanChecked} customItems={customSeserahanItems} hiddenDefaultIds={hiddenSeserahanItemIds} />
              <div id="allocation">{AllocationCard}</div>
            </div>
          </div>

          {/* Mobile: bottom action buttons */}
          <div className="order-6 flex flex-col lg:hidden" style={{ marginTop: 0, gap: 10 }}>
            <Link
              href="/dashboard/summary"
              className="w-full inline-flex items-center justify-center bg-nikah-deep text-white font-bold rounded-full text-sm active:scale-[0.97] active:brightness-90 transition-all"
              style={{ padding: '15px 24px' }}
            >
              Lihat Ringkasan
            </Link>
            <button
              type="button"
              onClick={handleResetPlan}
              disabled={isResetting}
              className="w-full inline-flex items-center justify-center border border-nikah-border bg-white text-nikah-deep font-bold rounded-full text-sm active:scale-[0.97] active:brightness-90 transition-all"
              style={{ padding: '15px 24px' }}
            >
              {isResetting ? 'Membuka...' : 'Atur Ulang Data'}
            </button>
          </div>
        </div>
      </main>
    </>
  )
}
