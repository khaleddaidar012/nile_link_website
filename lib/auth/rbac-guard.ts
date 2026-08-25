import { NextResponse } from "next/server"
import { getServerSession, getSessionFromRequest, AuthSessionPayload } from "./token-service"
import { UserRole } from "@/lib/models/User"

export async function requireAuth(
  request?: Request,
  allowedRoles?: UserRole[]
): Promise<{ session: AuthSessionPayload } | NextResponse> {
  const session = request
    ? await getSessionFromRequest(request)
    : await getServerSession()

  if (!session) {
    return NextResponse.json(
      { error: "Authentication required", code: "UNAUTHORIZED" },
      { status: 401 }
    )
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(session.role)) {
    return NextResponse.json(
      { error: "Forbidden: insufficient permissions", code: "FORBIDDEN" },
      { status: 403 }
    )
  }

  return { session }
}

export function isStaffOrAdmin(role: UserRole): boolean {
  return role === "staff" || role === "super_admin"
}

export function isCustomer(role: UserRole): boolean {
  return role === "customer" || role === "customer_admin"
}
