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
      <div className="relative flex min-h-screen bg-slate-50 font-sans text-secondary-900 dark:bg-[#0b0f19] dark:text-white">
        {/* Ambient Dark Mode Radial Lighting & Depth Effects */}
        <div className="pointer-events-none absolute inset-0 hidden overflow-hidden dark:block">
          <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-primary-500/10 blur-[130px]" />
          <div className="absolute top-1/3 -right-40 h-[500px] w-[500px] rounded-full bg-indigo-500/8 blur-[140px]" />
          <div className="absolute -bottom-40 left-1/3 h-[500px] w-[500px] rounded-full bg-cyan-500/8 blur-[140px]" />
        </div>

        <PortalSidebar />
        <div className="relative z-10 flex min-w-0 flex-1 flex-col pb-20 md:pb-0">
          <main className="flex-1">{children}</main>
        </div>
        <MobileBottomNav />
      </div>
    </PortalProvider>
  )
}
