'use client'

import Link from 'next/link'
import { useEffect, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAnimatedNumber } from '@/hooks/useAnimatedNumber'
import { bucketBudget, bucketGuests, scoreBand, track } from '@/lib/analytics'
import { clearOnboardingStore } from '@/stores/onboardingStore'
import { TabunganNikah } from '@/components/dashboard/TabunganNikah'
import { ChecklistPernikahan } from '@/components/dashboard/ChecklistPernikahan'
import { SeserahanList } from '@/components/dashboard/SeserahanList'
import { DashboardNote } from '@/components/dashboard/DashboardNote'
import { VendorPaymentTracker } from '@/components/dashboard/VendorPaymentTracker'
import { CurrentPriorities } from '@/components/dashboard/CurrentPriorities'
import { DashboardActivityTimeline } from '@/components/dashboard/DashboardActivityTimeline'
import { DashboardMinimizableSection } from '@/components/dashboard/DashboardMinimizableSection'
import {
  buildDashboardGuidance,
  buildDashboardStatusCopy,
  calculateDashboardChecklistProgress,
  calculateDashboardReadiness,
  type DashboardFinance,
} from '@/lib/dashboardInsights'
import { buildDashboardActivities } from '@/lib/dashboardActivity'
import { buildVendorReminderSummary } from '@/lib/dashboardReminders'
import { calculateMonthlySavings, monthsUntilDate } from '@/lib/savings'
import { SESERAHAN_ITEMS } from '@/lib/seserahanItems'
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
  finance,
}: {
  totalBudget: number
  vendorPayments: VendorPaymentInput[]
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

      <div className="grid grid-cols-2" style={{ gap: 12, marginBottom: 14 }}>
        {[
          { val: formatRupiahExact(finance.vendorCommitted), lbl: 'Komitmen' },
          { val: formatRupiahExact(finance.vendorOutstanding), lbl: 'Belum dibayar' },
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

function SavingsSummaryCard({
  collected,
  target,
  weddingDate,
}: {
  collected: number
  target: number
  weddingDate: string | null
}) {
  const months = monthsUntilDate(weddingDate)
  const monthly = calculateMonthlySavings(target, collected, months)
  const progress = target > 0 ? Math.min(100, Math.round((collected / target) * 100)) : 0
  const onTrack = progress >= 100 || monthly <= 0
  const remaining = Math.max(0, target - collected)

  return (
    <div
      className="bg-white border border-nikah-border"
      style={{ borderRadius: 'var(--d-radius)', padding: '20px 22px', boxShadow: '0 4px 20px rgba(90,30,42,0.06)' }}
    >
      <div className="flex items-center justify-between" style={{ marginBottom: 14 }}>
        <CardTitle>Dana Terkumpul</CardTitle>
        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${onTrack ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
          {onTrack ? 'Sesuai jalur' : 'Perlu dikejar'}
        </span>
      </div>

      <p className="text-nikah-muted font-bold uppercase" style={{ fontSize: 9.5, letterSpacing: '0.12em', margin: '0 0 4px' }}>
        Total terkumpul
      </p>
      <div className="text-nikah-deep" style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 500, fontSize: 26, lineHeight: 1.1, marginBottom: 14 }}>
        {formatRupiahExact(collected)}
      </div>

      <div className="bg-nikah-bg" style={{ borderRadius: 14, padding: '13px 14px', marginBottom: 14 }}>
        <div style={{ color: 'var(--nikah-mauve)', fontFamily: SERIF, fontStyle: 'italic', fontWeight: 500, fontSize: 30, lineHeight: 1.05 }}>
          {onTrack ? 'Target tercapai' : `${formatRupiahExact(monthly)}/bln`}
        </div>
        <div className="text-nikah-muted font-bold uppercase" style={{ fontSize: 10, letterSpacing: '0.12em', marginTop: 5 }}>
          {onTrack ? `${progress}% dari target` : weddingDate ? `selama ${months} bln lagi` : 'estimasi 12 bulan'}
        </div>
      </div>

      <div className="w-full bg-nikah-border rounded-full overflow-hidden" style={{ height: 6, marginBottom: 6 }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #C4798699, #C47986)' }}
        />
      </div>
      <p className="text-nikah-muted" style={{ fontSize: 11.5, lineHeight: 1.45, margin: 0 }}>
        {onTrack
          ? `Tabungan sudah menutup target ${formatRupiahExact(target)}.`
          : `Sisa ${formatRupiahExact(remaining)} menuju target ${formatRupiahExact(target)}.`}
      </p>
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

function SectionHeader({ label, sub, spaced = false }: { label: string; sub: string; spaced?: boolean }) {
  return (
    <div className={`hidden lg:block ${spaced ? 'lg:mt-3' : ''}`}>
      <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-nikah-mauve" style={{ margin: 0 }}>
        {label}
      </p>
      <p className="text-nikah-muted" style={{ fontSize: 12, lineHeight: 1.45, margin: '6px 0 0' }}>
        {sub}
      </p>
    </div>
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
  const [layoutMode, setLayoutMode] = useState<'band' | 'sidebar'>('band')
  const [liveSavings, setLiveSavings] = useState(tabunganCollected)
  const [liveSavingsHistory, setLiveSavingsHistory] = useState(savingsHistory)
  const [liveChecklistChecked, setLiveChecklistChecked] = useState(checklistChecked)
  const [liveCustomChecklistItems, setLiveCustomChecklistItems] = useState(customChecklistItems)
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
    const saved = localStorage.getItem('budgetnikah:dashboard:layout:v1')
    if (saved === 'sidebar') setLayoutMode('sidebar')
  }, [])

  function handleLayoutMode(mode: 'band' | 'sidebar') {
    setLayoutMode(mode)
    localStorage.setItem('budgetnikah:dashboard:layout:v1', mode)
  }

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
  const reminders = buildVendorReminderSummary(liveVendorPayments)
  const checklistProgress = calculateDashboardChecklistProgress({
    checkedIds: liveChecklistChecked,
    customChecklistItems: liveCustomChecklistItems,
    hiddenChecklistItemIds: liveHiddenChecklistItemIds,
  })
  const readiness = calculateDashboardReadiness({
    baseScore: score,
    finance: guidance.finance,
    reminders,
    checklist: checklistProgress,
    days,
  })
  const statusCopy = buildDashboardStatusCopy({
    score: readiness.score,
    days,
    finance: guidance.finance,
    reminders,
  })
  const activityItems = buildDashboardActivities({
    savingsHistory: liveSavingsHistory,
    vendorPayments: liveVendorPayments,
    checklistProgress,
  })

  // Actionable summary untuk kartu Kesiapan (gabungan dari checklist, vendor,
  // seserahan, dan kelengkapan data). Semua angka diturunkan dari data live.
  const checklistRemaining = Math.max(0, readiness.checklistProgress.total - readiness.checklistProgress.completed)
  const unpaidVendorCount = liveVendorPayments.filter(v => v.totalAmount > v.paidAmount).length
  const seserahanHiddenSet = new Set(hiddenSeserahanItemIds)
  const seserahanVisibleDefaultIds = SESERAHAN_ITEMS.filter(item => !seserahanHiddenSet.has(item.id)).map(item => item.id)
  const seserahanCheckedSet = new Set(seserahanChecked)
  const seserahanTotal = seserahanVisibleDefaultIds.length + customSeserahanItems.length
  const seserahanCompleted = [...seserahanVisibleDefaultIds, ...customSeserahanItems.map(item => item.id)]
    .filter(id => seserahanCheckedSet.has(id)).length
  const seserahanRemaining = Math.max(0, seserahanTotal - seserahanCompleted)

  const readinessActions: string[] = []
  if (checklistRemaining > 0) readinessActions.push(`${checklistRemaining} checklist belum selesai`)
  if (unpaidVendorCount > 0) readinessActions.push(`${unpaidVendorCount} vendor belum lunas`)
  if (seserahanRemaining > 0) readinessActions.push(`${seserahanRemaining} seserahan belum final`)
  if (!weddingDate) readinessActions.push('Tanggal nikah belum dilengkapi')
  else if (totalBudget <= 0) readinessActions.push('Total budget belum diisi')
  else if (liveVendorPayments.length === 0) readinessActions.push('Vendor belum dicatat')
  const topReadinessActions = readinessActions.slice(0, 4)

  const primaryInsight = guidance.insights[0]

  // Chip status ringkas di hero — diturunkan dari data yang sama dengan kartu KPI.
  const savingsProgress = totalBudget > 0 ? Math.min(100, Math.round((liveSavings / totalBudget) * 100)) : 0
  const budgetStatusChip = {
    neutral: 'Mulai catat',
    good: 'Budget aman',
    attention: 'Perlu dana',
    warning: 'Ruang tipis',
    critical: 'Lewat budget',
  }[guidance.finance.status]
  const statusDotColor = {
    neutral: '#A8A29E',
    good: '#2F7A3F',
    attention: '#B98C54',
    warning: '#B98C54',
    critical: '#B42318',
  }[guidance.finance.status]
  // Cerminkan jumlah item yang ditampilkan kartu Prioritas (maks 4).
  const priorityCount = Math.min(4, unpaidVendorCount + checklistRemaining)

  useEffect(() => {
    track('dashboard_viewed', {
      score_band: scoreBand(readiness.score),
      budget_bucket: bucketBudget(totalBudget),
      guest_bucket: bucketGuests(guestCount),
      has_wedding_date: Boolean(weddingDate),
    })
  }, [readiness.score, totalBudget, guestCount, weddingDate])

  const OverviewCard = (
    <div
      className="bg-white border border-nikah-border flex flex-col"
      style={{ borderRadius: 'var(--d-radius)', padding: '20px 22px', boxShadow: '0 4px 20px rgba(90,30,42,0.06)' }}
    >
      <div className="flex items-center justify-between" style={{ marginBottom: 14 }}>
        <CardTitle>Kesiapan Dashboard</CardTitle>
        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${LABEL_COLORS[readiness.label] ?? ''}`}>
          {readiness.label}
        </span>
      </div>
      <div className="grid grid-cols-[auto_1fr] items-center" style={{ gap: 16 }}>
        <ScoreRing score={readiness.score} />
        <div>
          <h2
            className="text-nikah-text"
            style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 500, fontSize: 19, lineHeight: 1.25, margin: '0 0 6px' }}
          >
            {statusCopy.readinessTitle}
          </h2>
          <p className="text-nikah-muted" style={{ fontSize: 12.5, lineHeight: 1.45, margin: 0 }}>
            {statusCopy.readinessCopy}
          </p>
        </div>
      </div>

      <div style={{ height: 1, background: 'var(--nikah-border)', margin: '16px 0 14px' }} />

      {topReadinessActions.length > 0 ? (
        <>
          <p className="text-nikah-muted font-bold uppercase" style={{ fontSize: 9.5, letterSpacing: '0.12em', margin: '0 0 10px' }}>
            Yang perlu dirapikan
          </p>
          <div className="grid" style={{ gap: 8 }}>
            {topReadinessActions.map(action => (
              <div key={action} className="flex items-center" style={{ gap: 10 }}>
                <span aria-hidden="true" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--nikah-mauve)', flexShrink: 0 }} />
                <span className="font-bold text-nikah-text" style={{ fontSize: 13, lineHeight: 1.35 }}>{action}</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-nikah-muted" style={{ fontSize: 13, lineHeight: 1.5, margin: 0 }}>
          Semua bagian utama sudah rapi. Pertahankan ritme tabungan dan checklist kalian.
        </p>
      )}

      {primaryInsight && (
        <a
          href={primaryInsight.href}
          className="inline-flex items-center justify-center bg-nikah-deep text-white font-bold rounded-full text-sm active:scale-[0.97] active:brightness-90 transition-all"
          style={{ padding: '11px 16px', marginTop: 16 }}
        >
          {primaryInsight.actionLabel}
        </a>
      )}
    </div>
  )

  function renderAllocationCard(headerAction?: ReactNode) {
    return (
    <div className="bg-white border border-nikah-border shadow-sm" style={{ borderRadius: 'var(--d-radius)', padding: 24 }}>
      <div className="flex items-start justify-between" style={{ gap: 12, marginBottom: 4 }}>
        <CardTitle>Sebaran Budget</CardTitle>
        {headerAction}
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
  }

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
            <div className="flex flex-col" style={{ gap: 12 }}>
              <div className="flex flex-wrap items-center" style={{ gap: 8 }}>
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
                {[
                  { label: budgetStatusChip, dot: statusDotColor },
                  { label: `Dana ${savingsProgress}%`, dot: null },
                  { label: `Skor ${readiness.score}`, dot: null },
                  ...(priorityCount > 0 ? [{ label: `${priorityCount} prioritas`, dot: '#C16E73' }] : []),
                ].map(chip => (
                  <span
                    key={chip.label}
                    className="inline-flex items-center bg-white border border-nikah-border font-bold text-nikah-text"
                    style={{ borderRadius: 999, padding: '7px 14px', fontSize: 12.5, gap: 7 }}
                  >
                    {chip.dot && (
                      <span aria-hidden="true" style={{ width: 7, height: 7, borderRadius: '50%', background: chip.dot, flexShrink: 0 }} />
                    )}
                    {chip.label}
                  </span>
                ))}
              </div>
              {statusCopy.countdownNote && (
                <p className="text-nikah-muted" style={{ fontSize: 13.5, lineHeight: 1.45, margin: 0 }}>
                  {statusCopy.countdownNote}
                </p>
              )}
            </div>
          </div>
          <div id="dashboard-actions" className="hidden lg:flex flex-wrap items-center justify-start lg:justify-end" style={{ gap: 10 }}>
            {/* Layout toggle */}
            <div
              className="inline-flex items-center border border-nikah-border bg-white"
              style={{ borderRadius: 999, padding: 3, gap: 2 }}
              title="Pilih tampilan dashboard"
            >
              <button
                type="button"
                onClick={() => handleLayoutMode('band')}
                title="Prioritas melebar penuh"
                aria-pressed={layoutMode === 'band'}
                className="transition-all active:scale-[0.95]"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 30, height: 30, borderRadius: 999,
                  background: layoutMode === 'band' ? 'var(--nikah-deep)' : 'transparent',
                  border: 0, cursor: 'pointer',
                }}
              >
                {/* icon: 3 baris horizontal (band layout) */}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="1" y="2" width="12" height="2.5" rx="1" fill={layoutMode === 'band' ? '#fff' : 'var(--nikah-muted)'} />
                  <rect x="1" y="6" width="12" height="2.5" rx="1" fill={layoutMode === 'band' ? '#fff' : 'var(--nikah-muted)'} />
                  <rect x="1" y="10" width="12" height="2.5" rx="1" fill={layoutMode === 'band' ? '#fff' : 'var(--nikah-muted)'} />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => handleLayoutMode('sidebar')}
                title="Prioritas di sidebar"
                aria-pressed={layoutMode === 'sidebar'}
                className="transition-all active:scale-[0.95]"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 30, height: 30, borderRadius: 999,
                  background: layoutMode === 'sidebar' ? 'var(--nikah-deep)' : 'transparent',
                  border: 0, cursor: 'pointer',
                }}
              >
                {/* icon: 2 kolom (sidebar layout) */}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="1" y="2" width="7" height="10" rx="1" fill={layoutMode === 'sidebar' ? '#fff' : 'var(--nikah-muted)'} />
                  <rect x="10" y="2" width="3" height="10" rx="1" fill={layoutMode === 'sidebar' ? '#fff' : 'var(--nikah-muted)'} />
                </svg>
              </button>
            </div>
            <Link
              href="/dashboard/summary"
              className="inline-flex items-center justify-center border border-nikah-border bg-white text-nikah-deep font-bold rounded-full text-center hover:bg-nikah-bg transition-all active:scale-[0.97] active:brightness-90"
              style={{ padding: '10px 18px', fontSize: 13 }}
            >
              Lihat Ringkasan
            </Link>
            <button
              type="button"
              onClick={handleResetPlan}
              disabled={isResetting}
              className="hidden lg:inline-flex items-center justify-center text-nikah-muted font-bold rounded-full text-center hover:text-nikah-deep hover:bg-nikah-bg transition-all active:scale-[0.97] disabled:opacity-60"
              style={{ padding: '10px 18px', fontSize: 13 }}
            >
              {isResetting ? 'Membuka...' : 'Atur Ulang Data'}
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-[1200px] mx-auto" style={{ padding: '0 var(--d-pad-page) 40px' }}>
        <div className="flex flex-col lg:block" style={{ gap: 20 }}>
          {/* LEVEL 2 — KPI ringkasan */}
          <div className="contents lg:grid lg:grid-cols-3 lg:gap-5 lg:items-start">
            <div className="order-1 lg:order-none">
              <BudgetHealthCard
                totalBudget={totalBudget}
                vendorPayments={liveVendorPayments}
                finance={guidance.finance}
              />
            </div>
            <div className="order-3 lg:order-none">
              <SavingsSummaryCard collected={liveSavings} target={totalBudget} weddingDate={weddingDate} />
            </div>
            <div className="order-8 lg:order-none">{OverviewCard}</div>
          </div>

          {/* LEVEL 2.5 — Prioritas full-width band (hanya mode 'band') */}
          {layoutMode === 'band' && (
            <div className="order-2 lg:mt-5">
              <CurrentPriorities
                days={days}
                checkedIds={liveChecklistChecked}
                vendorPayments={liveVendorPayments}
                customChecklistItems={liveCustomChecklistItems}
                hiddenChecklistItemIds={liveHiddenChecklistItemIds}
                onSelectVendor={handleSelectVendor}
                onSelectChecklist={handleSelectChecklist}
              />
            </div>
          )}

          {/* LEVEL 3 — workspace 2 kolom */}
          <div className="contents lg:grid lg:grid-cols-[1.9fr_1fr] lg:gap-6 lg:items-start lg:mt-5">
            {/* KIRI — keuangan, tugas, catatan */}
            <div className="contents lg:flex lg:flex-col lg:gap-5">
              <SectionHeader label="Keuangan" sub="Pantau pembayaran vendor dan tabungan kalian." />
              <div id="vendor-payments" className="order-4 lg:order-none">
                <VendorPaymentTracker
                  initialPayments={vendorPayments}
                  onSaved={setLiveVendorPayments}
                  focusRequest={vendorFocusRequest}
                />
              </div>
              <div id="savings" className="order-5 lg:order-none">
                <TabunganNikah
                  collected={tabunganCollected}
                  target={totalBudget}
                  weddingDate={weddingDate}
                  history={savingsHistory}
                  onSaved={(collected, history) => {
                    setLiveSavings(collected)
                    setLiveSavingsHistory(history)
                  }}
                />
              </div>

              <SectionHeader label="Tugas Pernikahan" sub="Checklist dan seserahan yang perlu diselesaikan." spaced />
              <div id="checklist" className="order-6 lg:order-none">
                <ChecklistPernikahan
                  checkedIds={checklistChecked}
                  days={days}
                  customItems={customChecklistItems}
                  hiddenDefaultIds={hiddenChecklistItemIds}
                  onSaved={setLiveChecklistChecked}
                  onCustomItemsSaved={setLiveCustomChecklistItems}
                  onHiddenItemsSaved={setLiveHiddenChecklistItemIds}
                  focusRequest={checklistFocusRequest}
                />
              </div>
              <div className="order-7 lg:order-none">
                <DashboardMinimizableSection
                  sectionId="seserahan"
                  title="Seserahan"
                  badge={`${seserahanChecked.length} siap`}
                >
                  {({ minimizeButton }) => (
                    <SeserahanList
                      checkedIds={seserahanChecked}
                      customItems={customSeserahanItems}
                      hiddenDefaultIds={hiddenSeserahanItemIds}
                      headerAction={minimizeButton}
                    />
                  )}
                </DashboardMinimizableSection>
              </div>

              <SectionHeader label="Catatan" sub="Simpan reminder dan keputusan penting." spaced />
              <div className="order-11 lg:order-none">
                <DashboardNote initialNote={dashboardNote} />
              </div>
            </div>

            {/* KANAN — sidebar: Prioritas (mode sidebar) + Aktivitas + Sebaran */}
            <div className="contents lg:flex lg:flex-col lg:gap-5">
              <SectionHeader label="Monitoring" sub={layoutMode === 'sidebar' ? 'Prioritas, aktivitas terbaru, dan sebaran budget.' : 'Aktivitas terbaru dan sebaran budget.'} />
              {layoutMode === 'sidebar' && (
                <div className="order-2 lg:order-none">
                  <CurrentPriorities
                    days={days}
                    checkedIds={liveChecklistChecked}
                    vendorPayments={liveVendorPayments}
                    customChecklistItems={liveCustomChecklistItems}
                    hiddenChecklistItemIds={liveHiddenChecklistItemIds}
                    onSelectVendor={handleSelectVendor}
                    onSelectChecklist={handleSelectChecklist}
                  />
                </div>
              )}
              <div className="order-9 lg:order-none">
                <DashboardMinimizableSection
                  sectionId="activity"
                  title="Aktivitas Terbaru"
                  badge={`${activityItems.length} update`}
                >
                  {({ minimizeButton }) => (
                    <DashboardActivityTimeline items={activityItems} headerAction={minimizeButton} />
                  )}
                </DashboardMinimizableSection>
              </div>
              <div id="allocation" className="order-10 lg:order-none">
                <DashboardMinimizableSection
                  sectionId="allocation"
                  title="Sebaran Budget"
                  badge={spreadEntries.length > 0 ? `${spreadEntries.length} kategori` : 'Belum ada vendor'}
                >
                  {({ minimizeButton }) => renderAllocationCard(minimizeButton)}
                </DashboardMinimizableSection>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile: bottom action buttons */}
        <div className="flex flex-col lg:hidden" style={{ marginTop: 20, gap: 10 }}>
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
      </main>
    </>
  )
}
