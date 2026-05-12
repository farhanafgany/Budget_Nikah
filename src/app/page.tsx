import { Navbar }           from '@/components/landing/Navbar'
import { HeroSection }      from '@/components/landing/HeroSection'
import { PainCards }        from '@/components/landing/PainCards'
import { FeatureShowcase }  from '@/components/landing/FeatureShowcase'
import { HowItWorks }       from '@/components/landing/HowItWorks'
import { PricingSection }   from '@/components/landing/PricingSection'
import { FAQSection }       from '@/components/landing/FAQSection'
import { Footer }           from '@/components/landing/Footer'
import { FloatingWhatsApp } from '@/components/landing/FloatingWhatsApp'

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main className="pb-20 md:pb-0">
        <HeroSection />
        <PainCards />
        <FeatureShowcase />
        <HowItWorks />
        <PricingSection />
        <FAQSection />
        <Footer />
      </main>
      <FloatingWhatsApp />
    </>
  )
}
