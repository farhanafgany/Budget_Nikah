import { HeroSection }     from '@/components/landing/HeroSection'
import { PainCards }       from '@/components/landing/PainCards'
import { FeatureShowcase } from '@/components/landing/FeatureShowcase'
import { HowItWorks }      from '@/components/landing/HowItWorks'
import { PricingSection }  from '@/components/landing/PricingSection'
import { FAQSection }      from '@/components/landing/FAQSection'

export default function LandingPage() {
  return (
    <main className="pb-20 md:pb-0">
      <HeroSection />
      <PainCards />
      <FeatureShowcase />
      <HowItWorks />
      <PricingSection />
      <FAQSection />
    </main>
  )
}
