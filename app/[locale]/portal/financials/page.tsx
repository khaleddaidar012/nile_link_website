"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { PortalHeader } from "@/components/portal/PortalHeader"
import { CreditCard, Download, CheckCircle2, Clock, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"

export default function PortalFinancialsPage() {
  const t = useTranslations()
  const [invoices, setInvoices] = useState<any[]>([])
  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/portal/financials")
      .then((res) => res.json())
      .then((data) => {
        if (data.invoices) setInvoices(data.invoices)
        if (data.summary) setSummary(data.summary)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="flex flex-col">
      <PortalHeader
        title={t("portal.sidebar.financials") || "Financials & Invoices"}
        subtitle="Review billing statements, outstanding balances, and official tax invoices"
      />

      <div className="space-y-6 p-6 sm:p-8">
        {/* 3 Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-secondary-200/80 bg-white p-5 shadow-sm dark:border-secondary-800 dark:bg-secondary-900">
            <span className="text-xs font-bold text-secondary-500 uppercase tracking-wider">Total Invoiced</span>
            <h2 className="mt-2 text-2xl font-bold text-secondary-900 dark:text-white">
              {(summary?.totalInvoiced || 0).toLocaleString()} EGP
            </h2>
          </div>
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-50/40 p-5 shadow-sm dark:bg-emerald-950/20">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Total Paid</span>
            <h2 className="mt-2 text-2xl font-bold text-emerald-700 dark:text-emerald-300">
              {(summary?.paidAmount || 0).toLocaleString()} EGP
            </h2>
          </div>
          <div className="rounded-2xl border border-amber-500/20 bg-amber-50/40 p-5 shadow-sm dark:bg-amber-950/20">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Outstanding Balance</span>
            <h2 className="mt-2 text-2xl font-bold text-amber-700 dark:text-amber-300">
              {(summary?.pendingBalance || 0).toLocaleString()} EGP
            </h2>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="overflow-hidden rounded-2xl border border-secondary-200/80 bg-white shadow-sm dark:border-secondary-800 dark:bg-secondary-900">
          <div className="border-b border-secondary-100 p-4 dark:border-secondary-800">
            <h3 className="text-sm font-bold text-secondary-900 dark:text-white">Billing Invoices</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs rtl:text-right">
              <thead className="border-b border-secondary-100 bg-secondary-50/75 text-[11px] font-bold text-secondary-600 uppercase tracking-wider dark:border-secondary-800 dark:bg-secondary-800/50 dark:text-secondary-400">
                <tr>
                  <th className="px-5 py-3.5">Invoice #</th>
                  <th className="px-4 py-3.5">Issue Date</th>
                  <th className="px-4 py-3.5">Due Date</th>
                  <th className="px-4 py-3.5">Amount</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right rtl:text-left">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-100 dark:divide-secondary-800">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-secondary-400">Loading invoices...</td>
                  </tr>
                ) : invoices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-secondary-400">
                      <CreditCard className="mx-auto h-8 w-8 text-secondary-300 dark:text-secondary-700" />
                      <p className="mt-2 text-sm font-semibold text-secondary-700 dark:text-secondary-300">No invoices issued yet</p>
                      <p className="text-xs text-secondary-500">Official billing receipts will appear here once shipping shipments clear.</p>
                    </td>
                  </tr>
                ) : (
                  invoices.map((inv) => (
                    <tr key={inv._id} className="hover:bg-secondary-50/50 dark:hover:bg-secondary-800/40">
                      <td className="px-5 py-4 font-mono font-bold text-primary-600 dark:text-primary-400">
                        {inv.invoiceNumber}
                      </td>
                      <td className="px-4 py-4 text-secondary-600 dark:text-secondary-400">
                        {new Date(inv.issueDate).toLocaleDateString("en-GB")}
                      </td>
                      <td className="px-4 py-4 text-secondary-600 dark:text-secondary-400">
                        {new Date(inv.dueDate).toLocaleDateString("en-GB")}
                      </td>
                      <td className="px-4 py-4 font-bold text-secondary-900 dark:text-white">
                        {inv.amount.toLocaleString()} {inv.currency}
                      </td>
                      <td className="px-4 py-4">
                        <span className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize",
                          inv.status === "paid" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300" :
                          inv.status === "overdue" ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300" :
                          "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
                        )}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right rtl:text-left">
                        <Button size="sm" variant="outline" className="text-xs">
                          <Download className="mr-1 h-3.5 w-3.5 rtl:mr-0 rtl:ml-1" />
                          <span>PDF</span>
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
