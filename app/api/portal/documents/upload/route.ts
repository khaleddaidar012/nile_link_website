import { NextRequest, NextResponse } from "next/server"
import mongoose from "mongoose"
import { connectDB } from "@/lib/mongodb"
import { Document as DocumentModel, Customer, Notification, User } from "@/lib/models"
import { getSessionFromRequest } from "@/lib/auth/token-service"
import { uploadFileToR2, generateStorageKey } from "@/lib/storage/r2-storage"
import { logDocumentActivity } from "@/lib/services/activity-log-service"

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
]

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const MAX_DOCUMENTS_PER_CUSTOMER = 20

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session?.userId) {
      return NextResponse.json(
        { error: "Authentication required as customer" },
        { status: 401 }
      )
    }

    await connectDB()

    let customerId = session.customerId
    if (!customerId) {
      const user = await User.findById(session.userId)
      customerId = user?.customerId?.toString()
    }

    const customer = customerId ? await Customer.findById(customerId) : null
    if (!customer) {
      return NextResponse.json({ error: "Customer record not found" }, { status: 404 })
    }

    const currentDocCount = await DocumentModel.countDocuments({
      customerId: customer._id,
      isArchived: false,
    })

    const formData = await req.formData()
    const files = formData.getAll("files") as File[]
    const categories = formData.getAll("categories") as string[]
    const titles = formData.getAll("titles") as string[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided for upload" }, { status: 400 })
    }

    if (currentDocCount + files.length > (customer.maxAllowedDocuments || MAX_DOCUMENTS_PER_CUSTOMER)) {
      return NextResponse.json(
        {
          error: `Upload rejected: Document limit is ${customer.maxAllowedDocuments || MAX_DOCUMENTS_PER_CUSTOMER}. You currently have ${currentDocCount} active documents.`,
          code: "QUOTA_EXCEEDED",
        },
        { status: 400 }
      )
    }

    const uploadedDocuments = []
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0] || ""
    const userAgent = req.headers.get("user-agent") || ""

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const category = (categories[i] || "other") as string
      const title = titles[i] || file.name.replace(/\.[^/.]+$/, "")

      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        return NextResponse.json(
          {
            error: `File "${file.name}" has an unsupported format (${file.type}). Allowed formats: PDF, JPEG, PNG, WEBP.`,
          },
          { status: 400 }
        )
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          {
            error: `File "${file.name}" exceeds maximum allowed size of 10MB.`,
          },
          { status: 400 }
        )
      }

      const buffer = Buffer.from(await file.arrayBuffer())
      const storageKey = generateStorageKey(customer._id.toString(), "documents", file.name)
      const storedFileName = storageKey.split("/").pop() || file.name

      // 1. Upload private binary to Cloudflare R2
      const { fileHash, fileSize } = await uploadFileToR2(
        buffer,
        storageKey,
        file.type,
        {
          customerId: customer._id.toString(),
          uploadedBy: session.userId,
          originalName: file.name,
        }
      )

      // 2. Create MongoDB Document with storageKey and metadata only (Zero binary in DB)
      const docId = new mongoose.Types.ObjectId()
      const document = await DocumentModel.create({
        _id: docId,
        customerId: customer._id,
        uploadedBy: session.userId,
        title,
        category: category as any,
        fileName: file.name,
        storedFileName,
        storageKey,
        fileUrl: `/api/portal/documents/${docId}/download`,
        fileSize,
        mimeType: file.type,
        fileHash,
        entityType: "Customer",
        entityId: customer._id,
        status: "pending_review",
        warningEscalationTier: "none",
        isArchived: false,
      })

      await logDocumentActivity({
        documentId: document._id,
        customerId: customer._id,
        actorId: session.userId,
        actorType: "customer",
        actorName: `${session.firstName} ${session.lastName}`,
        action: "upload",
        newState: { title, category, fileName: file.name, status: "pending_review" },
        ipAddress: clientIp,
        userAgent,
      })

      uploadedDocuments.push({
        id: document._id.toString(),
        title: document.title,
        category: document.category,
        fileName: document.fileName,
        fileSize: document.fileSize,
        status: document.status,
      })
    }

    // Create staff in-app notification
    await Notification.create({
      recipientCustomerId: customer._id,
      targetAudience: "staff",
      title: "New Documents Awaiting Review",
      message: `${customer.companyName} uploaded ${files.length} new document(s) for verification.`,
      channel: "in_app",
      type: "document_uploaded",
      severity: "normal",
      actionUrl: "/admin/documents/review",
    })

    return NextResponse.json(
      {
        success: true,
        message: `${files.length} document(s) uploaded successfully and submitted for review.`,
        documents: uploadedDocuments,
      },
      { status: 201 }
    )
  } catch (error: unknown) {
    console.error("Document upload error:", error)
    return NextResponse.json(
      { error: "Internal server error during document upload" },
      { status: 500 }
    )
  }
}
