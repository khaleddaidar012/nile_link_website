"use client"

import React, { useState } from "react"
import { useSearchParams } from "next/navigation"
import { useRouter } from "@/navigation"
import { useTranslations } from "next-intl"
import { PortalHeader } from "@/components/portal/PortalHeader"
import { toast } from "sonner"
import { Loader2, ArrowLeft, ArrowRight, FileText } from "lucide-react"

export default function RequestDetailsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const t = useTranslations()

  const services = searchParams.getAll("services")
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    operationType: "none",
    priority: "medium",
    origin: "",
    destination: "",
    weight: "",
    volume: "",
  })

  // Dynamic details per service. Keyed by service ID.
  const [serviceDetails, setServiceDetails] = useState<Record<string, any>>({})

  if (services.length === 0) {
    // If user got here without selecting services, push them back.
    if (typeof window !== "undefined") {
      router.push("/portal/requests/new")
    }
    return null
  }

  const handleGlobalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleServiceChange = (serviceId: string, field: string, value: string) => {
    setServiceDetails((prev) => ({
      ...prev,
      [serviceId]: {
        ...(prev[serviceId] || {}),
        [field]: value,
      },
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        ...formData,
        services: services.map((s) => ({
          serviceKey: s,
          details: serviceDetails[s] || {},
        })),
      }

      const res = await fetch("/api/portal/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (data.success) {
        toast.success("Request submitted successfully!")
        // Go to document upload or dashboard
        router.push(`/portal/requests/${data.request._id}`)
      } else {
        toast.error(data.error || "Failed to submit request")
      }
    } catch (err) {
      toast.error("Network error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col pb-20">
      <PortalHeader
        title={t("portal.requests.details.title") || "Request Details"}
        subtitle={t("portal.requests.details.subtitle") || "Provide the necessary details for your selected services."}
      />

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 max-w-4xl space-y-8">
        {/* Global Details */}
        <div className="bg-white dark:bg-secondary-900 rounded-xl border border-gray-200 dark:border-secondary-800 p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FileText className="text-primary-600" />
            {t("portal.requests.details.general_info") || "General Information"}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t("portal.requests.details.subject") || "Subject *"}</label>
              <input
                required
                name="subject"
                value={formData.subject}
                onChange={handleGlobalChange}
                className="w-full p-3 border rounded-lg dark:bg-secondary-800 dark:border-secondary-700 focus:ring-2 focus:ring-primary-500"
                placeholder={t("portal.requests.details.subject_placeholder") || "Brief title for your request"}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t("portal.requests.details.description") || "Description *"}</label>
              <textarea
                required
                name="description"
                value={formData.description}
                onChange={handleGlobalChange}
                rows={4}
                className="w-full p-3 border rounded-lg dark:bg-secondary-800 dark:border-secondary-700 focus:ring-2 focus:ring-primary-500"
                placeholder={t("portal.requests.details.description_placeholder") || "Detailed description of your overall requirements..."}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t("portal.requests.details.origin") || "Origin / Pickup"}</label>
                <input
                  name="origin"
                  value={formData.origin}
                  onChange={handleGlobalChange}
                  className="w-full p-3 border rounded-lg dark:bg-secondary-800 dark:border-secondary-700 focus:ring-2 focus:ring-primary-500"
                  placeholder={t("portal.requests.details.origin_placeholder") || "E.g., Shanghai Port, CN"}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t("portal.requests.details.destination") || "Destination / Delivery"}</label>
                <input
                  name="destination"
                  value={formData.destination}
                  onChange={handleGlobalChange}
                  className="w-full p-3 border rounded-lg dark:bg-secondary-800 dark:border-secondary-700 focus:ring-2 focus:ring-primary-500"
                  placeholder={t("portal.requests.details.destination_placeholder") || "E.g., Alexandria, EG"}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t("portal.requests.details.operation_type") || "Operation Type"}</label>
                <select
                  name="operationType"
                  value={formData.operationType}
                  onChange={handleGlobalChange}
                  className="w-full p-3 border rounded-lg dark:bg-secondary-800 dark:border-secondary-700 focus:ring-2 focus:ring-primary-500"
                >
                  <option value="none">{t("portal.requests.details.options.none") || "N/A"}</option>
                  <option value="import">{t("portal.requests.details.options.import") || "Import"}</option>
                  <option value="export">{t("portal.requests.details.options.export") || "Export"}</option>
                  <option value="transit">{t("portal.requests.details.options.transit") || "Transit"}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t("portal.requests.details.priority") || "Priority"}</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleGlobalChange}
                  className="w-full p-3 border rounded-lg dark:bg-secondary-800 dark:border-secondary-700 focus:ring-2 focus:ring-primary-500"
                >
                  <option value="low">{t("portal.requests.details.options.low") || "Low"}</option>
                  <option value="medium">{t("portal.requests.details.options.medium") || "Medium"}</option>
                  <option value="high">{t("portal.requests.details.options.high") || "High"}</option>
                  <option value="urgent">{t("portal.requests.details.options.urgent") || "Urgent"}</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t("portal.requests.details.weight") || "Weight (kg)"}</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleGlobalChange}
                  className="w-full p-3 border rounded-lg dark:bg-secondary-800 dark:border-secondary-700 focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t("portal.requests.details.volume") || "Volume (CBM)"}</label>
                <input
                  type="number"
                  name="volume"
                  value={formData.volume}
                  onChange={handleGlobalChange}
                  className="w-full p-3 border rounded-lg dark:bg-secondary-800 dark:border-secondary-700 focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Details per selected service */}
        {services.map((serviceId) => (
          serviceId === "general_inquiry" ? null : (
          <div key={serviceId} className="bg-white dark:bg-secondary-900 rounded-xl border border-gray-200 dark:border-secondary-800 p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4 capitalize">
              {t(`portal.requests.new.${serviceId}`) || serviceId.replace("_", " ")} {t("common.details") || "Details"}
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t("portal.requests.details.notes") || "Additional Notes"}</label>
                <textarea
                  value={serviceDetails[serviceId]?.notes || ""}
                  onChange={(e) => handleServiceChange(serviceId, "notes", e.target.value)}
                  rows={2}
                  className="w-full p-3 border rounded-lg dark:bg-secondary-800 dark:border-secondary-700 focus:ring-2 focus:ring-primary-500"
                  placeholder={t("portal.requests.details.notes_placeholder") || "Specific requirements for this service..."}
                />
              </div>
            </div>
          </div>
          )
        ))}

        <div className="flex justify-between border-t border-gray-200 dark:border-secondary-800 pt-6">
          <button
            type="button"
            onClick={() => router.push("/portal/requests/new")}
            className="flex items-center px-6 py-3 rounded-xl font-bold transition-all text-secondary-700 hover:bg-gray-100 dark:text-secondary-300 dark:hover:bg-secondary-800"
          >
            <ArrowLeft className="mr-2 h-5 w-5 rtl:ml-2 rtl:mr-0 rtl:rotate-180" />
            {t("portal.requests.details.back") || "Back"}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center px-6 py-3 rounded-xl font-bold transition-all text-white bg-primary-600 hover:bg-primary-700 shadow-md disabled:bg-primary-400"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : null}
            {loading ? (t("portal.requests.details.submitting") || "Submitting...") : (t("portal.requests.details.submit") || "Submit Request")}
          </button>
        </div>
      </form>
    </div>
  )
}
