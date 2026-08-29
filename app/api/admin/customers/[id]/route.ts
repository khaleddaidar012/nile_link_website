import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Customer, Document as DocumentModel, User, Invoice } from "@/lib/models"
import { getSessionFromRequest } from "@/lib/auth/token-service"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session || (session.role !== "staff" && session.role !== "super_admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    await connectDB()

    const customer = await Customer.findById(id).lean()
    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    // Associated Users / Contacts
    const users = await User.find({ customerId: customer._id })
      .select("firstName lastName email phone role status emailVerified whatsappVerified lastLoginAt")
      .lean()

    // Associated Documents
    const documents = await DocumentModel.find({
      customerId: customer._id,
      isArchived: false,
    })
      .sort({ createdAt: -1 })
      .lean()

    // Invoices summary
    const invoices = await Invoice.find({ customerId: customer._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean()

    const totalDocs = documents.length
    const approvedDocs = documents.filter((d) => d.status === "approved").length
    const expiringDocs = documents.filter((d) => d.status === "expiring_soon").length
    const expiredDocs = documents.filter((d) => d.status === "expired").length
    const pendingDocs = documents.filter((d) => d.status === "pending_review").length
    const rejectedDocs = documents.filter((d) => d.status === "rejected").length

    const formattedDocuments = documents.map((d) => ({
      id: d._id.toString(),
      title: d.title,
      category: d.category,
      fileName: d.fileName,
      fileUrl: d.fileUrl,
      fileSize: d.fileSize,
      mimeType: d.mimeType,
      status: d.status,
      startDate: d.startDate,
      expiryDate: d.expiryDate,
      warningEscalationTier: d.warningEscalationTier,
      rejectionReason: d.rejectionReason,
      reviewNotes: d.reviewNotes,
      createdAt: d.createdAt,
    }))

    return NextResponse.json({
      success: true,
      customer: {
        id: customer._id.toString(),
        companyName: customer.companyName,
        commercialRegisterNumber: customer.commercialRegisterNumber,
        taxCardNumber: customer.taxCardNumber,
        industry: customer.industry,
        country: customer.country,
        city: customer.city,
        address: customer.address,
        contactEmail: customer.contactEmail,
        contactPhone: customer.contactPhone,
        accountStatus: customer.accountStatus,
        statusReason: customer.statusReason,
        maxAllowedDocuments: customer.maxAllowedDocuments,
        notes: customer.notes,
        createdAt: customer.createdAt,
        updatedAt: customer.updatedAt,
      },
      users: users.map((u) => ({
        id: u._id.toString(),
        name: `${u.firstName} ${u.lastName}`,
        email: u.email,
        phone: u.phone,
        role: u.role,
        status: u.status,
        emailVerified: u.emailVerified,
        whatsappVerified: u.whatsappVerified,
        lastLoginAt: u.lastLoginAt,
      })),
      complianceStats: {
        totalDocs,
        approvedDocs,
        expiringDocs,
        expiredDocs,
        pendingDocs,
        rejectedDocs,
        maxAllowed: customer.maxAllowedDocuments || 20,
      },
      documents: formattedDocuments,
      recentInvoices: invoices.map((inv) => ({
        id: inv._id.toString(),
        invoiceNumber: inv.invoiceNumber,
        amount: inv.amount,
        currency: inv.currency,
        status: inv.status,
        dueDate: inv.dueDate,
      })),
    })
  } catch (error: unknown) {
    console.error("GET /api/admin/customers/[id] error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
