'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function updateTabungan(collected: number): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('wedding_profiles')
    .update({ savings_collected: collected })
    .eq('user_id', user.id)

  if (error) return { error: error.message }
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

  if (error) return { error: error.message }
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

  if (error) return { error: error.message }
  revalidatePath('/dashboard')
  return {}
}
