import { Navbar }             from '@/components/landing/Navbar'
import { HeroSection }        from '@/components/landing/HeroSection'
import { TrustMetrics }       from '@/components/landing/TrustMetrics'
import { PainCards }          from '@/components/landing/PainCards'
import { FeatureShowcase }    from '@/components/landing/FeatureShowcase'
import { SimulationPreview }  from '@/components/landing/SimulationPreview'
import { FounderNote }        from '@/components/landing/FounderNote'
import { Testimonials }       from '@/components/landing/Testimonials'
import { PricingSection }     from '@/components/landing/PricingSection'
import { FAQSection }         from '@/components/landing/FAQSection'
import { FinalCTA }           from '@/components/landing/FinalCTA'
import { Footer }             from '@/components/landing/Footer'
import { FloatingWhatsApp }   from '@/components/landing/FloatingWhatsApp'
import { SmoothSectionScroll } from '@/components/landing/SmoothSectionScroll'

export default function LandingPage() {
  return (
    <div className="landing-theme">
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
