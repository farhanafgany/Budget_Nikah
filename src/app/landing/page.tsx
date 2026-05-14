import { Navbar }             from '@/components/landing/Navbar'
import { HeroSection }        from '@/components/landing/HeroSection'
import { PainCards }          from '@/components/landing/PainCards'
import { FeatureShowcase }    from '@/components/landing/FeatureShowcase'
import { SimulationPreview }  from '@/components/landing/SimulationPreview'
import { HowItWorks }         from '@/components/landing/HowItWorks'
import { PricingSection }     from '@/components/landing/PricingSection'
import { FAQSection }         from '@/components/landing/FAQSection'
import { FinalCTA }           from '@/components/landing/FinalCTA'
import { Footer }             from '@/components/landing/Footer'
import { FloatingWhatsApp }   from '@/components/landing/FloatingWhatsApp'
import { SmoothSectionScroll } from '@/components/landing/SmoothSectionScroll'

export default function LandingPage() {
  return (
    <>
      <SmoothSectionScroll />
      <Navbar />
      <main className="pb-20 md:pb-0">
        <HeroSection />
        <PainCards />
        <FeatureShowcase />
        <SimulationPreview />
        <HowItWorks />
        <PricingSection />
        <FAQSection />
        <FinalCTA />
        <Footer />
      </main>
      <FloatingWhatsApp />
    </>
  )
}
