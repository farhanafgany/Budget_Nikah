import { Navbar } from './Navbar'
import { HeroSection } from './HeroSection'
import { TrustMetrics } from './TrustMetrics'
import { PainCards } from './PainCards'
import { FeatureShowcase } from './FeatureShowcase'
import { SimulationPreview } from './SimulationPreview'
import { FounderNote } from './FounderNote'
import { Testimonials } from './Testimonials'
import { PricingSection } from './PricingSection'
import { FAQSection } from './FAQSection'
import { FinalCTA } from './FinalCTA'
import { Footer } from './Footer'
import { FloatingWhatsApp } from './FloatingWhatsApp'
import { SmoothSectionScroll } from './SmoothSectionScroll'
import styles from './LandingMobilePolish.module.css'

export function LandingPage() {
  return (
    <div className={`landing-theme ${styles.mobilePolish}`}>
      <SmoothSectionScroll />
      <Navbar />
      <main>
        <HeroSection />
        <TrustMetrics />
        <PainCards />
        <FeatureShowcase />
        <SimulationPreview />
        <FounderNote />
        <Testimonials />
        <PricingSection />
        <FAQSection />
        <FinalCTA />
        <Footer />
      </main>
      <FloatingWhatsApp />
    </div>
  )
}
