"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Activity, Bell, RefreshCw, Zap, AlertCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDemoStore } from "@/lib/demo-store"

export default function MonitoringPage() {
  const { data } = useDemoStore()
  const [filter, setFilter] = useState<string>("all")

  const alerts = [
    ...data.threats.map((threat) => ({
      id: threat.id,
      alert_type: "threat",
      severity: threat.risk_score >= 90 ? "critical" : threat.risk_score >= 70 ? "high" : "medium",
      message: `Threat detected: ${threat.threat_type}`,
      source: threat.url,
      is_read: false,
      created_at: threat.detected_at,
    })),
    ...data.walletScreenings.map((screening) => ({
      id: screening.id,
      alert_type: "wallet",
      severity: screening.risk_level,
      message: `Wallet screening: ${screening.risk_level} risk`,
      source: screening.wallet_address,
      is_read: false,
      created_at: screening.created_at,
    })),
    ...data.contractAudits.map((audit) => ({
      id: audit.id,
      alert_type: "contract",
      severity: audit.risk_level,
      message: `Contract audit: ${audit.issues_found} issues found`,
      source: audit.contract_address,
      is_read: false,
      created_at: audit.created_at,
    })),
    ...data.incidents.map((incident) => ({
      id: incident.id,
      alert_type: "incident",
      severity: incident.severity,
      message: `Incident: ${incident.title}`,
      source: incident.incident_type,
      is_read: false,
      created_at: incident.created_at,
    })),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === "all") return true
    if (filter === "unread") return !alert.is_read
    return alert.severity === filter
  })

  const unreadCount = alerts.filter((a) => !a.is_read).length

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Live Monitoring</h1>
        <p className="text-muted-foreground mt-2">Real-time blockchain activity monitoring and alerts</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alerts.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
            <Activity className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alerts.filter((a) => a.severity === "critical").length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <Zap className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold text-green-500">Active</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Alert Feed</CardTitle>
              <CardDescription>Real-time security alerts and notifications</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={filter} onValueChange={setFilter}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
              <TabsTrigger value="critical">Critical</TabsTrigger>
              <TabsTrigger value="high">High</TabsTrigger>
            </TabsList>

            <TabsContent value={filter} className="mt-4">
              {filteredAlerts.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>No alerts yet</p>
                  <p className="text-sm mt-2">
                    Alerts will appear here when you scan threats, audit contracts, or screen wallets
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`flex items-start gap-4 p-4 border rounded-lg transition-colors ${
                        alert.is_read ? "bg-background" : "bg-accent/20 border-accent"
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            variant={
                              alert.severity === "critical" || alert.severity === "high"
                                ? "destructive"
                                : alert.severity === "medium"
                                  ? "secondary"
                                  : "default"
                            }
                          >
                            {alert.severity}
                          </Badge>
                          <Badge variant="outline">{alert.alert_type}</Badge>
                          {!alert.is_read && (
                            <Badge variant="default" className="bg-orange-500">
                              New
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm font-medium">{alert.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Source: {alert.source} • {new Date(alert.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
