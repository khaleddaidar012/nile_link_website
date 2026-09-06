import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { CustomerRequest, Customer } from "@/lib/models"
import { getSessionFromRequest } from "@/lib/auth/token-service"

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session || (session.role !== "staff" && session.role !== "super_admin")) {
      return NextResponse.json({ error: "Forbidden: Staff access required" }, { status: 403 })
    }

    await connectDB()

    const searchParams = req.nextUrl.searchParams
    const status = searchParams.get("status")
    const limit = parseInt(searchParams.get("limit") || "50")

    const query: any = {}
    if (status && status !== "all") {
      query.status = status
    }

    // Populate customerId to get companyName for the admin view
    const requests = await CustomerRequest.find(query)
      .populate({ path: "customerId", select: "companyName contactEmail" })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()

    return NextResponse.json({ requests })
  } catch (error: any) {
    console.error("Fetch admin requests error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
