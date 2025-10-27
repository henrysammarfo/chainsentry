"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertTriangle, Shield, AlertCircle, CheckCircle } from "lucide-react"

interface ThreatItem {
  id: string
  type: "critical" | "high" | "medium" | "low"
  title: string
  address: string
  time: string
  status: "active" | "resolved" | "investigating"
}

const threats: ThreatItem[] = [
  {
    id: "1",
    type: "critical",
    title: "Phishing Attack Detected",
    address: "0x742d...3f8a",
    time: "2 min ago",
    status: "active",
  },
  {
    id: "2",
    type: "high",
    title: "Reentrancy Vulnerability",
    address: "0x8b3c...9d2e",
    time: "15 min ago",
    status: "investigating",
  },
  {
    id: "3",
    type: "medium",
    title: "Suspicious Transaction Pattern",
    address: "0x4f7a...1c5b",
    time: "1 hour ago",
    status: "investigating",
  },
  {
    id: "4",
    type: "high",
    title: "Unauthorized Access Attempt",
    address: "0x9e2d...7a4f",
    time: "2 hours ago",
    status: "resolved",
  },
  {
    id: "5",
    type: "low",
    title: "Unusual Gas Usage",
    address: "0x1a8c...6b9d",
    time: "3 hours ago",
    status: "resolved",
  },
]

const typeConfig = {
  critical: {
    color: "bg-destructive text-destructive-foreground",
    icon: AlertTriangle,
  },
  high: {
    color: "bg-warning text-warning-foreground",
    icon: AlertCircle,
  },
  medium: {
    color: "bg-secondary text-secondary-foreground",
    icon: Shield,
  },
  low: {
    color: "bg-muted text-muted-foreground",
    icon: CheckCircle,
  },
}

const statusConfig = {
  active: { label: "Active", color: "bg-destructive" },
  investigating: { label: "Investigating", color: "bg-warning" },
  resolved: { label: "Resolved", color: "bg-success" },
}

export function ThreatFeed() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-balance">Live Threat Feed</h3>
        <Badge variant="outline" className="text-xs">
          Real-time
        </Badge>
      </div>

      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-4">
          {threats.map((threat) => {
            const TypeIcon = typeConfig[threat.type].icon
            const statusInfo = statusConfig[threat.status]

            return (
              <div
                key={threat.id}
                className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <div className={`rounded-lg p-2 ${typeConfig[threat.type].color}`}>
                  <TypeIcon className="h-4 w-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-sm text-balance">{threat.title}</p>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{threat.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground font-mono mt-1">{threat.address}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className={`h-2 w-2 rounded-full ${statusInfo.color}`} />
                    <span className="text-xs text-muted-foreground">{statusInfo.label}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </ScrollArea>
    </Card>
  )
}
