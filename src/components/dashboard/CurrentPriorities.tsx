import type { VendorPaymentInput } from '@/app/dashboard/actions'
import { CHECKLIST_ITEMS } from '@/lib/checklistItems'
import { getVendorPaymentStatus } from '@/lib/vendorPayments'
import { Circle } from 'lucide-react'

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

  const vendorItems: PriorityItem[] = vendorPayments
    .filter(item => item.totalAmount > item.paidAmount && item.dueDate)
    .map(item => {
      const status = getVendorPaymentStatus(item)
      const dueDate = new Date(item.dueDate)
      return {
        id: `vendor-${item.id}`,
        title: `Bayar ${item.name}`,
        meta: `${item.category} · ${dueDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}`,
        urgency: status.daysUntilDue ?? 999,
        color: status.status === 'overdue' ? '#B42318' : status.status === 'dueSoon' ? '#B98C54' : 'var(--landing-mauve, var(--nikah-mauve))',
        badge: 'Vendor',
        note: status.status === 'overdue'
          ? 'Perlu dicek'
          : status.status === 'dueSoon'
            ? 'Minggu ini'
            : 'Nanti',
      }
    })

  const checklistItems: PriorityItem[] = CHECKLIST_ITEMS
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
    }))

  const fallbackChecklist: PriorityItem[] = CHECKLIST_ITEMS
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
        background: 'var(--landing-card, rgba(255,255,255,0.58))',
        borderColor: 'var(--landing-border, rgba(192,120,136,0.22))',
        overflow: 'hidden',
        boxShadow: '0 12px 34px rgba(90, 30, 42, 0.055)',
      }}
    >
      <div className="flex items-start justify-between" style={{ padding: '20px 24px 17px', borderBottom: '1px solid var(--landing-border, rgba(237,228,230,0.82))', gap: 18 }}>
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-nikah-mauve" style={{ margin: '0 0 8px' }}>
            Prioritas Sekarang
          </p>
          <p className="text-nikah-muted" style={{ fontSize: 14, lineHeight: 1.5, margin: 0 }}>
            Mulai dari yang paling dekat. Tidak semua harus selesai sekarang.
          </p>
        </div>
        <span
          className="text-xs font-extrabold rounded-full"
          style={{ color: 'var(--landing-mauve, var(--nikah-mauve))', background: 'var(--landing-pink, #F8E1E7)', padding: '7px 13px', whiteSpace: 'nowrap' }}
        >
          {items.length} prioritas
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2" style={{ padding: '8px 14px 15px', gap: 0 }}>
        {items.length > 0 ? items.map((item, index) => (
          <div
            key={item.id}
            className={`flex items-center ${index % 2 === 0 ? 'md:border-r' : ''}`}
            style={{
              gap: 12,
              minHeight: 72,
              padding: '13px 12px',
              borderBottom: index < 2 ? '1px solid var(--landing-border, rgba(237,228,230,0.82))' : '0',
              borderColor: 'var(--landing-border, rgba(237,228,230,0.82))',
            }}
          >
            <span
              className="inline-flex items-center justify-center rounded-full flex-shrink-0"
              style={{ width: 28, height: 28, color: 'var(--landing-border, var(--nikah-border))', background: 'rgba(255,255,255,0.36)' }}
            >
              <Circle size={28} strokeWidth={1.4} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="font-extrabold text-nikah-text truncate" style={{ fontSize: 14.5, lineHeight: 1.25 }}>{item.title}</div>
              <div className="text-nikah-muted" style={{ fontSize: 11.5, marginTop: 3 }}>{item.meta}</div>
            </div>
            <span
              className="font-extrabold rounded-full"
              style={{ color: item.color, background: 'rgba(255,255,255,0.54)', fontSize: 11, padding: '6px 10px', whiteSpace: 'nowrap' }}
            >
              {item.note}
            </span>
          </div>
        )) : (
          <p className="text-sm text-nikah-muted" style={{ margin: 0, padding: '18px 12px' }}>
            Belum ada prioritas dekat. Tambahkan vendor atau lanjutkan checklist agar dashboard bisa membantu menyusun fokus berikutnya.
          </p>
        )}
      </div>
    </div>
  )
}
