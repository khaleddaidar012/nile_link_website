import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { AnalyticsEvent } from "@/lib/models/AnalyticsEvent"
import { verifyApiSession } from "@/lib/auth/session"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const authenticated = await verifyApiSession(request)
    if (!authenticated) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
    }
    await connectDB()

    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const sevenDaysAgo = new Date(todayStart)
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)

    const [totalVisitorsResult, todayVisitorsResult, totalPageViewsResult, topPagesResult, last7DaysResult, devicesResult, countriesResult] =
      await Promise.all([
        AnalyticsEvent.distinct("ipHash", { type: "page_view" }),
        AnalyticsEvent.distinct("ipHash", { type: "page_view", createdAt: { $gte: todayStart } }),
        AnalyticsEvent.countDocuments({ type: "page_view" }),
        AnalyticsEvent.aggregate([
          { $match: { type: "page_view" } },
          { $group: { _id: "$page", visitors: { $addToSet: "$ipHash" }, views: { $sum: 1 } } },
          { $project: { _id: 0, path: "$_id", visitors: { $size: "$visitors" }, views: 1 } },
          { $sort: { visitors: -1 } },
          { $limit: 10 },
        ]),
        AnalyticsEvent.aggregate([
          { $match: { type: "page_view", createdAt: { $gte: sevenDaysAgo } } },
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
              visitors: { $addToSet: "$ipHash" },
            },
          },
          { $project: { _id: 0, date: "$_id", value: { $size: "$visitors" } } },
          { $sort: { date: 1 } },
        ]),
        AnalyticsEvent.aggregate([
          { $match: { type: "page_view" } },
          { $group: { _id: "$device", visitors: { $addToSet: "$ipHash" } } },
          { $project: { _id: 0, device: "$_id", visitors: { $size: "$visitors" } } },
        ]),
        AnalyticsEvent.aggregate([
          { $match: { type: "page_view", country: { $nin: [null, ""] } } },
          { $group: { _id: "$country", visitors: { $addToSet: "$ipHash" } } },
          { $project: { _id: 0, country: "$_id", visitors: { $size: "$visitors" } } },
          { $sort: { visitors: -1 } },
          { $limit: 10 },
        ]),
      ])

    const totalVisitors = totalVisitorsResult.length
    const todayVisitors = todayVisitorsResult.length
    const totalPageViews = totalPageViewsResult

    const totalSources = devicesResult.reduce((sum, d) => sum + d.visitors, 0) || 1

    return NextResponse.json({
      success: true,
      data: {
        totalVisitors,
        todayVisitors,
        totalPageViews,
        topPages: topPagesResult.map((p: Record<string, unknown>) => ({
          path: p.path,
          title: ((p.path as string) || "").split("/").filter(Boolean).pop() || "Home",
          visitors: p.visitors,
          views: p.views,
        })),
        last7Days: last7DaysResult.map((d: Record<string, unknown>) => ({
          date: d.date,
          value: d.value,
        })),
        devices: devicesResult.map((d: Record<string, unknown>) => ({
          device: d.device,
          visitors: d.visitors,
          percentage: parseFloat((((d.visitors as number) / totalSources) * 100).toFixed(1)),
        })),
        countries: countriesResult.map((c: Record<string, unknown>) => ({
          country: c.country || "Unknown",
          code: ((c.country as string) || "").slice(0, 2).toLowerCase(),
          visitors: c.visitors,
          percentage: parseFloat((((c.visitors as number) / totalSources) * 100).toFixed(1)),
        })),
      },
    })
  } catch (error) {
    console.error("[Analytics Dashboard] Error:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
