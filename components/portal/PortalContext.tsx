"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from "react"
import { useRouter } from "@/navigation"

export interface PortalUser {
  id: string
  email: string
  username?: string
  role: "customer" | "customer_admin" | "staff" | "super_admin"
  firstName: string
  lastName: string
  phone?: string
  avatarUrl?: string
  emailVerified: boolean
}

export interface PortalCustomer {
  id: string
  companyName: string
  commercialRegisterNumber: string
  taxCardNumber: string
  accountStatus: "active" | "warning" | "inactive"
  statusReason?: string
  contactPhone: string
  contactEmail: string
  industry?: string
  country: string
  city?: string
  address?: string
}

export interface DocumentStats {
  totalDocs: number
  approvedDocs: number
  expiringDocs: number
  expiredDocs: number
  pendingDocs: number
  maxAllowed: number
}

interface PortalContextValue {
  user: PortalUser | null
  customer: PortalCustomer | null
  documentStats: DocumentStats | null
  unreadCount: number
  loading: boolean
  refreshData: () => Promise<void>
  logout: () => Promise<void>
}

const PortalContext = createContext<PortalContextValue | undefined>(undefined)

export function PortalProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<PortalUser | null>(null)
  const [customer, setCustomer] = useState<PortalCustomer | null>(null)
  const [documentStats, setDocumentStats] = useState<DocumentStats | null>(null)
  const [unreadCount, setUnreadCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  const refreshData = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me")
      if (!res.ok) {
        if (res.status === 401) {
          router.push("/login")
        }
        return
      }

      const data = await res.json()
      if (data.authenticated) {
        setUser(data.user)
        setCustomer(data.customer)
        setDocumentStats(data.documentStats)
        setUnreadCount(data.unreadNotificationsCount || 0)
      } else {
        router.push("/login")
      }
    } catch {
      // Offline / error
    } finally {
      setLoading(false)
    }
  }, [router])

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
    } finally {
      setUser(null)
      setCustomer(null)
      router.push("/login")
      router.refresh()
    }
  }

  useEffect(() => {
    refreshData()
  }, [refreshData])

  return (
    <PortalContext.Provider
      value={{
        user,
        customer,
        documentStats,
        unreadCount,
        loading,
        refreshData,
        logout,
      }}
    >
      {children}
    </PortalContext.Provider>
  )
}

export function usePortal() {
  const context = useContext(PortalContext)
  if (!context) {
    throw new Error("usePortal must be used within a PortalProvider")
  }
  return context
}
