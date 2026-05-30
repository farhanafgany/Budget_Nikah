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
  it('CTA masuk mengarah ke /auth/login', () => {
    render(<Navbar />)
    const cta = screen.getByRole('link', { name: /Masuk/i })
    expect(cta).toHaveAttribute('href', '/auth/login')
  })
})

import { TrustMetrics } from '../TrustMetrics'

describe('TrustMetrics', () => {
  it('tidak menampilkan teks garansi tanpa pertanyaan (sudah dipindah ke PricingSection)', () => {
    render(<TrustMetrics />)
    expect(screen.queryByText(/garansi tanpa pertanyaan/i)).toBeNull()
  })

  it('menampilkan fakta gabungan: tier kota dan readiness score', () => {
    render(<TrustMetrics />)
    expect(screen.getByText(/tier kota/i)).toBeInTheDocument()
    expect(screen.getByText(/readiness score/i)).toBeInTheDocument()
  })

  it('menampilkan heading utama TrustMetrics', () => {
    render(<TrustMetrics />)
    expect(screen.getByText(/tebak-tebakan/i)).toBeInTheDocument()
  })
})


import { FeatureShowcase } from '../FeatureShowcase'

describe('FeatureShowcase', () => {
  it('Wedding Readiness Score adalah satu-satunya fitur gratis', () => {
    render(<FeatureShowcase />)
    const gratisBadges = screen.getAllByText('✓ Gratis')
    expect(gratisBadges).toHaveLength(1)
  })

  it('fitur premium minimal 5 badge', () => {
    render(<FeatureShowcase />)
    const premiumBadges = screen.getAllByText('Premium')
    expect(premiumBadges.length).toBeGreaterThanOrEqual(5)
  })

  it('menampilkan micro-CTA untuk coba gratis dengan link ke /onboarding', () => {
    render(<FeatureShowcase />)
    const link = screen.getByRole('link', { name: /dicoba sekarang/i })
    expect(link).toHaveAttribute('href', '/onboarding')
  })
})

import { PricingSection } from '../PricingSection'

describe('PricingSection', () => {
  it('premium CTA mengarah ke /premium', () => {
    render(<PricingSection />)
    const premium = screen.getByRole('link', { name: /Beli Akses Premium/i })
    expect(premium).toHaveAttribute('href', '/premium')
  })

  it('free trial CTA mengarah ke /onboarding', () => {
    render(<PricingSection />)
    const freeTrial = screen.getByRole('link', { name: /Coba gratis dulu/i })
    expect(freeTrial).toHaveAttribute('href', '/onboarding')
  })

  it('menampilkan guarantee strip 3 hari tanpa pertanyaan', () => {
    render(<PricingSection />)
    expect(screen.getByText(/3 hari tanpa pertanyaan/i)).toBeInTheDocument()
  })
})

import { SocialProof } from '../SocialProof'

describe('SocialProof', () => {
  it('menampilkan heading utama', () => {
    render(<SocialProof />)
    expect(screen.getByText(/Bukan spreadsheet kering/i)).toBeInTheDocument()
  })

  it('menampilkan eyebrow jujur tanpa klaim palsu', () => {
    render(<SocialProof />)
    expect(screen.getByText(/Dibangun jujur untuk pasangan Indonesia/i)).toBeInTheDocument()
  })

  it('menampilkan fakta produk nyata: checklist, kota, score', () => {
    render(<SocialProof />)
    expect(screen.getByText(/checklist item/i)).toBeInTheDocument()
    expect(screen.getByText(/tier kota/i)).toBeInTheDocument()
    expect(screen.getByText(/readiness score/i)).toBeInTheDocument()
  })

  it('menampilkan garansi 3 hari di fact card', () => {
    render(<SocialProof />)
    expect(screen.getByText(/garansi tanpa pertanyaan/i)).toBeInTheDocument()
  })

  it('menampilkan guarantee strip 3 hari tanpa pertanyaan', () => {
    render(<SocialProof />)
    expect(screen.getByText(/3 hari tanpa pertanyaan/i)).toBeInTheDocument()
  })

  it('tidak menampilkan nama orang fiktif', () => {
    render(<SocialProof />)
    expect(screen.queryByText(/Rania/i)).toBeNull()
    expect(screen.queryByText(/Dewi/i)).toBeNull()
    expect(screen.queryByText(/Nisa/i)).toBeNull()
  })
})
