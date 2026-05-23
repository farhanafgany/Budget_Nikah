'use client'
import Link from 'next/link'
import { BrandLogo } from '@/components/ui/BrandLogo'
import { logoutDashboard } from '@/app/dashboard/actions'

interface Props {
  userEmail: string
}

export function DashboardNavbar({ userEmail }: Props) {
  return (
    <header className="sticky top-0 z-40 border-b border-nikah-border bg-white">
      <div
        className="max-w-[1200px] mx-auto flex items-center justify-between gap-3"
        style={{ padding: '0 var(--d-pad-page)', height: 64 }}
      >
        <Link href="/" className="flex items-center">
          <span className="md:hidden"><BrandLogo size="sm" /></span>
          <span className="hidden md:block"><BrandLogo size="md" /></span>
        </Link>
        <div className="flex min-w-0 items-center text-nikah-muted" style={{ gap: 10, fontSize: 13 }}>
          {/* Avatar — tampil di semua ukuran */}
          <div
            className="flex rounded-full items-center justify-center text-white font-extrabold flex-shrink-0"
            style={{
              width: 34,
              height: 34,
              fontSize: 12,
              background: 'var(--landing-mauve, var(--nikah-mauve))',
            }}
            aria-label={`Akun ${userEmail}`}
          >
            {userEmail.slice(0, 1).toUpperCase()}
          </div>

          {/* Desktop only: email + logout */}
          <span className="hidden sm:block truncate max-w-[180px]">{userEmail}</span>
          <form action={logoutDashboard}>
            <button
              type="submit"
              className="inline-flex items-center justify-center font-bold text-nikah-deep hover:text-nikah-text transition-colors rounded-full border border-nikah-border hover:bg-nikah-bg active:scale-[0.97] active:brightness-90"
              style={{ padding: '9px 15px', fontSize: 12 }}
              aria-label="Keluar"
            >
              Keluar
            </button>
          </form>
        </div>
      </div>
    </header>
  )
}
