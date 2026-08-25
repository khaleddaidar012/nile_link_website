export type ExpiryTier = "normal" | "warning" | "urgent" | "critical" | "expired"

export interface ExpiryClassification {
  tier: ExpiryTier
  daysRemaining: number
  isExpired: boolean
  isUrgent: boolean
  label: string
  colorClasses: {
    badge: string
    text: string
    border: string
    bg: string
    dot: string
  }
}

export function calculateExpiry(expiryDate: Date | string | null | undefined): ExpiryClassification | null {
  if (!expiryDate) return null

  const now = new Date()
  const exp = new Date(expiryDate)
  const diffTime = exp.getTime() - now.getTime()
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (daysRemaining < 0) {
    return {
      tier: "expired",
      daysRemaining,
      isExpired: true,
      isUrgent: true,
      label: `Expired (${Math.abs(daysRemaining)}d ago)`,
      colorClasses: {
        badge: "bg-red-950/20 text-red-600 border-red-700/60 dark:text-red-400 font-bold",
        text: "text-red-600 dark:text-red-400",
        border: "border-red-500",
        bg: "bg-red-500/10",
        dot: "bg-red-500",
      },
    }
  }

  if (daysRemaining <= 2) {
    return {
      tier: "critical",
      daysRemaining,
      isExpired: false,
      isUrgent: true,
      label: daysRemaining === 0 ? "Expires Today" : `Critical (${daysRemaining}d left)`,
      colorClasses: {
        badge: "bg-rose-500/15 text-rose-600 border-rose-500/40 dark:text-rose-400 animate-pulse font-bold",
        text: "text-rose-600 dark:text-rose-400",
        border: "border-rose-500",
        bg: "bg-rose-500/10",
        dot: "bg-rose-500",
      },
    }
  }

  if (daysRemaining <= 9) {
    return {
      tier: "urgent",
      daysRemaining,
      isExpired: false,
      isUrgent: true,
      label: `Urgent (${daysRemaining}d left)`,
      colorClasses: {
        badge: "bg-orange-500/15 text-orange-600 border-orange-500/30 dark:text-orange-400 font-semibold",
        text: "text-orange-600 dark:text-orange-400",
        border: "border-orange-500",
        bg: "bg-orange-500/10",
        dot: "bg-orange-500",
      },
    }
  }

  if (daysRemaining <= 30) {
    return {
      tier: "warning",
      daysRemaining,
      isExpired: false,
      isUrgent: false,
      label: `Warning (${daysRemaining}d left)`,
      colorClasses: {
        badge: "bg-amber-500/15 text-amber-600 border-amber-500/30 dark:text-amber-400",
        text: "text-amber-600 dark:text-amber-400",
        border: "border-amber-500",
        bg: "bg-amber-500/10",
        dot: "bg-amber-500",
      },
    }
  }

  return {
    tier: "normal",
    daysRemaining,
    isExpired: false,
    isUrgent: false,
    label: `Valid (${daysRemaining}d left)`,
    colorClasses: {
      badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:text-emerald-400",
      text: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-500",
      bg: "bg-emerald-500/10",
      dot: "bg-emerald-500",
    },
  }
}
