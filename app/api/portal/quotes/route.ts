import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Quote } from "@/lib/models"
import { getSessionFromRequest } from "@/lib/auth/token-service"

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    // Find the customer's customerId from session
    const { Customer } = await import("@/lib/models")
    const customer = await Customer.findOne({ userId: session.userId }).lean() as any

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    const quotes = await Quote.find({ customerId: customer._id })
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json({ success: true, quotes })
  } catch (error) {
    console.error("Fetch quotes error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
