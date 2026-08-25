"use client"

import { useEffect, useState, use } from "react"
import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react"
import { Link } from "@/navigation"
import { Button } from "@/components/ui/Button"
import { Container } from "@/components/ui/Container"

type Props = {
  searchParams: Promise<{ token?: string }>
}

export default function VerifyEmailPage({ searchParams }: Props) {
  const t = useTranslations()
  const resolvedSearchParams = use(searchParams)
  const token = resolvedSearchParams.token
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (!token) {
      setLoading(false)
      setSuccess(false)
      setMessage(t("auth.verifyEmail.errorDesc") || "Missing verification token")
      return
    }

    async function verify() {
      try {
        const res = await fetch(`/api/auth/verify-email?token=${token}`)
        const data = await res.json()
        if (res.ok && data.success) {
          setSuccess(true)
        } else {
          setSuccess(false)
          setMessage(data.error || t("auth.verifyEmail.errorDesc") || "Verification failed")
        }
      } catch {
        setSuccess(false)
        setMessage("A network error occurred. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    verify()
  }, [token, t])

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-secondary-950 via-slate-900 to-secondary-950 px-4 pt-36 pb-20 md:pt-44 md:pb-28">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-1/4 h-96 w-96 rounded-full bg-primary-500/15 blur-3xl" />
        <div className="absolute bottom-10 left-1/4 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <Container className="relative z-10 flex w-full items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md rounded-2xl border border-secondary-200 bg-white p-8 text-center shadow-premium-xl dark:border-secondary-800 dark:bg-secondary-900"
        >
          {loading ? (
            <div className="py-8">
              <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary-600" />
              <h2 className="mt-4 text-lg font-bold text-secondary-900 dark:text-white">
                {t("auth.verifyEmail.verifying") || "Verifying your email..."}
              </h2>
            </div>
          ) : success ? (
            <div>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold text-secondary-900 dark:text-white">
                {t("auth.verifyEmail.successTitle") || "Email Verified Successfully!"}
              </h2>
              <p className="mt-2 text-sm text-secondary-600 dark:text-secondary-400">
                {t("auth.verifyEmail.successDesc") || "Your account is now fully verified. You can proceed to access your portal."}
              </p>
              <div className="mt-6">
                <Link href="/portal">
                  <Button className="w-full">
                    <span>{t("auth.verifyEmail.continueBtn") || "Go to Client Portal"}</span>
                    <ArrowRight className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0 rtl:rotate-180" />
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400">
                <XCircle className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold text-secondary-900 dark:text-white">
                {t("auth.verifyEmail.errorTitle") || "Verification Failed"}
              </h2>
              <p className="mt-2 text-sm text-secondary-600 dark:text-secondary-400">{message}</p>
              <div className="mt-6">
                <Link href="/login">
                  <Button variant="outline" className="w-full">
                    Return to Login
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </Container>
    </div>
  )
}
