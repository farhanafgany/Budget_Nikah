'use client'

import Link from 'next/link'
import { useAnimatedNumber } from '@/hooks/useAnimatedNumber'
import { TabunganNikah } from '@/components/dashboard/TabunganNikah'
import { ChecklistPernikahan } from '@/components/dashboard/ChecklistPernikahan'
import { SeserahanList } from '@/components/dashboard/SeserahanList'
import { DashboardNote } from '@/components/dashboard/DashboardNote'
import { VendorPaymentTracker } from '@/components/dashboard/VendorPaymentTracker'
import { CurrentPriorities } from '@/components/dashboard/CurrentPriorities'
import { formatRupiah } from '@/lib/utils'
import type { PressureLevel } from '@/lib/scoring'
import type { CustomSeserahanInput, SavingsHistoryInput, VendorPaymentInput } from '@/app/dashboard/actions'

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
  seserahanChecked: string[]
  customSeserahanItems: CustomSeserahanInput[]
  hiddenSeserahanItemIds: string[]
  dashboardNote: string
  vendorPayments: VendorPaymentInput[]
}

const CATEGORY_LABELS: Record<string, string> = {
  catering: 'Catering',
  venue: 'Venue',
  decoration: 'Dekorasi',
  documentation: 'Dokumentasi',
  mua: 'MUA & Busana',
  souvenir: 'Souvenir',
  entertainment: 'Hiburan',
  emergencyFund: 'Dana Darurat',
}

const LABEL_COLORS: Record<string, string> = {
  Healthy: 'bg-green-100 text-green-700',
  Moderate: 'bg-orange-100 text-orange-700',
  'High Risk': 'bg-red-100 text-red-700',
}

const BAR_COLORS = ['#6E2638', '#C47986', '#B98C54', '#A87B68', '#8C4F62', '#A38C6C']
const SERIF = 'var(--font-playfair), "Cormorant Garamond", Georgia, serif'

