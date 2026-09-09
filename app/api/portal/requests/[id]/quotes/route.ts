import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Quote, QuoteItem, CustomerRequest } from "@/lib/models"
import { getSessionFromRequest } from "@/lib/auth/token-service"
import mongoose from "mongoose"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session || !session.role.startsWith("customer")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const resolvedParams = await params
    const id = resolvedParams.id

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid Request ID" }, { status: 400 })
    }

    await connectDB()

    // 1. Validate ownership
    const request = await CustomerRequest.findOne({
      _id: id,
      customerId: session.customerId,
    })

    if (!request) {
      return NextResponse.json({ error: "Request not found or unauthorized" }, { status: 404 })
    }

    // 2. Fetch Quote
    const quote = await Quote.findOne({ requestId: id })
    if (!quote) {
      return NextResponse.json({ success: true, quote: null })
    }

    // 3. Fetch QuoteItems
    const items = await QuoteItem.find({ quoteId: quote._id }).populate("requestServiceId")

    return NextResponse.json({
      success: true,
      quote,
      items
    })

  } catch (error: any) {
    console.error("Fetch quote error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
