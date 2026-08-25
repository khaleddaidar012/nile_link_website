import { verifySession } from "@/lib/auth/session"
import { redirect } from "@/navigation"
import { DashboardClient } from "./components/DashboardClient"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Analytics Dashboard | NileLink",
  description: "Internal analytics dashboard for NileLink Logistics",
}

type Props = {
  params: Promise<{ locale: string }>
}

export default async function DashboardPage({ params }: Props) {
  const { locale } = await params
  const authenticated = await verifySession()

  if (!authenticated) {
    redirect({ href: "/analytics-login", locale })
  }

  return <DashboardClient />
}
