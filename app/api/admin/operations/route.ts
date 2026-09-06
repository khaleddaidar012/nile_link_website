import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { RequestService, CustomerRequest } from "@/lib/models"
import { getSessionFromRequest } from "@/lib/auth/token-service"

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    // Find services that are not in terminal states (assuming pending and active are what we want)
    // For operations, we probably only want 'active' ones that were approved, but we can fetch all and filter in UI.
    const services = await RequestService.find({
      status: { $nin: ["completed", "cancelled"] }
    })
      .populate({
        path: "requestId",
        model: CustomerRequest,
        populate: {
          path: "customerId",
          model: "Customer",
          select: "companyName contactEmail"
        }
      })
      .sort({ updatedAt: -1 })
      .lean()

    return NextResponse.json({ success: true, data: services })
  } catch (error) {
    console.error("Fetch operations error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
