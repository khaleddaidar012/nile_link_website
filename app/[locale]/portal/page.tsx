import { PortalHeader } from "@/components/portal/PortalHeader"
import { AccountHealthAlertBanner } from "@/components/portal/AccountHealthAlertBanner"
import { DashboardMetricsCards } from "@/components/portal/DashboardMetricsCards"
import { QuickUploadWidget } from "@/components/portal/QuickUploadWidget"
import { RecentActivityFeed } from "@/components/portal/RecentActivityFeed"

export default function PortalDashboardPage() {
  return (
    <div className="flex flex-col">
      <PortalHeader title="Client Dashboard" subtitle="Corporate legal files, shipping operations & compliance status" />

      <div className="space-y-6 p-6 sm:p-8">
        {/* Urgent Account Health Alert Banner */}
        <AccountHealthAlertBanner />

        {/* 4 KPI Metrics Cards */}
        <DashboardMetricsCards />

        {/* Main Grid: Quick Dropzone & Activity Timeline */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <QuickUploadWidget />
          </div>
          <div className="lg:col-span-2">
            <RecentActivityFeed />
          </div>
        </div>
      </div>
    </div>
  )
}
