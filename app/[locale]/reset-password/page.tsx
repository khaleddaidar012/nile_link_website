import { Container } from "@/components/ui/Container"
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm"
import { AlertCircle } from "lucide-react"
import { Link } from "@/navigation"
import { Button } from "@/components/ui/Button"

type Props = {
  searchParams: Promise<{ token?: string }>
}

export default async function ResetPasswordPage({ searchParams }: Props) {
  const { token } = await searchParams

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-secondary-950 via-slate-900 to-secondary-950 px-4 pt-36 pb-20 md:pt-44 md:pb-28">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-1/4 h-96 w-96 rounded-full bg-primary-500/15 blur-3xl" />
        <div className="absolute bottom-10 left-1/4 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <Container className="relative z-10 flex w-full items-center justify-center">
        {token ? (
          <ResetPasswordForm token={token} />
        ) : (
          <div className="w-full max-w-md rounded-2xl border border-secondary-200 bg-white p-8 text-center shadow-premium-xl dark:border-secondary-800 dark:bg-secondary-900">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400">
              <AlertCircle className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-bold text-secondary-900 dark:text-white">Invalid Reset Link</h2>
            <p className="mt-2 text-sm text-secondary-600 dark:text-secondary-400">
              This password reset link is missing a valid token or has expired.
            </p>
            <div className="mt-6">
              <Link href="/forgot-password">
                <Button className="w-full">Request New Reset Link</Button>
              </Link>
            </div>
          </div>
        )}
      </Container>
    </div>
  )
}