function ScoreRing({ score }: { score: number }) {
  const animatedRingScore = useAnimatedNumber(score, { duration: 900 })
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
    <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-nikah-mauve">
      {children}
    </span>
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
  seserahanChecked,
  customSeserahanItems,
  hiddenSeserahanItemIds,
  dashboardNote,
  vendorPayments,
}: Props) {
  const allocEntries = alloc
    ? (Object.entries(alloc) as [string, AllocEntry][])
        .filter(([, v]) => typeof v?.percentage === 'number' && v.percentage > 0)
        .sort((a, b) => b[1].percentage - a[1].percentage)
        .slice(0, 4)
    : []

  const weddingDateText = weddingDate
    ? new Date(weddingDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    : null
  const timeLeftText = formatTimeLeft(days)
  const readinessTitle = score >= 70
    ? 'Rencana kalian sudah berada di jalur yang cukup aman.'
    : score >= 40
      ? 'Rencana kalian cukup baik, tinggal dirapikan pelan-pelan.'
      : 'Rencana kalian masih bisa ditata dari hal yang paling dekat.'
  const readinessCopy = score >= 70
    ? 'Fokuskan energi ke pembayaran penting dan checklist terdekat agar persiapan tetap terasa terkendali.'
    : score >= 40
      ? 'Mulai dari prioritas minggu ini dulu, lalu rapikan bagian budget dan vendor yang paling dekat.'
      : 'Tidak semua perlu selesai sekaligus. Ambil satu langkah kecil yang paling membantu minggu ini.'

  const OverviewCard = (
    <div
      className="bg-white border border-nikah-border shadow-sm overflow-hidden"
      style={{ borderRadius: 'var(--d-radius)', padding: 24, boxShadow: '0 12px 34px rgba(90, 30, 42, 0.055)' }}
    >
      <div className="flex items-center justify-between" style={{ marginBottom: 17 }}>
        <CardTitle>Estimasi Readiness</CardTitle>
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
            {readinessTitle}
          </h2>
          <p className="text-nikah-muted" style={{ fontSize: 13, lineHeight: 1.5, margin: 0 }}>
            {readinessCopy}
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
      <div className="flex items-center justify-between" style={{ marginBottom: 18 }}>
        <CardTitle>Referensi Alokasi · Top {allocEntries.length}</CardTitle>
      </div>
      {allocEntries.length > 0 ? (
        <div className="grid" style={{ gap: 14 }}>
          {allocEntries.map(([key, val], i) => (
            <div key={key}>
              <div className="flex items-center justify-between" style={{ gap: 10, marginBottom: 6 }}>
                <span className="font-bold text-nikah-text truncate" style={{ fontSize: 13 }}>
                  {CATEGORY_LABELS[key] ?? key}
                </span>
                <span className="font-extrabold text-nikah-text tabular-nums" style={{ fontSize: 13 }}>
                  {formatRupiah(val.estimatedAmount)}
                </span>
              </div>
              <div className="flex items-center" style={{ gap: 8 }}>
                <div className="w-full bg-nikah-border rounded-full overflow-hidden" style={{ height: 5 }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${val.percentage}%`, backgroundColor: BAR_COLORS[i % BAR_COLORS.length] }}
                  />
                </div>
                <span className="text-nikah-muted tabular-nums" style={{ fontSize: 11, minWidth: 34, textAlign: 'right' }}>
                  {val.percentage}%
                </span>
              </div>
            </div>
          ))}
          <p className="text-xs text-nikah-muted" style={{ margin: '8px 0 0', lineHeight: 1.5 }}>
            Benchmark dari pasangan dengan budget {formatRupiah(totalBudget)}
          </p>
        </div>
      ) : (
        <p className="text-sm text-nikah-muted">Data alokasi belum tersedia.</p>
      )}
    </div>
  )

  return (
    <>
      <div className="max-w-[1200px] mx-auto" style={{ padding: '36px var(--d-pad-page) 26px' }}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] items-end" style={{ gap: 24 }}>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve" style={{ marginBottom: 8 }}>
              Selamat datang kembali
            </p>
            <h1
              className="text-nikah-text"
              style={{
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontWeight: 500,
                fontSize: 'clamp(42px, 5vw, 58px)',
                letterSpacing: '-0.025em',
                lineHeight: 1.05,
                margin: '0 0 12px',
              }}
            >
              Hai, {userName1} &amp; {userName2}
            </h1>
            {timeLeftText && weddingDateText && (
              <p className="text-nikah-muted" style={{ fontSize: 15.5, margin: 0 }}>
                Hari H: <strong className="text-nikah-text">{weddingDateText}</strong> — {timeLeftText} lagi. Fokus pada yang paling dekat agar persiapan tetap terkendali.
              </p>
            )}
          </div>
          <div id="dashboard-actions" className="flex flex-wrap items-center justify-start lg:justify-end" style={{ gap: 10 }}>
            <Link
              href="/dashboard/summary"
              className="inline-flex items-center justify-center border border-nikah-border bg-white text-nikah-deep font-bold rounded-full text-sm text-center hover:bg-nikah-bg transition"
              style={{ padding: '13px 24px' }}
            >
              Lihat Ringkasan
            </Link>
            <Link
              href="/result"
              className="inline-flex items-center justify-center bg-nikah-deep text-white font-bold rounded-full text-sm text-center hover:opacity-90 transition"
              style={{ padding: '13px 24px' }}
            >
              Buka Simulasi
            </Link>
          </div>
        </div>
      </div>

      <main className="max-w-[1200px] mx-auto" style={{ padding: '0 var(--d-pad-page)' }}>
        <div className="grid grid-cols-1 lg:grid-cols-[1.7fr_1fr]" style={{ gap: 20, marginBottom: 20 }}>
          <CurrentPriorities days={days} checkedIds={checklistChecked} vendorPayments={vendorPayments} />
          {OverviewCard}
        </div>

        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-nikah-mauve" style={{ margin: '0 0 14px' }}>
          Uang
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-3" style={{ gap: 20, marginBottom: 28 }}>
          <TabunganNikah collected={tabunganCollected} target={totalBudget} weddingDate={weddingDate} history={savingsHistory} />
          <VendorPaymentTracker initialPayments={vendorPayments} />
          <DashboardNote initialNote={dashboardNote} />
        </div>

        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-nikah-mauve" style={{ margin: '0 0 14px' }}>
          Tugas &amp; Referensi
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_0.95fr_0.95fr]" style={{ gap: 20 }}>
          <ChecklistPernikahan checkedIds={checklistChecked} />
          <SeserahanList checkedIds={seserahanChecked} customItems={customSeserahanItems} hiddenDefaultIds={hiddenSeserahanItemIds} />
          {AllocationCard}
        </div>
      </main>
    </>
  )
}
