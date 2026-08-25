export interface MostVisitedPage {
  path: string
  title: string
  visitors: number
  percentage: number
}

export interface AnalyticsOverview {
  totalVisitors: number
  visitorsToday: number
  visitorsThisWeek: number
  visitorsThisMonth: number
  totalQuoteRequests: number
  quoteRequestsToday: number
  quoteRequestsThisWeek: number
  quoteRequestsThisMonth: number
  averageSessionDuration: number
  bounceRate: number
}

export interface TimeSeriesDataPoint {
  date: string
  value: number
}

export interface VisitorComparison {
  todayVsYesterday: { current: number; previous: number; changePercent: number }
  thisWeekVsLastWeek: { current: number; previous: number; changePercent: number }
  thisMonthVsLastMonth: { current: number; previous: number; changePercent: number }
}

export interface SessionAnalytics {
  averageSessionDuration: number
  averagePagesPerVisit: number
  newVisitors: number
  returningVisitors: number
}

export interface QuoteRequestTrend {
  date: string
  value: number
}

export interface TrafficSource {
  source: string
  visitors: number
  percentage: number
}

export interface LanguageStat {
  language: string
  code: string
  visitors: number
  percentage: number
}

export interface CountryStat {
  country: string
  code: string
  visitors: number
  percentage: number
}

export interface DeviceStat {
  device: string
  visitors: number
  percentage: number
}

export interface BrowserStat {
  browser: string
  visitors: number
  percentage: number
}

export interface OSStat {
  os: string
  visitors: number
  percentage: number
}

export interface ActiveUsers {
  current: number
}

export interface RecentQuote {
  id: string
  name: string
  company: string
  country: string
  email: string
  service: string
  date: string
  status: "pending" | "contacted" | "completed"
}

export type AnalyticsPeriod = "today" | "yesterday" | "last7" | "last30" | "last90" | "lastYear" | "custom"

export interface AnalyticsFilter {
  period: AnalyticsPeriod
  startDate?: string
  endDate?: string
}

export interface AnalyticsDataSet {
  overview: AnalyticsOverview
  dailyVisitors: TimeSeriesDataPoint[]
  weeklyVisitors: TimeSeriesDataPoint[]
  monthlyVisitors: TimeSeriesDataPoint[]
  visitorComparison: VisitorComparison
  sessionAnalytics: SessionAnalytics
  quoteRequestTrend: QuoteRequestTrend[]
  trafficSources: TrafficSource[]
  languages: LanguageStat[]
  countries: CountryStat[]
  devices: DeviceStat[]
  browsers: BrowserStat[]
  operatingSystems: OSStat[]
  activeUsers: ActiveUsers
  recentQuotes: RecentQuote[]
  mostVisitedPages: MostVisitedPage[]
}
