"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Plus, Search, Clock, CheckCircle2, XCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDemoStore, type Incident } from "@/lib/demo-store"

export default function IncidentsPage() {
  const { data, addIncident, updateIncident, deleteIncident } = useDemoStore()
  const [filter, setFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    severity: "medium" as "low" | "medium" | "high" | "critical",
    incident_type: "phishing",
    affected_assets: "",
  })

  const handleCreate = async () => {
    const assets = formData.affected_assets
      .split(",")
      .map((a) => a.trim())
      .filter((a) => a)

    const newIncident: Incident = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      severity: formData.severity,
      incident_type: formData.incident_type,
      affected_assets: assets,
      status: "open",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    addIncident(newIncident)
    setIsCreateOpen(false)
    setFormData({
      title: "",
      description: "",
      severity: "medium",
      incident_type: "phishing",
      affected_assets: "",
    })
  }

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    updateIncident(id, { status: newStatus as any })
    if (selectedIncident?.id === id) {
      setSelectedIncident({ ...selectedIncident, status: newStatus as any, updated_at: new Date().toISOString() })
    }
  }

  const handleDelete = async (id: string) => {
    deleteIncident(id)
    setIsDetailsOpen(false)
  }

  const filteredIncidents = data.incidents.filter((incident) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "open" && incident.status === "open") ||
      (filter === "investigating" && incident.status === "investigating") ||
      (filter === "resolved" && incident.status === "resolved") ||
      (filter === "critical" && incident.severity === "critical") ||
      (filter === "high" && incident.severity === "high")

    const matchesSearch =
      searchQuery === "" ||
      incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.description?.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesFilter && matchesSearch
  })

  const stats = {
    total: data.incidents.length,
    open: data.incidents.filter((i) => i.status === "open").length,
    investigating: data.incidents.filter((i) => i.status === "investigating").length,
    resolved: data.incidents.filter((i) => i.status === "resolved").length,
    critical: data.incidents.filter((i) => i.severity === "critical").length,
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "destructive"
      case "investigating":
        return "secondary"
      case "resolved":
        return "default"
      case "closed":
        return "default"
      default:
        return "default"
    }
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Incident Response</h1>
          <p className="text-muted-foreground mt-2">Manage and track security incidents</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-orange-500 to-purple-600">
              <Plus className="h-4 w-4 mr-2" />
              Create Incident
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Incident</DialogTitle>
              <DialogDescription>Report a new security incident for tracking and resolution</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Incident Title</Label>
                <Input
                  id="title"
                  placeholder="Brief description of the incident"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Detailed description of the incident..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-2 min-h-[100px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="severity">Severity</Label>
                  <Select
                    value={formData.severity}
                    onValueChange={(value: any) => setFormData({ ...formData, severity: value })}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="type">Incident Type</Label>
                  <Select
                    value={formData.incident_type}
                    onValueChange={(value) => setFormData({ ...formData, incident_type: value })}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="phishing">Phishing</SelectItem>
                      <SelectItem value="contract_exploit">Contract Exploit</SelectItem>
                      <SelectItem value="unauthorized_access">Unauthorized Access</SelectItem>
                      <SelectItem value="data_breach">Data Breach</SelectItem>
                      <SelectItem value="malware">Malware</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="assets">Affected Assets (comma-separated)</Label>
                <Input
                  id="assets"
                  placeholder="0x123..., wallet-1, contract-xyz"
                  value={formData.affected_assets}
                  onChange={(e) => setFormData({ ...formData, affected_assets: e.target.value })}
                  className="mt-2"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={!formData.title}>
                Create Incident
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.open}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Investigating</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.investigating}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.resolved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.critical}</div>
          </CardContent>
        </Card>
      </div>

      {/* Incidents List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Incidents</CardTitle>
              <CardDescription>Track and manage security incidents</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search incidents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={filter} onValueChange={setFilter}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="open">Open</TabsTrigger>
              <TabsTrigger value="investigating">Investigating</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
              <TabsTrigger value="critical">Critical</TabsTrigger>
            </TabsList>

            <TabsContent value={filter} className="mt-4">
              {filteredIncidents.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>No incidents found</p>
                  <Button variant="link" size="sm" className="mt-2" onClick={() => setIsCreateOpen(true)}>
                    Create your first incident
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredIncidents.map((incident) => (
                    <div
                      key={incident.id}
                      className="flex items-start gap-4 p-4 border border-border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                      onClick={() => {
                        setSelectedIncident(incident)
                        setIsDetailsOpen(true)
                      }}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={getSeverityColor(incident.severity)}>{incident.severity}</Badge>
                          <Badge variant={getStatusColor(incident.status)}>{incident.status}</Badge>
                          <Badge variant="outline">{incident.incident_type.replace("_", " ")}</Badge>
                        </div>
                        <h4 className="font-medium mb-1">{incident.title}</h4>
                        {incident.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">{incident.description}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>Created {new Date(incident.created_at).toLocaleString()}</span>
                          {incident.affected_assets && incident.affected_assets.length > 0 && (
                            <span>{incident.affected_assets.length} affected assets</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Incident Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Incident Details</DialogTitle>
            <DialogDescription>View and manage incident information</DialogDescription>
          </DialogHeader>
          {selectedIncident && (
            <div className="space-y-4">
              <div>
                <Label>Title</Label>
                <p className="text-sm mt-1 font-medium">{selectedIncident.title}</p>
              </div>
              {selectedIncident.description && (
                <div>
                  <Label>Description</Label>
                  <p className="text-sm mt-1 text-muted-foreground">{selectedIncident.description}</p>
                </div>
              )}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Severity</Label>
                  <p className="mt-1">
                    <Badge variant={getSeverityColor(selectedIncident.severity)}>{selectedIncident.severity}</Badge>
                  </p>
                </div>
                <div>
                  <Label>Status</Label>
                  <p className="mt-1">
                    <Badge variant={getStatusColor(selectedIncident.status)}>{selectedIncident.status}</Badge>
                  </p>
                </div>
                <div>
                  <Label>Type</Label>
                  <p className="mt-1">
                    <Badge variant="outline">{selectedIncident.incident_type.replace("_", " ")}</Badge>
                  </p>
                </div>
              </div>
              {selectedIncident.affected_assets && selectedIncident.affected_assets.length > 0 && (
                <div>
                  <Label>Affected Assets</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedIncident.affected_assets.map((asset, index) => (
                      <Badge key={index} variant="secondary">
                        {asset}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label>Created</Label>
                  <p className="text-muted-foreground mt-1">{new Date(selectedIncident.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <Label>Last Updated</Label>
                  <p className="text-muted-foreground mt-1">{new Date(selectedIncident.updated_at).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-4 border-t">
                <Label>Update Status:</Label>
                <Select
                  value={selectedIncident.status}
                  onValueChange={(value) => handleUpdateStatus(selectedIncident.id, value)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="investigating">Investigating</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="destructive" onClick={() => selectedIncident && handleDelete(selectedIncident.id)}>
              Delete Incident
            </Button>
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
