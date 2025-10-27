"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { cn } from "@/lib/utils"
import { DemoStoreProvider } from "@/lib/demo-store"
import { useAuth } from "@/lib/auth-context"
import { ThemeProvider } from "@/components/theme-provider"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <DemoStoreProvider>
        <div className="flex min-h-screen w-full bg-background">
          <AppSidebar
            user={user}
            isCollapsed={isSidebarCollapsed}
            onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />
          <div
            className={cn("flex flex-1 flex-col transition-all duration-300", isSidebarCollapsed ? "ml-16" : "ml-64")}
          >
            <DashboardHeader user={user} />
            <main className="flex-1">{children}</main>
          </div>
        </div>
      </DemoStoreProvider>
    </ThemeProvider>
  )
}
