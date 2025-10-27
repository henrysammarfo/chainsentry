"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Shield, Activity, FileSearch, AlertTriangle, BarChart3, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  {
    title: "Overview",
    href: "/",
    icon: Activity,
  },
  {
    title: "Threat Scanner",
    href: "/scanner",
    icon: FileSearch,
  },
  {
    title: "Contract Audit",
    href: "/audit",
    icon: Shield,
  },
  {
    title: "Incidents",
    href: "/incidents",
    icon: AlertTriangle,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-1 p-4">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
            {item.title}
          </Link>
        )
      })}
    </nav>
  )
}
