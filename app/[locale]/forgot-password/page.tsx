import Image from "next/image"
import { Container } from "@/components/ui/Container"
import { ForgotPasswordWizard } from "@/components/auth/ForgotPasswordWizard"

export default async function ForgotPasswordPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pt-36 pb-20 md:pt-44 md:pb-28">
      {/* Official Branded Logistics Hero Background */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/hero-bg.jpg"
          alt="NileLink Freight & Logistics"
          fill
          sizes="100vw"
          priority
          className="object-cover object-center"
        />
        {/* Official Website Hero Background (Crisp port/shipping background without blur) */}
        <div className="absolute inset-0 bg-gradient-to-r from-secondary-900/90 via-secondary-900/75 to-secondary-900/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary-950/60 via-transparent to-secondary-950/40" />
      </div>

      <Container className="relative z-10 flex w-full items-center justify-center">
        <ForgotPasswordWizard />
      </Container>
    </div>
  )
}
