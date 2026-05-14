import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { calculateMonthlySavings, monthsUntilDate } from '@/lib/savings'
import { formatRupiah } from '@/lib/utils'
import { CHECKLIST_ITEMS } from '@/lib/checklistItems'
import { PrintButton } from '@/components/dashboard/PrintButton'
import { BrandLogo } from '@/components/ui/BrandLogo'
import type { VendorPaymentInput } from '@/app/dashboard/actions'

interface AllocEntry {
  percentage: number
  estimatedAmount: number
}

function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) return null
  return Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
}

function normalizeVendorPayments(value: unknown): VendorPaymentInput[] {
  if (!Array.isArray(value)) return []
  return value
    .filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null)
    .map(item => ({
      id: typeof item.id === 'string' ? item.id : crypto.randomUUID(),
      name: typeof item.name === 'string' ? item.name : '',
      category: typeof item.category === 'string' ? item.category : 'Lainnya',
      totalAmount: typeof item.totalAmount === 'number' ? item.totalAmount : 0,
      paidAmount: typeof item.paidAmount === 'number' ? item.paidAmount : 0,
      dueDate: typeof item.dueDate === 'string' ? item.dueDate : '',
      installments: Array.isArray(item.installments)
        ? item.installments
            .filter((installment): installment is Record<string, unknown> => typeof installment === 'object' && installment !== null)
            .map(installment => ({
              id: typeof installment.id === 'string' ? installment.id : crypto.randomUUID(),
              amount: typeof installment.amount === 'number' ? installment.amount : 0,
              date: typeof installment.date === 'string' ? installment.date : '',
            }))
            .filter(installment => installment.amount > 0)
        : [],
    }))
    .filter(item => item.name)
}

function getFocusWindow(days: number | null) {
  if (days === null || days <= 7) return 0
  if (days <= 45) return 1
  if (days <= 120) return 3
  if (days <= 240) return 6
  return 12
}

