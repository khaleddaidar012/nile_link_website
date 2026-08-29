import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Document as DocumentModel, User } from "@/lib/models"
import { getSessionFromRequest } from "@/lib/auth/token-service"

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    let customerId = session.customerId
    if (!customerId) {
      const user = await User.findById(session.userId)
      customerId = user?.customerId?.toString()
    }

    if (!customerId) {
      return NextResponse.json({ documents: [], pagination: { total: 0, page: 1, limit: 20, pages: 0 } })
    }

    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search") || ""
    const category = searchParams.get("category") || "all"
    const status = searchParams.get("status") || "all"
    const page = parseInt(searchParams.get("page") || "1", 10)
    const limit = parseInt(searchParams.get("limit") || "20", 10)

    const query: Record<string, unknown> = {
      customerId,
      isArchived: false,
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { fileName: { $regex: search, $options: "i" } },
      ]
    }

    if (category && category !== "all") {
      query.category = category
    }

    if (status && status !== "all") {
      query.status = status
    }

    const total = await DocumentModel.countDocuments(query)
    const documents = await DocumentModel.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("reviewedBy", "firstName lastName")
      .lean()

    return NextResponse.json({
      documents: documents.map((doc) => ({
        id: doc._id.toString(),
        title: doc.title,
        category: doc.category,
        fileName: doc.fileName,
        fileUrl: doc.fileUrl,
        fileSize: doc.fileSize,
        mimeType: doc.mimeType,
        status: doc.status,
        startDate: doc.startDate,
        expiryDate: doc.expiryDate,
        rejectionReason: doc.rejectionReason,
        reviewNotes: doc.reviewNotes,
        warningEscalationTier: doc.warningEscalationTier,
        reviewedBy: doc.reviewedBy,
        reviewedAt: doc.reviewedAt,
        createdAt: doc.createdAt,
      })),
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error: unknown) {
    console.error("List documents error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
