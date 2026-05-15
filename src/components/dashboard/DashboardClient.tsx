'use client'
import Link from 'next/link'
import { TabunganNikah } from '@/components/dashboard/TabunganNikah'
import { ChecklistPernikahan } from '@/components/dashboard/ChecklistPernikahan'
import { SeserahanList } from '@/components/dashboard/SeserahanList'
import { DashboardNote } from '@/components/dashboard/DashboardNote'
import { VendorPaymentTracker } from '@/components/dashboard/VendorPaymentTracker'
import { CurrentPriorities } from '@/components/dashboard/CurrentPriorities'
import { formatRupiah } from '@/lib/utils'
import type { PressureLevel } from '@/lib/scoring'
import type { CustomSeserahanInput, SavingsHistoryInput, VendorPaymentInput } from '@/app/dashboard/actions'
import { Gauge, SlidersHorizontal } from 'lucide-react'

interface AllocEntry {
  percentage: number
  estimatedAmount: number
}

interface Insight {
  kind: 'good' | 'warn' | 'info'
  title: string
  body: string
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
  seserahanChecked: string[]
  customSeserahanItems: CustomSeserahanInput[]
  hiddenSeserahanItemIds: string[]
  dashboardNote: string
  vendorPayments: VendorPaymentInput[]
}

const CATEGORY_LABELS: Record<string, string> = {
  catering: 'Catering', venue: 'Venue', decoration: 'Dekorasi',
  documentation: 'Dokumentasi', mua: 'MUA & Busana', souvenir: 'Souvenir',
  entertainment: 'Hiburan', emergencyFund: 'Dana Darurat',
}

const LABEL_COLORS: Record<string, string> = {
  Healthy:     'bg-green-100 text-green-700',
  Moderate:    'bg-orange-100 text-orange-700',
  'High Risk': 'bg-red-100 text-red-700',
}

const BAR_COLORS = ['#6B3545', '#C07888', '#C8A860', '#B98F5E', '#8C4F62', '#A38C6C']

