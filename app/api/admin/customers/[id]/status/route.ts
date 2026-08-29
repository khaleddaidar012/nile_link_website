import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { connectDB } from "@/lib/mongodb"
import { Customer, Notification, User } from "@/lib/models"
import { getSessionFromRequest } from "@/lib/auth/token-service"

const statusUpdateSchema = z.object({
  accountStatus: z.enum(["active", "warning", "inactive"]),
  statusReason: z.string().min(2, "Status reason is required").trim(),
})

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session || (session.role !== "staff" && session.role !== "super_admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // RBAC check: super_admin or staff with canManageCustomers
    if (session.role === "staff" && !session.staffPermissions?.canManageCustomers) {
      return NextResponse.json(
        {
          error: "Access denied. You lack the 'canManageCustomers' permission to change customer account status.",
          code: "PERMISSION_DENIED",
        },
        { status: 403 }
      )
    }

    const { id } = await params
    const body = await req.json()
    const parsed = statusUpdateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid status parameters", details: parsed.error.format() },
        { status: 400 }
      )
    }

    const { accountStatus, statusReason } = parsed.data

    await connectDB()

    const customer = await Customer.findById(id)
    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    const oldStatus = customer.accountStatus
    customer.accountStatus = accountStatus
    customer.statusReason = statusReason
    await customer.save()

    // Send in-app notification to all users belonging to this customer
    const customerUsers = await User.find({ customerId: customer._id })
    for (const u of customerUsers) {
      await Notification.create({
        recipientCustomerId: customer._id,
        recipientUserId: u._id,
        title:
          accountStatus === "active"
            ? "Account Status Activated"
            : accountStatus === "warning"
            ? "Account Status: Action Required"
            : "Account Service Restricted",
        message: statusReason,
        channel: "in_app",
        type: "account_status_change",
        severity: accountStatus === "active" ? "normal" : accountStatus === "warning" ? "warning" : "critical",
        targetAudience: "customer",
        actionUrl: "/portal",
      })
    }

    return NextResponse.json({
      success: true,
      message: `Customer status updated from ${oldStatus} to ${accountStatus}.`,
      customer: {
        id: customer._id.toString(),
        companyName: customer.companyName,
        accountStatus: customer.accountStatus,
        statusReason: customer.statusReason,
      },
    })
  } catch (error: unknown) {
    console.error("PATCH /api/admin/customers/[id]/status error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
