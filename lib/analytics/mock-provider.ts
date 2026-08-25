import { AnalyticsProvider } from "./provider"
import { AnalyticsDataSet, AnalyticsFilter } from "./types"

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function generateTimeSeries(days: number, base: number, variance: number): { date: string; value: number }[] {
  const result: { date: string; value: number }[] = []
  const now = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    result.push({
      date: formatDate(d),
      value: base + randomInt(-variance, variance),
    })
  }
  return result
}

function generateWeeklySeries(weeks: number, base: number, variance: number): { date: string; value: number }[] {
  const result: { date: string; value: number }[] = []
  const now = new Date()
  for (let i = weeks - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i * 7)
    result.push({
      date: formatDate(d),
      value: base + randomInt(-variance, variance),
    })
  }
  return result
}

function generateMonthlySeries(months: number, base: number, variance: number): { date: string; value: number }[] {
  const result: { date: string; value: number }[] = []
  const now = new Date()
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    result.push({
      date: formatDate(d),
      value: base + randomInt(-variance, variance),
    })
  }
  return result
}

const mockRecentQuotes = [
  { id: "Q-001", name: "Ahmed Hassan", company: "EgyptTrade Co.", country: "Egypt", email: "ahmed@example.com", service: "Sea Freight", date: "2026-07-19", status: "pending" as const },
  { id: "Q-002", name: "Maria Schmidt", company: "Berlin Imports GmbH", country: "Germany", email: "maria@example.com", service: "Air Freight", date: "2026-07-18", status: "contacted" as const },
  { id: "Q-003", name: "John Smith", company: "London Logistics Ltd", country: "United Kingdom", email: "john@example.com", service: "Road Freight", date: "2026-07-18", status: "pending" as const },
  { id: "Q-004", name: "Li Wei", company: "Shanghai Shipping Corp", country: "China", email: "liwei@example.com", service: "Sea Freight", date: "2026-07-17", status: "completed" as const },
  { id: "Q-005", name: "Sophie Dubois", company: "Paris Cargo SARL", country: "France", email: "sophie@example.com", service: "Air Freight", date: "2026-07-16", status: "contacted" as const },
  { id: "Q-006", name: "Marco Rossi", company: "Milano Spedizioni", country: "Italy", email: "marco@example.com", service: "Road Freight", date: "2026-07-16", status: "pending" as const },
  { id: "Q-007", name: "Ivan Petrov", company: "Sofia Logistics", country: "Bulgaria", email: "ivan@example.com", service: "Customs Clearance", date: "2026-07-15", status: "pending" as const },
  { id: "Q-008", name: "Fatima Al-Sayed", company: "Dubai Trade LLC", country: "UAE", email: "fatima@example.com", service: "Sea Freight", date: "2026-07-14", status: "completed" as const },
]

