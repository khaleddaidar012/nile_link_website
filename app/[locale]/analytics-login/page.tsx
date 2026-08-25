"use client"

import { useState, FormEvent } from "react"
import { useRouter } from "@/navigation"
import { LogIn, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react"

export default function AnalyticsLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/analytics/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()

      if (!data.success) {
        setError(data.message || "Login failed")
        return
      }

      router.push("/dashboard")
    } catch {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary-50 px-4 dark:bg-secondary-900">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl border border-secondary-200 bg-white p-8 shadow-sm dark:border-secondary-700 dark:bg-secondary-800">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/30">
              <LogIn className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h1 className="text-lg font-bold text-secondary-900 dark:text-white">Analytics Dashboard</h1>
            <p className="mt-1 text-sm text-secondary-500">Sign in to access analytics</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
                autoFocus
                autoComplete="username"
                className="w-full rounded-xl border border-secondary-200 bg-white px-4 py-2.5 text-sm text-secondary-900 placeholder-secondary-400 outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-secondary-600 dark:bg-secondary-700 dark:text-white dark:placeholder-secondary-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-secondary-200 bg-white px-4 py-2.5 pr-10 text-sm text-secondary-900 placeholder-secondary-400 outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-secondary-600 dark:bg-secondary-700 dark:text-white dark:placeholder-secondary-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-xl bg-red-50 p-3 dark:bg-red-900/20">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-secondary-400">
          Authorized personnel only
        </p>
      </div>
    </div>
  )
}
