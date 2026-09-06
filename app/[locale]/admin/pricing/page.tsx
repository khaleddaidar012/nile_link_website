"use client"

import React, { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { Loader2, Plus, Edit2, Trash2 } from "lucide-react"

export default function AdminPricingPage() {
  const t = useTranslations("AdminPricing")
  const [rules, setRules] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRules()
  }, [])

  const fetchRules = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/admin/pricing-rules")
      const data = await res.json()
      if (data.success) {
        setRules(data.data)
      } else {
        toast.error(data.error || "Failed to fetch pricing rules")
      }
    } catch (err) {
      toast.error("Network error")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return
    try {
      const res = await fetch(`/api/admin/pricing-rules/${id}`, { method: "DELETE" })
      const data = await res.json()
      if (data.success) {
        toast.success("Pricing rule deleted")
        setRules(rules.filter((r) => r._id !== id))
      } else {
        toast.error(data.error)
      }
    } catch (err) {
      toast.error("Network error")
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t("title") || "Pricing Rules"}</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700">
          <Plus size={16} />
          {t("addRule") || "Add Rule"}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-zinc-800">
              <tr>
                <th className="p-4">Service</th>
                <th className="p-4">Type</th>
                <th className="p-4">Default Price</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
              {rules.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    No pricing rules found.
                  </td>
                </tr>
              ) : (
                rules.map((rule) => (
                  <tr key={rule._id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                    <td className="p-4 font-medium">{rule.serviceKey}</td>
                    <td className="p-4 capitalize">{rule.pricingType.replace("_", " ")}</td>
                    <td className="p-4">
                      {rule.pricingType === "manual" ? "-" : `${rule.defaultPrice} ${rule.currency}`}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          rule.isActive
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {rule.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-4 flex gap-2">
                      <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(rule._id)}
                        className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
