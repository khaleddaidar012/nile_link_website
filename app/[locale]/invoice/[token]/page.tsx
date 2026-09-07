"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { InvoiceLivePreview } from "@/components/portal/financials/InvoiceLivePreview"
import { Building2, RefreshCw } from "lucide-react"

export default function PublicInvoicePage() {
  const { token } = useParams()
  const t = useTranslations()
  const [data, setData] = useState<{ invoice: any, payments: any[] } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (token) {
      setLoading(true)
      fetch(`/api/invoice/${token}`)
        .then(res => res.json())
        .then(resData => {
          if (resData.success) {
            setData({ invoice: resData.invoice, payments: resData.payments })
          } else {
            setError(true)
          }
        })
        .catch(() => setError(true))
        .finally(() => setLoading(false))
    }
  }, [token])

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-secondary-50 dark:bg-secondary-950">
        <RefreshCw className="h-10 w-10 animate-spin text-primary-500 mb-4" />
        <p className="text-secondary-500 font-medium">Loading secure invoice...</p>
      </div>
    )
  }

  if (error || !data?.invoice) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-secondary-50 p-4 text-center dark:bg-secondary-950">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-100 text-rose-500 dark:bg-rose-900/30">
          <Building2 className="h-10 w-10" />
        </div>
        <h1 className="mb-2 text-2xl font-black text-secondary-900 dark:text-white">Invoice Not Found</h1>
        <p className="text-secondary-500 max-w-sm">The invoice you are looking for might have been removed, or the secure token is invalid.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 sm:py-12 dark:bg-secondary-950">
      <div className="w-full max-w-4xl mx-auto flex justify-between items-center mb-8 px-4">
        <div className="flex items-center gap-2 text-primary-600">
          <Building2 className="h-6 w-6" />
          <span className="text-lg font-black tracking-tighter uppercase">NileLink</span>
        </div>
        <div className="text-xs font-bold text-secondary-400 uppercase tracking-widest">
          Secure Invoice Portal
        </div>
      </div>
      
      <InvoiceLivePreview invoice={data.invoice} payments={data.payments} />
      
      <div className="mt-12 text-center text-xs text-secondary-400">
        <p>&copy; {new Date().getFullYear()} NileLink Logistics. All rights reserved.</p>
      </div>
    </div>
  )
}
