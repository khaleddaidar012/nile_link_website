import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { CustomerRequest, RequestService, User } from "@/lib/models"
import { getSessionFromRequest } from "@/lib/auth/token-service"
import { PricingEngine } from "@/lib/services/PricingEngine"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const user = await User.findById(session.userId)
    if (user?.role !== "admin" && user?.role !== "employee") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const request = await CustomerRequest.findById(params.id)
    if (!request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 })
    }

    // Fetch the actual RequestService documents
    const services = await RequestService.find({ _id: { $in: request.services } })
    
    // Calculate prices
    const suggestedPrices = await PricingEngine.calculateAll(services)

    return NextResponse.json({
      success: true,
      data: suggestedPrices,
    })
  } catch (error) {
    console.error("Calculate price error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
