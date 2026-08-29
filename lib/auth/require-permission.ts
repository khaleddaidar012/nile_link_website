import { NextResponse } from "next/server"
import { getSessionFromRequest, AuthSessionPayload } from "@/lib/auth/token-service"
import { IStaffPermissions } from "@/lib/models/User"

export type StaffPermissionKey = keyof IStaffPermissions

/**
 * Asserts that the incoming request has a valid staff or super_admin session.
 * If permissionKey is provided, it verifies that the staff member has that specific permission.
 * super_admin automatically bypasses specific permission checks.
 */
export async function assertStaffPermission(
  request: Request,
  permissionKey?: StaffPermissionKey
): Promise<{ authorized: true; session: AuthSessionPayload } | { authorized: false; response: NextResponse }> {
  const session = await getSessionFromRequest(request)

  if (!session) {
    return {
      authorized: false,
      response: NextResponse.json({ error: "Authentication required" }, { status: 401 }),
    }
  }

  if (session.role !== "staff" && session.role !== "super_admin") {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Access denied. NileLink Staff or Manager role required." },
        { status: 403 }
      ),
    }
  }

  if (session.role === "super_admin") {
    return { authorized: true, session }
  }

  if (permissionKey) {
    const hasPermission = session.staffPermissions?.[permissionKey] ?? false
    if (!hasPermission) {
      return {
        authorized: false,
        response: NextResponse.json(
          {
            error: `Access denied. You lack the '${permissionKey}' operational permission. Contact your system manager.`,
            requiredPermission: permissionKey,
          },
          { status: 403 }
        ),
      }
    }
  }

  return { authorized: true, session }
}
