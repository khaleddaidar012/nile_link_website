import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Invoice } from "@/lib/models"
import { getSessionFromRequest } from "@/lib/auth/token-service"

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const { Customer } = await import("@/lib/models")
    const customer = await Customer.findOne({ userId: session.userId }).lean() as any

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    // Fetch invoices sorted by creation date descending
    const invoices = await Invoice.find({ customerId: customer._id })
      .sort({ createdAt: -1 })
      .lean()
      
    // Calculate metrics
    const metrics = invoices.reduce(
      (acc, inv) => {
        if (inv.status !== "cancelled" && inv.status !== "draft") {
          acc.totalInvoicesValue += inv.totalAmount || 0
          acc.totalPaid += inv.paidAmount || 0
          acc.totalRemaining += inv.remainingAmount || 0
        }
        return acc
      },
      { totalInvoicesValue: 0, totalPaid: 0, totalRemaining: 0 }
    )

    return NextResponse.json({ success: true, invoices, metrics })
  } catch (error) {
    console.error("Fetch financials error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
