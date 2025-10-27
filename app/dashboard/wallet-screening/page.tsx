"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { AlertCircle, Search, Shield, AlertTriangle, CheckCircle2, XCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { validateWalletAddress } from "@/lib/validation"
import { useDemoStore } from "@/lib/demo-store"
import type { WalletScreening } from "@/lib/demo-store"

export default function WalletScreeningPage() {
  const { data, addWalletScreening } = useDemoStore()
  const screenings = data.walletScreenings || []

  const [loading, setLoading] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [blockchain, setBlockchain] = useState("ethereum")
  const [selectedScreening, setSelectedScreening] = useState<WalletScreening | null>(null)
  const [error, setError] = useState("")

  async function screenWallet() {
    const validation = validateWalletAddress(walletAddress)
    if (!validation.valid) {
      setError(validation.error || "Invalid wallet address")
      return
    }

    setScanning(true)
    setError("")

    // Simulate screening delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const riskScore = Math.floor(Math.random() * 100)
    const flags: string[] = []
    let sanctionsMatch = false

    if (riskScore > 70) {
      flags.push("High-risk jurisdiction exposure")
      flags.push("Multiple mixer interactions")
      if (Math.random() > 0.7) {
        sanctionsMatch = true
        flags.push("OFAC sanctions list match")
      }
    } else if (riskScore > 40) {
      flags.push("Moderate exchange exposure")
      flags.push("DeFi protocol interactions")
    }

    const riskLevel = riskScore > 75 ? "critical" : riskScore > 50 ? "high" : riskScore > 25 ? "medium" : "low"

    const exposureData = {
      exchanges: Math.floor(Math.random() * 10),
      mixers: riskScore > 50 ? Math.floor(Math.random() * 5) : 0,
      gambling: Math.floor(Math.random() * 3),
      defi: Math.floor(Math.random() * 15),
      nft: Math.floor(Math.random() * 8),
    }

    const newScreening: WalletScreening = {
      id: Date.now().toString(),
      wallet_address: walletAddress,
      blockchain,
      risk_score: riskScore,
      risk_level: riskLevel,
      flags,
      sanctions_match: sanctionsMatch,
      exposure_data: exposureData,
      created_at: new Date().toISOString(),
    }

    addWalletScreening(newScreening)
    setWalletAddress("")
    setSelectedScreening(newScreening)
    setScanning(false)
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "critical":
        return "destructive"
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "default"
    }
  }

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "critical":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "high":
        return <AlertTriangle className="h-5 w-5 text-orange-500" />
      case "medium":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case "low":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      default:
        return <Shield className="h-5 w-5" />
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-96">Loading...</div>
  }

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Wallet Screening</h1>
        <p className="text-muted-foreground mt-2 text-lg">Screen cryptocurrency wallets for risk and compliance</p>
      </div>

      {/* Scanner Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Search className="h-6 w-6" />
            Screen Wallet Address
          </CardTitle>
          <CardDescription className="text-base">
            Analyze wallet addresses for sanctions, risk exposure, and suspicious activity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-2">
              <Label className="text-base">Wallet Address</Label>
              <Input
                placeholder="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
                value={walletAddress}
                onChange={(e) => {
                  setWalletAddress(e.target.value)
                  setError("")
                }}
                onKeyDown={(e) => e.key === "Enter" && screenWallet()}
                className="text-base font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-base">Blockchain</Label>
              <Select value={blockchain} onValueChange={setBlockchain}>
                <SelectTrigger className="text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ethereum">Ethereum</SelectItem>
                  <SelectItem value="bitcoin">Bitcoin</SelectItem>
                  <SelectItem value="polygon">Polygon</SelectItem>
                  <SelectItem value="bsc">BSC</SelectItem>
                  <SelectItem value="arbitrum">Arbitrum</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={screenWallet} disabled={scanning} className="w-full text-base h-11">
            {scanning ? "Screening..." : "Screen Wallet"}
          </Button>
        </CardContent>
      </Card>

      {/* Recent Screenings */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Recent Screenings</h2>
        <div className="grid gap-4">
          {screenings.map((screening) => (
            <Card
              key={screening.id}
              className="cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => setSelectedScreening(screening)}
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      {getRiskIcon(screening.risk_level)}
                      <code className="text-base font-mono">{screening.wallet_address}</code>
                      <Badge variant="outline" className="text-sm">
                        {screening.blockchain}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-base">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Risk Score:</span>
                        <Badge variant={getRiskColor(screening.risk_level)} className="text-sm">
                          {screening.risk_score}/100
                        </Badge>
                      </div>
                      {screening.sanctions_match && (
                        <Badge variant="destructive" className="gap-1 text-sm">
                          <AlertTriangle className="h-3 w-3" />
                          Sanctions Match
                        </Badge>
                      )}
                      {screening.flags.length > 0 && (
                        <span className="text-muted-foreground text-sm">
                          {screening.flags.length} flag{screening.flags.length !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground">
                      Screened {new Date(screening.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {screenings.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                <p className="text-lg">No wallet screenings yet. Screen your first wallet above.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Screening Details Dialog */}
      <Dialog open={!!selectedScreening} onOpenChange={() => setSelectedScreening(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              {selectedScreening && getRiskIcon(selectedScreening.risk_level)}
              Wallet Screening Details
            </DialogTitle>
            <DialogDescription className="text-base">Comprehensive risk analysis and exposure data</DialogDescription>
          </DialogHeader>

          {selectedScreening && (
            <div className="space-y-6">
              {/* Wallet Info */}
              <div className="space-y-2">
                <Label className="text-base">Wallet Address</Label>
                <code className="block p-3 bg-muted rounded-md text-base break-all">
                  {selectedScreening.wallet_address}
                </code>
                <div className="flex gap-2">
                  <Badge variant="outline">{selectedScreening.blockchain}</Badge>
                  <Badge variant={getRiskColor(selectedScreening.risk_level)}>
                    Risk: {selectedScreening.risk_level.toUpperCase()}
                  </Badge>
                </div>
              </div>

              {/* Risk Score */}
              <div className="space-y-2">
                <Label className="text-base">Risk Score</Label>
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-muted rounded-full h-4 overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        selectedScreening.risk_score > 75
                          ? "bg-red-500"
                          : selectedScreening.risk_score > 50
                            ? "bg-orange-500"
                            : selectedScreening.risk_score > 25
                              ? "bg-yellow-500"
                              : "bg-green-500"
                      }`}
                      style={{ width: `${selectedScreening.risk_score}%` }}
                    />
                  </div>
                  <span className="font-bold text-xl">{selectedScreening.risk_score}/100</span>
                </div>
              </div>

              {/* Sanctions */}
              {selectedScreening.sanctions_match && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-base">
                    This wallet address matches entries on sanctions lists (OFAC, UN, EU)
                  </AlertDescription>
                </Alert>
              )}

              {/* Flags */}
              {selectedScreening.flags.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-base">Risk Flags ({selectedScreening.flags.length})</Label>
                  <div className="space-y-2">
                    {selectedScreening.flags.map((flag, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-3 bg-muted rounded-md">
                        <AlertCircle className="h-5 w-5 text-orange-500" />
                        <span className="text-base">{flag}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Exposure Data */}
              {selectedScreening.exposure_data && (
                <div className="space-y-2">
                  <Label className="text-base">Exposure Analysis</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-muted rounded-md">
                      <div className="text-base text-muted-foreground">Exchanges</div>
                      <div className="text-3xl font-bold">{selectedScreening.exposure_data.exchanges || 0}</div>
                    </div>
                    <div className="p-4 bg-muted rounded-md">
                      <div className="text-base text-muted-foreground">Mixers</div>
                      <div className="text-3xl font-bold">{selectedScreening.exposure_data.mixers || 0}</div>
                    </div>
                    <div className="p-4 bg-muted rounded-md">
                      <div className="text-base text-muted-foreground">DeFi Protocols</div>
                      <div className="text-3xl font-bold">{selectedScreening.exposure_data.defi || 0}</div>
                    </div>
                    <div className="p-4 bg-muted rounded-md">
                      <div className="text-base text-muted-foreground">NFT Platforms</div>
                      <div className="text-3xl font-bold">{selectedScreening.exposure_data.nft || 0}</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="text-sm text-muted-foreground">
                Screened on {new Date(selectedScreening.created_at).toLocaleString()}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
