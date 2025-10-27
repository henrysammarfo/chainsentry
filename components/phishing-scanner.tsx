"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Shield, Search, CheckCircle2, XCircle } from "lucide-react"
import { analyzeURL, type PhishingAnalysis } from "@/lib/phishing-detector"

export function PhishingScanner() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PhishingAnalysis | null>(null)

  const handleScan = async () => {
    if (!url) return

    setLoading(true)
    try {
      const analysis = await analyzeURL(url)
      setResult(analysis)
    } catch (error) {
      console.error("[v0] Phishing scan error:", error)
    } finally {
      setLoading(false)
    }
  }

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

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Shield className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-balance">Phishing URL Scanner</h2>
          <p className="text-sm text-muted-foreground">Analyze URLs for phishing indicators</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <Input
          placeholder="Enter URL to scan (e.g., https://example.com)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleScan()}
          className="flex-1"
        />
        <Button onClick={handleScan} disabled={loading || !url}>
          {loading ? (
            <>
              <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
              Scanning
            </>
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Scan
            </>
          )}
        </Button>
      </div>

      {result && (
        <div className="space-y-6">
          <div className="flex items-start justify-between p-4 rounded-lg border border-border bg-muted/30">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {result.isPhishing ? (
                  <XCircle className="h-5 w-5 text-destructive" />
                ) : (
                  <CheckCircle2 className="h-5 w-5 text-success" />
                )}
                <span className="font-semibold">{result.isPhishing ? "Phishing Detected" : "URL Appears Safe"}</span>
              </div>
              <p className="text-sm text-muted-foreground break-all">{result.url}</p>
            </div>
            <div className="text-right ml-4">
              <div className="text-2xl font-bold">{result.riskScore}</div>
              <div className="text-xs text-muted-foreground">Risk Score</div>
            </div>
          </div>

          {result.indicators.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Security Indicators ({result.indicators.length})
              </h3>
              <div className="space-y-2">
                {result.indicators.map((indicator, idx) => (
                  <div key={idx} className="p-3 rounded-lg border border-border bg-card">
                    <div className="flex items-start justify-between mb-1">
                      <span className="font-medium text-sm">{indicator.category}</span>
                      <Badge className={getSeverityColor(indicator.severity)}>{indicator.severity}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{indicator.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-sm font-semibold mb-3">URL Features</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg border border-border bg-card">
                <div className="text-xs text-muted-foreground mb-1">SSL Certificate</div>
                <div className="font-medium">{result.urlFeatures.hasSSL ? "Valid" : "Missing"}</div>
              </div>
              <div className="p-3 rounded-lg border border-border bg-card">
                <div className="text-xs text-muted-foreground mb-1">Domain Age</div>
                <div className="font-medium">{result.urlFeatures.domainAge}</div>
              </div>
              <div className="p-3 rounded-lg border border-border bg-card">
                <div className="text-xs text-muted-foreground mb-1">URL Length</div>
                <div className="font-medium">{result.urlFeatures.urlLength} chars</div>
              </div>
              <div className="p-3 rounded-lg border border-border bg-card">
                <div className="text-xs text-muted-foreground mb-1">Subdomains</div>
                <div className="font-medium">{result.urlFeatures.subdomainCount}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
