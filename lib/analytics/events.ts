export type AnalyticsEvent =
  | { name: "request_quote_submitted"; properties?: Record<string, string | number> }
  | { name: "contact_form_submitted"; properties?: Record<string, string | number> }
  | { name: "phone_number_clicked"; properties?: Record<string, string | number> }
  | { name: "whatsapp_clicked"; properties?: Record<string, string | number> }
  | { name: "email_clicked"; properties?: Record<string, string | number> }
  | { name: "service_card_clicked"; properties?: Record<string, string | number> }
  | { name: "cta_button_clicked"; properties?: Record<string, string | number> }
  | { name: "page_viewed"; properties?: { path: string; title: string } }

declare global {
  interface Window {
    gtag?: (command: string, targetId: string, config?: Record<string, unknown>) => void
  }
}

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

function isGtagAvailable(): boolean {
  return typeof window !== "undefined" && typeof window.gtag === "function" && !!GA_MEASUREMENT_ID
}

export function trackEvent(event: AnalyticsEvent): void {
  if (isGtagAvailable()) {
    try {
      window.gtag!("event", event.name, event.properties)
    } catch {
      console.warn(`[Analytics] Failed to track event: ${event.name}`)
    }
  }
  if (process.env.NODE_ENV === "development") {
    console.log(`[Analytics] Event tracked:`, event)
  }
}

export function trackPageView(path: string, title: string): void {
  trackEvent({ name: "page_viewed", properties: { path, title } })
}
