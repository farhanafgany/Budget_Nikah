'use client'
import Link from 'next/link'
import { BrandLogo } from '@/components/ui/BrandLogo'
import { logoutDashboard } from '@/app/dashboard/actions'

interface Props {
  userEmail: string
}

export function DashboardNavbar({ userEmail }: Props) {
  return (
    <header className="border-b border-nikah-border bg-nikah-bg">
      <div
        className="max-w-[1200px] mx-auto flex items-center justify-between"
        style={{ padding: '0 var(--d-pad-page)', height: 56 }}
      >
        <Link href="/" className="flex items-center">
          <BrandLogo size="sm" />
        </Link>
        <div className="flex items-center text-nikah-muted" style={{ gap: 12, fontSize: 13 }}>
          {/* Mobile: tombol Lihat Ringkasan sebagai pengganti avatar */}
          <Link
            href="/dashboard/summary"
            className="sm:hidden inline-flex items-center rounded-full font-bold text-white active:scale-95 active:brightness-90 transition-all"
            style={{ padding: '9px 15px', fontSize: 12, background: 'var(--landing-deep, #5A1E2A)' }}
          >
            Lihat Ringkasan
          </Link>

          {/* Desktop: avatar + email + logout */}
          <div
            className="hidden sm:flex rounded-full items-center justify-center text-white font-extrabold flex-shrink-0"
            style={{
              width: 34,
              height: 34,
              fontSize: 12,
              background: 'var(--landing-mauve, var(--nikah-mauve))',
            }}
            aria-hidden="true"
          >
            {userEmail.slice(0, 1).toUpperCase()}
          </div>
          <span className="hidden sm:block truncate max-w-[180px]">{userEmail}</span>
          <form action={logoutDashboard} className="hidden sm:block">
            <button
              type="submit"
              className="font-bold text-nikah-deep hover:text-nikah-text transition-colors rounded-full border border-nikah-border hover:bg-nikah-bg"
              style={{ padding: '9px 15px', fontSize: 12 }}
            >
              Keluar
            </button>
          </form>
        </div>
      </div>
    </header>
  )
}
