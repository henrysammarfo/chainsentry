"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, AlertTriangle, FileCode, Activity, Clock, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { useDemoStore } from "@/lib/demo-store"

export default function DashboardPage() {
  const { data, getStats } = useDemoStore()

  const { threats = [], walletScreenings = [], contractAudits = [], incidents = [] } = data || {}
  const stats = getStats()

  const recentThreats = threats?.slice(0, 3) || []
  const recentAudits = contractAudits?.slice(0, 3) || []

  return (
    <div className="space-y-8 p-8">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Security Overview</h1>
        <p className="text-muted-foreground">Real-time blockchain security monitoring across all networks</p>
      </div>

      {/* Key Metrics - Clean 4-column grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Threats</CardTitle>
              <div className="rounded-full bg-destructive/10 p-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.activeThreats}</div>
            <p className="text-xs text-muted-foreground mt-2">Updates in real-time</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Contracts Audited</CardTitle>
              <div className="rounded-full bg-primary/10 p-2">
                <FileCode className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.contractsAudited}</div>
            <p className="text-xs text-muted-foreground mt-2">Total audits performed</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Open Incidents</CardTitle>
              <div className="rounded-full bg-accent/10 p-2">
                <Shield className="h-4 w-4 text-accent" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{incidents?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-2">Requires attention</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Wallets Screened</CardTitle>
              <div className="rounded-full bg-primary/10 p-2">
                <Activity className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{walletScreenings?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-2">Total screenings</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content - 2 column layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Threats */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Threats</CardTitle>
                <CardDescription className="mt-1">Latest security threats detected</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/threats">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentThreats.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No threats detected yet. Scan a URL to get started.
              </p>
            ) : (
              <div className="space-y-6">
                {recentThreats.map((threat) => (
                  <div
                    key={threat.id}
                    className="flex items-start gap-4 pb-6 border-b border-border/50 last:border-0 last:pb-0"
                  >
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{threat.url}</p>
                        <Badge variant="outline" className="text-xs border-border/50">
                          {threat.threat_type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(threat.detected_at).toLocaleTimeString()}
                        </span>
                        <span>Risk Score: {threat.risk_score}</span>
                      </div>
                      <Progress value={threat.risk_score} className="h-1.5" />
                    </div>
                    <Badge
                      variant={
                        threat.risk_score >= 90 ? "destructive" : threat.risk_score >= 70 ? "secondary" : "outline"
                      }
                      className={
                        threat.risk_score >= 90 ? "bg-destructive/10 text-destructive border-destructive/20" : ""
                      }
                    >
                      {threat.risk_score >= 90 ? "critical" : threat.risk_score >= 70 ? "high" : "medium"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Smart Contract Audits */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Smart Contract Audits</CardTitle>
                <CardDescription className="mt-1">Recent security assessments</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/audit">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentAudits.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No audits performed yet. Audit a contract to get started.
              </p>
            ) : (
              <div className="space-y-6">
                {recentAudits.map((audit) => (
                  <div
                    key={audit.id}
                    className="flex items-start gap-4 pb-6 border-b border-border/50 last:border-0 last:pb-0"
                  >
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <p className="font-mono text-sm font-medium">{audit.contract_address}</p>
                        <Badge variant="outline" className="text-xs border-border/50">
                          {audit.blockchain}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{audit.issues_found} issues found</span>
                        <span>•</span>
                        <span className="capitalize">{audit.status.replace("-", " ")}</span>
                      </div>
                    </div>
                    <Badge
                      variant={
                        audit.risk_level === "high" || audit.risk_level === "critical"
                          ? "destructive"
                          : audit.risk_level === "medium"
                            ? "secondary"
                            : "outline"
                      }
                      className={
                        audit.risk_level === "high" || audit.risk_level === "critical"
                          ? "bg-destructive/10 text-destructive border-destructive/20"
                          : ""
                      }
                    >
                      {audit.risk_level}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* System Health - Full width */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>System Health</CardTitle>
          <CardDescription>All monitoring systems operational</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { name: "API Gateway", status: "operational", uptime: "99.9%" },
              { name: "Scan Engine", status: "operational", uptime: "99.8%" },
              { name: "ML Models", status: "operational", uptime: "100%" },
              { name: "Database", status: "operational", uptime: "99.9%" },
            ].map((system, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 border border-border/50 rounded-lg bg-background/50"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium">{system.name}</p>
                  <p className="text-xs text-muted-foreground">{system.uptime} uptime</p>
                </div>
                <div className="rounded-full bg-primary/10 p-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common security tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button
              variant="outline"
              className="justify-start bg-background/50 border-border/50 hover:bg-accent/5"
              asChild
            >
              <Link href="/dashboard/threats">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Scan URL
              </Link>
            </Button>
            <Button
              variant="outline"
              className="justify-start bg-background/50 border-border/50 hover:bg-accent/5"
              asChild
            >
              <Link href="/dashboard/audit">
                <FileCode className="mr-2 h-4 w-4" />
                Audit Contract
              </Link>
            </Button>
            <Button
              variant="outline"
              className="justify-start bg-background/50 border-border/50 hover:bg-accent/5"
              asChild
            >
              <Link href="/dashboard/wallet-screening">
                <Shield className="mr-2 h-4 w-4" />
                Screen Wallet
              </Link>
            </Button>
            <Button
              variant="outline"
              className="justify-start bg-background/50 border-border/50 hover:bg-accent/5"
              asChild
            >
              <Link href="/dashboard/reports">
                <Activity className="mr-2 h-4 w-4" />
                Generate Report
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
