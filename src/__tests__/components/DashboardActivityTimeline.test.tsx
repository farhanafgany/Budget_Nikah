import { fireEvent, render, screen } from '@testing-library/react'
import { DashboardActivityTimeline } from '@/components/dashboard/DashboardActivityTimeline'
import type { DashboardActivityItem } from '@/lib/dashboardActivity'

const items: DashboardActivityItem[] = [
  {
    id: 'deadline',
    title: 'Pembayaran Venue Mawar segera jatuh tempo',
    body: 'Rp 8.000.000 masih perlu disiapkan.',
    meta: '4 hari lagi',
    tone: 'warning',
    href: '#vendor-payments',
    sortTime: 20,
  },
  {
    id: 'saving',
    title: 'Tabungan bertambah Rp 1.000.000',
    body: 'Saldo tabungan menjadi Rp 5.000.000.',
    meta: '20 Mei',
    tone: 'good',
    href: '#savings',
    sortTime: 10,
  },
]

describe('DashboardActivityTimeline', () => {
  it('shows one activity by default and expands the rest on request', () => {
    render(<DashboardActivityTimeline items={items} />)

    expect(screen.getByText('Pembayaran Venue Mawar segera jatuh tempo')).toBeInTheDocument()
    expect(screen.queryByText('Tabungan bertambah Rp 1.000.000')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Lihat semua aktivitas (1 lagi)' }))

    expect(screen.getByText('Tabungan bertambah Rp 1.000.000')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Tutup aktivitas' }))

    expect(screen.queryByText('Tabungan bertambah Rp 1.000.000')).not.toBeInTheDocument()
  })
})
