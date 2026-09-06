import { NextRequest, NextResponse } from "next/server"
import { CustomerRequest } from "@/lib/models"
import { connectDB } from "@/lib/mongodb"
import { getSessionFromRequest } from "@/lib/auth/token-service"
import mongoose from "mongoose"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session || (session.role !== "admin" && session.role !== "staff" && session.role !== "super_admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const resolvedParams = await params
    const id = resolvedParams.id
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid Request ID" }, { status: 400 })
    }

    await connectDB()

    const request = await CustomerRequest.findById(id).populate("customerId", "companyName contactEmail contactPhone")
    if (!request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 })
    }

    return NextResponse.json({ request })
  } catch (error: any) {
    console.error("Fetch Request Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch request", details: error.message },
      { status: 500 }
    )
  }
}
