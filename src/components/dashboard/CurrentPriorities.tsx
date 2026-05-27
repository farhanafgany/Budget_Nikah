import type { VendorPaymentInput } from '@/lib/dashboardActions'
import { CHECKLIST_ITEMS } from '@/lib/checklistItems'
import { buildVendorReminderSummary } from '@/lib/dashboardReminders'
import { formatRupiahExact } from '@/lib/utils'
import { getVendorPaymentStatus } from '@/lib/vendorPayments'
import { ArrowRight, Circle } from 'lucide-react'

function getRelativeDateLabel(dateStr: string): string {
  const due = new Date(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  due.setHours(0, 0, 0, 0)
  const diff = Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  if (diff < 0) return 'Terlambat'
  if (diff === 0) return 'Hari ini'
  if (diff === 1) return 'Besok'
  if (diff <= 6) return due.toLocaleDateString('id-ID', { weekday: 'long' })
  if (diff <= 13) return 'Minggu depan'
  return `${Math.ceil(diff / 7)} minggu lagi`
}

interface Props {
  days: number | null
  checkedIds: string[]
  vendorPayments: VendorPaymentInput[]
}

interface PriorityItem {
  id: string
  title: string
  meta: string
  urgency: number
  color: string
  badge: string
  note: string
  href: string
}

function getFocusWindow(days: number | null) {
  if (days === null || days <= 7) return { label: 'H-1 Minggu', monthsBefore: 0 }
  if (days <= 45) return { label: '1 Bulan Sebelum', monthsBefore: 1 }
  if (days <= 120) return { label: '3 Bulan Sebelum', monthsBefore: 3 }
  if (days <= 240) return { label: '6 Bulan Sebelum', monthsBefore: 6 }
  return { label: '12 Bulan Sebelum', monthsBefore: 12 }
}

export function CurrentPriorities({ days, checkedIds, vendorPayments }: Props) {
  const focus = getFocusWindow(days)
  const hasTimeline = days !== null
  const reminders = buildVendorReminderSummary(vendorPayments)
  const urgentCount = reminders.overdueCount + reminders.dueSoonCount

  const vendorItems: PriorityItem[] = vendorPayments
    .filter(item => item.totalAmount > item.paidAmount)
    .map(item => {
      const status = getVendorPaymentStatus(item)
      const isOverdue = status.status === 'overdue'
      const isDueSoon = status.status === 'dueSoon'
      const isUnscheduled = status.status === 'unscheduled'
      const dueDate = isUnscheduled ? null : new Date(item.dueDate)
      const relLabel = dueDate ? getRelativeDateLabel(item.dueDate) : 'Belum dijadwalkan'
      const remaining = Math.max(0, item.totalAmount - item.paidAmount)
      return {
        id: `vendor-${item.id}`,
        title: isUnscheduled ? `Atur deadline ${item.name}` : `Bayar ${item.name}`,
        meta: `${formatRupiahExact(remaining)} tersisa · ${item.category}${dueDate ? ` · ${dueDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}` : ''}`,
        urgency: isUnscheduled ? 15 : status.daysUntilDue ?? 999,
        color: isOverdue ? '#B42318' : isDueSoon ? '#B98C54' : 'var(--landing-mauve, var(--nikah-mauve))',
        badge: 'Vendor',
        note: relLabel,
        href: '#vendor-payments',
      }
    })

  const checklistItems: PriorityItem[] = (hasTimeline ? CHECKLIST_ITEMS : [])
    .filter(item => item.monthsBefore === focus.monthsBefore && !checkedIds.includes(item.id))
    .slice(0, 5)
    .map((item, index) => ({
      id: `checklist-${item.id}`,
      title: item.label,
      meta: `${item.category} · ${focus.label}`,
      urgency: 30 + index,
      color: 'var(--landing-mauve, var(--nikah-mauve))',
      badge: 'Checklist',
      note: 'Minggu ini',
      href: '#checklist',
    }))

  const fallbackChecklist: PriorityItem[] = (hasTimeline ? CHECKLIST_ITEMS : [])
    .filter(item => !checkedIds.includes(item.id))
    .slice(0, 5)
    .map((item, index) => ({
      id: `fallback-${item.id}`,
      title: item.label,
      meta: `${item.category} · prioritas berikutnya`,
      urgency: 50 + index,
      color: 'var(--landing-mauve, var(--nikah-mauve))',
      badge: 'Checklist',
      note: 'Berikutnya',
      href: '#checklist',
    }))

  const sourceChecklist = checklistItems.length > 0 ? checklistItems : fallbackChecklist
  const items = [...vendorItems, ...sourceChecklist]
    .sort((a, b) => a.urgency - b.urgency)
    .slice(0, 4)

  return (
    <div
      className="border shadow-sm"
      style={{
        borderRadius: 'var(--d-radius)',
        padding: 0,
        background: 'linear-gradient(160deg, #FEF2F2 0%, #FFF8F5 55%, #FFFFFF 100%)',
        borderColor: 'var(--landing-border, rgba(192,120,136,0.22))',
        overflow: 'hidden',
        boxShadow: '0 12px 34px rgba(90, 30, 42, 0.055)',
      }}
    >
      {/* Header */}
      <div style={{ padding: '20px 22px 14px' }}>
        <div className="flex items-center justify-between" style={{ gap: 18, marginBottom: 10 }}>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-nikah-mauve" style={{ margin: 0 }}>
            Prioritas Sekarang
          </p>
          <span
            className="text-xs font-extrabold rounded-full"
            style={{ color: 'var(--landing-mauve, var(--nikah-mauve))', background: 'rgba(248,225,231,0.7)', padding: '6px 12px', whiteSpace: 'nowrap' }}
          >
            {items.length} hal
          </span>
        </div>
        <p className="text-nikah-muted" style={{ fontSize: 13, lineHeight: 1.5, margin: 0 }}>
          {reminders.overdueCount > 0
            ? `${reminders.overdueCount} pembayaran terlambat perlu ditangani lebih dulu.`
            : reminders.dueSoonCount > 0
              ? `${formatRupiahExact(reminders.urgentOutstanding)} perlu disiapkan untuk pembayaran dalam 7 hari.`
              : reminders.unscheduledCount > 0
                ? `${reminders.unscheduledCount} vendor belum memiliki tanggal pembayaran.`
                : hasTimeline
                  ? 'Mulai dari yang paling dekat. Tidak semua harus selesai sekarang.'
            : 'Lengkapi tanggal rencana agar checklist bisa disusun berdasarkan waktu yang tersedia.'}
        </p>
        {(urgentCount > 0 || reminders.unscheduledCount > 0) && (
          <div className="flex flex-wrap" style={{ gap: 7, marginTop: 13 }}>
            {reminders.overdueCount > 0 && (
              <span className="rounded-full bg-red-50 px-3 py-1.5 text-[11px] font-bold text-red-700">
                {reminders.overdueCount} terlambat
              </span>
            )}
            {reminders.dueSoonCount > 0 && (
              <span className="rounded-full bg-amber-50 px-3 py-1.5 text-[11px] font-bold text-amber-800">
                {reminders.dueSoonCount} dalam 7 hari
              </span>
            )}
            {reminders.unscheduledCount > 0 && (
              <span className="rounded-full bg-nikah-bg px-3 py-1.5 text-[11px] font-bold text-nikah-muted">
                {reminders.unscheduledCount} belum dijadwalkan
              </span>
            )}
          </div>
        )}
      </div>

      {/* Items */}
      <div style={{ padding: '4px 0 4px' }}>
        {items.length > 0 ? items.map((item, index) => (
          <a
            key={item.id}
            href={item.href}
            className="flex items-center"
            style={{
              gap: 14,
              padding: '14px 22px',
              borderTop: index > 0 ? '1px solid rgba(237,228,230,0.7)' : 'none',
            }}
          >
            <span
              className="inline-flex items-center justify-center rounded-full flex-shrink-0"
              style={{ width: 32, height: 32, color: 'rgba(192,120,136,0.35)', background: 'rgba(255,255,255,0.6)' }}
            >
              <Circle size={32} strokeWidth={1.2} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="font-extrabold text-nikah-text" style={{ fontSize: 14.5, lineHeight: 1.3 }}>{item.title}</div>
              <div className="text-nikah-muted" style={{ fontSize: 12, marginTop: 3 }}>{item.meta}</div>
            </div>
            <span
              className="font-bold rounded-full flex-shrink-0"
              style={{
                color: item.note === 'Terlambat' ? '#B42318' : item.note === 'Hari ini' ? '#9A3B48' : 'var(--nikah-muted)',
                background: item.note === 'Terlambat' ? '#FDECEA' : item.note === 'Hari ini' ? 'rgba(248,225,231,0.9)' : 'rgba(237,230,232,0.6)',
                fontSize: 11.5,
                padding: '6px 11px',
                whiteSpace: 'nowrap',
              }}
            >
              {item.note}
            </span>
          </a>
        )) : (
          <p className="text-sm text-nikah-muted" style={{ margin: 0, padding: '14px 22px 18px' }}>
            {hasTimeline
              ? 'Belum ada prioritas dekat. Tambahkan vendor atau lanjutkan checklist agar dashboard bisa membantu menyusun fokus berikutnya.'
              : 'Belum ada pembayaran mendesak yang dicatat. Tanggal rencana akan membantu menyusun prioritas berikutnya.'}
          </p>
        )}
      </div>

      <div className="flex flex-wrap border-t border-nikah-border" style={{ gap: 10, padding: '14px 22px 18px' }}>
        <a
          href="#vendor-payments"
          className="inline-flex items-center text-sm font-bold text-nikah-deep hover:underline underline-offset-4"
          style={{ gap: 4 }}
        >
          Cek pembayaran <ArrowRight size={14} />
        </a>
        <a
          href="#checklist"
          className="inline-flex items-center text-sm font-bold text-nikah-muted hover:text-nikah-deep hover:underline underline-offset-4"
          style={{ gap: 4 }}
        >
          Lihat checklist <ArrowRight size={14} />
        </a>
      </div>
    </div>
  )
}
