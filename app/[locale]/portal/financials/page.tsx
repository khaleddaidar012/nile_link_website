"use client"

import { useState, useEffect, useMemo } from "react"
import { useTranslations } from "next-intl"
import { PortalHeader } from "@/components/portal/PortalHeader"
import { FinancialsSummaryCards } from "@/components/portal/financials/FinancialsSummaryCards"
import { FinancialsToolbar } from "@/components/portal/financials/FinancialsToolbar"
import { InvoicesTable } from "@/components/portal/financials/InvoicesTable"
import { InvoiceDetailsModal } from "@/components/portal/financials/InvoiceDetailsModal"

export default function PortalFinancialsPage() {
  const t = useTranslations()
  const [invoices, setInvoices] = useState<any[]>([])
  const [metrics, setMetrics] = useState<any>({ totalInvoicesValue: 0, totalPaid: 0, totalRemaining: 0 })
  const [loading, setLoading] = useState(true)
  
  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  
  // Modal State
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchFinancials = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/portal/financials")
      const data = await res.json()
      if (data.invoices) setInvoices(data.invoices)
      if (data.metrics) setMetrics(data.metrics)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFinancials()
  }, [])

  // Filtered invoices for the table
  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      const matchesSearch = searchQuery === "" || 
        inv.invoiceNumber?.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesStatus = statusFilter === "all" || inv.status === statusFilter
      
      return matchesSearch && matchesStatus
    })
  }, [invoices, searchQuery, statusFilter])

  const handleViewInvoice = (invoice: any) => {
    setSelectedInvoice(invoice)
    setIsModalOpen(true)
  }

  return (
    <div className="flex flex-col min-h-full bg-slate-50/50 dark:bg-slate-900/50">
      <PortalHeader
        title={t("portal.sidebar.financials") || "Financials & Invoices"}
        subtitle={t("portal.financials.subtitle") || "Track your invoices, view payment history, and monitor your outstanding balance."}
      />

      <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
        <FinancialsSummaryCards data={metrics} count={invoices.length} loading={loading} />
        
        <div className="flex flex-col rounded-2xl border border-secondary-200/80 bg-white shadow-sm dark:border-secondary-800 dark:bg-secondary-900 overflow-hidden">
          <FinancialsToolbar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
          
          <InvoicesTable 
            invoices={filteredInvoices} 
            loading={loading} 
            onViewDetails={handleViewInvoice} 
          />
        </div>
      </div>

      {isModalOpen && selectedInvoice && (
        <InvoiceDetailsModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          invoiceToken={selectedInvoice.token} 
        />
      )}
    </div>
  )
}
