"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Activity } from "lucide-react"
import { threatMonitor, type ThreatEvent } from "@/lib/threat-monitor"

export function LiveThreatFeed() {
  const [threats, setThreats] = useState<ThreatEvent[]>([])
  const [filter, setFilter] = useState<"all" | "critical" | "high">("all")
  const [isMonitoring, setIsMonitoring] = useState(true)

  useEffect(() => {
    const unsubscribe = threatMonitor.subscribe((event) => {
      setThreats((prev) => [event, ...prev].slice(0, 50))
    })

    threatMonitor.start()

    return () => {
      unsubscribe()
      threatMonitor.stop()
    }
  }, [])

  const filteredThreats = threats.filter((threat) => {
    if (filter === "all") return true
    return threat.severity === filter
  })

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-destructive text-destructive-foreground"
      case "high":
        return "bg-warning text-warning-foreground"
      case "medium":
        return "bg-accent text-accent-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getTypeIcon = (type: ThreatEvent["type"]) => {
    return <AlertTriangle className="h-4 w-4" />
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
            <Activity className="h-5 w-5 text-destructive" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-balance">Live Threat Feed</h2>
            <p className="text-sm text-muted-foreground">Real-time security events</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${isMonitoring ? "bg-success animate-pulse" : "bg-muted"}`} />
          <span className="text-xs text-muted-foreground">{isMonitoring ? "Live" : "Paused"}</span>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <Button size="sm" variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>
          All
        </Button>
        <Button size="sm" variant={filter === "critical" ? "default" : "outline"} onClick={() => setFilter("critical")}>
          Critical
        </Button>
        <Button size="sm" variant={filter === "high" ? "default" : "outline"} onClick={() => setFilter("high")}>
          High
        </Button>
      </div>

      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {filteredThreats.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No threats detected</p>
            <p className="text-xs mt-1">Monitoring for security events...</p>
          </div>
        ) : (
          filteredThreats.map((threat) => (
            <div
              key={threat.id}
              className="p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getTypeIcon(threat.type)}
                  <span className="font-semibold text-sm">{threat.description}</span>
                </div>
                <Badge className={getSeverityColor(threat.severity)}>{threat.severity}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div>Source: {threat.source}</div>
                <div>Chain: {threat.details.blockchain}</div>
                <div>Time: {threat.timestamp.toLocaleTimeString()}</div>
                <div>Status: {threat.status}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
