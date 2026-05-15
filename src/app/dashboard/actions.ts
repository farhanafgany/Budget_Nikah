'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

function formatDashboardError(error: { message?: string; code?: string }) {
  const message = error.message ?? 'Unknown error'
  if (
    error.code === 'PGRST204' ||
    message.includes('dashboard_note') ||
    message.includes('vendor_payments') ||
    message.includes('custom_seserahan_items') ||
    message.includes('hidden_seserahan_item_ids') ||
    message.includes('savings_history')
  ) {
    return 'Kolom database dashboard belum tersedia. Jalankan migration terbaru di Supabase, lalu coba lagi.'
  }
  return message
}

export async function updateTabungan(collected: number): Promise<{ error?: string }> {
  return updateTabunganWithHistory(collected, [])
}

export interface SavingsHistoryInput {
  id: string
  type: 'add' | 'subtract'
  amount: number
  balanceAfter: number
  date: string
}

export async function updateTabunganWithHistory(
  collected: number,
  history: SavingsHistoryInput[],
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const sanitizedHistory = history
    .map(item => ({
      id: item.id,
      type: item.type === 'subtract' ? 'subtract' : 'add',
      amount: Math.max(0, Math.round(item.amount || 0)),
      balanceAfter: Math.max(0, Math.round(item.balanceAfter || 0)),
      date: item.date,
    }))
    .filter(item => item.id && item.amount > 0)

  const { error } = await supabase
    .from('wedding_profiles')
    .update({
      savings_collected: collected,
      savings_history: sanitizedHistory,
    })
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
  const newChecked = isNowChecked
    ? [...currentChecked, id]
    : currentChecked.filter(i => i !== id)

  return updateChecklistItems(newChecked)
}

export async function updateChecklistItems(checkedIds: string[]): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const sanitized = Array.from(new Set(checkedIds.filter(Boolean)))

  const { error } = await supabase
    .from('wedding_profiles')
    .update({ checklist_checked: sanitized })
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
  const newChecked = isNowChecked
    ? [...currentChecked, id]
    : currentChecked.filter(i => i !== id)

  return updateSeserahanItems(newChecked)
}

export async function updateSeserahanItems(checkedIds: string[]): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const sanitized = Array.from(new Set(checkedIds.filter(Boolean)))

  const { error } = await supabase
    .from('wedding_profiles')
    .update({ seserahan_checked: sanitized })
    .eq('user_id', user.id)

  if (error) return { error: formatDashboardError(error) }
  revalidatePath('/dashboard')
  return {}
}

export interface CustomSeserahanInput {
  id: string
  label: string
}

export async function updateCustomSeserahanItems(items: CustomSeserahanInput[]): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const sanitized = items
    .map(item => ({
      id: item.id,
      label: item.label.trim().slice(0, 80),
    }))
    .filter(item => item.id && item.label)

  const { error } = await supabase
    .from('wedding_profiles')
    .update({ custom_seserahan_items: sanitized })
    .eq('user_id', user.id)

  if (error) return { error: formatDashboardError(error) }
  revalidatePath('/dashboard')
  return {}
}

export async function updateHiddenSeserahanItems(ids: string[]): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const sanitized = Array.from(new Set(ids.filter(Boolean)))

  const { error } = await supabase
    .from('wedding_profiles')
    .update({ hidden_seserahan_item_ids: sanitized })
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
