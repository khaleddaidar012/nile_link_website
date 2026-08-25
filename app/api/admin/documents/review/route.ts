import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Document as DocumentModel } from "@/lib/models"
import { getSessionFromRequest } from "@/lib/auth/token-service"

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session || (session.role !== "staff" && session.role !== "super_admin")) {
      return NextResponse.json({ error: "Forbidden: Staff access required" }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const category = searchParams.get("category")

    await connectDB()

    const query: Record<string, unknown> = {
      status: "pending_review",
      isArchived: false,
    }

    if (category && category !== "all") {
      query.category = category
    }

    const documents = await DocumentModel.find(query)
      .sort({ createdAt: 1 })
      .populate("customerId", "companyName commercialRegisterNumber contactEmail contactPhone")
      .populate("uploadedBy", "firstName lastName email")
      .lean()

    return NextResponse.json({
      documents: documents.map((doc: any) => ({
        id: doc._id.toString(),
        title: doc.title,
        category: doc.category,
        fileName: doc.fileName,
        fileUrl: doc.fileUrl,
        fileSize: doc.fileSize,
        mimeType: doc.mimeType,
        status: doc.status,
        companyName: doc.customerId?.companyName || "Unknown Company",
        commercialRegisterNumber: doc.customerId?.commercialRegisterNumber || "—",
        uploadedByName: doc.uploadedBy
          ? `${doc.uploadedBy.firstName} ${doc.uploadedBy.lastName}`
          : "Customer",
        uploadedByEmail: doc.uploadedBy?.email || "",
        createdAt: doc.createdAt,
      })),
      total: documents.length,
    })
  } catch (error: unknown) {
    console.error("Pending review queue error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
