"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Activity, Shield, AlertTriangle, FileCode } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useDemoStore } from "@/lib/demo-store"

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d")
  const { data } = useDemoStore()

  const threats = data?.threats || []
  const audits = data?.contractAudits || []
  const incidents = data?.incidents || []
  const walletScreenings = data?.walletScreenings || []

  // Calculate metrics
  const totalThreats = threats.length
  const highRiskThreats = threats.filter((t) => t.risk_score >= 70).length
  const totalAudits = audits.length
  const failedAudits = audits.filter((a) => a.risk_level === "critical" || a.risk_level === "high").length
  const totalIncidents = incidents.length
  const openIncidents = incidents.filter((i) => i.status === "open").length
  const totalScreenings = walletScreenings.length
  const highRiskWallets = walletScreenings.filter((w) => w.risk_score >= 70).length

  // Threat distribution by type
  const threatsByType = threats.reduce((acc: any, threat) => {
    acc[threat.threat_type] = (acc[threat.threat_type] || 0) + 1
    return acc
  }, {})

  const threatTypeData = Object.entries(threatsByType).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }))

  // Threats over time
  const threatsOverTime = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    const dateStr = date.toISOString().split("T")[0]
    const count = threats.filter((t) => t.created_at.startsWith(dateStr)).length
    return {
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      threats: count,
    }
  })

  // Audit scores distribution
  const auditScoreRanges = {
    "90-100": audits.filter((a) => a.audit_score >= 90).length,
    "80-89": audits.filter((a) => a.audit_score >= 80 && a.audit_score < 90).length,
    "70-79": audits.filter((a) => a.audit_score >= 70 && a.audit_score < 80).length,
    "Below 70": audits.filter((a) => a.audit_score < 70).length,
  }

  const auditScoreData = Object.entries(auditScoreRanges).map(([range, count]) => ({
    range,
    count,
  }))

  // Incident severity distribution
  const incidentsBySeverity = incidents.reduce((acc: any, incident) => {
    acc[incident.severity] = (acc[incident.severity] || 0) + 1
    return acc
  }, {})

  const incidentSeverityData = Object.entries(incidentsBySeverity).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }))

  const COLORS = ["#f97316", "#a855f7", "#ef4444", "#3b82f6", "#10b981"]

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Analytics & Reports</h1>
          <p className="text-muted-foreground mt-2 text-base">Comprehensive security metrics and insights</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Total Threats</CardTitle>
            <AlertTriangle className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalThreats}</div>
            <p className="text-sm text-muted-foreground mt-1">
              <span className="text-red-500 font-medium">{highRiskThreats} high risk</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Smart Contract Audits</CardTitle>
            <FileCode className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalAudits}</div>
            <p className="text-sm text-muted-foreground mt-1">
              <span className="text-red-500 font-medium">{failedAudits} failed</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Security Incidents</CardTitle>
            <Shield className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalIncidents}</div>
            <p className="text-sm text-muted-foreground mt-1">
              <span className="text-red-500 font-medium">{openIncidents} open</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Wallet Screenings</CardTitle>
            <Activity className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalScreenings}</div>
            <p className="text-sm text-muted-foreground mt-1">
              <span className="text-red-500 font-medium">{highRiskWallets} high risk</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {totalThreats === 0 && totalAudits === 0 && totalIncidents === 0 && totalScreenings === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <TrendingUp className="h-16 w-16 text-muted-foreground/20 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Data Yet</h3>
            <p className="text-muted-foreground text-center max-w-md text-base">
              Start using ChainSentry's features to see analytics and insights. Scan threats, audit contracts, screen
              wallets, or create incidents to populate your dashboard.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="threats">Threats</TabsTrigger>
            <TabsTrigger value="audits">Audits</TabsTrigger>
            <TabsTrigger value="incidents">Incidents</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Security Overview</CardTitle>
                <CardDescription className="text-base">
                  Comprehensive security metrics across all systems
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-medium">Threat Detection</span>
                      <TrendingUp className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="text-4xl font-bold">{totalThreats}</div>
                    <p className="text-sm text-muted-foreground">{highRiskThreats} high-risk threats blocked</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-medium">Contract Security</span>
                      <Shield className="h-5 w-5 text-purple-500" />
                    </div>
                    <div className="text-4xl font-bold">
                      {audits.length > 0
                        ? Math.round(
                            audits.reduce((sum, a) => sum + (100 - (a.issues_found || 0) * 10), 0) / audits.length,
                          )
                        : 0}
                      /100
                    </div>
                    <p className="text-sm text-muted-foreground">Average audit score</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-medium">Incident Response</span>
                      <Activity className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="text-4xl font-bold">
                      {incidents.length > 0
                        ? Math.round((incidents.filter((i) => i.status === "resolved").length / incidents.length) * 100)
                        : 0}
                      %
                    </div>
                    <p className="text-sm text-muted-foreground">Resolution rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="threats" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Threats Over Time</CardTitle>
                  <CardDescription>Daily threat detection trend</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      threats: {
                        label: "Threats",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={threatsOverTime}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="date" className="text-xs" />
                        <YAxis className="text-xs" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="threats" stroke="hsl(var(--chart-1))" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Threat Distribution</CardTitle>
                  <CardDescription>Threats by type</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      value: {
                        label: "Count",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={threatTypeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {threatTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent High-Risk Threats</CardTitle>
                <CardDescription>Threats with risk score above 70</CardDescription>
              </CardHeader>
              <CardContent>
                {threats
                  .filter((t) => t.risk_score >= 70)
                  .slice(0, 5)
                  .map((threat) => (
                    <div key={threat.id} className="flex items-center justify-between py-3 border-b last:border-0">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{threat.url}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(threat.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive">{threat.threat_type}</Badge>
                        <span className="text-sm font-bold">{threat.risk_score}</span>
                      </div>
                    </div>
                  ))}
                {threats.filter((t) => t.risk_score >= 70).length === 0 && (
                  <p className="text-center py-8 text-muted-foreground text-sm">No high-risk threats detected</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audits" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Audit Score Distribution</CardTitle>
                  <CardDescription>Contract security scores</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      count: {
                        label: "Audits",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={auditScoreData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="range" className="text-xs" />
                        <YAxis className="text-xs" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="count" fill="hsl(var(--chart-2))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Audit Statistics</CardTitle>
                  <CardDescription>Key audit metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Audits</span>
                    <span className="text-2xl font-bold">{totalAudits}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Average Score</span>
                    <span className="text-2xl font-bold">
                      {audits.length > 0
                        ? Math.round(
                            audits.reduce((sum, a) => sum + (100 - (a.issues_found || 0) * 10), 0) / audits.length,
                          )
                        : 0}
                      /100
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Failed Audits</span>
                    <span className="text-2xl font-bold text-red-500">{failedAudits}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Pass Rate</span>
                    <span className="text-2xl font-bold text-green-500">
                      {audits.length > 0 ? Math.round(((audits.length - failedAudits) / audits.length) * 100) : 0}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="incidents" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Incident Severity</CardTitle>
                  <CardDescription>Distribution by severity level</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      value: {
                        label: "Incidents",
                        color: "hsl(var(--chart-3))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={incidentSeverityData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {incidentSeverityData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Incident Metrics</CardTitle>
                  <CardDescription>Response and resolution stats</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Incidents</span>
                    <span className="text-2xl font-bold">{totalIncidents}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Open</span>
                    <span className="text-2xl font-bold text-red-500">{openIncidents}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Resolved</span>
                    <span className="text-2xl font-bold text-green-500">
                      {incidents.filter((i) => i.status === "resolved").length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Resolution Rate</span>
                    <span className="text-2xl font-bold">
                      {incidents.length > 0
                        ? Math.round((incidents.filter((i) => i.status === "resolved").length / incidents.length) * 100)
                        : 0}
                      %
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
