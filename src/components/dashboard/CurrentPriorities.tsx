import type { VendorPaymentInput } from '@/app/dashboard/actions'
import { CHECKLIST_ITEMS } from '@/lib/checklistItems'
import { getVendorPaymentStatus } from '@/lib/vendorPayments'
import { BellRing } from 'lucide-react'

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
        meta: `${item.category} · ${dueDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} · ${status.label}`,
        urgency: status.daysUntilDue ?? 999,
        color: status.status === 'overdue' ? '#B42318' : status.status === 'dueSoon' ? '#E0A235' : 'var(--nikah-mauve)',
        badge: 'Vendor',
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
      color: 'var(--nikah-mauve)',
      badge: 'Checklist',
    }))

  const fallbackChecklist: PriorityItem[] = CHECKLIST_ITEMS
    .filter(item => !checkedIds.includes(item.id))
    .slice(0, 5)
    .map((item, index) => ({
      id: `fallback-${item.id}`,
      title: item.label,
      meta: `${item.category} · prioritas berikutnya`,
      urgency: 50 + index,
      color: 'var(--nikah-mauve)',
      badge: 'Checklist',
    }))

  const sourceChecklist = checklistItems.length > 0 ? checklistItems : fallbackChecklist
  const items = [...vendorItems, ...sourceChecklist]
    .sort((a, b) => a.urgency - b.urgency)
    .slice(0, 5)

  return (
    <div
      className="border shadow-sm"
      style={{
        borderRadius: 'var(--d-radius)',
        padding: 'var(--d-pad-card)',
        background: 'linear-gradient(135deg, #FFF 0%, #F8E9EE 100%)',
        borderColor: 'rgba(192,120,136,0.34)',
        boxShadow: '0 18px 45px rgba(107,53,69,0.09)',
      }}
    >
      <div className="flex items-center justify-between" style={{ marginBottom: 14 }}>
        <span className="inline-flex items-center" style={{ gap: 8 }}>
          <span
            className="inline-flex items-center justify-center text-nikah-deep"
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #F5E8EC, #EDD6DE)',
            }}
          >
            <BellRing size={18} strokeWidth={1.9} />
          </span>
          <span className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-nikah-deep">
            Prioritas Sekarang
          </span>
        </span>
        <span
          className="text-xs font-extrabold rounded-full"
          style={{ color: 'var(--nikah-deep)', background: '#fff', padding: '5px 10px' }}
        >
          {items.length} item utama
        </span>
      </div>

      <p className="text-nikah-muted font-light" style={{ fontSize: 14, lineHeight: 1.5, margin: '0 0 14px' }}>
        Ringkasan otomatis dari checklist dan pembayaran vendor. Ini bukan checklist baru, tapi pengingat hal yang paling perlu kamu perhatikan.
      </p>

      <div className="grid" style={{ gap: 6 }}>
        {items.length > 0 ? items.map(item => (
          <div
            key={item.id}
            className="flex items-start bg-white/72"
            style={{ gap: 12, padding: '14px 12px', borderRadius: 12, border: '1px solid rgba(237,228,230,0.72)' }}
          >
            <span
              className="inline-flex items-center justify-center rounded-full flex-shrink-0"
              style={{ backgroundColor: item.color, marginTop: 2, width: 24, height: 24, color: '#fff' }}
            >
              <BellRing size={12} strokeWidth={2.2} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center" style={{ gap: 8 }}>
                <div className="font-bold text-nikah-text" style={{ fontSize: 15, lineHeight: 1.28 }}>{item.title}</div>
                <span
                  className="font-extrabold rounded-full bg-nikah-bg text-nikah-muted"
                  style={{ fontSize: 9, padding: '3px 7px', whiteSpace: 'nowrap' }}
                >
                  Sumber: {item.badge}
                </span>
              </div>
              <div className="text-nikah-muted" style={{ fontSize: 11.5, marginTop: 3 }}>{item.meta}</div>
            </div>
          </div>
        )) : (
          <p className="text-sm text-nikah-muted" style={{ margin: 0 }}>
            Belum ada prioritas dekat. Tambahkan vendor atau lanjutkan checklist agar dashboard bisa menyusun fokus berikutnya.
          </p>
        )}
      </div>
    </div>
  )
}
