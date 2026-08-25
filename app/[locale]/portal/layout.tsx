import { redirect } from "next/navigation"
import { getServerSession } from "@/lib/auth/token-service"
import { PortalProvider } from "@/components/portal/PortalContext"
import { PortalSidebar } from "@/components/portal/PortalSidebar"
import { MobileBottomNav } from "@/components/portal/MobileBottomNav"

type Props = {
  children: React.ReactNode
}

export default async function PortalLayout({ children }: Props) {
  const session = await getServerSession()

  if (!session) {
    redirect("/login?callbackUrl=/portal")
  }

  return (
    <PortalProvider>
      <div className="flex min-h-screen bg-secondary-50/60 font-sans text-secondary-900 dark:bg-secondary-950 dark:text-white">
        <PortalSidebar />
        <div className="flex min-w-0 flex-1 flex-col pb-20 md:pb-0">
          <main className="flex-1">{children}</main>
        </div>
        <MobileBottomNav />
      </div>
    </PortalProvider>
  )
}
