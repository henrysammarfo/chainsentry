"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Search, Filter, RefreshCw, ExternalLink, Shield, AlertCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { validateUrl } from "@/lib/validation"
import { useDemoStore, type Threat } from "@/lib/demo-store"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ThreatsPage() {
  const { data, addThreat } = useDemoStore()
  const threats = data.threats || []

  const [url, setUrl] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [filter, setFilter] = useState("all")
  const [selectedThreat, setSelectedThreat] = useState<Threat | null>(null)
  const [error, setError] = useState("")

  const handleScan = async () => {
    const validation = validateUrl(url)
    if (!validation.valid) {
      setError(validation.error || "Invalid URL")
      return
    }

    setIsScanning(true)
    setError("")

    setTimeout(() => {
      const urlObj = new URL(url)
      const suspiciousKeywords = ["metamask", "wallet", "airdrop", "claim", "free", "urgent", "verify"]
      const hasSuspiciousKeyword = suspiciousKeywords.some((keyword) => url.toLowerCase().includes(keyword))

      const isHttps = urlObj.protocol === "https:"
      const hasShortDomain = urlObj.hostname.length < 8
      const hasSuspiciousTLD = [".xyz", ".tk", ".ml", ".ga"].some((tld) => urlObj.hostname.endsWith(tld))

      let riskScore = 0
      let threatType = "suspicious"

      if (hasSuspiciousKeyword) riskScore += 40
      if (!isHttps) riskScore += 20
      if (hasShortDomain) riskScore += 15
      if (hasSuspiciousTLD) riskScore += 25

      if (riskScore > 70) threatType = "phishing"
      else if (riskScore > 50) threatType = "scam"
      else if (riskScore > 30) threatType = "suspicious"
      else threatType = "low-risk"

      const newThreat: Threat = {
        id: Date.now().toString(),
        url: url,
        threat_type: threatType,
        risk_score: Math.min(riskScore, 100),
        status: "active",
        detected_at: new Date().toISOString(),
        metadata: {
          https: isHttps,
          domain_length: urlObj.hostname.length,
          suspicious_keywords: hasSuspiciousKeyword,
          suspicious_tld: hasSuspiciousTLD,
        },
      }

      addThreat(newThreat)
      setUrl("")
      setIsScanning(false)
    }, 1500)
  }

  const filteredThreats = threats.filter((threat) => {
    if (filter === "all") return true
    if (filter === "high-risk") return threat.risk_score >= 70
    if (filter === "active") return threat.status === "active"
    if (filter === "resolved") return threat.status === "resolved"
    return true
  })

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Threat Detection</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Advanced phishing and malware detection powered by machine learning
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">URL Security Scanner</CardTitle>
              <CardDescription className="text-base">
                Analyze URLs for phishing, malware, and scam indicators using AI
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="url" className="text-base">
                Enter URL to scan
              </Label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value)
                  setError("")
                }}
                onKeyDown={(e) => e.key === "Enter" && handleScan()}
                className="h-12 text-base"
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleScan}
                disabled={isScanning || !url}
                className="h-12 px-8 bg-gradient-to-r from-orange-500 to-purple-600 text-base"
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-5 w-5" />
                    Scan URL
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Detected Threats</CardTitle>
              <CardDescription className="text-base mt-1">All scanned URLs and their risk assessments</CardDescription>
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Threats</SelectItem>
                <SelectItem value="high-risk">High Risk</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredThreats.length === 0 ? (
            <div className="text-center py-16">
              <AlertTriangle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg font-medium">No threats detected</p>
              <p className="text-sm text-muted-foreground mt-2">
                Start scanning URLs to identify potential security risks
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredThreats.map((threat) => (
                <Dialog key={threat.id}>
                  <DialogTrigger asChild>
                    <div
                      className="group relative overflow-hidden rounded-lg border p-5 hover:border-primary/50 hover:bg-accent/50 cursor-pointer transition-all"
                      onClick={() => setSelectedThreat(threat)}
                    >
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2 flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge
                                variant={
                                  threat.risk_score >= 70
                                    ? "destructive"
                                    : threat.risk_score >= 50
                                      ? "secondary"
                                      : "default"
                                }
                                className="font-medium"
                              >
                                {threat.threat_type}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {threat.status}
                              </Badge>
                            </div>
                            <p className="text-sm font-mono truncate">{threat.url}</p>
                          </div>
                          <div className="text-right ml-4">
                            <div className="text-3xl font-bold">{threat.risk_score}</div>
                            <div className="text-xs text-muted-foreground">risk score</div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                threat.risk_score >= 70
                                  ? "bg-destructive"
                                  : threat.risk_score >= 50
                                    ? "bg-orange-500"
                                    : "bg-green-500"
                              }`}
                              style={{ width: `${threat.risk_score}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Detected {new Date(threat.detected_at).toLocaleString()}</span>
                            <ExternalLink className="h-3 w-3" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Threat Details</DialogTitle>
                      <DialogDescription>Complete analysis of the scanned URL</DialogDescription>
                    </DialogHeader>
                    {selectedThreat && (
                      <div className="space-y-4">
                        <div>
                          <Label className="text-base">URL</Label>
                          <p className="text-sm font-mono bg-muted p-3 rounded mt-2 break-all">{selectedThreat.url}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-base">Threat Type</Label>
                            <p className="text-sm mt-2">
                              <Badge
                                variant={
                                  selectedThreat.risk_score >= 70
                                    ? "destructive"
                                    : selectedThreat.risk_score >= 50
                                      ? "secondary"
                                      : "default"
                                }
                              >
                                {selectedThreat.threat_type}
                              </Badge>
                            </p>
                          </div>
                          <div>
                            <Label className="text-base">Risk Score</Label>
                            <p className="text-2xl font-bold mt-2">{selectedThreat.risk_score}/100</p>
                          </div>
                          <div>
                            <Label className="text-base">Status</Label>
                            <p className="text-sm mt-2">
                              <Badge variant="outline">{selectedThreat.status}</Badge>
                            </p>
                          </div>
                          <div>
                            <Label className="text-base">Detected</Label>
                            <p className="text-sm mt-2">{new Date(selectedThreat.detected_at).toLocaleString()}</p>
                          </div>
                        </div>
                        {selectedThreat.metadata && (
                          <div>
                            <Label className="text-base">Analysis Details</Label>
                            <div className="bg-muted p-4 rounded mt-2 space-y-3">
                              <div className="flex justify-between text-base">
                                <span>HTTPS Enabled</span>
                                <Badge variant={selectedThreat.metadata.https ? "default" : "destructive"}>
                                  {selectedThreat.metadata.https ? "Yes" : "No"}
                                </Badge>
                              </div>
                              <div className="flex justify-between text-base">
                                <span>Suspicious Keywords</span>
                                <Badge
                                  variant={selectedThreat.metadata.suspicious_keywords ? "destructive" : "default"}
                                >
                                  {selectedThreat.metadata.suspicious_keywords ? "Detected" : "None"}
                                </Badge>
                              </div>
                              <div className="flex justify-between text-base">
                                <span>Suspicious TLD</span>
                                <Badge variant={selectedThreat.metadata.suspicious_tld ? "destructive" : "default"}>
                                  {selectedThreat.metadata.suspicious_tld ? "Yes" : "No"}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
