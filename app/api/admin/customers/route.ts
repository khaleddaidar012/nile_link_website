import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Customer, Document as DocumentModel } from "@/lib/models"
import { getSessionFromRequest } from "@/lib/auth/token-service"

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session || (session.role !== "staff" && session.role !== "super_admin")) {
      return NextResponse.json({ error: "Forbidden: Staff access required" }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || "all"

    await connectDB()

    const query: Record<string, unknown> = {}
    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: "i" } },
        { commercialRegisterNumber: { $regex: search, $options: "i" } },
        { contactEmail: { $regex: search, $options: "i" } },
        { contactPhone: { $regex: search, $options: "i" } },
      ]
    }

    if (status && status !== "all") {
      query.accountStatus = status
    }

    const customers = await Customer.find(query).sort({ updatedAt: -1 }).lean()

    const enrichedCustomers = await Promise.all(
      customers.map(async (cust) => {
        const totalDocs = await DocumentModel.countDocuments({
          customerId: cust._id,
          isArchived: false,
        })

        const expiringCount = await DocumentModel.countDocuments({
          customerId: cust._id,
          status: "expiring_soon",
          isArchived: false,
        })

        const expiredCount = await DocumentModel.countDocuments({
          customerId: cust._id,
          status: "expired",
          isArchived: false,
        })

        const pendingCount = await DocumentModel.countDocuments({
          customerId: cust._id,
          status: "pending_review",
          isArchived: false,
        })

        return {
          id: cust._id.toString(),
          companyName: cust.companyName,
          commercialRegisterNumber: cust.commercialRegisterNumber,
          taxCardNumber: cust.taxCardNumber,
          contactEmail: cust.contactEmail,
          contactPhone: cust.contactPhone,
          accountStatus: cust.accountStatus,
          statusReason: cust.statusReason,
          totalDocs,
          expiringCount,
          expiredCount,
          pendingCount,
          maxAllowed: cust.maxAllowedDocuments || 20,
          createdAt: cust.createdAt,
        }
      })
    )

    return NextResponse.json({
      customers: enrichedCustomers,
      total: enrichedCustomers.length,
    })
  } catch (error: unknown) {
    console.error("Admin customers list error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
