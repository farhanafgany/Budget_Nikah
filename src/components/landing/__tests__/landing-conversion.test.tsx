import { render, screen, fireEvent } from '@testing-library/react'
import { SimulationPreview } from '../SimulationPreview'
import { FAQSection } from '../FAQSection'

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

describe('FAQSection', () => {
  it('jawaban "Bagaimana setelah bayar" dimulai dengan Langsung aktif', () => {
    render(<FAQSection />)
    // FAQ index 2 (ketiga) tidak terbuka secara default — perlu diklik
    const paymentQuestion = screen.getByText('Bagaimana setelah saya bayar?')
    fireEvent.click(paymentQuestion)
    expect(screen.getByText(/Langsung aktif\./)).toBeInTheDocument()
  })
})

import { Navbar } from '../Navbar'

describe('Navbar', () => {
  it('CTA mengarah langsung ke /onboarding bukan ke #harga', () => {
    render(<Navbar />)
    const cta = screen.getByRole('link', { name: /Mulai Gratis/i })
    expect(cta).toHaveAttribute('href', '/onboarding')
  })
})

import { TrustMetrics } from '../TrustMetrics'

describe('TrustMetrics', () => {
  it('tidak menampilkan teks garansi refund (sudah dipindah ke PricingSection)', () => {
    render(<TrustMetrics />)
    expect(screen.queryByText(/garansi refund/i)).toBeNull()
  })

  it('menampilkan metric 12 bulan coverage', () => {
    render(<TrustMetrics />)
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText(/bulan coverage/i)).toBeInTheDocument()
  })

  it('menampilkan heading yang baru', () => {
    render(<TrustMetrics />)
    expect(screen.getByText(/Kenapa BudgetNikah berbeda/i)).toBeInTheDocument()
  })
})
