import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { calculatePressureLevel } from '@/lib/scoring'
import { DashboardNavbar } from '@/components/dashboard/DashboardNavbar'
import { DashboardClient } from '@/components/dashboard/DashboardClient'
import type { CustomSeserahanInput, SavingsHistoryInput, VendorPaymentInput } from '@/app/dashboard/actions'

function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return null
  const diff = date.getTime() - Date.now()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

interface AllocEntry {
  percentage: number
  estimatedAmount: number
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

function normalizeCustomSeserahanItems(value: unknown): CustomSeserahanInput[] {
  if (!Array.isArray(value)) return []
  return value
    .filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null)
    .map(item => ({
      id: typeof item.id === 'string' ? item.id : crypto.randomUUID(),
      label: typeof item.label === 'string' ? item.label : '',
    }))
    .filter(item => item.label)
}

function normalizeSavingsHistory(value: unknown): SavingsHistoryInput[] {
  if (!Array.isArray(value)) return []
  return value
    .filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null)
    .map(item => ({
      id: typeof item.id === 'string' ? item.id : crypto.randomUUID(),
      type: (item.type === 'subtract' ? 'subtract' : 'add') as SavingsHistoryInput['type'],
      amount: typeof item.amount === 'number' ? item.amount : 0,
      balanceAfter: typeof item.balanceAfter === 'number' ? item.balanceAfter : 0,
      date: typeof item.date === 'string' ? item.date : '',
    }))
    .filter(item => item.amount > 0)
}

function normalizeStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: account } = await supabase
    .from('app_users')
    .select('is_premium')
    .eq('id', user.id)
    .single()

  if (!account?.is_premium) {
    redirect('/premium')
  }

  const { data: profile } = await supabase
    .from('wedding_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!profile) {
    return (
      <div className="dashboard-theme min-h-screen bg-nikah-bg flex items-center justify-center px-6">
        <div className="max-w-sm w-full text-center bg-white rounded-3xl p-8 shadow-sm border border-nikah-border">
          <div className="text-4xl mb-4" aria-hidden="true">💍</div>
          <h2 className="text-xl font-extrabold text-nikah-text mb-2">Belum ada data</h2>
          <p className="text-nikah-muted text-sm mb-6 font-light">
            Mulai susun wedding plan kamu agar semuanya terasa lebih terarah.
          </p>
          <a href="/onboarding" className="block w-full bg-nikah-deep text-white font-bold py-4 rounded-full text-sm text-center">
            Mulai Wedding Plan →
          </a>
        </div>
      </div>
    )
  }

  const days       = daysUntil(profile.wedding_date as string | null)
  const score      = (profile.readiness_score as number | null) ?? 0
  const label      = score >= 70 ? 'Healthy' : score >= 40 ? 'Moderate' : 'High Risk'
  const pressure   = calculatePressureLevel(score)
  const alloc      = profile.allocation_result as Record<string, AllocEntry> | null

  return (
    <div className="dashboard-theme min-h-screen bg-nikah-bg" style={{ paddingBottom: 60 }}>
      <DashboardNavbar userEmail={user.email ?? ''} />
      <DashboardClient
        userName1={(profile.partner_one_name as string | null) ?? 'Kamu'}
        userName2={(profile.partner_two_name as string | null) ?? 'Pasangan'}
        score={score}
        label={label}
        pressure={pressure}
        days={days}
        alloc={alloc}
        totalBudget={(profile.total_budget as number | null) ?? 0}
        guestCount={(profile.guest_count as number | null)}
        weddingDate={(profile.wedding_date as string | null)}
        tabunganCollected={(profile.savings_collected as number | null) ?? 0}
        savingsHistory={normalizeSavingsHistory(profile.savings_history)}
        checklistChecked={(profile.checklist_checked as string[] | null) ?? []}
        seserahanChecked={(profile.seserahan_checked as string[] | null) ?? []}
        customSeserahanItems={normalizeCustomSeserahanItems(profile.custom_seserahan_items)}
        hiddenSeserahanItemIds={normalizeStringArray(profile.hidden_seserahan_item_ids)}
        dashboardNote={(profile.dashboard_note as string | null) ?? ''}
        vendorPayments={normalizeVendorPayments(profile.vendor_payments)}
      />
    </div>
  )
}
