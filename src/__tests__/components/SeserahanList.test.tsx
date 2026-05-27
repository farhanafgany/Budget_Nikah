import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { updateHiddenSeserahanItems } from '@/app/dashboard/actions'
import { SeserahanList } from '@/components/dashboard/SeserahanList'

jest.mock('@/app/dashboard/actions', () => ({
  updateCustomSeserahanItems: jest.fn(),
  updateHiddenSeserahanItems: jest.fn(),
  updateSeserahanItems: jest.fn(),
}))

jest.mock('@/lib/analytics', () => ({
  track: jest.fn(),
}))

describe('SeserahanList hidden default items', () => {
  const mockedUpdateHiddenSeserahanItems = jest.mocked(updateHiddenSeserahanItems)

  beforeEach(() => {
    jest.clearAllMocks()
    mockedUpdateHiddenSeserahanItems.mockResolvedValue({})
  })

  it('allows a hidden default item to be restored', async () => {
    render(
      <SeserahanList
        checkedIds={[]}
        customItems={[]}
        hiddenDefaultIds={['alat-sholat']}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Lihat item tersembunyi (1)' }))
    fireEvent.click(screen.getByRole('button', { name: 'Pulihkan Seperangkat alat sholat' }))

    await waitFor(() => {
      expect(mockedUpdateHiddenSeserahanItems).toHaveBeenCalledWith([])
    })
    expect(screen.getByText('Seperangkat alat sholat')).toBeInTheDocument()
  })
})
