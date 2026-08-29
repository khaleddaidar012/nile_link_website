"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { motion, AnimatePresence } from "framer-motion"
import {
  Tag,
  Plus,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Edit2,
  Calendar,
  Layers,
  X,
  Loader2,
  Shield,
} from "lucide-react"
import { Button } from "@/components/ui/Button"

export interface DocumentCategoryRecord {
  _id?: string
  key: string
  nameEn: string
  nameAr: string
  description?: string
  defaultValidityDays: number
  isMandatory: boolean
  isActive: boolean
}

export function DocumentCategoriesManager() {
  const t = useTranslations()
  const [categories, setCategories] = useState<DocumentCategoryRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<DocumentCategoryRecord | null>(null)

  // Form State
  const [key, setKey] = useState("")
  const [nameEn, setNameEn] = useState("")
  const [nameAr, setNameAr] = useState("")
  const [description, setDescription] = useState("")
  const [defaultValidityDays, setDefaultValidityDays] = useState(365)
  const [isMandatory, setIsMandatory] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/settings/categories")
      if (res.ok) {
        const data = await res.json()
        setCategories(data.categories || [])
      }
    } catch {
      // Ignore
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleOpenAdd = () => {
    setKey("")
    setNameEn("")
    setNameAr("")
    setDescription("")
    setDefaultValidityDays(365)
    setIsMandatory(false)
    setError(null)
    setEditingCategory(null)
    setIsAddModalOpen(true)
  }

  const handleOpenEdit = (cat: DocumentCategoryRecord) => {
    setKey(cat.key)
    setNameEn(cat.nameEn)
    setNameAr(cat.nameAr)
    setDescription(cat.description || "")
    setDefaultValidityDays(cat.defaultValidityDays || 365)
    setIsMandatory(cat.isMandatory || false)
    setError(null)
    setEditingCategory(cat)
    setIsAddModalOpen(true)
  }

  const handleToggleActive = async (cat: DocumentCategoryRecord) => {
    try {
      const res = await fetch(`/api/admin/settings/categories/${cat.key}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !cat.isActive }),
      })
      if (res.ok) {
        fetchCategories()
      }
    } catch {
      // Ignore
    }
  }

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSaving(true)

    try {
      if (editingCategory) {
        // Edit existing
        const res = await fetch(`/api/admin/settings/categories/${editingCategory.key}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nameEn,
            nameAr,
            description,
            defaultValidityDays,
            isMandatory,
          }),
        })

        const data = await res.json()
        if (!res.ok) {
          setError(data.error || "Failed to update category")
          return
        }
      } else {
        // Add new
        const res = await fetch("/api/admin/settings/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key: key.trim().toLowerCase().replace(/\s+/g, "_"),
            nameEn,
            nameAr,
            description,
            defaultValidityDays: Number(defaultValidityDays),
            isMandatory,
          }),
        })

        const data = await res.json()
        if (!res.ok) {
          setError(data.error || "Failed to create category")
          return
        }
      }

      setIsAddModalOpen(false)
      fetchCategories()
    } catch {
      setError("Network error while saving category")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-bold text-secondary-900 dark:text-white">
            {t("admin.settings.catTitle") || "Corporate Document Types & Categories"}
          </h3>
          <p className="text-xs text-secondary-500">
            {t("admin.settings.catSubtitle") ||
              "Configure acceptable business certificates, default validities, and client upload dropzone types"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchCategories}
            className="border-secondary-200 bg-white hover:bg-secondary-50 dark:border-secondary-800 dark:bg-secondary-900"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          </Button>

          <Button
            onClick={handleOpenAdd}
            className="bg-primary-600 font-bold text-white shadow-md hover:bg-primary-700"
          >
            <Plus className="mr-1.5 h-4 w-4 rtl:mr-0 rtl:ml-1.5" />
            <span>{t("admin.settings.addCat") || "Add Document Type"}</span>
          </Button>
        </div>
      </div>

      {/* Categories Grid / Table */}
      <div className="overflow-hidden rounded-2xl border border-secondary-200/80 bg-white shadow-sm dark:border-secondary-800 dark:bg-secondary-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs rtl:text-right">
            <thead className="border-b border-secondary-100 bg-secondary-50/75 text-[11px] font-bold text-secondary-600 uppercase tracking-wider dark:border-secondary-800 dark:bg-secondary-800/50 dark:text-secondary-400">
              <tr>
                <th className="px-5 py-3.5">{t("admin.settings.colType") || "Document Type"}</th>
                <th className="px-4 py-3.5">{t("admin.settings.colKey") || "System Key"}</th>
                <th className="px-4 py-3.5">{t("admin.settings.colValidity") || "Default Validity"}</th>
                <th className="px-4 py-3.5">{t("admin.settings.colMandatory") || "Mandatory"}</th>
                <th className="px-4 py-3.5">{t("admin.settings.colStatus") || "Status"}</th>
                <th className="px-5 py-3.5 text-right rtl:text-left">{t("common.actions") || "Actions"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100 dark:divide-secondary-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-secondary-400">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin text-primary-500" />
                      <span>Loading document categories...</span>
                    </div>
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-secondary-400">
                    <Tag className="mx-auto h-8 w-8 text-secondary-300" />
                    <p className="mt-2 text-sm font-bold text-secondary-900 dark:text-white">
                      No document categories configured
                    </p>
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr
                    key={cat.key}
                    className="transition-colors hover:bg-secondary-50/60 dark:hover:bg-secondary-800/40"
                  >
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-bold text-secondary-900 dark:text-white text-xs">
                          {cat.nameEn}
                        </p>
                        <p className="text-[11px] font-semibold text-primary-600 dark:text-primary-400">
                          {cat.nameAr}
                        </p>
                        {cat.description && (
                          <p className="mt-0.5 text-[11px] text-secondary-500 line-clamp-1">
                            {cat.description}
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <code className="rounded bg-secondary-100 px-2 py-0.5 font-mono text-[11px] text-secondary-800 dark:bg-secondary-800 dark:text-secondary-200">
                        {cat.key}
                      </code>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5 text-secondary-700 dark:text-secondary-300 font-medium">
                        <Calendar className="h-3.5 w-3.5 text-secondary-400" />
                        <span>{cat.defaultValidityDays} days ({Math.round(cat.defaultValidityDays / 365 * 10) / 10} yr)</span>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      {cat.isMandatory ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
                          <Shield className="h-2.5 w-2.5" />
                          <span>Required</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-secondary-400">Optional</span>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      <button
                        onClick={() => handleToggleActive(cat)}
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold transition-all ${
                          cat.isActive
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300"
                            : "bg-secondary-100 text-secondary-500 hover:bg-secondary-200 dark:bg-secondary-800 dark:text-secondary-400"
                        }`}
                      >
                        {cat.isActive ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                        <span>{cat.isActive ? "Active (In Dropzone)" : "Archived"}</span>
                      </button>
                    </td>

                    <td className="px-5 py-4 text-right rtl:text-left">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenEdit(cat)}
                        className="rounded-xl border-secondary-200 bg-white font-semibold text-secondary-700 shadow-sm hover:bg-secondary-50 dark:border-secondary-700 dark:bg-secondary-800 dark:text-secondary-300"
                      >
                        <Edit2 className="mr-1.5 h-3 w-3 rtl:mr-0 rtl:ml-1.5" />
                        <span>Edit</span>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Category Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-secondary-200 bg-white p-6 shadow-2xl dark:border-secondary-800 dark:bg-secondary-900"
            >
              <div className="flex items-center justify-between border-b border-secondary-100 pb-4 dark:border-secondary-800">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-950/60 dark:text-primary-400">
                    <Tag className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-secondary-900 dark:text-white">
                      {editingCategory ? "Edit Document Category" : "Add Allowed Document Type"}
                    </h3>
                    <p className="text-xs text-secondary-500">
                      Configure legal title, Arabic name, and preset validity
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-lg p-1.5 text-secondary-400 hover:bg-secondary-100 hover:text-secondary-700 dark:hover:bg-secondary-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSaveCategory} className="mt-5 space-y-4">
                {error && (
                  <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
                    {error}
                  </div>
                )}

                {!editingCategory && (
                  <div>
                    <label className="text-xs font-bold text-secondary-700 dark:text-secondary-300">
                      System Key (Lowercase & underscores) *
                    </label>
                    <input
                      type="text"
                      required
                      value={key}
                      onChange={(e) => setKey(e.target.value)}
                      placeholder="e.g. eur1_certificate"
                      className="mt-1 w-full rounded-xl border border-secondary-200 bg-white px-3 py-2 text-xs font-mono text-secondary-900 focus:border-primary-500 focus:outline-none dark:border-secondary-700 dark:bg-secondary-800 dark:text-white"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-secondary-700 dark:text-secondary-300">
                      English Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={nameEn}
                      onChange={(e) => setNameEn(e.target.value)}
                      placeholder="EUR.1 Movement Certificate"
                      className="mt-1 w-full rounded-xl border border-secondary-200 bg-white px-3 py-2 text-xs font-medium text-secondary-900 focus:border-primary-500 focus:outline-none dark:border-secondary-700 dark:bg-secondary-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-secondary-700 dark:text-secondary-300">
                      Arabic Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={nameAr}
                      onChange={(e) => setNameAr(e.target.value)}
                      placeholder="شهادة حركة البضائع يورو 1"
                      className="mt-1 w-full rounded-xl border border-secondary-200 bg-white px-3 py-2 text-xs font-medium text-secondary-900 focus:border-primary-500 focus:outline-none dark:border-secondary-700 dark:bg-secondary-800 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-secondary-700 dark:text-secondary-300">
                      Default Validity (Days) *
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={defaultValidityDays}
                      onChange={(e) => setDefaultValidityDays(Number(e.target.value))}
                      className="mt-1 w-full rounded-xl border border-secondary-200 bg-white px-3 py-2 text-xs font-medium text-secondary-900 focus:border-primary-500 focus:outline-none dark:border-secondary-700 dark:bg-secondary-800 dark:text-white"
                    />
                  </div>

                  <div className="flex flex-col justify-end">
                    <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-secondary-200 bg-secondary-50/50 p-2.5 dark:border-secondary-700 dark:bg-secondary-800/50">
                      <input
                        type="checkbox"
                        checked={isMandatory}
                        onChange={(e) => setIsMandatory(e.target.checked)}
                        className="h-4 w-4 rounded text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-xs font-bold text-secondary-900 dark:text-white">
                        Mandatory Compliance Doc
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-secondary-700 dark:text-secondary-300">
                    Description & Regulatory Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Instructions shown to customer in upload zone..."
                    className="mt-1 w-full rounded-xl border border-secondary-200 bg-white p-2.5 text-xs text-secondary-900 placeholder-secondary-400 focus:border-primary-500 focus:outline-none dark:border-secondary-700 dark:bg-secondary-800 dark:text-white"
                  />
                </div>

                <div className="mt-5 flex items-center justify-end gap-2 border-t border-secondary-100 pt-4 dark:border-secondary-800">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddModalOpen(false)}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={saving}
                    className="bg-primary-600 font-bold text-white hover:bg-primary-700"
                  >
                    {saving ? (
                      <span className="flex items-center gap-1.5">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Saving...</span>
                      </span>
                    ) : (
                      <span>{editingCategory ? "Save Changes" : "Create Document Type"}</span>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
