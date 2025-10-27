"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { FileText, Download, Loader2, Trash2, Plus } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDemoStore } from "@/lib/demo-store"

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([])
  const [generating, setGenerating] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [newReport, setNewReport] = useState({
    title: "",
    type: "analytics" as const,
    format: "pdf" as const,
  })

  const { data } = useDemoStore()

  function generateReport() {
    setGenerating(true)
    setTimeout(() => {
      const report = {
        id: Date.now().toString(),
        title: newReport.title,
        type: newReport.type,
        format: newReport.format,
        status: "completed" as const,
        file_url: `#download-${Date.now()}.${newReport.format}`,
        created_at: new Date().toISOString(),
        dataSnapshot: {
          threats: data?.threats?.length || 0,
          audits: data?.contractAudits?.length || 0,
          incidents: data?.incidents?.length || 0,
          walletScreenings: data?.walletScreenings?.length || 0,
        },
      }
      setReports([report, ...reports])
      setShowDialog(false)
      setNewReport({ title: "", type: "analytics", format: "pdf" })
      setGenerating(false)
    }, 2000)
  }

  function deleteReport(id: string) {
    setReports(reports.filter((r) => r.id !== id))
  }

  function downloadReport(report: any) {
    const content = generateReportContent(report)
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${report.title.replace(/\s+/g, "-")}.${report.format}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  function generateReportContent(report: any) {
    const { dataSnapshot } = report
    return `
ChainSentry Security Report
${report.title}
Generated: ${new Date(report.created_at).toLocaleString()}

=== SUMMARY ===
Total Threats Detected: ${dataSnapshot.threats}
Smart Contract Audits: ${dataSnapshot.audits}
Security Incidents: ${dataSnapshot.incidents}
Wallet Screenings: ${dataSnapshot.walletScreenings}

=== DETAILS ===
${data?.threats?.map((t: any) => `- Threat: ${t.url} (Risk: ${t.risk_score})`).join("\n") || "No threats"}

${data?.contractAudits?.map((a: any) => `- Audit: ${a.contract_address} (Risk: ${a.risk_level})`).join("\n") || "No audits"}

${data?.incidents?.map((i: any) => `- Incident: ${i.title} (Status: ${i.status})`).join("\n") || "No incidents"}

=== END OF REPORT ===
    `.trim()
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Reports</h1>
          <p className="text-muted-foreground mt-2 text-base">Generate and download security reports</p>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button size="lg">
              <Plus className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-xl">Generate New Report</DialogTitle>
              <DialogDescription className="text-base">Create a custom security report</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base">Report Title</Label>
                <Input
                  placeholder="Monthly Security Summary"
                  value={newReport.title}
                  onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
                  className="text-base"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-base">Report Type</Label>
                <Select value={newReport.type} onValueChange={(v: any) => setNewReport({ ...newReport, type: v })}>
                  <SelectTrigger className="text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="analytics">Analytics Report</SelectItem>
                    <SelectItem value="threat">Threat Report</SelectItem>
                    <SelectItem value="audit">Audit Report</SelectItem>
                    <SelectItem value="incident">Incident Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-base">Format</Label>
                <Select value={newReport.format} onValueChange={(v: any) => setNewReport({ ...newReport, format: v })}>
                  <SelectTrigger className="text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="txt">TXT</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={generateReport} disabled={generating || !newReport.title} className="w-full text-base">
                {generating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Report"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {reports.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="h-16 w-16 text-muted-foreground/20 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Reports Yet</h3>
            <p className="text-muted-foreground text-center max-w-md text-base">
              Generate your first security report to download and share insights from your ChainSentry dashboard.
            </p>
            <Button className="mt-4" onClick={() => setShowDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {reports.map((report) => (
            <Card key={report.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <FileText className="h-6 w-6 text-primary" />
                      <h3 className="font-semibold text-lg">{report.title}</h3>
                      <Badge variant="outline">{report.type}</Badge>
                      <Badge variant="secondary" className="gap-1">
                        {report.format.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Generated {new Date(report.created_at).toLocaleDateString()}</span>
                      <Badge variant="secondary" className="gap-1">
                        Ready
                      </Badge>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => downloadReport(report)}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => deleteReport(report.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
