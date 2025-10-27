"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { FileCode, AlertTriangle, CheckCircle2, XCircle, Info, RefreshCw, AlertCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CodeEditor } from "@/components/code-editor"
import { validateContractAddress } from "@/lib/validation"
import { useDemoStore } from "@/lib/demo-store"
import type { ContractAudit } from "@/lib/demo-store"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AuditPage() {
  const { data, addContractAudit } = useDemoStore()
  const audits = data.contractAudits || []

  const [code, setCode] = useState("")
  const [contractAddress, setContractAddress] = useState("")
  const [blockchain, setBlockchain] = useState("ethereum")
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState("")

  const analyzeContract = (code: string) => {
    const vulnerabilities = []
    const lines = code.split("\n")

    // Check for reentrancy
    if (code.includes(".call{value:") || code.includes(".call.value(")) {
      vulnerabilities.push({
        title: "Potential Reentrancy Vulnerability",
        description: "External call detected that could be vulnerable to reentrancy attacks",
        severity: "critical",
        lineNumber: lines.findIndex((l) => l.includes(".call")) + 1,
        recommendation: "Use the Checks-Effects-Interactions pattern or ReentrancyGuard",
      })
    }

    // Check for unchecked external calls
    if (code.match(/\.call\(/g) && !code.includes("require(success")) {
      vulnerabilities.push({
        title: "Unchecked External Call",
        description: "External call return value is not checked",
        severity: "high",
        lineNumber: lines.findIndex((l) => l.includes(".call(")) + 1,
        recommendation: "Always check the return value of external calls",
      })
    }

    // Check for tx.origin
    if (code.includes("tx.origin")) {
      vulnerabilities.push({
        title: "Use of tx.origin",
        description: "Using tx.origin for authorization is vulnerable to phishing attacks",
        severity: "high",
        lineNumber: lines.findIndex((l) => l.includes("tx.origin")) + 1,
        recommendation: "Use msg.sender instead of tx.origin",
      })
    }

    // Check for delegatecall
    if (code.includes("delegatecall")) {
      vulnerabilities.push({
        title: "Delegatecall Usage",
        description: "Delegatecall can be dangerous if not used carefully",
        severity: "medium",
        lineNumber: lines.findIndex((l) => l.includes("delegatecall")) + 1,
        recommendation: "Ensure delegatecall is only used with trusted contracts",
      })
    }

    // Check for missing access control
    const publicFunctions = code.match(/function\s+\w+\s*$$[^)]*$$\s+public/g) || []
    if (publicFunctions.length > 0 && !code.includes("onlyOwner") && !code.includes("AccessControl")) {
      vulnerabilities.push({
        title: "Missing Access Control",
        description: "Public functions detected without access control modifiers",
        severity: "medium",
        lineNumber: 0,
        recommendation: "Add appropriate access control modifiers to sensitive functions",
      })
    }

    const securityScore = Math.max(0, 100 - vulnerabilities.length * 15)

    return {
      securityScore,
      vulnerabilities,
      recommendations: [
        "Implement comprehensive test coverage for all functions",
        "Add NatSpec documentation for public functions",
        "Consider using OpenZeppelin's audited contracts",
        "Implement event logging for critical state changes",
        "Use SafeMath or Solidity 0.8+ for arithmetic operations",
      ],
    }
  }

  const handleAnalyze = async () => {
    const validation = validateContractAddress(contractAddress)
    if (!validation.valid) {
      setError(validation.error || "Invalid contract address")
      return
    }

    if (!code || code.trim() === "") {
      setError("Please enter contract code to analyze")
      return
    }

    setAnalyzing(true)
    setResult(null)
    setProgress(0)
    setError("")

    const steps = [
      { name: "Parsing contract...", duration: 500 },
      { name: "Analyzing vulnerabilities...", duration: 1000 },
      { name: "Checking best practices...", duration: 800 },
      { name: "Generating report...", duration: 700 },
    ]

    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, steps[i].duration))
      setProgress(((i + 1) / steps.length) * 100)
    }

    const analysis = analyzeContract(code)

    const riskLevel =
      analysis.securityScore >= 80
        ? "low"
        : analysis.securityScore >= 60
          ? "medium"
          : analysis.securityScore >= 40
            ? "high"
            : "critical"

    const newAudit: ContractAudit = {
      id: Date.now().toString(),
      contract_address: contractAddress,
      blockchain: blockchain,
      risk_level: riskLevel,
      issues_found: analysis.vulnerabilities.length,
      status: "completed",
      vulnerabilities: analysis.vulnerabilities,
      created_at: new Date().toISOString(),
    }

    addContractAudit(newAudit)
    setResult(analysis)
    setAnalyzing(false)
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <XCircle className="h-5 w-5 text-destructive" />
      case "high":
        return <AlertTriangle className="h-5 w-5 text-destructive" />
      case "medium":
        return <AlertTriangle className="h-5 w-5 text-warning" />
      case "low":
        return <Info className="h-5 w-5 text-muted-foreground" />
      default:
        return <Info className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive"
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "default"
      default:
        return "default"
    }
  }

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Smart Contract Audit</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Comprehensive vulnerability analysis and security assessment
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <FileCode className="h-6 w-6" />
                Contract Analysis
              </CardTitle>
              <CardDescription className="text-base">
                Paste your Solidity smart contract code for security analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="address" className="text-base">
                    Contract Address
                  </Label>
                  <Input
                    id="address"
                    placeholder="0x..."
                    value={contractAddress}
                    onChange={(e) => {
                      setContractAddress(e.target.value)
                      setError("")
                    }}
                    className="mt-2 font-mono text-base"
                  />
                </div>
                <div>
                  <Label htmlFor="blockchain" className="text-base">
                    Blockchain
                  </Label>
                  <Select value={blockchain} onValueChange={setBlockchain}>
                    <SelectTrigger className="mt-2 text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ethereum">Ethereum</SelectItem>
                      <SelectItem value="bsc">BSC</SelectItem>
                      <SelectItem value="polygon">Polygon</SelectItem>
                      <SelectItem value="arbitrum">Arbitrum</SelectItem>
                      <SelectItem value="optimism">Optimism</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="code" className="text-base">
                  Contract Code
                </Label>
                <div className="mt-2">
                  <CodeEditor value={code} onChange={setCode} language="sol" height="500px" />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleAnalyze}
                  disabled={analyzing || !code || !contractAddress}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-purple-600 text-base h-11"
                >
                  {analyzing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <FileCode className="h-4 w-4 mr-2" />
                      Analyze Contract
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setCode("")
                    setContractAddress("")
                    setResult(null)
                    setError("")
                  }}
                  className="text-base"
                >
                  Clear
                </Button>
              </div>

              {analyzing && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-base">
                    <span className="text-muted-foreground">Analysis in progress...</span>
                    <span className="text-primary font-medium">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              )}
            </CardContent>
          </Card>

          {result && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Audit Results</CardTitle>
                    <CardDescription className="text-base">
                      {result.vulnerabilities.length} issues found
                    </CardDescription>
                  </div>
                  <Badge
                    variant={
                      result.securityScore >= 80 ? "default" : result.securityScore >= 60 ? "secondary" : "destructive"
                    }
                    className="text-xl px-4 py-1"
                  >
                    {result.securityScore}/100
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="vulnerabilities">
                  <TabsList className="mb-4">
                    <TabsTrigger value="vulnerabilities">Vulnerabilities ({result.vulnerabilities.length})</TabsTrigger>
                    <TabsTrigger value="recommendations">Recommendations ({result.recommendations.length})</TabsTrigger>
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                  </TabsList>

                  <TabsContent value="vulnerabilities" className="space-y-3">
                    {result.vulnerabilities.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <CheckCircle2 className="h-12 w-12 text-green-500 mb-3" />
                        <h4 className="font-semibold mb-1 text-lg">No Vulnerabilities Found</h4>
                        <p className="text-base text-muted-foreground">This contract passed all security checks</p>
                      </div>
                    ) : (
                      <div className="w-full">
                        {result.vulnerabilities.map((vuln: any, index: number) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 text-left w-full mb-3 p-3 border rounded-lg"
                          >
                            {getSeverityIcon(vuln.severity)}
                            <div className="flex-1">
                              <div className="font-medium text-base">{vuln.title}</div>
                              <div className="text-sm text-muted-foreground">
                                {vuln.lineNumber > 0 && `Line ${vuln.lineNumber}`}
                              </div>
                            </div>
                            <Badge variant={getSeverityColor(vuln.severity)}>{vuln.severity}</Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="recommendations" className="space-y-3">
                    {result.recommendations.map((rec: string, index: number) => (
                      <div key={index} className="flex items-start gap-3 p-4 border border-border rounded-lg">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <p className="text-base">{rec}</p>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="summary">
                    <div className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Vulnerability Breakdown</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            {["critical", "high", "medium", "low"].map((severity) => {
                              const count = result.vulnerabilities.filter((v: any) => v.severity === severity).length
                              return (
                                <div key={severity} className="flex items-center justify-between text-base">
                                  <span className="capitalize text-muted-foreground">{severity}</span>
                                  <Badge variant={getSeverityColor(severity)}>{count}</Badge>
                                </div>
                              )
                            })}
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Contract Metrics</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2 text-base">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Lines of Code</span>
                              <span>{code.split("\n").length}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Functions</span>
                              <span>{(code.match(/function\s+\w+/g) || []).length}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Security Score</span>
                              <span className="font-semibold">{result.securityScore}/100</span>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Audit Checklist</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                "Reentrancy vulnerabilities",
                "Integer overflow/underflow",
                "Access control issues",
                "Unchecked external calls",
                "Gas optimization",
                "Code quality & best practices",
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-base">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-muted-foreground">{item}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Recent Audits</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {audits.length === 0 ? (
                  <p className="text-base text-muted-foreground text-center py-4">No audits yet</p>
                ) : (
                  audits.slice(0, 5).map((audit) => (
                    <div
                      key={audit.id}
                      className="flex items-center justify-between p-3 border border-border rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-base font-mono truncate">{audit.contract_address}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(audit.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <Badge
                        variant={
                          audit.issues_found === 0 ? "default" : audit.issues_found < 5 ? "secondary" : "destructive"
                        }
                      >
                        {audit.issues_found} issues
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
