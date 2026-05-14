import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { calculatePressureLevel } from '@/lib/scoring'
import { DashboardNavbar } from '@/components/dashboard/DashboardNavbar'
import { DashboardClient } from '@/components/dashboard/DashboardClient'
import { BrandLogo } from '@/components/ui/BrandLogo'
import type { VendorPaymentInput } from '@/app/dashboard/actions'

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
    const paymentUrl = process.env.NEXT_PUBLIC_PAYMENT_URL ?? '/'

    return (
      <div className="min-h-screen bg-nikah-bg" style={{ paddingBottom: 60 }}>
        <DashboardNavbar userEmail={user.email ?? ''} />
        <main className="px-6 py-12">
          <div className="max-w-[440px] mx-auto bg-white border border-nikah-border shadow-sm text-center" style={{ borderRadius: 'var(--d-radius)', padding: '34px 28px' }}>
            <div className="flex justify-center" style={{ marginBottom: 22 }}>
              <BrandLogo size="md" />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve" style={{ marginBottom: 8 }}>
              Akses premium belum aktif
            </p>
            <h1
              className="text-nikah-text"
              style={{
                fontFamily: 'var(--font-fraunces, Georgia, serif)',
                fontStyle: 'italic',
                fontWeight: 500,
                fontSize: 30,
                lineHeight: 1.12,
                margin: '0 0 10px',
              }}
            >
              Dashboard kamu sudah siap, tinggal aktifkan akses.
            </h1>
            <p className="text-nikah-muted font-light" style={{ fontSize: 14, lineHeight: 1.6, margin: '0 0 24px' }}>
              Jika kamu sudah menyelesaikan pembayaran, akses akan aktif setelah pembayaran terverifikasi.
            </p>
            <a
              href={paymentUrl}
              target={paymentUrl === '/' ? undefined : '_blank'}
              rel={paymentUrl === '/' ? undefined : 'noopener noreferrer'}
              className="block w-full bg-nikah-deep text-white font-bold rounded-full text-sm text-center hover:opacity-90 transition"
              style={{ padding: '14px 22px' }}
            >
              Dapatkan Akses Sekarang →
            </a>
          </div>
        </main>
      </div>
    )
  }

  const { data: profile } = await supabase
    .from('wedding_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!profile) {
    return (
      <div className="min-h-screen bg-nikah-bg flex items-center justify-center px-6">
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
    <div className="min-h-screen bg-nikah-bg" style={{ paddingBottom: 60 }}>
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
        checklistChecked={(profile.checklist_checked as string[] | null) ?? []}
        seserahanChecked={(profile.seserahan_checked as string[] | null) ?? []}
        dashboardNote={(profile.dashboard_note as string | null) ?? ''}
        vendorPayments={normalizeVendorPayments(profile.vendor_payments)}
      />
    </div>
  )
}
