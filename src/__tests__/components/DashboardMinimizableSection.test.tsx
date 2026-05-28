import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { DashboardMinimizableSection } from '@/components/dashboard/DashboardMinimizableSection'

jest.mock('@/lib/analytics', () => ({
  track: jest.fn(),
}))

function renderSection() {
  return render(
    <DashboardMinimizableSection
      sectionId="seserahan"
      title="Seserahan"
      badge="2 siap"
    >
      {({ minimizeButton }) => (
        <div>
          <header>
            <span>Header card</span>
            {minimizeButton}
          </header>
          <div>Isi daftar seserahan</div>
        </div>
      )}
    </DashboardMinimizableSection>,
  )
}

describe('DashboardMinimizableSection', () => {
  beforeEach(() => {
    window.localStorage.clear()
    jest.clearAllMocks()
  })

  it('lets users minimize and restore an optional dashboard card', () => {
    renderSection()

    expect(screen.getByText('Isi daftar seserahan')).toBeVisible()

    fireEvent.click(screen.getByRole('button', { name: 'Sembunyikan Seserahan' }))

    expect(screen.queryByText('Isi daftar seserahan')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Tampilkan Seserahan' })).toBeInTheDocument()
    expect(screen.queryByText('Disembunyikan dari tampilan utama. Bisa dibuka lagi kapan pun.')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Tampilkan Seserahan' }))

    expect(screen.getByText('Isi daftar seserahan')).toBeVisible()
  })

  it('keeps minimized preference after the card is rendered again', async () => {
    const { unmount } = renderSection()

    fireEvent.click(screen.getByRole('button', { name: 'Sembunyikan Seserahan' }))
    unmount()

    renderSection()

    await waitFor(() => {
      expect(screen.queryByText('Isi daftar seserahan')).not.toBeInTheDocument()
    })
    expect(screen.getByRole('button', { name: 'Tampilkan Seserahan' })).toBeInTheDocument()
  })
})
