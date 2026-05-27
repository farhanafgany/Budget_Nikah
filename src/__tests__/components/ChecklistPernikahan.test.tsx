import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { updateHiddenChecklistItems } from '@/app/dashboard/actions'
import { ChecklistPernikahan } from '@/components/dashboard/ChecklistPernikahan'

jest.mock('@/app/dashboard/actions', () => ({
  updateChecklistItems: jest.fn(),
  updateCustomChecklistItems: jest.fn(),
  updateHiddenChecklistItems: jest.fn(),
}))

jest.mock('@/hooks/useDashboardAction', () => ({
  useHandleActionError: () => jest.fn(),
}))

jest.mock('@/lib/analytics', () => ({
  track: jest.fn(),
}))

describe('ChecklistPernikahan priority focus', () => {
  const mockedUpdateHiddenChecklistItems = jest.mocked(updateHiddenChecklistItems)

  beforeAll(() => {
    Object.defineProperty(Element.prototype, 'scrollIntoView', {
      configurable: true,
      value: jest.fn(),
    })
  })

  beforeEach(() => {
    jest.clearAllMocks()
    mockedUpdateHiddenChecklistItems.mockResolvedValue({})
  })

  it('opens the requested timeline and expands a focused task outside the preview', async () => {
    render(
      <ChecklistPernikahan
        checkedIds={[]}
        days={3}
        focusRequest={{ checklistId: 'pilih-parfum', requestId: 1 }}
      />,
    )

    expect(await screen.findByText('Pilih parfum untuk hari H')).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: '6 bln' })).toHaveAttribute('aria-selected', 'true')
  })

  it('allows a hidden default item to be restored', async () => {
    const onHiddenItemsSaved = jest.fn()

    render(
      <ChecklistPernikahan
        checkedIds={[]}
        days={3}
        hiddenDefaultIds={['packing-honeymoon']}
        onHiddenItemsSaved={onHiddenItemsSaved}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Lihat item tersembunyi (1)' }))
    fireEvent.click(screen.getByRole('button', { name: 'Pulihkan Packing untuk bulan madu' }))

    await waitFor(() => {
      expect(mockedUpdateHiddenChecklistItems).toHaveBeenCalledWith([])
      expect(onHiddenItemsSaved).toHaveBeenCalledWith([])
    })
    expect(screen.getByText('Packing untuk bulan madu')).toBeInTheDocument()
  })
})
