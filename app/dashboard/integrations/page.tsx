"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExternalLink, XCircle, Copy, Check } from "lucide-react"
import { API_INTEGRATIONS } from "@/lib/api-integrations"

export default function IntegrationsPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const integrations = Object.entries(API_INTEGRATIONS).filter(([key]) => key !== "forcloud")

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-4xl font-bold">API Integrations</h1>
        <p className="text-muted-foreground mt-2 text-base">
          Connect external services to enhance ChainSentry's capabilities
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {integrations.map(([key, integration]) => (
          <Card key={key} className="relative">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    {integration.name}
                    <Badge variant="outline" className="gap-1">
                      <XCircle className="h-3 w-3" />
                      Not Configured
                    </Badge>
                  </CardTitle>
                  <CardDescription className="mt-2 text-base">{integration.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="text-base font-medium">Required Environment Variables:</div>
                <div className="space-y-1">
                  {integration.requiredEnvVars.map((envVar) => (
                    <div key={envVar} className="flex items-center justify-between p-2 bg-muted rounded-md">
                      <code className="text-sm">{envVar}</code>
                      <Button size="sm" variant="ghost" onClick={() => copyToClipboard(envVar, envVar)}>
                        {copiedId === envVar ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => setSelectedIntegration(key)}
                    >
                      View Setup Guide
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-xl">{integration.name} Integration</DialogTitle>
                      <DialogDescription className="text-base">
                        Complete setup instructions and code examples
                      </DialogDescription>
                    </DialogHeader>

                    <Tabs defaultValue="setup" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="setup">Setup Instructions</TabsTrigger>
                        <TabsTrigger value="code">Code Example</TabsTrigger>
                      </TabsList>

                      <TabsContent value="setup" className="space-y-4">
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                            {integration.setupInstructions}
                          </pre>
                        </div>
                      </TabsContent>

                      <TabsContent value="code" className="space-y-4">
                        <div className="relative">
                          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                            <code>{integration.exampleUsage}</code>
                          </pre>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="absolute top-2 right-2"
                            onClick={() => copyToClipboard(integration.exampleUsage, `code-${key}`)}
                          >
                            {copiedId === `code-${key}` ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </DialogContent>
                </Dialog>

                <Button variant="outline" asChild>
                  <a href={integration.docsUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Docs
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
