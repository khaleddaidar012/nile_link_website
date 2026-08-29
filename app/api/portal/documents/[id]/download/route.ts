import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Document as DocumentModel } from "@/lib/models"
import { getSessionFromRequest } from "@/lib/auth/token-service"
import { getFileStreamFromR2 } from "@/lib/storage/r2-storage"
import { logDocumentActivity } from "@/lib/services/activity-log-service"

type Props = {
  params: Promise<{ id: string }>
}

export async function GET(req: NextRequest, { params }: Props) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    await connectDB()

    const document = await DocumentModel.findById(id)
    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    const isStaff = session.role === "staff" || session.role === "super_admin"
    const isOwner = session.customerId && document.customerId.toString() === session.customerId.toString()

    if (!isStaff && !isOwner) {
      return NextResponse.json({ error: "Forbidden: Access denied" }, { status: 403 })
    }

    const storageKey =
      document.storageKey ||
      `clients/${document.customerId.toString()}/documents/${document.storedFileName}`

    const { body, contentType, contentLength } = await getFileStreamFromR2(storageKey)

    await logDocumentActivity({
      documentId: document._id,
      customerId: document.customerId,
      actorId: session.userId,
      actorType: isStaff ? "staff" : "customer",
      actorName: `${session.firstName} ${session.lastName}`,
      action: "download",
      ipAddress: req.headers.get("x-forwarded-for")?.split(",")[0] || "",
      userAgent: req.headers.get("user-agent") || "",
    })

    const isInline = req.nextUrl.searchParams.get("view") === "inline"
    const dispositionType = isInline ? "inline" : "attachment"

    return new NextResponse(body as any, {
      headers: {
        "Content-Type": document.mimeType || contentType || "application/octet-stream",
        "Content-Disposition": `${dispositionType}; filename="${encodeURIComponent(document.fileName)}"`,
        "Content-Length": contentLength.toString(),
      },
    })
  } catch (error: unknown) {
    console.error("Document download error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
