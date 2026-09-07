import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Quote, QuoteItem } from "@/lib/models"
import { getSessionFromRequest } from "@/lib/auth/token-service"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getSessionFromRequest(req)
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const quoteId = id
    const quote = await Quote.findById(quoteId).lean()

    if (!quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 })
    }

    const items = await QuoteItem.find({ quoteId }).lean()

    return NextResponse.json({ success: true, quote, items })
  } catch (error) {
    console.error("Fetch quote error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
