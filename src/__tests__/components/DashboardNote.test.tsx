import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { updateDashboardNote } from '@/app/dashboard/actions'
import { DashboardNote } from '@/components/dashboard/DashboardNote'

jest.mock('@/app/dashboard/actions', () => ({
  updateDashboardNote: jest.fn(),
}))

jest.mock('@/hooks/useDashboardAction', () => ({
  useHandleActionError: () => (error?: string) => error ?? '',
}))

jest.mock('@/lib/analytics', () => ({
  track: jest.fn(),
}))

describe('DashboardNote quick notes', () => {
  const mockedUpdateDashboardNote = jest.mocked(updateDashboardNote)

  beforeEach(() => {
    jest.clearAllMocks()
    mockedUpdateDashboardNote.mockResolvedValue({})
  })

  it('adds a structured note template and saves it', async () => {
    render(<DashboardNote initialNote="" />)

    fireEvent.click(screen.getByRole('button', { name: '+ Follow-up vendor' }))

    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
    expect(textarea.value).toContain('Follow-up vendor:')
    expect(textarea.value).toContain('Yang perlu ditanya:')

    fireEvent.click(screen.getByRole('button', { name: 'Simpan' }))

    await waitFor(() => {
      expect(mockedUpdateDashboardNote).toHaveBeenCalledWith(expect.stringContaining('Follow-up vendor:'))
    })
  })
})
