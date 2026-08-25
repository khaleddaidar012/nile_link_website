import { redirect } from "next/navigation"
import { getServerSession } from "@/lib/auth/token-service"
import { AdminSidebar } from "@/components/admin/AdminSidebar"

type Props = {
  children: React.ReactNode
}

export default async function AdminLayout({ children }: Props) {
  const session = await getServerSession()

  if (!session) {
    redirect("/login?callbackUrl=/admin")
  }

  if (session.role !== "staff" && session.role !== "super_admin") {
    redirect("/portal")
  }

  return (
    <div className="flex min-h-screen bg-slate-950 font-sans text-slate-100">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
