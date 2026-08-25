"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import {
  Search,
  Building2,
  FileText,
  Clock,
  AlertOctagon,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  Send,
  RefreshCw,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { ManualWarningModal } from "@/components/admin/documents/ManualWarningModal"
import { cn } from "@/lib/utils"

export interface CustomerAdminItem {
  id: string
  companyName: string
  commercialRegisterNumber: string
  taxCardNumber: string
  contactEmail: string
  contactPhone: string
  accountStatus: "active" | "warning" | "inactive"
  statusReason?: string
  totalDocs: number
  expiringCount: number
  expiredCount: number
  pendingCount: number
  maxAllowed: number
  createdAt: string
}

export function CustomerOverviewTable() {
  const t = useTranslations()
  const [customers, setCustomers] = useState<CustomerAdminItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [warningModalTarget, setWarningModalTarget] = useState<CustomerAdminItem | null>(null)

  const fetchCustomers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set("search", search)
      if (statusFilter !== "all") params.set("status", statusFilter)

      const res = await fetch(`/api/admin/customers?${params.toString()}`)
      const data = await res.json()
      if (data.customers) {
        setCustomers(data.customers)
      }
    } catch {
      // Error fetching
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [search, statusFilter])

  const renderStatusBadge = (status: string, reason?: string) => {
    if (status === "active") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-400">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Active</span>
        </span>
      )
    }
    if (status === "warning") {
      return (
        <span
          className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-400 animate-pulse"
          title={reason}
        >
          <AlertTriangle className="h-3.5 w-3.5" />
          <span>Warning (Action Needed)</span>
        </span>
      )
    }
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 text-xs font-bold text-rose-400"
        title={reason}
      >
        <XCircle className="h-3.5 w-3.5" />
        <span>Inactive / Suspended</span>
      </span>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search & Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400 rtl:right-3.5 rtl:left-auto" />
          <input
            type="text"
            placeholder="Search by company name, CR number, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-900/90 py-2.5 pr-4 pl-10 text-xs font-medium text-white placeholder-slate-500 shadow-sm transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 rtl:pr-10 rtl:pl-4"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-xs font-semibold text-slate-300 shadow-sm focus:border-primary-500 focus:outline-none"
          >
            <option value="all">All Account Statuses</option>
            <option value="active">Active & Compliant</option>
            <option value="warning">Warning / Expiring Soon</option>
            <option value="inactive">Inactive / Restricted</option>
          </select>
        </div>
      </div>

      {/* Table Canvas */}
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs rtl:text-right">
            <thead className="border-b border-slate-800 bg-slate-950/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Client / Company</th>
                <th className="px-4 py-3.5">Documents</th>
                <th className="px-4 py-3.5">Expiring (≤10d)</th>
                <th className="px-4 py-3.5">Expired</th>
                <th className="px-4 py-3.5">Account Status</th>
                <th className="px-5 py-3.5 text-right rtl:text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-white">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin text-primary-500" />
                      <span>Loading customer overview...</span>
                    </div>
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-14 text-center text-slate-400">
                    <Building2 className="mx-auto h-8 w-8 text-slate-600" />
                    <p className="mt-2 text-sm font-bold text-slate-300">No customers found</p>
                  </td>
                </tr>
              ) : (
                customers.map((cust) => (
                  <tr
                    key={cust.id}
                    className="group transition-colors hover:bg-slate-800/40"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-950/70 border border-primary-800/40 text-primary-400">
                          <Building2 className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">{cust.companyName}</p>
                          <p className="text-[11px] text-slate-400">
                            CR: {cust.commercialRegisterNumber} • {cust.contactEmail}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">
                          {cust.totalDocs}
                        </span>
                        <span className="text-slate-500 text-xs">/ {cust.maxAllowed}</span>
                        {cust.pendingCount > 0 && (
                          <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold text-indigo-400">
                            +{cust.pendingCount} pending
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {cust.expiringCount > 0 ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/15 px-2.5 py-0.5 text-xs font-bold text-amber-400">
                          <Clock className="h-3 w-3" />
                          <span>{cust.expiringCount} files</span>
                        </span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {cust.expiredCount > 0 ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/15 px-2.5 py-0.5 text-xs font-bold text-rose-400">
                          <AlertOctagon className="h-3 w-3" />
                          <span>{cust.expiredCount} expired</span>
                        </span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4">{renderStatusBadge(cust.accountStatus, cust.statusReason)}</td>
                    <td className="px-5 py-4 text-right rtl:text-left">
                      <div className="flex items-center justify-end gap-2 rtl:justify-start">
                        {(cust.expiringCount > 0 || cust.expiredCount > 0) && (
                          <Button
                            size="sm"
                            onClick={() => setWarningModalTarget(cust)}
                            className="rounded-xl bg-amber-600 text-xs font-semibold text-white shadow-sm hover:bg-amber-700 transition-colors"
                          >
                            <Send className="mr-1.5 h-3.5 w-3.5 rtl:mr-0 rtl:ml-1.5" />
                            <span>Send Warning</span>
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Warning Modal */}
      {warningModalTarget && (
        <ManualWarningModal
          documentId={warningModalTarget.id}
          documentTitle="Legal Compliance Verification"
          companyName={warningModalTarget.companyName}
          contactEmail={warningModalTarget.contactEmail}
          contactPhone={warningModalTarget.contactPhone}
          onClose={() => setWarningModalTarget(null)}
          onSuccess={fetchCustomers}
        />
      )}
    </div>
  )
}
