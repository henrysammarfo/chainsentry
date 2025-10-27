"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Shield,
  LayoutDashboard,
  ScanSearch,
  FileCode,
  Activity,
  AlertCircle,
  BarChart3,
  Settings,
  Zap,
  Wallet,
  FileText,
  ChevronLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Threat Detection", href: "/dashboard/threats", icon: ScanSearch },
  { name: "Smart Contract Audit", href: "/dashboard/audit", icon: FileCode },
  { name: "Wallet Screening", href: "/dashboard/wallet-screening", icon: Wallet },
  { name: "Live Monitoring", href: "/dashboard/monitoring", icon: Activity },
  { name: "Incident Response", href: "/dashboard/incidents", icon: AlertCircle },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Reports", href: "/dashboard/reports", icon: FileText },
  { name: "Integrations", href: "/dashboard/integrations", icon: Zap },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function AppSidebar({
  user,
  isCollapsed,
  onToggle,
}: {
  user: { id: string; email: string }
  isCollapsed: boolean
  onToggle: () => void
}) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r bg-card transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold">ChainSentry</h1>
              <p className="text-xs text-muted-foreground">Security Platform</p>
            </div>
          </div>
        )}
        {isCollapsed && (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary mx-auto">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
        )}
      </div>

      <div className="flex justify-end p-2 border-b">
        <Button variant="ghost" size="icon" onClick={onToggle} className="h-8 w-8">
          <ChevronLeft className={cn("h-4 w-4 transition-transform", isCollapsed && "rotate-180")} />
        </Button>
      </div>

      <nav className="space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                isCollapsed && "justify-center",
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
