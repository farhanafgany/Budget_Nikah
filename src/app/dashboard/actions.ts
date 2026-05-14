'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

function formatDashboardError(error: { message?: string; code?: string }) {
  const message = error.message ?? 'Unknown error'
  if (
    error.code === 'PGRST204' ||
    message.includes('dashboard_note') ||
    message.includes('vendor_payments')
  ) {
    return 'Kolom database dashboard belum tersedia. Jalankan migration terbaru di Supabase, lalu coba lagi.'
  }
  return message
}

export async function updateTabungan(collected: number): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('wedding_profiles')
    .update({ savings_collected: collected })
    .eq('user_id', user.id)

  if (error) return { error: formatDashboardError(error) }
  revalidatePath('/dashboard')
  return {}
}

export async function toggleChecklistItem(
  id: string,
  isNowChecked: boolean,
  currentChecked: string[],
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const newChecked = isNowChecked
    ? [...currentChecked, id]
    : currentChecked.filter(i => i !== id)

  const { error } = await supabase
    .from('wedding_profiles')
    .update({ checklist_checked: newChecked })
    .eq('user_id', user.id)

  if (error) return { error: formatDashboardError(error) }
  revalidatePath('/dashboard')
  return {}
}

export async function toggleSeserahanItem(
  id: string,
  isNowChecked: boolean,
  currentChecked: string[],
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const newChecked = isNowChecked
    ? [...currentChecked, id]
    : currentChecked.filter(i => i !== id)

  const { error } = await supabase
    .from('wedding_profiles')
    .update({ seserahan_checked: newChecked })
    .eq('user_id', user.id)

  if (error) return { error: formatDashboardError(error) }
  revalidatePath('/dashboard')
  return {}
}

export async function updateDashboardNote(note: string): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('wedding_profiles')
    .update({ dashboard_note: note })
    .eq('user_id', user.id)

  if (error) return { error: formatDashboardError(error) }
  revalidatePath('/dashboard')
  return {}
}

export interface VendorPaymentInput {
  id: string
  name: string
  category: string
  totalAmount: number
  paidAmount: number
  dueDate: string
  installments?: {
    id: string
    amount: number
    date: string
  }[]
}

export async function updateVendorPayments(payments: VendorPaymentInput[]): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const sanitized = payments.map(item => ({
    id: item.id,
    name: item.name.slice(0, 80),
    category: item.category.slice(0, 40),
    totalAmount: Math.max(0, Math.round(item.totalAmount || 0)),
    paidAmount: Math.min(
      Math.max(0, Math.round(item.paidAmount || 0)),
      Math.max(0, Math.round(item.totalAmount || 0)),
    ),
    dueDate: item.dueDate,
    installments: Array.isArray(item.installments)
      ? item.installments.map(installment => ({
          id: installment.id,
          amount: Math.max(0, Math.round(installment.amount || 0)),
          date: installment.date,
        })).filter(installment => installment.id && installment.amount > 0)
      : [],
  }))

  const { error } = await supabase
    .from('wedding_profiles')
    .update({ vendor_payments: sanitized })
    .eq('user_id', user.id)

  if (error) return { error: formatDashboardError(error) }
  revalidatePath('/dashboard')
  return {}
}

export async function logoutDashboard(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/auth/signed-out')
}
