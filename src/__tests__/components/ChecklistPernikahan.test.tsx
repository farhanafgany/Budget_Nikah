import { render, screen } from '@testing-library/react'
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
  beforeAll(() => {
    Object.defineProperty(Element.prototype, 'scrollIntoView', {
      configurable: true,
      value: jest.fn(),
    })
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
})
