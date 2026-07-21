import { HeroSection } from "@/components/sections/HeroSection"
import { AboutPreview } from "@/components/sections/AboutPreview"
import { ServicesPreview } from "@/components/sections/ServicesPreview"
import { WhyChooseUs } from "@/components/sections/WhyChooseUs"
import { GlobalCoverage } from "@/components/sections/GlobalCoverage"
import { FAQ } from "@/components/sections/FAQ"
import { CTASection } from "@/components/sections/CTASection"

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutPreview />
      <ServicesPreview />
      <WhyChooseUs />
      <GlobalCoverage />
      <FAQ />
      <CTASection />
    </>
  )
}
