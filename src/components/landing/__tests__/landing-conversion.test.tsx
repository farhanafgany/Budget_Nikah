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
  it('tidak menampilkan teks garansi refund (sudah dipindah ke PricingSection)', () => {
    render(<TrustMetrics />)
    expect(screen.queryByText(/garansi refund/i)).toBeNull()
  })

  it('menampilkan metric 12 bulan timeline', () => {
    render(<TrustMetrics />)
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText(/bulan timeline/i)).toBeInTheDocument()
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
  it('primary CTA mengarah ke /onboarding', () => {
    render(<PricingSection />)
    const primary = screen.getByRole('link', { name: /Mulai Sekarang/i })
    expect(primary).toHaveAttribute('href', '/onboarding')
  })

  it('secondary CTA mengarah ke /premium', () => {
    render(<PricingSection />)
    const secondary = screen.getByRole('link', { name: /Langsung Beli Akses Premium/i })
    expect(secondary).toHaveAttribute('href', '/premium')
  })

  it('menampilkan guarantee strip 3 hari tanpa pertanyaan', () => {
    render(<PricingSection />)
    expect(screen.getByText(/3 hari tanpa pertanyaan/i)).toBeInTheDocument()
  })
})

import { SocialProof } from '../SocialProof'

describe('SocialProof', () => {
  it('menampilkan heading utama dengan pesan emosional', () => {
    render(<SocialProof />)
    expect(screen.getByText(/Persiapan yang lebih tenang/i)).toBeInTheDocument()
  })

  it('copy body tidak membuat klaim kompetitif tentang aplikasi lain', () => {
    render(<SocialProof />)
    expect(screen.queryByText(/tidak ada alat/i)).toBeNull()
    expect(screen.queryByText(/lebih baik dari/i)).toBeNull()
  })

  it('menampilkan guarantee strip 3 hari tanpa pertanyaan', () => {
    render(<SocialProof />)
    expect(screen.getByText(/3 hari tanpa pertanyaan/i)).toBeInTheDocument()
  })

  it('menampilkan minimal 3 testimonial', () => {
    render(<SocialProof />)
    // Setiap testimonial punya lokasi sebagai identifier
    expect(screen.getByText('Jakarta')).toBeInTheDocument()
    expect(screen.getByText('Bandung')).toBeInTheDocument()
    expect(screen.getByText('Surabaya')).toBeInTheDocument()
  })

  it('menampilkan eyebrow social proof', () => {
    render(<SocialProof />)
    expect(screen.getByText(/Dari pasangan yang sudah pakai/i)).toBeInTheDocument()
  })
})
