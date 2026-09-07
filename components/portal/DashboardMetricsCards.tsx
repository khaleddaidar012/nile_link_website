"use client"

import { useTranslations, useLocale } from "next-intl"
import {
  ShieldCheck,
  ShieldAlert,
  FileText,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  FolderLock,
  Phone,
  Mail,
  ArrowRight,
} from "lucide-react"
import { Link } from "@/navigation"
import { usePortal } from "./PortalContext"
import { cn } from "@/lib/utils"

export function DashboardMetricsCards() {
  const t = useTranslations()
  const locale = useLocale()
  const isEn = locale === "en"
  const { user, customer, documentStats, loading } = usePortal()

  if (loading || !user || !customer) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 w-full animate-pulse rounded-2xl bg-slate-200/60 dark:bg-slate-800/60"></div>
        ))}
      </div>
    )
  }

  const emailVer = !!user?.emailVerified
  const whatsappVer = !!user?.whatsappVerified
  const isChannelsVerified = emailVer && whatsappVer

  let channelsValue = ""
  let channelsSubtitle = ""

  if (emailVer && whatsappVer) {
    channelsValue = t("portal.verification.verified");
    if (channelsValue === "portal.verification.verified") channelsValue = isEn ? "Fully Verified" : "موثق بالكامل";
    channelsSubtitle = t("portal.verification.verifiedSubtitle");
    if (channelsSubtitle === "portal.verification.verifiedSubtitle") channelsSubtitle = isEn ? "Email and WhatsApp verified" : "تم توثيق الإيميل والواتساب";
  } else if (emailVer && !whatsappVer) {
    channelsValue = t("portal.verification.partial");
    if (channelsValue === "portal.verification.partial") channelsValue = isEn ? "Partial Verification" : "توثيق جزئي";
    channelsSubtitle = t("portal.verification.emailOnlySubtitle");
    if (channelsSubtitle === "portal.verification.emailOnlySubtitle") channelsSubtitle = isEn ? "Email verified (waiting for WhatsApp)" : "تم توثيق الإيميل (بانتظار الواتساب)";
  } else if (!emailVer && whatsappVer) {
    channelsValue = t("portal.verification.partial");
    if (channelsValue === "portal.verification.partial") channelsValue = isEn ? "Partial Verification" : "توثيق جزئي";
    channelsSubtitle = t("portal.verification.whatsappOnlySubtitle");
    if (channelsSubtitle === "portal.verification.whatsappOnlySubtitle") channelsSubtitle = isEn ? "WhatsApp verified (waiting for Email)" : "تم توثيق الواتساب (بانتظار الإيميل)";
  } else {
    channelsValue = t("portal.verification.unverified");
    if (channelsValue === "portal.verification.unverified") channelsValue = isEn ? "Unverified" : "غير موثق";
    channelsSubtitle = t("portal.verification.unverifiedSubtitle");
    if (channelsSubtitle === "portal.verification.unverifiedSubtitle") channelsSubtitle = isEn ? "No communication channel verified" : "لم يتم توثيق أي قناة اتصال";
  }

  const totalUploaded = documentStats?.totalDocs ?? 0
  const maxAllowed = documentStats?.maxAllowed ?? 20
  const approvedCount = documentStats?.approvedDocs ?? 0
  const pendingCount = documentStats?.pendingDocs ?? 0
  const expiringCount = documentStats?.expiringDocs ?? 0

  const approvedPercentage = totalUploaded > 0 ? Math.round((approvedCount / totalUploaded) * 100) : 0
  const pendingPercentage = totalUploaded > 0 ? Math.round((pendingCount / totalUploaded) * 100) : 0
  const expiringPercentage = totalUploaded > 0 ? Math.round((expiringCount / totalUploaded) * 100) : 0

  let translatedReason = customer?.statusReason || ""
  if (translatedReason === "All company documents are verified and up to date.") {
    translatedReason = isEn ? translatedReason : "جميع مستندات الشركة موثقة ومحدثة بالكامل."
  } else if (translatedReason) {
    const rejectedMatch = translatedReason.match(/Mandatory document \((.*?)\) was rejected/i)
    if (rejectedMatch) {
      translatedReason = isEn ? `Document rejected: ${rejectedMatch[1]}` : `تم رفض المستند: ${rejectedMatch[1]}`
    }
    const expiredMatch = translatedReason.match(/Mandatory document \((.*?)\) has expired/i)
    if (expiredMatch) {
      translatedReason = isEn ? `Document expired: ${expiredMatch[1]}` : `انتهت صلاحية المستند: ${expiredMatch[1]}`
    }
    const expiringSoonMatch = translatedReason.match(/(.*?) will expire in (\d+) days/i)
    if (expiringSoonMatch) {
      translatedReason = isEn ? `Document ${expiringSoonMatch[1]} will expire in ${expiringSoonMatch[2]} days.` : `المستند ${expiringSoonMatch[1]} سينتهي خلال ${expiringSoonMatch[2]} أيام.`
    }
  }

  const cards = [
    // 1. Communication Channels Verification
    {
      title: t("portal.dashboard.channels") || (isEn ? "Communication Channels" : "قنوات الاتصال والتوثيق"),
      value: channelsValue,
      subtitle: channelsSubtitle,
      badge: isChannelsVerified
        ? (t("portal.verification.verified") || (isEn ? "Verified" : "موثق"))
        : (t("portal.dashboard.kpi.actionRequired") || (isEn ? "Action Needed" : "مطلوب إجراء")),
      icon: isChannelsVerified ? ShieldCheck : ShieldAlert,
      href: "/portal/verification",
      color: isChannelsVerified
        ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
        : "text-amber-500 bg-amber-500/10 border-amber-500/20 animate-pulse",
      badgeColor: isChannelsVerified
        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
        : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300",
    },

    // 2. Account Health & Activation
    {
      title: t("portal.dashboard.accountStatus") || (isEn ? "Account Status" : "حالة الحساب"),
      value:
        customer?.accountStatus === "active"
          ? (t("portal.dashboard.kpi.activeCompliant") || (isEn ? "Active & Compliant" : "نشط ومعتمد"))
          : customer?.accountStatus === "warning"
            ? (t("portal.dashboard.kpi.warningPending") || (isEn ? "Pending Documents" : "مستندات معلقة"))
            : (t("portal.dashboard.kpi.actionRequired") || (isEn ? "Action Required" : "مطلوب إجراء")),
      subtitle: translatedReason || (isEn ? "Enterprise Legal Compliance" : "الامتثال القانوني للشركات"),
      badge: customer?.accountStatus === "active" 
        ? (t("portal.accountStatus.active") || "معتمد") 
        : (t("portal.accountStatus.review") || "مراجعة"),
      icon: customer?.accountStatus === "active" ? CheckCircle2 : AlertCircle,
      href: "/portal/profile",
      color:
        customer?.accountStatus === "active"
          ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
          : customer?.accountStatus === "warning"
            ? "text-amber-500 bg-amber-500/10 border-amber-500/20"
            : "text-rose-500 bg-rose-500/10 border-rose-500/20",
      badgeColor:
        customer?.accountStatus === "active"
          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
          : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300",
    },

    // 3. Total Uploaded Documents (needs.md Requirement 10: Just integer count e.g. 10 or 5)
    {
      title: t("portal.dashboard.kpi.totalDocs") || (isEn ? "Total Uploaded Files" : "إجمالي المستندات المرفوعة"),
      value: documentStats ? `${totalUploaded}` : "0",
      subtitle: `${maxAllowed - totalUploaded} ${t("portal.dashboard.kpi.slotsAvailable") || (isEn ? "slots available" : "أماكن متاحة")} (${maxAllowed} ${isEn ? "max" : "كحد أقصى"})`,
      badge: t("portal.dashboard.kpi.storage") || (isEn ? "Storage" : "التخزين"),
      icon: FolderLock,
      href: "/portal/documents",
      color: "text-cyan-500 bg-cyan-500/10 border-cyan-500/20",
      badgeColor: "bg-cyan-100 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300",
    },

    // 4. Active & Approved Documents Ratio (needs.md Requirement 10: approved / total uploaded)
    {
      title: t("portal.dashboard.activeDocs") || (isEn ? "Approved Documents Ratio" : "نسبة المستندات المعتمدة"),
      value: `${approvedCount} / ${totalUploaded}`,
      subtitle: `${approvedPercentage}% ${t("portal.dashboard.kpi.ofTotalUploaded") || (isEn ? "of uploaded files approved" : "من المستندات المرفوعة معتمدة")}`,
      badge: `${approvedPercentage}%`,
      icon: FileCheck2,
      href: "/portal/documents?status=approved",
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
      badgeColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
    },

    // 5. Documents Pending Staff Review Ratio (needs.md Requirement 10: in-review / total uploaded)
    {
      title: t("portal.dashboard.pendingDocs") || (isEn ? "In-Review Documents Ratio" : "نسبة المستندات قيد المراجعة"),
      value: `${pendingCount} / ${totalUploaded}`,
      subtitle: `${pendingPercentage}% ${t("portal.dashboard.kpi.awaitingStaff") || (isEn ? "awaiting staff review" : "بانتظار مراجعة الموظفين")}`,
      badge: `${pendingPercentage}%`,
      icon: Send,
      href: "/portal/documents?status=pending_review",
      color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
      badgeColor: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300",
    },

    // 6. Documents Expiring Soon Ratio (needs.md Requirement 10: expiring / total uploaded)
    {
      title: t("portal.dashboard.expiringDocs") || (isEn ? "Expiring Soon Ratio (≤10d)" : "نسبة المستندات المنتهية قريباً"),
      value: `${expiringCount} / ${totalUploaded}`,
      subtitle:
        expiringCount > 0
          ? `${expiringPercentage}% ${t("portal.dashboard.kpi.requiresRenewal") || (isEn ? "requires immediate renewal" : "تتطلب التجديد الفوري")}`
          : (t("portal.dashboard.kpi.allGood") || (isEn ? "All documents up to date" : "جميع المستندات سارية")),
      badge: expiringCount > 0 ? `${expiringPercentage}%` : "0%",
      icon: Clock,
      href: "/portal/documents?status=expiring_soon",
      color:
        expiringCount > 0
          ? "text-amber-500 bg-amber-500/15 border-amber-500/30 font-bold"
          : "text-slate-400 bg-slate-500/10 border-slate-500/20",
      badgeColor:
        expiringCount > 0
          ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 font-bold"
          : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, idx) => (
        <Link
          key={idx}
          href={card.href}
          className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider dark:text-slate-400">
              {card.title}
            </span>
            <div
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-xl border transition-transform group-hover:scale-110",
                card.color
              )}
            >
              <card.icon className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline justify-between">
            <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
              {card.value}
            </h2>
            <span
              className={cn(
                "rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                card.badgeColor
              )}
            >
              {card.badge}
            </span>
          </div>

          <p className="mt-1 text-xs text-slate-500 line-clamp-1 dark:text-slate-400">
            {card.subtitle}
          </p>
        </Link>
      ))}
    </div>
  )
}