function ScoreRing({ score }: { score: number }) {
  const pct = Math.min(100, Math.max(0, score))
  return (
    <div
      style={{
        width: 124,
        height: 124,
        borderRadius: '50%',
        background: `radial-gradient(circle at center, #fff 60%, transparent 60%), conic-gradient(var(--nikah-deep) 0% ${pct}%, #F0E0E5 ${pct}% 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <div
        className="text-center bg-white rounded-full flex flex-col items-center justify-center"
        style={{ width: 96, height: 96, boxShadow: 'inset 0 0 0 1px var(--nikah-border)' }}
      >
        <div
          className="leading-none text-nikah-deep"
          style={{ fontFamily: 'var(--font-fraunces, Georgia, serif)', fontSize: 40, fontWeight: 500 }}
        >
          {score}
        </div>
        <div className="font-extrabold text-nikah-mauve uppercase" style={{ fontSize: 9, letterSpacing: '0.14em', marginTop: 2 }}>Score</div>
      </div>
    </div>
  )
}

function CardTitle({
  icon,
  children,
}: {
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <span className="inline-flex items-center" style={{ gap: 8 }}>
      <span
        className="inline-flex items-center justify-center text-nikah-deep"
        style={{
          width: 28,
          height: 28,
          borderRadius: 8,
          background: 'linear-gradient(135deg, #F5E8EC, #EDD6DE)',
        }}
      >
        {icon}
      </span>
      <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-nikah-mauve">
        {children}
      </span>
    </span>
  )
}

function computeInsights(score: number, pressure: PressureLevel, days: number | null): Insight[] {
  const insights: Insight[] = []
  if (score >= 70) {
    insights.push({ kind: 'good', title: 'Rencana sudah solid', body: 'Skor kamu di zona aman. Pertahankan ritme menabung dan lanjutkan checklist.' })
  } else if (score >= 40) {
    insights.push({ kind: 'warn', title: 'Ada ruang untuk diperbaiki', body: 'Simulasikan perubahan jumlah tamu atau gaya untuk meningkatkan skor.' })
  } else {
    insights.push({ kind: 'warn', title: 'Perlu perhatian segera', body: 'Budget atau waktu persiapan terlalu mepet. Pertimbangkan kurangi tamu atau tambah budget.' })
  }
  if (pressure === 'High') {
    insights.push({ kind: 'warn', title: 'Tekanan budget tinggi', body: 'Budget per tamu di bawah standar ideal. Coba kurangi jumlah undangan.' })
  }
  if (days !== null && days > 0 && days <= 180) {
    insights.push({ kind: 'info', title: 'Kurang dari 6 bulan', body: 'Segera booking vendor inti: venue, katering, MUA, dan dokumentasi.' })
  }
  if (insights.length < 2) {
    insights.push({ kind: 'info', title: 'Pantau checklist', body: 'Centang item checklist secara rutin agar tidak ada yang terlewat menjelang hari H.' })
  }
  return insights
}

function formatTimeLeft(days: number | null) {
  if (days === null || days <= 0) return null
  if (days < 30) return 'kurang 1 bulan'
  return `${Math.ceil(days / 30)} bulan`
}

export function DashboardClient({
  userName1, userName2, score, label, pressure, days,
  alloc, totalBudget, guestCount, weddingDate,
  tabunganCollected, savingsHistory, checklistChecked, seserahanChecked, customSeserahanItems, hiddenSeserahanItemIds, dashboardNote,
  vendorPayments,
}: Props) {
  const insights = computeInsights(score, pressure, days)

  const allocEntries = alloc
    ? (Object.entries(alloc) as [string, AllocEntry][])
        .filter(([, v]) => typeof v?.percentage === 'number' && v.percentage > 0)
        .sort((a, b) => b[1].percentage - a[1].percentage)
        .slice(0, 4)
    : []

  const primaryInsight = insights[0]
  const primaryInsightColor = primaryInsight?.kind === 'good'
    ? '#4CAF82'
    : primaryInsight?.kind === 'warn'
      ? '#E0A235'
      : 'var(--nikah-mauve)'

  const weddingDateText = weddingDate
    ? new Date(weddingDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'tanggal yang kamu pilih'
  const timeLeftText = formatTimeLeft(days)
  const monthsLeft = days !== null && days >= 30 ? Math.ceil(days / 30) : null
  const planZone = score >= 70 ? 'zona aman' : score >= 40 ? 'zona yang perlu dirapikan' : 'zona yang perlu perhatian ekstra'
  const focusWindowText = monthsLeft ? `${Math.min(monthsLeft, 6)} bulan` : timeLeftText ?? 'beberapa bulan'
  const overviewBody = `Berdasarkan budget ${formatRupiah(totalBudget)}, ${guestCount ? `${guestCount} tamu` : 'jumlah tamu yang kamu isi'}, dan tanggal ${weddingDateText} — rencanamu masuk ${planZone}. Fokuskan ${focusWindowText} ke depan untuk mengunci vendor inti.`

  const OverviewCard = (
    <div
      className="bg-white border border-nikah-border shadow-sm overflow-hidden"
      style={{ borderRadius: 'var(--d-radius)', padding: 'var(--d-pad-card)' }}
    >
      <div className="flex items-center justify-between" style={{ marginBottom: 14 }}>
        <CardTitle icon={<Gauge size={16} strokeWidth={1.8} />}>Estimasi Readiness</CardTitle>
        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${LABEL_COLORS[label] ?? ''}`}>
          {label}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] items-center" style={{ gap: 24 }}>
        <ScoreRing score={score} />
        <div className="flex-1 min-w-0">
          <h2
            className="text-nikah-text"
            style={{
              fontFamily: 'var(--font-fraunces, Georgia, serif)',
              fontStyle: 'italic',
              fontWeight: 500,
              fontSize: 26,
              margin: '4px 0 4px',
            }}
          >
            {score >= 70 ? 'Rencanamu sudah cukup realistis.' : score >= 40 ? 'Ada beberapa hal yang perlu diperhatikan.' : 'Perlu perbaikan segera.'}
          </h2>
          <p className="text-nikah-muted font-light" style={{ fontSize: 13, margin: '0 0 14px', lineHeight: 1.45 }}>
            {overviewBody}
          </p>
          <div className="grid grid-cols-3" style={{ gap: 10 }}>
            {[
              { val: formatRupiah(totalBudget), lbl: 'Estimasi total' },
              ...(guestCount ? [{ val: String(guestCount), lbl: 'Undangan' }] : []),
              ...(timeLeftText ? [{ val: timeLeftText.replace(' bulan', ' bln'), lbl: 'Sisa waktu' }] : []),
            ].map(s => (
              <div key={s.lbl} className="bg-nikah-bg" style={{ borderRadius: 12, padding: '10px 12px' }}>
                <div className="font-extrabold text-nikah-deep" style={{ fontSize: 16, lineHeight: 1.1 }}>{s.val}</div>
                <div className="text-nikah-muted" style={{ fontSize: 10, marginTop: 3 }}>{s.lbl}</div>
              </div>
            ))}
          </div>
          {primaryInsight && (
            <div className="flex items-start bg-nikah-bg" style={{ gap: 10, padding: 12, borderRadius: 12, marginTop: 12, fontSize: 13, lineHeight: 1.45 }}>
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: primaryInsightColor, marginTop: 6 }}
              />
              <div>
                <strong>{primaryInsight.title}.</strong>{' '}
                <span className="text-nikah-muted font-light">{primaryInsight.body}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const AllocationCard = (
    <div className="bg-white border border-nikah-border shadow-sm" style={{ borderRadius: 'var(--d-radius)', padding: 'var(--d-pad-card)' }}>
      <div className="flex items-center justify-between" style={{ marginBottom: 14 }}>
        <CardTitle icon={<SlidersHorizontal size={16} strokeWidth={1.8} />}>Referensi Budget</CardTitle>
        <span className="text-xs font-bold text-nikah-text">Top {allocEntries.length}</span>
      </div>
      {allocEntries.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 10 }}>
          {allocEntries.map(([key, val], i) => (
            <div key={key} className="bg-nikah-bg" style={{ borderRadius: 12, padding: '10px 12px' }}>
              <div className="flex items-center justify-between" style={{ gap: 10, marginBottom: 8 }}>
                <span className="font-semibold text-nikah-text truncate" style={{ fontSize: 13 }}>{CATEGORY_LABELS[key] ?? key}</span>
                <span className="text-nikah-muted tabular-nums" style={{ fontSize: 11 }}>{val.percentage}%</span>
              </div>
              <div className="w-full bg-nikah-border rounded-full overflow-hidden" style={{ height: 5, marginBottom: 6 }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: `${val.percentage}%`, backgroundColor: BAR_COLORS[i % BAR_COLORS.length] }}
                />
              </div>
              <div className="font-extrabold text-nikah-deep" style={{ fontSize: 14, lineHeight: 1.1 }}>{formatRupiah(val.estimatedAmount)}</div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-nikah-muted">Data alokasi belum tersedia.</p>
      )}
    </div>
  )

  const TabunganCard = (
    <TabunganNikah
      collected={tabunganCollected}
      target={totalBudget}
      weddingDate={weddingDate}
      history={savingsHistory}
    />
  )

  const ChecklistCard = (
    <ChecklistPernikahan
      checkedIds={checklistChecked}
    />
  )

  const SeserahanCard = (
    <SeserahanList
      checkedIds={seserahanChecked}
      customItems={customSeserahanItems}
      hiddenDefaultIds={hiddenSeserahanItemIds}
    />
  )

  const NoteCard = (
    <DashboardNote initialNote={dashboardNote} />
  )

  const CurrentPrioritiesCard = (
    <CurrentPriorities
      days={days}
      checkedIds={checklistChecked}
      vendorPayments={vendorPayments}
    />
  )

  const VendorPaymentCard = (
    <VendorPaymentTracker initialPayments={vendorPayments} />
  )

  const SimBtn = (
    <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 10 }}>
      <Link
        href="/dashboard/summary"
        className="block w-full bg-nikah-deep text-white font-bold py-4 rounded-full text-sm text-center hover:opacity-90 transition"
      >
        Lihat Ringkasan →
      </Link>
      <Link
        href="/result"
        className="block w-full border border-nikah-deep text-nikah-deep font-bold py-4 rounded-full text-sm text-center hover:bg-white transition"
      >
        Buka Simulasi
      </Link>
    </div>
  )

  return (
    <>
      <div className="max-w-[1080px] mx-auto" style={{ padding: '36px var(--d-pad-page) 18px' }}>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve" style={{ marginBottom: 6 }}>Selamat datang kembali</p>
          <h1
            className="text-nikah-text"
            style={{ fontFamily: 'var(--font-fraunces, Georgia, serif)', fontStyle: 'italic', fontWeight: 500, fontSize: 36, letterSpacing: '-0.015em', lineHeight: 1.1, margin: '0 0 8px' }}
          >
            Hai, {userName1} &amp; {userName2}
          </h1>
          {timeLeftText && weddingDate && (
            <p className="text-nikah-muted font-light" style={{ fontSize: 'var(--d-body)', margin: 0 }}>
              Hari H: {new Date(weddingDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} — {timeLeftText} lagi.
            </p>
          )}
        </div>
      </div>

      <main className="max-w-[1080px] mx-auto" style={{ padding: '0 var(--d-pad-page)' }}>
        <div style={{ marginBottom: 'var(--d-gap-card)' }}>{OverviewCard}</div>
        <div style={{ marginBottom: 'var(--d-gap-card)' }}>{CurrentPrioritiesCard}</div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr]" style={{ gap: 'var(--d-gap-card)' }}>
          <div className="grid self-start" style={{ gap: 'var(--d-gap-card)' }}>{TabunganCard}{VendorPaymentCard}{ChecklistCard}</div>
          <div className="grid self-start" style={{ gap: 'var(--d-gap-card)' }}>{NoteCard}{AllocationCard}{SeserahanCard}</div>
        </div>

        <div style={{ marginTop: 'var(--d-gap-card)' }}>{SimBtn}</div>
      </main>
    </>
  )
}
