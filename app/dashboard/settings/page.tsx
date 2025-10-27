"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Key, User, Shield, Bell, Trash2, Plus, Eye, EyeOff, Check } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"

interface ApiIntegration {
  id: string
  provider: string
  api_key: string
  is_active: boolean
  last_used_at: string | null
  created_at: string
}

export default function SettingsPage() {
  const { user } = useAuth()
  const [integrations, setIntegrations] = useState<ApiIntegration[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [showApiKey, setShowApiKey] = useState<{ [key: string]: boolean }>({})
  const [isAddIntegrationOpen, setIsAddIntegrationOpen] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const [profileForm, setProfileForm] = useState({
    full_name: user?.name || "",
    company: "",
  })

  const [integrationForm, setIntegrationForm] = useState({
    provider: "chainalysis",
    api_key: "",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    criticalOnly: false,
    weeklyReports: true,
    threatDetection: true,
    auditCompletion: true,
  })

  const handleSaveProfile = () => {
    setIsSaving(true)
    setTimeout(() => {
      setSaveSuccess(true)
      setIsSaving(false)
      setTimeout(() => setSaveSuccess(false), 3000)
    }, 1000)
  }

  const handleAddIntegration = () => {
    const newIntegration: ApiIntegration = {
      id: Date.now().toString(),
      provider: integrationForm.provider,
      api_key: integrationForm.api_key,
      is_active: true,
      last_used_at: null,
      created_at: new Date().toISOString(),
    }
    setIntegrations([newIntegration, ...integrations])
    setIsAddIntegrationOpen(false)
    setIntegrationForm({ provider: "chainalysis", api_key: "" })
  }

  const handleToggleIntegration = (id: string, isActive: boolean) => {
    setIntegrations(integrations.map((int) => (int.id === id ? { ...int, is_active: !isActive } : int)))
  }

  const handleDeleteIntegration = (id: string) => {
    setIntegrations(integrations.filter((int) => int.id !== id))
  }

  const toggleApiKeyVisibility = (id: string) => {
    setShowApiKey((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const maskApiKey = (key: string) => {
    if (key.length <= 8) return "••••••••"
    return key.slice(0, 4) + "••••••••" + key.slice(-4)
  }

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2 text-base">Manage your account and integrations</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="integrations">
            <Key className="h-4 w-4 mr-2" />
            API Integrations
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Profile Information</CardTitle>
              <CardDescription className="text-base">Update your personal information and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-base">
                  Email
                </Label>
                <Input id="email" type="email" value={user?.email || ""} disabled className="mt-2 text-base" />
                <p className="text-sm text-muted-foreground mt-1">Email cannot be changed</p>
              </div>
              <div>
                <Label htmlFor="fullName" className="text-base">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  value={profileForm.full_name}
                  onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                  className="mt-2 text-base"
                />
              </div>
              <div>
                <Label htmlFor="company" className="text-base">
                  Company
                </Label>
                <Input
                  id="company"
                  value={profileForm.company}
                  onChange={(e) => setProfileForm({ ...profileForm, company: e.target.value })}
                  className="mt-2 text-base"
                  placeholder="Optional"
                />
              </div>
              <div className="flex items-center gap-2 pt-4">
                <Button onClick={handleSaveProfile} disabled={isSaving} size="lg">
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
                {saveSuccess && (
                  <div className="flex items-center gap-2 text-green-500 text-base">
                    <Check className="h-4 w-4" />
                    Saved successfully
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">API Integrations</CardTitle>
                  <CardDescription className="text-base">Manage external API keys and integrations</CardDescription>
                </div>
                <Dialog open={isAddIntegrationOpen} onOpenChange={setIsAddIntegrationOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Integration
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-lg">Add API Integration</DialogTitle>
                      <DialogDescription className="text-base">Connect an external API service</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="provider" className="text-base">
                          Provider
                        </Label>
                        <Select
                          value={integrationForm.provider}
                          onValueChange={(value) => setIntegrationForm({ ...integrationForm, provider: value })}
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="chainalysis">Chainalysis</SelectItem>
                            <SelectItem value="trm_labs">TRM Labs</SelectItem>
                            <SelectItem value="etherscan">Etherscan</SelectItem>
                            <SelectItem value="alchemy">Alchemy</SelectItem>
                            <SelectItem value="infura">Infura</SelectItem>
                            <SelectItem value="openai">OpenAI</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="apiKey" className="text-base">
                          API Key
                        </Label>
                        <Input
                          id="apiKey"
                          type="password"
                          placeholder="Enter your API key"
                          value={integrationForm.api_key}
                          onChange={(e) => setIntegrationForm({ ...integrationForm, api_key: e.target.value })}
                          className="mt-2 text-base"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddIntegrationOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddIntegration} disabled={!integrationForm.api_key}>
                        Add Integration
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {integrations.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Key className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p className="text-base">No API integrations configured</p>
                  <Button variant="link" size="sm" className="mt-2" onClick={() => setIsAddIntegrationOpen(true)}>
                    Add your first integration
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {integrations.map((integration) => (
                    <div
                      key={integration.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium capitalize text-base">{integration.provider.replace("_", " ")}</h4>
                          <Badge variant={integration.is_active ? "default" : "secondary"}>
                            {integration.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                            {showApiKey[integration.id] ? integration.api_key : maskApiKey(integration.api_key)}
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => toggleApiKeyVisibility(integration.id)}
                          >
                            {showApiKey[integration.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                          </Button>
                        </div>
                        {integration.last_used_at && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Last used: {new Date(integration.last_used_at).toLocaleString()}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={integration.is_active}
                          onCheckedChange={() => handleToggleIntegration(integration.id, integration.is_active)}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteIntegration(integration.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Notification Preferences</CardTitle>
              <CardDescription className="text-base">Configure how you receive alerts and updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Email Alerts</Label>
                  <p className="text-sm text-muted-foreground">Receive security alerts via email</p>
                </div>
                <Switch
                  checked={notificationSettings.emailAlerts}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, emailAlerts: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Critical Alerts Only</Label>
                  <p className="text-sm text-muted-foreground">Only notify for critical severity issues</p>
                </div>
                <Switch
                  checked={notificationSettings.criticalOnly}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, criticalOnly: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Weekly Reports</Label>
                  <p className="text-sm text-muted-foreground">Receive weekly security summary reports</p>
                </div>
                <Switch
                  checked={notificationSettings.weeklyReports}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, weeklyReports: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Threat Detection</Label>
                  <p className="text-sm text-muted-foreground">Notify when new threats are detected</p>
                </div>
                <Switch
                  checked={notificationSettings.threatDetection}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, threatDetection: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Audit Completion</Label>
                  <p className="text-sm text-muted-foreground">Notify when contract audits are completed</p>
                </div>
                <Switch
                  checked={notificationSettings.auditCompletion}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, auditCompletion: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Security Settings</CardTitle>
              <CardDescription className="text-base">Manage your account security and authentication</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-base">Password</Label>
                <div className="flex gap-2 mt-2">
                  <Input type="password" value="••••••••" disabled className="text-base" />
                  <Button variant="outline" className="text-base bg-transparent">
                    Change Password
                  </Button>
                </div>
              </div>
              <div>
                <Label className="text-base">Two-Factor Authentication</Label>
                <div className="flex items-center justify-between mt-2 p-4 border border-border rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-base">2FA Status</p>
                    <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                  </div>
                  <Badge variant="secondary">Not Enabled</Badge>
                </div>
              </div>
              <div>
                <Label className="text-base">Active Sessions</Label>
                <div className="mt-2 p-4 border border-border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-base">Current Session</p>
                      <p className="text-xs text-muted-foreground">Last activity: Just now</p>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
