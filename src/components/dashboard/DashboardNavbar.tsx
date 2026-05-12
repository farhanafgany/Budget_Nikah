'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Props {
  userEmail: string
}

export function DashboardNavbar({ userEmail }: Props) {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-nikah-border">
      <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">

        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#F5E8EC] to-[#C07888] flex items-center justify-center flex-shrink-0">
            <span className="text-white text-[10px] font-extrabold">B</span>
          </div>
          <span className="text-sm font-extrabold text-nikah-text tracking-tight">BudgetNikah</span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="hidden sm:block text-xs text-nikah-muted truncate max-w-[160px]">{userEmail}</span>
          <button
            onClick={handleLogout}
            className="text-xs font-semibold text-nikah-muted hover:text-nikah-text transition-colors px-3 py-1.5 rounded-full border border-nikah-border hover:border-nikah-text"
          >
            Keluar
          </button>
        </div>

      </div>
    </header>
  )
}
