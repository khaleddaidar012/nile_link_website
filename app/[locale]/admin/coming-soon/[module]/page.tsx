"use client"

import { use } from "react"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { ModuleComingSoonView, LOGISTICS_MODULES } from "@/components/admin/coming-soon/ModuleComingSoonView"

interface ComingSoonPageProps {
  params: Promise<{ module: string }>
}

export default function AdminComingSoonPage({ params }: ComingSoonPageProps) {
  const resolvedParams = use(params)
  const moduleData = LOGISTICS_MODULES[resolvedParams.module] || LOGISTICS_MODULES.shipments

  return (
    <div className="flex flex-col">
      <AdminHeader
        title={moduleData.nameEn}
        subtitle="Logistics Enterprise Module Roadmap & Capability Preview"
      />

      <div className="p-6 sm:p-8">
        <ModuleComingSoonView moduleSlug={resolvedParams.module} />
      </div>
    </div>
  )
}
