import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { RequestService } from "@/lib/models"
import { getSessionFromRequest } from "@/lib/auth/token-service"

export async function PUT(
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

    const serviceId = id
    const body = await req.json()
    const { status, title, comment } = body

    if (!status || !title) {
      return NextResponse.json({ error: "Missing status or title" }, { status: 400 })
    }

    const service = await RequestService.findById(serviceId)

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    // Update Status
    service.status = status
    
    // Add to timeline
    service.timeline.push({
      status,
      title,
      comment: comment || "",
      updatedBy: session.userId as any,
      createdAt: new Date(),
    })

    await service.save()

    return NextResponse.json({ success: true, service })
  } catch (error) {
    console.error("Update service status error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
