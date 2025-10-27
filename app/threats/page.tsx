"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { analyzeURL } from "@/lib/phishing-detector"
import { ScanSearch, AlertTriangle, Shield, ExternalLink, Filter, Download, RefreshCw } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface ThreatLog {
  id: string
  timestamp: Date
  url: string
  type: string
  severity: "critical" | "high" | "medium" | "low"
  status: "blocked" | "flagged" | "investigating"
  score: number
}

export default function ThreatsPage() {
  const [url, setUrl] = useState("")
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [selectedThreat, setSelectedThreat] = useState<ThreatLog | null>(null)
  const [filterSeverity, setFilterSeverity] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const [threatLogs, setThreatLogs] = useState<ThreatLog[]>([
    {
      id: "T-2024-001",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      url: "https://metamask-secure-login.xyz",
      type: "Phishing",
      severity: "critical",
      status: "blocked",
      score: 95,
    },
    {
      id: "T-2024-002",
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      url: "https://uniswap-airdrop.com",
      type: "Phishing",
      severity: "high",
      status: "blocked",
      score: 87,
    },
    {
      id: "T-2024-003",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      url: "https://binance-verify.net",
      type: "Phishing",
      severity: "critical",
      status: "blocked",
      score: 92,
    },
    {
      id: "T-2024-004",
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      url: "https://opensea-nft-claim.io",
      type: "Phishing",
      severity: "high",
      status: "flagged",
      score: 84,
    },
    {
      id: "T-2024-005",
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      url: "https://coinbase-support.org",
      type: "Phishing",
      severity: "medium",
      status: "investigating",
      score: 72,
    },
  ])

  const handleScan = async () => {
    if (!url) return
    setScanning(true)
    setResult(null)

    await new Promise((resolve) => setTimeout(resolve, 2000))
    const analysis = await analyzeURL(url)

    const adaptedResult = {
      isPhishing: analysis.isPhishing,
      riskScore: analysis.riskScore,
      features: {
        domainAge: analysis.urlFeatures.domainAge === "5+ years" ? 1825 : 30,
        urlLength: analysis.urlFeatures.urlLength,
        suspiciousKeywords: analysis.urlFeatures.suspiciousKeywords.length,
        hasHttps: analysis.urlFeatures.hasSSL,
      },
      indicators: analysis.indicators.map((ind) => ind.description),
    }
    setResult(adaptedResult)

    if (analysis.isPhishing) {
      const newThreat: ThreatLog = {
        id: `T-2024-${String(threatLogs.length + 1).padStart(3, "0")}`,
        timestamp: new Date(),
        url,
        type: "Phishing",
        severity: analysis.riskScore > 80 ? "critical" : analysis.riskScore > 60 ? "high" : "medium",
        status: "blocked",
        score: analysis.riskScore,
      }
      setThreatLogs([newThreat, ...threatLogs])
    }

    setScanning(false)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive"
      case "high":
        return "destructive"
      case "medium":
        return "warning"
      case "low":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "blocked":
        return "destructive"
      case "flagged":
        return "warning"
      case "investigating":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const filteredThreats = threatLogs.filter((threat) => {
    if (filterSeverity !== "all" && threat.severity !== filterSeverity) return false
    if (filterStatus !== "all" && threat.status !== filterStatus) return false
    return true
  })

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Threat Detection</h1>
            <p className="text-xs text-muted-foreground">Advanced phishing and malware detection</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <Tabs defaultValue="scanner" className="space-y-6">
          <TabsList>
            <TabsTrigger value="scanner">URL Scanner</TabsTrigger>
            <TabsTrigger value="logs">Threat Logs</TabsTrigger>
            <TabsTrigger value="rules">Detection Rules</TabsTrigger>
          </TabsList>

          <TabsContent value="scanner" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <ScanSearch className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Phishing URL Scanner</h3>
                  <p className="text-sm text-muted-foreground">
                    Analyze URLs for phishing indicators and malicious patterns
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mb-6">
                <Input
                  placeholder="Enter URL to scan (e.g., https://example.com)"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleScan()}
                  className="flex-1"
                />
                <Button onClick={handleScan} disabled={scanning || !url}>
                  {scanning ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <ScanSearch className="h-4 w-4 mr-2" />
                      Scan URL
                    </>
                  )}
                </Button>
              </div>

              {scanning && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Analyzing URL structure...</span>
                    <span className="text-primary">33%</span>
                  </div>
                  <Progress value={33} />
                </div>
              )}

              {result && (
                <div className="space-y-4 border-t border-border pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {result.isPhishing ? (
                        <AlertTriangle className="h-6 w-6 text-destructive" />
                      ) : (
                        <Shield className="h-6 w-6 text-success" />
                      )}
                      <div>
                        <h4 className="font-semibold">
                          {result.isPhishing ? "Phishing Detected" : "URL Appears Safe"}
                        </h4>
                        <p className="text-sm text-muted-foreground">Risk Score: {result.riskScore}/100</p>
                      </div>
                    </div>
                    <Badge variant={result.isPhishing ? "destructive" : "success"}>
                      {result.isPhishing ? "MALICIOUS" : "SAFE"}
                    </Badge>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Card className="p-4">
                      <h5 className="text-sm font-medium mb-3">URL Features</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Domain Age</span>
                          <span>{result.features.domainAge} days</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">URL Length</span>
                          <span>{result.features.urlLength} chars</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Suspicious Keywords</span>
                          <span>{result.features.suspiciousKeywords}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">HTTPS</span>
                          <Badge variant={result.features.hasHttps ? "success" : "destructive"}>
                            {result.features.hasHttps ? "Yes" : "No"}
                          </Badge>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h5 className="text-sm font-medium mb-3">Detection Indicators</h5>
                      <div className="space-y-2">
                        {result.indicators.map((indicator: string, index: number) => (
                          <div key={index} className="flex items-start gap-2 text-sm">
                            <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{indicator}</span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold">Threat Detection Logs</h3>
                  <p className="text-sm text-muted-foreground">{filteredThreats.length} threats detected</p>
                </div>
                <div className="flex items-center gap-3">
                  <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                    <SelectTrigger className="w-[140px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Severity</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[140px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="blocked">Blocked</SelectItem>
                      <SelectItem value="flagged">Flagged</SelectItem>
                      <SelectItem value="investigating">Investigating</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredThreats.map((threat) => (
                    <TableRow key={threat.id}>
                      <TableCell className="font-mono text-sm">{threat.id}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {threat.timestamp.toLocaleTimeString()}
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-sm">{threat.url}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{threat.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getSeverityColor(threat.severity)}>{threat.severity}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(threat.status)}>{threat.status}</Badge>
                      </TableCell>
                      <TableCell className="font-semibold">{threat.score}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedThreat(threat)}>
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Threat Details: {threat.id}</DialogTitle>
                              <DialogDescription>Detailed analysis and response actions</DialogDescription>
                            </DialogHeader>
                            {selectedThreat && (
                              <div className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                  <div>
                                    <label className="text-sm font-medium">URL</label>
                                    <p className="text-sm text-muted-foreground break-all">{selectedThreat.url}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Detection Time</label>
                                    <p className="text-sm text-muted-foreground">
                                      {selectedThreat.timestamp.toLocaleString()}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Threat Type</label>
                                    <p className="text-sm text-muted-foreground">{selectedThreat.type}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Risk Score</label>
                                    <p className="text-sm text-muted-foreground">{selectedThreat.score}/100</p>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button variant="destructive" size="sm">
                                    Block Domain
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    Add to Watchlist
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    Generate Report
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="rules" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Detection Rules Configuration</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Configure custom detection rules and thresholds for threat identification
              </p>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <h4 className="font-medium">Suspicious Domain Detection</h4>
                    <p className="text-sm text-muted-foreground">Flag domains with suspicious keywords</p>
                  </div>
                  <Badge variant="success">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <h4 className="font-medium">URL Length Analysis</h4>
                    <p className="text-sm text-muted-foreground">Detect abnormally long URLs</p>
                  </div>
                  <Badge variant="success">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <h4 className="font-medium">HTTPS Verification</h4>
                    <p className="text-sm text-muted-foreground">Require HTTPS for financial sites</p>
                  </div>
                  <Badge variant="success">Active</Badge>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
