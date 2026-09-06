"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { toast } from "sonner"
import { Activity, Edit, RefreshCw, X } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Link } from "@/navigation"

export default function AdminOperationsPage() {
  const t = useTranslations()
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Status update modal state
  const [selectedService, setSelectedService] = useState<any>(null)
  const [newStatus, setNewStatus] = useState("")
  const [newTitle, setNewTitle] = useState("")
  const [newComment, setNewComment] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)

  const fetchOperations = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/operations")
      const data = await res.json()
      if (data.success) {
        setServices(data.data)
      } else {
        toast.error("Failed to load operations")
      }
    } catch (err) {
      toast.error("Network error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOperations()
  }, [])

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedService) return

    setIsUpdating(true)
    try {
      const res = await fetch(`/api/admin/services/${selectedService._id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          title: newTitle,
          comment: newComment,
        }),
      })

      const data = await res.json()
      if (data.success) {
        toast.success("Service status updated successfully")
        setSelectedService(null)
        fetchOperations() // Refresh
      } else {
        toast.error(data.error || "Failed to update status")
      }
    } catch (err) {
      toast.error("Network error")
    } finally {
      setIsUpdating(false)
    }
  }

  const openUpdateModal = (service: any) => {
    setSelectedService(service)
    setNewStatus(service.status)
    setNewTitle("")
    setNewComment("")
  }

  return (
    <div className="flex flex-col pb-12">
      <AdminHeader
        title="Operations Board"
        subtitle="Manage the independent statuses of all active services."
      />

      <div className="p-6 sm:p-8 max-w-7xl mx-auto w-full">
        {loading ? (
          <div className="flex justify-center p-12">
            <RefreshCw className="h-8 w-8 animate-spin text-primary-500" />
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service._id}
                className="rounded-2xl border border-secondary-200 bg-white p-6 shadow-sm dark:border-secondary-800 dark:bg-secondary-900 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span
                      className={`px-2 py-1 text-xs font-bold uppercase rounded-lg ${
                        service.status === "active"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : service.status === "pending"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      }`}
                    >
                      {service.status}
                    </span>
                    <Link href={`/admin/requests/${service.requestId?._id}`}>
                      <span className="text-xs font-mono text-primary-600 hover:underline">
                        {service.requestId?.trackingNumber}
                      </span>
                    </Link>
                  </div>

                  <h3 className="font-bold text-lg capitalize mb-2 dark:text-white">
                    {service.serviceKey.replace("_", " ")}
                  </h3>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-4">
                    Client: {service.requestId?.customerId?.companyName || "N/A"}
                  </p>
                  
                  {service.details?.origin && service.details?.destination && (
                    <div className="text-xs text-secondary-500 bg-secondary-50 dark:bg-secondary-800/50 p-2 rounded-lg mb-4">
                      {service.details.origin} → {service.details.destination}
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => openUpdateModal(service)}
                  variant="outline"
                  className="w-full justify-center"
                >
                  <Edit className="mr-2 h-4 w-4" /> Update Status
                </Button>
              </div>
            ))}
            
            {services.length === 0 && (
              <div className="col-span-full p-12 text-center text-secondary-500 bg-white dark:bg-secondary-900 rounded-2xl border border-secondary-200 dark:border-secondary-800">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No active operations found.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Update Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-secondary-200 bg-white p-6 shadow-2xl dark:border-secondary-800 dark:bg-secondary-900">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Update Service Status</h3>
              <button onClick={() => setSelectedService(null)} className="text-secondary-500 hover:text-secondary-900 dark:hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">New Status</label>
                <select
                  required
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full p-2.5 border rounded-lg dark:bg-secondary-800 dark:border-secondary-700"
                >
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="in_transit">In Transit</option>
                  <option value="customs_clearing">Customs Clearing</option>
                  <option value="delayed">Delayed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Milestone Title *</label>
                <input
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Vessel Departed"
                  className="w-full p-2.5 border rounded-lg dark:bg-secondary-800 dark:border-secondary-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Comment (Optional)</label>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                  placeholder="Additional details..."
                  className="w-full p-2.5 border rounded-lg dark:bg-secondary-800 dark:border-secondary-700"
                />
              </div>

              <div className="flex justify-end pt-4 gap-3">
                <Button type="button" variant="outline" onClick={() => setSelectedService(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isUpdating} className="bg-primary-600 text-white">
                  {isUpdating ? "Saving..." : "Save Update"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
