"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { PortalHeader } from "@/components/portal/PortalHeader"
import { Send, Plus, Search, Clock, CheckCircle2, AlertCircle, RefreshCw, X, Ship, FileText, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"

export default function PortalRequestsPage() {
  const t = useTranslations()
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewModal, setShowNewModal] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [serviceType, setServiceType] = useState("freight_booking")
  const [subject, setSubject] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState("medium")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchRequests = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/portal/requests")
      const data = await res.json()
      if (data.requests) setRequests(data.requests)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/portal/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceType, subject, description, priority }),
      })
      if (res.ok) {
        setShowNewModal(false)
        setSubject("")
        setDescription("")
        fetchRequests()
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col">
      <PortalHeader
        title={t("portal.sidebar.requests") || "Service Inquiries & Operations"}
        subtitle="Track live shipments, customs clearances, and operations inquiries in real time"
      />

      <div className="space-y-6 p-6 sm:p-8">
        {/* Action Header */}
        <div className="flex flex-col gap-3 rounded-2xl border border-secondary-200/80 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-secondary-800 dark:bg-secondary-900">
          <div>
            <h2 className="text-base font-bold text-secondary-900 dark:text-white">Active Cargo & Service Requests</h2>
            <p className="text-xs text-secondary-500">Track clearance status and shipment milestones</p>
          </div>
          <Button
            onClick={() => setShowNewModal(true)}
            className="rounded-xl bg-primary-600 font-semibold text-white shadow hover:bg-primary-700 transition-colors"
          >
            <Plus className="mr-1.5 h-4 w-4 rtl:mr-0 rtl:ml-1.5" />
            <span>New Service Request</span>
          </Button>
        </div>

        {/* Requests Master Table */}
        <div className="overflow-hidden rounded-2xl border border-secondary-200/80 bg-white shadow-sm dark:border-secondary-800 dark:bg-secondary-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs rtl:text-right">
              <thead className="border-b border-secondary-100 bg-secondary-50/75 text-[11px] font-bold text-secondary-600 uppercase tracking-wider dark:border-secondary-800 dark:bg-secondary-800/50 dark:text-secondary-400">
                <tr>
                  <th className="px-5 py-3.5">Tracking Number</th>
                  <th className="px-4 py-3.5">Service Type</th>
                  <th className="px-4 py-3.5">Subject</th>
                  <th className="px-4 py-3.5">Priority</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right rtl:text-left">Timeline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-100 dark:divide-secondary-800">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-secondary-400">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin text-primary-500" />
                        <span>Loading requests...</span>
                      </div>
                    </td>
                  </tr>
                ) : requests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-14 text-center">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary-100 text-secondary-400 dark:bg-secondary-800 dark:text-secondary-500">
                        <Send className="h-7 w-7" />
                      </div>
                      <p className="mt-3 text-sm font-bold text-secondary-900 dark:text-white">No service requests yet</p>
                      <p className="mt-1 text-xs text-secondary-500 dark:text-secondary-400 max-w-sm mx-auto">Create a shipping booking, customs clearance inquiry, or warehousing request to begin tracking.</p>
                    </td>
                  </tr>
                ) : (
                  requests.map((req) => (
                    <tr key={req._id} className="group hover:bg-secondary-50/60 dark:hover:bg-secondary-800/40 transition-colors">
                      <td className="px-5 py-4 font-mono font-bold text-primary-600 dark:text-primary-400 text-sm">
                        {req.trackingNumber}
                      </td>
                      <td className="px-4 py-4 capitalize font-medium text-secondary-700 dark:text-secondary-300">
                        {req.serviceType.replace("_", " ")}
                      </td>
                      <td className="px-4 py-4 font-bold text-secondary-900 dark:text-white">
                        {req.subject}
                      </td>
                      <td className="px-4 py-4">
                        <span className={cn(
                          "rounded-lg px-2.5 py-0.5 text-[10px] font-bold uppercase",
                          req.priority === "urgent" ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300" :
                          req.priority === "high" ? "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300" :
                          "bg-secondary-100 text-secondary-700 dark:bg-secondary-800 dark:text-secondary-300"
                        )}>
                          {req.priority}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-1 rounded-full border border-primary-500/20 bg-primary-50 px-2.5 py-0.5 text-xs font-bold text-primary-700 dark:bg-primary-950/60 dark:text-primary-300">
                          <Clock className="h-3 w-3" />
                          <span className="capitalize">{req.status.replace("_", " ")}</span>
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right rtl:text-left">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedRequest(req)}
                          className="rounded-xl text-xs font-semibold"
                        >
                          <span>View Milestones</span>
                          <ChevronRight className="ml-1 h-3.5 w-3.5 rtl:mr-1 rtl:ml-0 rtl:rotate-180" />
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

      {/* View Timeline Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-secondary-200 bg-white p-6 shadow-2xl dark:border-secondary-800 dark:bg-secondary-900">
            <div className="flex items-center justify-between border-b border-secondary-100 pb-3 dark:border-secondary-800">
              <div>
                <span className="font-mono text-xs font-bold text-primary-600 dark:text-primary-400">{selectedRequest.trackingNumber}</span>
                <h3 className="text-base font-bold text-secondary-900 dark:text-white">{selectedRequest.subject}</h3>
              </div>
              <button onClick={() => setSelectedRequest(null)} className="rounded-lg p-1 text-secondary-400 hover:text-secondary-600 dark:hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="my-4 space-y-3">
              <p className="text-xs text-secondary-600 dark:text-secondary-400">{selectedRequest.description}</p>
              
              <h4 className="text-xs font-bold text-secondary-700 uppercase tracking-wider dark:text-secondary-300 pt-2">Tracking Milestones</h4>
              <div className="relative pl-6 space-y-4 before:absolute before:top-2 before:bottom-2 before:left-2 before:w-0.5 before:bg-secondary-200 dark:before:bg-secondary-800">
                {selectedRequest.timeline?.map((item: any, i: number) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-6 top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary-600 ring-4 ring-white dark:ring-secondary-900"></div>
                    <p className="text-xs font-bold text-secondary-900 dark:text-white">{item.title}</p>
                    <p className="text-[11px] text-secondary-500">{item.comment}</p>
                    <span className="text-[10px] text-secondary-400">{new Date(item.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="outline" onClick={() => setSelectedRequest(null)} className="rounded-xl text-xs">Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* New Request Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-secondary-200 bg-white p-6 shadow-2xl dark:border-secondary-800 dark:bg-secondary-900">
            <div className="flex items-center justify-between border-b border-secondary-100 pb-3 dark:border-secondary-800">
              <h3 className="text-base font-bold text-secondary-900 dark:text-white">Submit New Service Inquiry</h3>
              <button onClick={() => setShowNewModal(false)} className="rounded-lg p-1 text-secondary-400 hover:text-secondary-600 dark:hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">Service Category *</label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full rounded-xl border border-secondary-200 bg-secondary-50/50 p-2.5 text-xs font-semibold dark:border-secondary-700 dark:bg-secondary-800 dark:text-white focus:border-primary-500 focus:outline-none"
                >
                  <option value="freight_booking">Freight Booking (Sea/Air/Land)</option>
                  <option value="customs_clearance">Customs Clearance</option>
                  <option value="warehousing">Warehousing & Storage</option>
                  <option value="transportation">Inland Transportation</option>
                  <option value="general_inquiry">General Operations Inquiry</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">Inquiry Subject *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2x40ft FCL Container Import Clearance from Alexandria"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-xl border border-secondary-200 bg-secondary-50/50 p-2.5 text-xs font-medium dark:border-secondary-700 dark:bg-secondary-800 dark:text-white focus:border-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">Cargo Details & Specifications *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide container counts, commodity description, port of loading/discharge, temperature requirements..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-secondary-200 bg-secondary-50/50 p-2.5 text-xs font-medium dark:border-secondary-700 dark:bg-secondary-800 dark:text-white focus:border-primary-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowNewModal(false)} className="rounded-xl text-xs">Cancel</Button>
                <Button type="submit" disabled={isSubmitting} className="rounded-xl bg-primary-600 font-bold text-white shadow hover:bg-primary-700 text-xs">
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
