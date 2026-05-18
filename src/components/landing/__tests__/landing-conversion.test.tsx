import { render, screen } from '@testing-library/react'
import { SimulationPreview } from '../SimulationPreview'

describe('SimulationPreview', () => {
  it('tidak menggunakan kata "Geser" yang mengimplikasikan slider', () => {
    render(<SimulationPreview />)
    expect(screen.queryByText(/Geser/)).toBeNull()
  })

  it('menampilkan copy yang benar tanpa klaim interaktivitas', () => {
    render(<SimulationPreview />)
    expect(screen.getByText(/Dari 600 ke 350 tamu/)).toBeInTheDocument()
  })
})
