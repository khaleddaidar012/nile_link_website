"use client"

import { useState, useEffect, useMemo } from "react"
import { useTranslations } from "next-intl"
import { PortalHeader } from "@/components/portal/PortalHeader"
import { QuoteSummaryCards } from "@/components/portal/quotes/QuoteSummaryCards"
import { QuotesToolbar } from "@/components/portal/quotes/QuotesToolbar"
import { QuotesTable } from "@/components/portal/quotes/QuotesTable"
import { QuoteDetailsModal } from "@/components/portal/quotes/QuoteDetailsModal"

export default function PortalQuotesPage() {
  const t = useTranslations()
  const [quotes, setQuotes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  
  // Modal State
  const [selectedQuote, setSelectedQuote] = useState<any | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchQuotes = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/portal/quotes")
      const data = await res.json()
      if (data.quotes) setQuotes(data.quotes)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuotes()
  }, [])

  // Derived state for summary cards
  const summaryData = useMemo(() => {
    return {
      total: quotes.length,
      sent: quotes.filter(q => q.status === "sent").length,
      accepted: quotes.filter(q => q.status === "accepted").length,
      rejected: quotes.filter(q => q.status === "rejected").length,
      pending: quotes.filter(q => ["draft", "pending", "viewed"].includes(q.status)).length,
      totalValue: quotes.reduce((acc, q) => acc + (q.totalAmount || 0), 0)
    }
  }, [quotes])

  // Filtered quotes for the table
  const filteredQuotes = useMemo(() => {
    return quotes.filter(q => {
      const matchesSearch = searchQuery === "" || 
        q.quoteNumber?.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesStatus = statusFilter === "all" || q.status === statusFilter
      
      return matchesSearch && matchesStatus
    })
  }, [quotes, searchQuery, statusFilter])

  const handleViewQuote = (quote: any) => {
    setSelectedQuote(quote)
    setIsModalOpen(true)
  }

  return (
    <div className="flex flex-col min-h-full bg-slate-50/50 dark:bg-slate-900/50">
      <PortalHeader
        title={t("portal.sidebar.quotes") || "Quotes"}
        subtitle={t("portal.quotes.subtitle") || "Review and manage shipping quotes sent to your company."}
      />

      <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
        <QuoteSummaryCards data={summaryData} loading={loading} />
        
        <div className="flex flex-col rounded-2xl border border-secondary-200/80 bg-white shadow-sm dark:border-secondary-800 dark:bg-secondary-900 overflow-hidden">
          <QuotesToolbar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
          
          <QuotesTable 
            quotes={filteredQuotes} 
            loading={loading} 
            onViewDetails={handleViewQuote} 
          />
        </div>
      </div>

      <QuoteDetailsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        quote={selectedQuote} 
        onQuoteUpdated={fetchQuotes}
      />
    </div>
  )
}
