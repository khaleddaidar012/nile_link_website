"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"

type EventType = "page_view" | "contact_submit" | "service_view"

async function sendEvent(type: EventType, page: string) {
  try {
    const enabled = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== "false"
    if (!enabled) return

    await fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, page }),
    })
  } catch {
    // silently fail
  }
}

export function AnalyticsTracker() {
  const pathname = usePathname()

  useEffect(() => {
    const start = performance.now()

    sendEvent("page_view", pathname)

    return () => {
      const duration = Math.round(performance.now() - start)
      if (duration > 100) {
        // page was likely navigated away from, could log duration
      }
    }
  }, [pathname])

  return null
}

export function trackEvent(type: EventType, page: string) {
  sendEvent(type, page)
}
