import { Hero } from '@/components/landing/Hero'
import { PainCards } from '@/components/landing/PainCards'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { SimulationPreview } from '@/components/landing/SimulationPreview'
import { FinalCTA } from '@/components/landing/FinalCTA'

export default function LandingPage() {
  return (
    <main className="pb-20 md:pb-0">
      <Hero />
      <PainCards />
      <FeaturesSection />
      <SimulationPreview />
      <FinalCTA />
    </main>
  )
}