export function createMockProvider(): AnalyticsProvider {
  const now = new Date()
  const todayStr = formatDate(now)

  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = formatDate(yesterday)

  const dailyBase = 120
  const totalVisitors = 48257
  const visitorsToday = dailyBase + randomInt(-20, 20)
  const visitorsYesterday = dailyBase + randomInt(-20, 20)

  return {
    name: "mock",

    async fetchData(_filter: AnalyticsFilter): Promise<AnalyticsDataSet> {
      return {
        overview: {
          totalVisitors,
          visitorsToday,
          visitorsThisWeek: 845 + randomInt(-50, 50),
          visitorsThisMonth: 3840 + randomInt(-200, 200),
          totalQuoteRequests: 342,
          quoteRequestsToday: 5 + randomInt(-2, 3),
          quoteRequestsThisWeek: 38 + randomInt(-5, 5),
          quoteRequestsThisMonth: 165 + randomInt(-15, 15),
          averageSessionDuration: 245,
          bounceRate: 38.5,
        },

        dailyVisitors: generateTimeSeries(30, dailyBase, 40),
        weeklyVisitors: generateWeeklySeries(12, 750, 150),
        monthlyVisitors: generateMonthlySeries(12, 3500, 500),

        visitorComparison: {
          todayVsYesterday: {
            current: visitorsToday,
            previous: visitorsYesterday,
            changePercent: parseFloat((((visitorsToday - visitorsYesterday) / visitorsYesterday) * 100).toFixed(1)),
          },
          thisWeekVsLastWeek: {
            current: 845,
            previous: 792,
            changePercent: 6.7,
          },
          thisMonthVsLastMonth: {
            current: 3840,
            previous: 3610,
            changePercent: 6.4,
          },
        },

        sessionAnalytics: {
          averageSessionDuration: 245,
          averagePagesPerVisit: 3.8,
          newVisitors: 31200,
          returningVisitors: 17057,
        },

        quoteRequestTrend: generateTimeSeries(30, 8, 5),

        trafficSources: [
          { source: "Google Search", visitors: 18320, percentage: 38 },
          { source: "Direct", visitors: 10850, percentage: 22.5 },
          { source: "Facebook", visitors: 4850, percentage: 10 },
          { source: "LinkedIn", visitors: 3620, percentage: 7.5 },
          { source: "Instagram", visitors: 2410, percentage: 5 },
          { source: "Referral", visitors: 5270, percentage: 11 },
          { source: "Other", visitors: 2937, percentage: 6 },
        ],

        languages: [
          { language: "English", code: "en", visitors: 18200, percentage: 37.7 },
          { language: "Arabic", code: "ar", visitors: 9650, percentage: 20 },
          { language: "French", code: "fr", visitors: 5320, percentage: 11 },
          { language: "German", code: "de", visitors: 4820, percentage: 10 },
          { language: "Italian", code: "it", visitors: 3850, percentage: 8 },
          { language: "Chinese", code: "zh", visitors: 3370, percentage: 7 },
          { language: "Bulgarian", code: "bg", visitors: 3047, percentage: 6.3 },
        ],

        countries: [
          { country: "Egypt", code: "eg", visitors: 8750, percentage: 18.1 },
          { country: "Germany", code: "de", visitors: 5320, percentage: 11 },
          { country: "France", code: "fr", visitors: 4820, percentage: 10 },
          { country: "United Kingdom", code: "gb", visitors: 4350, percentage: 9 },
          { country: "Italy", code: "it", visitors: 3860, percentage: 8 },
          { country: "United States", code: "us", visitors: 3380, percentage: 7 },
          { country: "China", code: "cn", visitors: 2890, percentage: 6 },
          { country: "Saudi Arabia", code: "sa", visitors: 2410, percentage: 5 },
          { country: "Bulgaria", code: "bg", visitors: 1930, percentage: 4 },
          { country: "UAE", code: "ae", visitors: 1450, percentage: 3 },
        ],

        devices: [
          { device: "Desktop", visitors: 24128, percentage: 50 },
          { device: "Mobile", visitors: 20509, percentage: 42.5 },
          { device: "Tablet", visitors: 3620, percentage: 7.5 },
        ],

        browsers: [
          { browser: "Chrome", visitors: 23650, percentage: 49 },
          { browser: "Safari", visitors: 9650, percentage: 20 },
          { browser: "Firefox", visitors: 6270, percentage: 13 },
          { browser: "Edge", visitors: 4825, percentage: 10 },
          { browser: "Opera", visitors: 3862, percentage: 8 },
        ],

        operatingSystems: [
          { os: "Windows", visitors: 16407, percentage: 34 },
          { os: "macOS", visitors: 12064, percentage: 25 },
          { os: "Android", visitors: 10616, percentage: 22 },
          { os: "iOS", visitors: 7240, percentage: 15 },
          { os: "Linux", visitors: 1930, percentage: 4 },
        ],

        activeUsers: {
          current: randomInt(12, 48),
        },

        recentQuotes: mockRecentQuotes,

        mostVisitedPages: [
          { path: "/", title: "Home", visitors: 12450, percentage: 25.8 },
          { path: "/services", title: "Services", visitors: 6750, percentage: 14 },
          { path: "/request-quote", title: "Request Quote", visitors: 5430, percentage: 11.3 },
          { path: "/about", title: "About Us", visitors: 4890, percentage: 10.1 },
          { path: "/contact", title: "Contact", visitors: 4320, percentage: 9 },
          { path: "/services/sea-freight", title: "Sea Freight", visitors: 3210, percentage: 6.7 },
          { path: "/services/air-freight", title: "Air Freight", visitors: 2870, percentage: 5.9 },
          { path: "/services/road-freight", title: "Road Freight", visitors: 2450, percentage: 5.1 },
          { path: "/services/customs-clearance", title: "Customs Clearance", visitors: 1980, percentage: 4.1 },
          { path: "/services/warehousing", title: "Warehousing", visitors: 1650, percentage: 3.4 },
        ],
      }
    },
  }
}
