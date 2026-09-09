import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Document as DocumentModel } from "@/lib/models"
import { getSessionFromRequest } from "@/lib/auth/token-service"
import mongoose from "mongoose"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session || (session.role !== "staff" && session.role !== "super_admin")) {
      return NextResponse.json({ error: "Forbidden: Staff access required" }, { status: 403 })
    }

    const resolvedParams = await params
    const id = resolvedParams.id

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid Request ID" }, { status: 400 })
    }

    await connectDB()

    const documents = await DocumentModel.find({
      entityId: id,
      entityType: "CustomerRequest",
      isArchived: false,
    }).sort({ createdAt: -1 }).lean()

    return NextResponse.json({
      success: true,
      documents: documents.map((doc: any) => ({
        id: doc._id.toString(),
        title: doc.title,
        category: doc.category,
        fileName: doc.fileName,
        fileUrl: doc.fileUrl,
        fileSize: doc.fileSize,
        mimeType: doc.mimeType,
        status: doc.status,
        createdAt: doc.createdAt,
      })),
    })
  } catch (error: unknown) {
    console.error("Fetch request documents error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
