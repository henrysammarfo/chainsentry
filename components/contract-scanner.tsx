"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { FileCode, AlertTriangle, TrendingUp, Zap } from "lucide-react"
import { analyzeContract, type VulnerabilityReport } from "@/lib/contract-analyzer"

export function ContractScanner() {
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState<VulnerabilityReport | null>(null)

  const handleAnalyze = async () => {
    if (!code.trim()) return

    setLoading(true)
    try {
      const analysis = await analyzeContract(code)
      setReport(analysis)
    } catch (error) {
      console.error("[v0] Contract analysis error:", error)
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

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success"
    if (score >= 60) return "text-warning"
    return "text-destructive"
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
          <FileCode className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-balance">Smart Contract Analyzer</h2>
          <p className="text-sm text-muted-foreground">Detect vulnerabilities in Solidity code</p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <Textarea
          placeholder="Paste your Solidity contract code here..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="min-h-[200px] font-mono text-sm"
        />
        <Button onClick={handleAnalyze} disabled={loading || !code.trim()} className="w-full">
          {loading ? (
            <>
              <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
              Analyzing Contract
            </>
          ) : (
            <>
              <FileCode className="h-4 w-4 mr-2" />
              Analyze Contract
            </>
          )}
        </Button>
      </div>

      {report && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border border-border bg-muted/30 text-center">
              <div className={`text-3xl font-bold ${getScoreColor(report.securityScore)}`}>{report.securityScore}</div>
              <div className="text-xs text-muted-foreground mt-1">Security Score</div>
            </div>
            <div className="p-4 rounded-lg border border-border bg-muted/30 text-center">
              <div className="text-3xl font-bold text-destructive">{report.vulnerabilities.length}</div>
              <div className="text-xs text-muted-foreground mt-1">Vulnerabilities</div>
            </div>
            <div className="p-4 rounded-lg border border-border bg-muted/30 text-center">
              <div className="text-3xl font-bold text-primary">{report.gasOptimization.length}</div>
              <div className="text-xs text-muted-foreground mt-1">Optimizations</div>
            </div>
          </div>

          {report.vulnerabilities.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                Vulnerabilities Found
              </h3>
              <div className="space-y-3">
                {report.vulnerabilities.map((vuln) => (
                  <div key={vuln.id} className="p-4 rounded-lg border border-border bg-card">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-muted-foreground">{vuln.id}</span>
                        <span className="font-semibold">{vuln.title}</span>
                      </div>
                      <Badge className={getSeverityColor(vuln.severity)}>{vuln.severity}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{vuln.description}</p>
                    <div className="p-2 rounded bg-muted/50 text-sm">
                      <span className="text-xs font-semibold text-success">Recommendation: </span>
                      {vuln.recommendation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Zap className="h-4 w-4 text-warning" />
              Gas Optimization Opportunities
            </h3>
            <div className="space-y-2">
              {report.gasOptimization.map((opt, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg border border-border bg-card flex items-center justify-between"
                >
                  <span className="text-sm">{opt.issue}</span>
                  <span className="text-sm font-semibold text-success">{opt.savings}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Code Quality Metrics
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {report.codeQuality.map((metric, idx) => (
                <div key={idx} className="p-3 rounded-lg border border-border bg-card">
                  <div className="text-xs text-muted-foreground mb-1">{metric.metric}</div>
                  <div className="font-semibold">{metric.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
