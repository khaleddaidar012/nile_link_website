import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Invoice } from "@/lib/models"
import { getSessionFromRequest } from "@/lib/auth/token-service"

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session || !session.customerId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const invoices = await Invoice.find({ customerId: session.customerId })
      .sort({ issueDate: -1 })
      .lean()

    const totalInvoiced = invoices.reduce((acc, inv) => acc + (inv.amount || 0), 0)
    const paidAmount = invoices
      .filter((inv) => inv.status === "paid")
      .reduce((acc, inv) => acc + (inv.amount || 0), 0)
    const pendingBalance = invoices
      .filter((inv) => inv.status === "pending" || inv.status === "overdue")
      .reduce((acc, inv) => acc + (inv.amount || 0), 0)

    return NextResponse.json({
      invoices,
      summary: {
        totalInvoiced,
        paidAmount,
        pendingBalance,
      },
    })
  } catch (error: unknown) {
    console.error("List financials error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
