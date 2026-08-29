import { Metadata } from "next"
import { VerificationFlow } from "@/components/portal/verification/VerificationFlow"

export const metadata: Metadata = {
  title: "Account Verification | NileLink Maritime & Logistics",
  description: "Verify your corporate email and WhatsApp phone number for NileLink Client Portal services",
}

export default function VerificationPage() {
  return (
    <div className="relative min-h-[calc(100vh-160px)] flex flex-col justify-center py-10">
      {/* Background Subtle Gradient Accents */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-1/4 h-80 w-80 rounded-full bg-primary-500/10 blur-3xl" />
        <div className="absolute bottom-10 left-1/4 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="relative z-10">
        <VerificationFlow />
      </div>
    </div>
  )
}