export default async function DashboardSummaryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('wedding_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!profile) redirect('/dashboard')

  const score = (profile.readiness_score as number | null) ?? 0
  const label = score >= 70 ? 'Healthy' : score >= 40 ? 'Moderate' : 'High Risk'
  const totalBudget = (profile.total_budget as number | null) ?? 0
  const savingsCollected = (profile.savings_collected as number | null) ?? 0
  const weddingDate = (profile.wedding_date as string | null)
  const days = daysUntil(weddingDate)
  const months = monthsUntilDate(weddingDate)
  const monthlySavings = calculateMonthlySavings(totalBudget, savingsCollected, months)
  const checklistChecked = (profile.checklist_checked as string[] | null) ?? []
  const vendorPayments = normalizeVendorPayments(profile.vendor_payments)
  const vendorTotal = vendorPayments.reduce((sum, item) => sum + item.totalAmount, 0)
  const vendorPaid = vendorPayments.reduce((sum, item) => sum + item.paidAmount, 0)
  const vendorRemaining = Math.max(0, vendorTotal - vendorPaid)
  const alloc = profile.allocation_result as Record<string, AllocEntry> | null
  const topAlloc = alloc
    ? (Object.entries(alloc) as [string, AllocEntry][])
        .filter(([, item]) => item.estimatedAmount > 0)
        .sort((a, b) => b[1].estimatedAmount - a[1].estimatedAmount)
        .slice(0, 4)
    : []
  const focusWindow = getFocusWindow(days)
  const priorities = CHECKLIST_ITEMS
    .filter(item => item.monthsBefore === focusWindow && !checklistChecked.includes(item.id))
    .slice(0, 5)
  const note = (profile.dashboard_note as string | null) ?? ''

  return (
    <main className="min-h-screen bg-nikah-bg px-6 py-8 print:bg-white print:px-0 print:py-0">
      <div className="max-w-[900px] mx-auto bg-white border border-nikah-border shadow-sm print:border-0 print:shadow-none" style={{ borderRadius: 'var(--d-radius)' }}>
        <div className="flex items-center justify-between gap-4 border-b border-nikah-border print:hidden" style={{ padding: '22px 26px' }}>
          <Link href="/dashboard" className="text-sm font-bold text-nikah-deep">← Dashboard</Link>
          <PrintButton />
        </div>

        <div style={{ padding: '34px 34px 40px' }}>
          <div className="flex items-start justify-between gap-6" style={{ marginBottom: 28 }}>
            <div>
              <BrandLogo size="md" />
              <h1
                className="text-nikah-text"
                style={{ fontFamily: 'var(--font-fraunces, Georgia, serif)', fontStyle: 'italic', fontWeight: 500, fontSize: 34, margin: '24px 0 8px', lineHeight: 1.08 }}
              >
                Ringkasan rencana pernikahan
              </h1>
              <p className="text-nikah-muted" style={{ fontSize: 14, margin: 0 }}>
                {((profile.partner_one_name as string | null) ?? 'Kamu')} &amp; {((profile.partner_two_name as string | null) ?? 'Pasangan')}
                {weddingDate ? ` · ${new Date(weddingDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}` : ''}
              </p>
            </div>
            <div className="text-right">
              <div className="text-nikah-deep" style={{ fontFamily: 'var(--font-fraunces, Georgia, serif)', fontSize: 44, lineHeight: 1 }}>{score}</div>
              <div className="text-xs font-extrabold uppercase tracking-[0.14em] text-nikah-mauve">{label}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: 10, marginBottom: 24 }}>
            {[
              { label: 'Budget', value: formatRupiah(totalBudget) },
              { label: 'Tabungan', value: formatRupiah(savingsCollected) },
              { label: 'Nabung/bln', value: formatRupiah(monthlySavings) },
              { label: 'Sisa vendor', value: formatRupiah(vendorRemaining) },
            ].map(item => (
              <div key={item.label} className="bg-nikah-bg" style={{ borderRadius: 12, padding: '12px 14px' }}>
                <div className="font-extrabold text-nikah-deep" style={{ fontSize: 16, lineHeight: 1.1 }}>{item.value}</div>
                <div className="text-nikah-muted" style={{ fontSize: 10, marginTop: 4 }}>{item.label}</div>
              </div>
            ))}
          </div>

          <section style={{ marginBottom: 24 }}>
            <h2 className="text-xs font-extrabold uppercase tracking-[0.14em] text-nikah-mauve" style={{ margin: '0 0 10px' }}>Prioritas sekarang</h2>
            <div className="grid" style={{ gap: 8 }}>
              {(priorities.length > 0 ? priorities : CHECKLIST_ITEMS.filter(item => !checklistChecked.includes(item.id)).slice(0, 5)).map(item => (
                <div key={item.id} className="bg-nikah-bg" style={{ borderRadius: 12, padding: '11px 13px' }}>
                  <div className="font-bold text-nikah-text" style={{ fontSize: 14 }}>{item.label}</div>
                  <div className="text-nikah-muted" style={{ fontSize: 11, marginTop: 3 }}>{item.category}</div>
                </div>
              ))}
            </div>
          </section>

          <section style={{ marginBottom: 24 }}>
            <h2 className="text-xs font-extrabold uppercase tracking-[0.14em] text-nikah-mauve" style={{ margin: '0 0 10px' }}>Pembayaran vendor</h2>
            <div className="grid" style={{ gap: 8 }}>
              {vendorPayments.length > 0 ? vendorPayments.slice(0, 6).map(item => (
                <div key={item.id} className="flex justify-between gap-4 bg-nikah-bg" style={{ borderRadius: 12, padding: '11px 13px' }}>
                  <div>
                    <div className="font-bold text-nikah-text" style={{ fontSize: 14 }}>{item.name}</div>
                    <div className="text-nikah-muted" style={{ fontSize: 11, marginTop: 3 }}>{item.category}</div>
                  </div>
                  <div className="text-right text-nikah-deep font-bold" style={{ fontSize: 13 }}>
                    {formatRupiah(Math.max(0, item.totalAmount - item.paidAmount))}
                  </div>
                </div>
              )) : (
                <p className="text-sm text-nikah-muted" style={{ margin: 0 }}>Belum ada vendor yang dicatat.</p>
              )}
            </div>
          </section>

          <section style={{ marginBottom: 24 }}>
            <h2 className="text-xs font-extrabold uppercase tracking-[0.14em] text-nikah-mauve" style={{ margin: '0 0 10px' }}>Referensi budget</h2>
            <div className="grid grid-cols-2" style={{ gap: 8 }}>
              {topAlloc.map(([key, item]) => (
                <div key={key} className="bg-nikah-bg" style={{ borderRadius: 12, padding: '11px 13px' }}>
                  <div className="font-bold text-nikah-text capitalize" style={{ fontSize: 14 }}>{key}</div>
                  <div className="text-nikah-muted" style={{ fontSize: 11, marginTop: 3 }}>{formatRupiah(item.estimatedAmount)} · {item.percentage}%</div>
                </div>
              ))}
            </div>
          </section>

          {note && (
            <section>
              <h2 className="text-xs font-extrabold uppercase tracking-[0.14em] text-nikah-mauve" style={{ margin: '0 0 10px' }}>Catatan</h2>
              <p className="bg-nikah-bg text-nikah-text" style={{ borderRadius: 12, padding: 14, fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap', margin: 0 }}>{note}</p>
            </section>
          )}
        </div>
      </div>
    </main>
  )
}
