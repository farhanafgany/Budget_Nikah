import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { calculateMonthlySavings, monthsUntilDate } from '@/lib/savings'
import { formatRupiahExact } from '@/lib/utils'
import { buildSummaryChecklistPriorities } from '@/lib/dashboardSummary'
import { buildVendorReminderSummary } from '@/lib/dashboardReminders'
import { calculateDashboardChecklistProgress, calculateDashboardFinance, calculateDashboardReadiness } from '@/lib/dashboardInsights'
import { getVendorPaymentStatus } from '@/lib/vendorPayments'
import { PrintButton } from '@/components/dashboard/PrintButton'
import { BrandLogo } from '@/components/ui/BrandLogo'
import type { CustomChecklistInput, VendorPaymentInput } from '@/lib/dashboardActions'

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

function normalizeStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : []
}

function normalizeCustomChecklistItems(value: unknown): CustomChecklistInput[] {
  const validMonths = new Set([0, 1, 3, 6, 12])
  if (!Array.isArray(value)) return []
  return value
    .filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null)
    .map(item => ({
      id: typeof item.id === 'string' ? item.id : crypto.randomUUID(),
      label: typeof item.label === 'string' ? item.label : '',
      monthsBefore: (validMonths.has(item.monthsBefore as number)
        ? item.monthsBefore
        : 12) as CustomChecklistInput['monthsBefore'],
    }))
    .filter(item => item.label)
}

