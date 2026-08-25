import { Container } from "@/components/ui/Container"
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm"

export default async function ForgotPasswordPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-secondary-950 via-slate-900 to-secondary-950 px-4 pt-36 pb-20 md:pt-44 md:pb-28">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-1/4 h-96 w-96 rounded-full bg-primary-500/15 blur-3xl" />
        <div className="absolute bottom-10 left-1/4 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <Container className="relative z-10 flex w-full items-center justify-center">
        <ForgotPasswordForm />
      </Container>
    </div>
  )
}
