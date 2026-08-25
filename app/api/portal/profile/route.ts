import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { connectDB } from "@/lib/mongodb"
import { User, Customer } from "@/lib/models"
import { getSessionFromRequest } from "@/lib/auth/token-service"

const updateProfileSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  phone: z.string().min(8).optional(),
  companyName: z.string().min(2).optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  industry: z.string().optional(),
})

export async function PUT(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const parsed = updateProfileSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation error", details: parsed.error.format() },
        { status: 400 }
      )
    }

    await connectDB()

    if (parsed.data.firstName || parsed.data.lastName || parsed.data.phone) {
      await User.findByIdAndUpdate(session.userId, {
        ...(parsed.data.firstName && { firstName: parsed.data.firstName }),
        ...(parsed.data.lastName && { lastName: parsed.data.lastName }),
        ...(parsed.data.phone && { phone: parsed.data.phone }),
      })
    }

    if (session.customerId && (parsed.data.companyName || parsed.data.address || parsed.data.city || parsed.data.industry)) {
      await Customer.findByIdAndUpdate(session.customerId, {
        ...(parsed.data.companyName && { companyName: parsed.data.companyName }),
        ...(parsed.data.address !== undefined && { address: parsed.data.address }),
        ...(parsed.data.city && { city: parsed.data.city }),
        ...(parsed.data.country && { country: parsed.data.country }),
        ...(parsed.data.industry && { industry: parsed.data.industry }),
      })
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
    })
  } catch (error: unknown) {
    console.error("Update profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
