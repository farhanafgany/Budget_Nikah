import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { updateVendorPayments } from '@/app/dashboard/actions'
import { VendorPaymentTracker } from '@/components/dashboard/VendorPaymentTracker'

jest.mock('@/app/dashboard/actions', () => ({
  updateVendorPayments: jest.fn(),
}))

jest.mock('@/hooks/useDashboardAction', () => ({
  useHandleActionError: () => (error?: string) => error ?? '',
}))

jest.mock('@/lib/analytics', () => ({
  track: jest.fn(),
}))

const mockedUpdateVendorPayments = jest.mocked(updateVendorPayments)

const vendor = {
  id: 'venue-1',
  name: 'Venue Mawar',
  category: 'Venue',
  totalAmount: 10_000_000,
  paidAmount: 2_000_000,
  dueDate: '2026-06-03',
}

describe('VendorPaymentTracker sensitive actions', () => {
  beforeEach(() => {
    mockedUpdateVendorPayments.mockReset()
    mockedUpdateVendorPayments.mockResolvedValue({})
  })

  it('asks for confirmation before recording the remaining bill as paid', async () => {
    render(<VendorPaymentTracker initialPayments={[vendor]} />)

    fireEvent.click(screen.getByRole('button', { name: 'Tandai Lunas' }))

    expect(mockedUpdateVendorPayments).not.toHaveBeenCalled()
    expect(screen.getByText(/Sisa Rp 8.000.000 akan dicatat/)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Ya, tandai lunas' }))

    await waitFor(() => expect(mockedUpdateVendorPayments).toHaveBeenCalledTimes(1))
    expect(mockedUpdateVendorPayments.mock.calls[0][0][0].paidAmount).toBe(10_000_000)
  })

  it('asks for confirmation before removing a vendor', async () => {
    render(<VendorPaymentTracker initialPayments={[vendor]} />)

    fireEvent.click(screen.getByRole('button', { name: 'Hapus Venue Mawar' }))

    expect(mockedUpdateVendorPayments).not.toHaveBeenCalled()
    expect(screen.getByText(/Riwayat pembayaran vendor ini akan dihapus/)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Ya, hapus vendor' }))

    await waitFor(() => expect(mockedUpdateVendorPayments).toHaveBeenCalledWith([]))
  })
})