export default async function DashboardSummaryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [accountResult, profileResult] = await Promise.all([
    supabase
      .from('app_users')
      .select('is_premium')
      .eq('id', user.id)
      .single(),
    supabase
      .from('wedding_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single(),
  ])

  if (!accountResult.data?.is_premium) redirect('/premium')

  const profile = profileResult.data

  if (!profile) redirect('/dashboard')

  const baseScore = (profile.readiness_score as number | null) ?? 0
  const totalBudget = (profile.total_budget as number | null) ?? 0
  const savingsCollected = (profile.savings_collected as number | null) ?? 0
  const weddingDate = (profile.wedding_date as string | null)
  const days = daysUntil(weddingDate)
  const months = monthsUntilDate(weddingDate)
  const monthlySavings = calculateMonthlySavings(totalBudget, savingsCollected, months)
  const checklistChecked = normalizeStringArray(profile.checklist_checked)
  const hiddenChecklistItemIds = normalizeStringArray(profile.hidden_checklist_item_ids)
  const customChecklistItems = normalizeCustomChecklistItems(profile.custom_checklist_items)
  const vendorPayments = normalizeVendorPayments(profile.vendor_payments)
  const finance = calculateDashboardFinance({
    totalBudget,
    savingsCollected,
    vendorPayments,
  })
  const vendorTotal = vendorPayments.reduce((sum, item) => sum + item.totalAmount, 0)
  const vendorPaid = vendorPayments.reduce((sum, item) => sum + item.paidAmount, 0)
  const vendorRemaining = Math.max(0, vendorTotal - vendorPaid)
  const vendorReminders = buildVendorReminderSummary(vendorPayments)
  const readiness = calculateDashboardReadiness({
    baseScore,
    finance,
    reminders: vendorReminders,
    checklist: calculateDashboardChecklistProgress({
      checkedIds: checklistChecked,
      customChecklistItems,
      hiddenChecklistItemIds,
    }),
    days,
  })
  const urgentVendorCount = vendorReminders.overdueCount + vendorReminders.dueSoonCount
  const vendorAttentionText = urgentVendorCount > 0
    ? `${formatRupiahExact(vendorReminders.urgentOutstanding)} perlu perhatian: ada pembayaran terlambat atau jatuh tempo dalam 7 hari.`
    : vendorReminders.unscheduledCount > 0
      ? `${vendorReminders.unscheduledCount} vendor belum punya tanggal pembayaran. Atur deadline dari dashboard.`
      : vendorPayments.length > 0
        ? 'Pembayaran vendor yang dicatat belum menunjukkan tenggat mendesak.'
        : null
  const alloc = profile.allocation_result as Record<string, AllocEntry> | null
  const topAlloc = alloc
    ? (Object.entries(alloc) as [string, AllocEntry][])
        .filter(([, item]) => item.estimatedAmount > 0)
        .sort((a, b) => b[1].estimatedAmount - a[1].estimatedAmount)
        .slice(0, 4)
    : []
  const priorities = buildSummaryChecklistPriorities({
    daysUntilWedding: days,
    checkedIds: checklistChecked,
    hiddenIds: hiddenChecklistItemIds,
    customItems: customChecklistItems,
  })
  const note = (profile.dashboard_note as string | null) ?? ''

  return (
    <main className="min-h-screen bg-nikah-bg px-4 py-4 sm:px-6 sm:py-8 print:bg-white print:px-0 print:py-0">
      <div className="max-w-[900px] mx-auto bg-white border border-nikah-border shadow-sm print:border-0 print:shadow-none" style={{ borderRadius: 'var(--d-radius)' }}>
        <div className="flex items-center justify-between gap-4 border-b border-nikah-border px-4 py-4 sm:px-[26px] sm:py-[22px] print:hidden">
          <Link href="/dashboard" className="text-sm font-bold text-nikah-deep">← Dashboard</Link>
          <PrintButton />
        </div>

        <div className="px-4 pb-7 pt-6 sm:px-[34px] sm:pb-10 sm:pt-[34px]">
          <div className="flex items-start justify-between gap-6" style={{ marginBottom: 28 }}>
            <div>
              <BrandLogo size="md" />
              <h1
                className="text-nikah-text"
                style={{ fontFamily: 'var(--font-playfair), "Cormorant Garamond", Georgia, serif', fontStyle: 'italic', fontWeight: 500, fontSize: 'clamp(28px, 8vw, 34px)', margin: '24px 0 8px', lineHeight: 1.08 }}
              >
                Ringkasan rencana pernikahan
              </h1>
              <p className="text-nikah-muted" style={{ fontSize: 14, margin: 0 }}>
                {((profile.partner_one_name as string | null) ?? 'Kamu')} &amp; {((profile.partner_two_name as string | null) ?? 'Pasangan')}
                {weddingDate ? ` · ${new Date(weddingDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}` : ''}
              </p>
            </div>
            <div className="text-right">
              <div className="text-nikah-deep" style={{ fontFamily: 'var(--font-playfair), "Cormorant Garamond", Georgia, serif', fontSize: 44, lineHeight: 1 }}>{readiness.score}</div>
              <div className="text-xs font-extrabold uppercase tracking-[0.14em] text-nikah-mauve">{readiness.label}</div>
              <div className="text-[10px] font-bold text-nikah-muted" style={{ marginTop: 4 }}>score dinamis</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: 10, marginBottom: 24 }}>
            {[
              { label: 'Budget', value: formatRupiahExact(totalBudget) },
              { label: 'Tabungan', value: formatRupiahExact(savingsCollected) },
              { label: 'Nabung/bln', value: formatRupiahExact(monthlySavings) },
              { label: 'Sisa vendor', value: formatRupiahExact(vendorRemaining) },
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
              {priorities.map(item => (
                <div key={item.id} className="bg-nikah-bg" style={{ borderRadius: 12, padding: '11px 13px' }}>
                  <div className="font-bold text-nikah-text" style={{ fontSize: 14 }}>{item.label}</div>
                  <div className="text-nikah-muted" style={{ fontSize: 11, marginTop: 3 }}>{item.category}</div>
                </div>
              ))}
              {priorities.length === 0 && (
                <p className="text-sm text-nikah-muted" style={{ margin: 0 }}>
                  {days === null
                    ? 'Tambahkan tanggal pernikahan di dashboard agar prioritas bisa disusun sesuai waktunya.'
                    : 'Tidak ada tugas aktif yang perlu ditampilkan dalam ringkasan ini.'}
                </p>
              )}
            </div>
          </section>

          <section style={{ marginBottom: 24 }}>
            <h2 className="text-xs font-extrabold uppercase tracking-[0.14em] text-nikah-mauve" style={{ margin: '0 0 10px' }}>Pembayaran vendor</h2>
            {vendorAttentionText && (
              <p
                className="text-sm"
                style={{
                  margin: '0 0 10px',
                  borderRadius: 12,
                  padding: '11px 13px',
                  color: urgentVendorCount > 0 ? '#9A5B00' : 'var(--nikah-muted)',
                  background: urgentVendorCount > 0 ? '#FEF0C7' : 'var(--nikah-bg)',
                }}
              >
                {vendorAttentionText}
              </p>
            )}
            <div className="grid" style={{ gap: 8 }}>
              {vendorPayments.length > 0 ? vendorPayments.slice(0, 6).map(item => {
                const status = getVendorPaymentStatus(item)
                const remaining = Math.max(0, item.totalAmount - item.paidAmount)

                return (
                  <div key={item.id} className="flex justify-between gap-4 bg-nikah-bg" style={{ borderRadius: 12, padding: '11px 13px' }}>
                    <div>
                      <div className="font-bold text-nikah-text" style={{ fontSize: 14 }}>{item.name}</div>
                      <div className="text-nikah-muted" style={{ fontSize: 11, marginTop: 3 }}>{item.category}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-nikah-deep font-bold" style={{ fontSize: 13 }}>
                        {remaining > 0 ? formatRupiahExact(remaining) : 'Lunas'}
                      </div>
                      <span
                        className="inline-block font-bold"
                        style={{
                          borderRadius: 999,
                          marginTop: 5,
                          padding: '3px 8px',
                          fontSize: 10,
                          color: status.color,
                          background: status.background,
                        }}
                      >
                        {status.label}
                      </span>
                    </div>
                  </div>
                )
              }) : (
                <p className="text-sm text-nikah-muted" style={{ margin: 0 }}>Belum ada vendor yang dicatat. Tambahkan vendor dari dashboard untuk melihat jadwal pembayaran.</p>
              )}
            </div>
          </section>

          <section style={{ marginBottom: 24 }}>
            <h2 className="text-xs font-extrabold uppercase tracking-[0.14em] text-nikah-mauve" style={{ margin: '0 0 10px' }}>Referensi budget</h2>
            <div className="grid grid-cols-2" style={{ gap: 8 }}>
              {topAlloc.map(([key, item]) => (
                <div key={key} className="bg-nikah-bg" style={{ borderRadius: 12, padding: '11px 13px' }}>
                  <div className="font-bold text-nikah-text" style={{ fontSize: 14 }}>
                    {({'catering':'Catering','venue':'Venue','decoration':'Dekorasi','documentation':'Dokumentasi','mua':'MUA & Busana','souvenir':'Souvenir','entertainment':'Hiburan','emergencyFund':'Dana Darurat'} as Record<string,string>)[key] ?? key}
                  </div>
                  <div className="text-nikah-muted" style={{ fontSize: 11, marginTop: 3 }}>{formatRupiahExact(item.estimatedAmount)} · {item.percentage}%</div>
                </div>
              ))}
            </div>
          </section>

          {note && (
            <section>
              <h2 className="text-xs font-extrabold uppercase tracking-[0.14em] text-nikah-mauve" style={{ margin: '0 0 10px' }}>Catatan</h2>
              <p className="bg-nikah-bg text-nikah-text" style={{ borderRadius: 12, padding: 14, fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', margin: 0 }}>{note}</p>
            </section>
          )}
        </div>
      </div>
    </main>
  )
}
