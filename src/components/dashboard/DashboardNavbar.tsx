'use client'
import Link from 'next/link'
import { BrandLogo } from '@/components/ui/BrandLogo'
import { logoutDashboard } from '@/app/dashboard/actions'

interface Props {
  userEmail: string
}

export function DashboardNavbar({ userEmail }: Props) {
  return (
    <header
      className="sticky top-0 z-30 border-b border-nikah-border"
      style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)' }}
    >
      <div
        className="max-w-[1080px] mx-auto flex items-center justify-between"
        style={{ padding: '0 var(--d-pad-page)', height: 64 }}
      >
        <Link href="/" className="flex items-center">
          <BrandLogo size="sm" />
        </Link>
        <div className="flex items-center text-nikah-muted" style={{ gap: 12, fontSize: 12 }}>
          {/* Avatar circle */}
          <div
            className="hidden sm:flex rounded-full items-center justify-center text-white font-extrabold flex-shrink-0"
            style={{
              width: 30,
              height: 30,
              fontSize: 11,
              background: 'linear-gradient(135deg, #E8C0CC, var(--nikah-mauve))',
            }}
            aria-hidden="true"
          >
            {userEmail.slice(0, 1).toUpperCase()}
          </div>
          <span className="hidden sm:block truncate max-w-[180px]">{userEmail}</span>
          <form action={logoutDashboard}>
            <button
              type="submit"
              className="font-bold text-nikah-deep hover:text-nikah-text transition-colors rounded-full border border-nikah-deep hover:bg-nikah-bg"
              style={{ padding: '9px 18px', fontSize: 12 }}
            >
              Keluar
            </button>
          </form>
        </div>
      </div>
    </header>
  )
}
