import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Document as DocumentModel, Customer } from "@/lib/models"
import { getSessionFromRequest } from "@/lib/auth/token-service"

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session || (session.role !== "staff" && session.role !== "super_admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const now = new Date()
    const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

    const expiringDocuments = await DocumentModel.find({
      isArchived: false,
      expiryDate: { $lte: in30Days, $ne: null },
    })
      .populate("customerId")
      .sort({ expiryDate: 1 })
      .lean()

    const ONE_DAY_MS = 24 * 60 * 60 * 1000

    const formatted = expiringDocuments.map((doc: any) => {
      const expiryMs = new Date(doc.expiryDate).getTime()
      const diffMs = expiryMs - now.getTime()
      const daysLeft = Math.ceil(diffMs / ONE_DAY_MS)

      let tier: "30d" | "20d" | "10d" | "5d" | "expired" = "30d"
      if (daysLeft <= 0) tier = "expired"
      else if (daysLeft <= 5) tier = "5d"
      else if (daysLeft <= 10) tier = "10d"
      else if (daysLeft <= 20) tier = "20d"

      const cust = doc.customerId as any

      return {
        id: doc._id.toString(),
        title: doc.title,
        category: doc.category,
        fileName: doc.fileName,
        fileUrl: doc.fileUrl,
        expiryDate: doc.expiryDate,
        daysLeft,
        tier,
        customerId: cust?._id?.toString() || "",
        companyName: cust?.companyName || "Unknown Organization",
        contactEmail: cust?.contactEmail || "",
        contactPhone: cust?.contactPhone || "",
        lastNotificationSentAt: doc.lastNotificationSentAt,
      }
    })

    return NextResponse.json({
      success: true,
      documents: formatted,
      totalCount: formatted.length,
    })
  } catch (error: unknown) {
    console.error("GET /api/admin/documents/expiring error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
