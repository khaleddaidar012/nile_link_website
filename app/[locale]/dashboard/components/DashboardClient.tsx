"use client"

import { useState, useEffect, useCallback } from "react"
import { AnalyticsDataSet, AnalyticsPeriod } from "@/lib/analytics"
import { Users, Eye, CalendarDays, Clock, FileText, Activity, TrendingUp, BarChart3, Globe, Smartphone, Monitor, Laptop, Languages, MapPin, ArrowUpRight, AlertCircle, RefreshCw } from "lucide-react"
import { MetricCard } from "./MetricCard"
import { AreaChartCard } from "./AreaChart"
import { BarChartCard } from "./BarChart"
import { PieChartCard } from "./PieChartCard"
import { StatRow, StatRowList } from "./StatRow"
import { RecentQuotesTable } from "./RecentQuotesTable"
import { RealTimeVisitors } from "./RealTimeVisitors"
import { MostVisitedPages } from "./MostVisitedPages"
import { DateFilter } from "./DateFilter"
import { Link, useRouter } from "@/navigation"
import { LogOut } from "lucide-react"

export function DashboardClient() {
  const router = useRouter()
  const [period, setPeriod] = useState<AnalyticsPeriod>("last30")
  const [data, setData] = useState<AnalyticsDataSet | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/analytics/dashboard")
      const json = await res.json()
      if (!json.success) throw new Error(json.error || "Failed to fetch analytics data")

      const d = json.data

      const dataset: AnalyticsDataSet = {
        overview: {
          totalVisitors: d.totalVisitors,
          visitorsToday: d.todayVisitors,
          visitorsThisWeek: d.totalVisitors,
          visitorsThisMonth: d.totalVisitors,
          totalQuoteRequests: 0,
          quoteRequestsToday: 0,
          quoteRequestsThisWeek: 0,
          quoteRequestsThisMonth: 0,
          averageSessionDuration: 0,
          bounceRate: 0,
        },
        dailyVisitors: d.last7Days || [],
        weeklyVisitors: [],
        monthlyVisitors: [],
        visitorComparison: {
          todayVsYesterday: { current: d.todayVisitors, previous: 0, changePercent: 0 },
          thisWeekVsLastWeek: { current: d.totalVisitors, previous: 0, changePercent: 0 },
          thisMonthVsLastMonth: { current: d.totalVisitors, previous: 0, changePercent: 0 },
        },
        sessionAnalytics: {
          averageSessionDuration: 0,
          averagePagesPerVisit: 0,
          newVisitors: d.totalVisitors,
          returningVisitors: 0,
        },
        quoteRequestTrend: [],
        trafficSources: [],
        languages: [],
        countries: d.countries || [],
        devices: d.devices || [],
        browsers: [],
        operatingSystems: [],
        activeUsers: { current: d.todayVisitors },
        recentQuotes: [],
        mostVisitedPages: (d.topPages || []).map((p: { path: string; title: string; visitors: number }) => ({
          path: p.path,
          title: p.title,
          visitors: p.visitors,
          percentage: d.totalVisitors > 0 ? parseFloat(((p.visitors / d.totalVisitors) * 100).toFixed(1)) : 0,
        })),
      }

      setData(dataset)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load analytics data")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleLogout = useCallback(async () => {
    await fetch("/api/analytics/logout", { method: "POST" })
    router.push("/analytics-login")
  }, [router])

  const handlePeriodChange = useCallback((newPeriod: AnalyticsPeriod) => {
    setPeriod(newPeriod)
  }, [])

  const handleCustomRange = useCallback((start: string, end: string) => {
    console.log("Custom range:", start, end)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 pt-16 dark:bg-secondary-900 md:pt-20">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-24">
            <RefreshCw className="h-8 w-8 animate-spin text-primary-500" />
            <p className="mt-4 text-sm text-secondary-500">Loading analytics data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-secondary-50 pt-16 dark:bg-secondary-900 md:pt-20">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-24">
            <AlertCircle className="h-12 w-12 text-red-400" />
            <h2 className="mt-4 text-lg font-semibold text-secondary-900 dark:text-white">Failed to Load Data</h2>
            <p className="mt-2 text-sm text-secondary-500">{error || "An unexpected error occurred"}</p>
            <button
              onClick={fetchData}
              className="mt-6 flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  const { overview, dailyVisitors, weeklyVisitors, monthlyVisitors, visitorComparison, sessionAnalytics, quoteRequestTrend, trafficSources, languages, countries, devices, browsers, operatingSystems, activeUsers, recentQuotes, mostVisitedPages } = data

  const getFlagEmoji = (countryCode: string): string => {
    const codePoints = countryCode.toUpperCase().split("").map(char => 0x1F1E6 + char.charCodeAt(0) - 65)
    return String.fromCodePoint(...codePoints)
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}m ${secs}s`
  }

  return (
    <div className="min-h-screen bg-secondary-50 pt-16 dark:bg-secondary-900 md:pt-20">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">Analytics Dashboard</h1>
            <p className="mt-1 text-sm text-secondary-500">Monitor your website performance and visitor analytics</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-xl border border-secondary-200 bg-white px-4 py-2.5 text-sm font-medium text-secondary-600 transition-colors hover:bg-secondary-50 dark:border-secondary-700 dark:bg-secondary-800 dark:text-secondary-300 dark:hover:bg-secondary-700"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
            <Link
              href="/"
              className="flex items-center gap-1.5 rounded-xl border border-secondary-200 bg-white px-4 py-2.5 text-sm font-medium text-secondary-600 transition-colors hover:bg-secondary-50 dark:border-secondary-700 dark:bg-secondary-800 dark:text-secondary-300 dark:hover:bg-secondary-700"
            >
              <ArrowUpRight className="h-4 w-4" />
              View Site
            </Link>
            <DateFilter period={period} onPeriodChange={handlePeriodChange} onCustomRange={handleCustomRange} />
          </div>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard title="Total Visitors" value={overview.totalVisitors} description="All time" icon={Users} />
          <MetricCard title="Visitors Today" value={overview.visitorsToday} description={new Date().toLocaleDateString()} icon={Eye} trend={visitorComparison.todayVsYesterday.changePercent} trendLabel="vs yesterday" />
          <MetricCard title="This Week" value={overview.visitorsThisWeek} description="Last 7 days" icon={CalendarDays} trend={visitorComparison.thisWeekVsLastWeek.changePercent} trendLabel="vs last week" />
          <MetricCard title="This Month" value={overview.visitorsThisMonth} description="Last 30 days" icon={BarChart3} trend={visitorComparison.thisMonthVsLastMonth.changePercent} trendLabel="vs last month" />
          <MetricCard title="Quote Requests" value={overview.totalQuoteRequests} description="All time" icon={FileText} />
          <MetricCard title="Requests Today" value={overview.quoteRequestsToday} description={new Date().toLocaleDateString()} icon={FileText} />
          <MetricCard title="Avg. Session Duration" value={formatDuration(overview.averageSessionDuration)} description="Per visit" icon={Clock} />
          <MetricCard title="Bounce Rate" value={`${overview.bounceRate}%`} description="Exits without interaction" icon={Activity} />
        </div>

        <div className="mb-8 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <AreaChartCard data={dailyVisitors} title="Daily Visitors" subtitle="Last 7 days" />
          </div>
          <div className="grid gap-6">
            <div className="rounded-2xl border border-secondary-200 bg-white p-6 shadow-sm dark:border-secondary-700 dark:bg-secondary-800">
              <h3 className="mb-3 text-sm font-bold text-secondary-900 dark:text-white">Visitor Comparison</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs text-secondary-500 mb-1">Today vs Yesterday</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 rounded-full bg-secondary-100 dark:bg-secondary-700">
                      <div className="h-2 rounded-full bg-primary-500" style={{ width: `${Math.min(Math.abs(visitorComparison.todayVsYesterday.changePercent) * 5, 100)}%` }} />
                    </div>
                    <span className={`text-xs font-semibold ${visitorComparison.todayVsYesterday.changePercent >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                      {visitorComparison.todayVsYesterday.changePercent >= 0 ? "+" : ""}{visitorComparison.todayVsYesterday.changePercent}%
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-secondary-500 mb-1">This Week vs Last Week</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 rounded-full bg-secondary-100 dark:bg-secondary-700">
                      <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${Math.min(Math.abs(visitorComparison.thisWeekVsLastWeek.changePercent) * 5, 100)}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-emerald-500">+{visitorComparison.thisWeekVsLastWeek.changePercent >= 0 ? "" : ""}{visitorComparison.thisWeekVsLastWeek.changePercent}%</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-secondary-500 mb-1">This Month vs Last Month</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 rounded-full bg-secondary-100 dark:bg-secondary-700">
                      <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${Math.min(Math.abs(visitorComparison.thisMonthVsLastMonth.changePercent) * 5, 100)}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-emerald-500">+{visitorComparison.thisMonthVsLastMonth.changePercent >= 0 ? "" : ""}{visitorComparison.thisMonthVsLastMonth.changePercent}%</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-secondary-200 bg-white p-6 shadow-sm dark:border-secondary-700 dark:bg-secondary-800">
              <h3 className="mb-3 text-sm font-bold text-secondary-900 dark:text-white">Session Analytics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-xs text-secondary-500">Avg. Session Duration</span>
                  <span className="text-xs font-semibold text-secondary-900 dark:text-white">{formatDuration(sessionAnalytics.averageSessionDuration)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-secondary-500">Pages Per Visit</span>
                  <span className="text-xs font-semibold text-secondary-900 dark:text-white">{sessionAnalytics.averagePagesPerVisit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-secondary-500">New Visitors</span>
                  <span className="text-xs font-semibold text-secondary-900 dark:text-white">{sessionAnalytics.newVisitors.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-secondary-500">Returning Visitors</span>
                  <span className="text-xs font-semibold text-secondary-900 dark:text-white">{sessionAnalytics.returningVisitors.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {weeklyVisitors.length > 0 && (
          <div className="mb-8 grid gap-6 lg:grid-cols-2">
            <BarChartCard data={weeklyVisitors} title="Weekly Visitors" subtitle="Last 12 weeks" color="#10b981" />
          </div>
        )}

        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          {monthlyVisitors.length > 0 && (
            <AreaChartCard data={monthlyVisitors} title="Monthly Visitors" subtitle="Last 12 months" color="#8b5cf6" />
          )}
          {quoteRequestTrend.length > 0 && (
            <AreaChartCard data={quoteRequestTrend} title="Quote Requests Over Time" subtitle="Last 30 days" color="#f59e0b" />
          )}
        </div>

        <div className="mb-8 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 grid gap-6 lg:grid-cols-2">
            <PieChartCard data={trafficSources.map(s => ({ name: s.source, value: s.visitors }))} title="Traffic Sources" />
            {(languages.length > 0) && (
              <PieChartCard data={languages.map(l => ({ name: l.language, value: l.visitors }))} title="Languages" />
            )}
            <PieChartCard data={devices.map(d => ({ name: d.device, value: d.visitors }))} title="Devices" />
            <PieChartCard data={browsers.map(b => ({ name: b.browser, value: b.visitors }))} title="Browsers" />
          </div>
          <div className="grid gap-6">
            {mostVisitedPages.length > 0 && <MostVisitedPages pages={mostVisitedPages} />}
            <RealTimeVisitors current={activeUsers.current} />
          </div>
        </div>

        <div className="mb-8 grid gap-6 lg:grid-cols-3">
          <StatRowList title="Operating Systems">
            {operatingSystems.map((os) => (
              <StatRow key={os.os} label={os.os} value={os.visitors.toLocaleString()} percentage={os.percentage} />
            ))}
          </StatRowList>
          <StatRowList title="Top Countries">
            {countries.map((c) => (
              <StatRow key={c.country} label={c.country} value={c.visitors.toLocaleString()} percentage={c.percentage} flag={getFlagEmoji(c.code)} />
            ))}
          </StatRowList>
          {languages.length > 0 && (
            <StatRowList title="Languages">
              {languages.map((l) => (
                <StatRow key={l.language} label={l.language} value={l.visitors.toLocaleString()} percentage={l.percentage} />
              ))}
            </StatRowList>
          )}
        </div>

        {recentQuotes.length > 0 && (
          <div className="mb-8">
            <RecentQuotesTable quotes={recentQuotes} />
          </div>
        )}

        <div className="rounded-2xl border border-secondary-200 bg-white p-6 text-center shadow-sm dark:border-secondary-700 dark:bg-secondary-800">
          <p className="text-xs text-secondary-400">
            Data source: <span className="font-medium text-secondary-600 dark:text-secondary-300">Internal Analytics</span>
          </p>
        </div>
      </div>
    </div>
  )
}
