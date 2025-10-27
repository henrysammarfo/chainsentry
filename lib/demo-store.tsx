"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Types
export interface Threat {
  id: string
  url: string
  threat_type: string
  risk_score: number
  status: string
  detected_at: string
  metadata: any
}

export interface WalletScreening {
  id: string
  wallet_address: string
  blockchain: string
  risk_score: number
  risk_level: "low" | "medium" | "high" | "critical"
  flags: string[]
  sanctions_match: boolean
  exposure_data: any
  created_at: string
}

export interface ContractAudit {
  id: string
  contract_address: string
  blockchain: string
  risk_level: "low" | "medium" | "high" | "critical"
  issues_found: number
  status: "completed" | "in-progress" | "failed"
  created_at: string
  vulnerabilities: any[]
}

export interface Incident {
  id: string
  title: string
  description: string
  severity: "low" | "medium" | "high" | "critical"
  status: "open" | "investigating" | "resolved" | "closed"
  incident_type: string
  affected_assets: string[]
  created_at: string
  updated_at: string
}

interface DemoData {
  threats: Threat[]
  walletScreenings: WalletScreening[]
  contractAudits: ContractAudit[]
  incidents: Incident[]
}

interface DemoStoreContext {
  data: DemoData
  addThreat: (threat: Threat) => void
  updateThreat: (id: string, updates: Partial<Threat>) => void
  addWalletScreening: (screening: WalletScreening) => void
  addContractAudit: (audit: ContractAudit) => void
  updateContractAudit: (id: string, updates: Partial<ContractAudit>) => void
  addIncident: (incident: Incident) => void
  updateIncident: (id: string, updates: Partial<Incident>) => void
  deleteIncident: (id: string) => void
  getStats: () => {
    activeThreats: number
    contractsAudited: number
    openIncidents: number
    alerts24h: number
    highRiskThreats: number
    criticalIncidents: number
  }
}

const DemoStoreContext = createContext<DemoStoreContext | undefined>(undefined)

const INITIAL_DATA: DemoData = {
  threats: [],
  walletScreenings: [],
  contractAudits: [],
  incidents: [],
}

export function DemoStoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DemoData>(INITIAL_DATA)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const userId = localStorage.getItem("chainsentry-user-id")
    if (userId) {
      const stored = localStorage.getItem(`chainsentry-demo-data-${userId}`)
      if (stored) {
        try {
          setData(JSON.parse(stored))
        } catch (e) {
          console.error("Failed to parse stored data:", e)
          setData(INITIAL_DATA)
        }
      } else {
        // New user - start with empty data
        setData(INITIAL_DATA)
      }
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (!isLoaded) return // Don't save until initial load is complete

    const userId = localStorage.getItem("chainsentry-user-id")
    if (userId) {
      localStorage.setItem(`chainsentry-demo-data-${userId}`, JSON.stringify(data))
    }
  }, [data, isLoaded])

  const addThreat = (threat: Threat) => {
    setData((prev) => ({ ...prev, threats: [threat, ...prev.threats] }))
  }

  const updateThreat = (id: string, updates: Partial<Threat>) => {
    setData((prev) => ({
      ...prev,
      threats: prev.threats.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }))
  }

  const addWalletScreening = (screening: WalletScreening) => {
    setData((prev) => ({ ...prev, walletScreenings: [screening, ...prev.walletScreenings] }))
  }

  const addContractAudit = (audit: ContractAudit) => {
    setData((prev) => ({ ...prev, contractAudits: [audit, ...prev.contractAudits] }))
  }

  const updateContractAudit = (id: string, updates: Partial<ContractAudit>) => {
    setData((prev) => ({
      ...prev,
      contractAudits: prev.contractAudits.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    }))
  }

  const addIncident = (incident: Incident) => {
    setData((prev) => ({ ...prev, incidents: [incident, ...prev.incidents] }))
  }

  const updateIncident = (id: string, updates: Partial<Incident>) => {
    setData((prev) => ({
      ...prev,
      incidents: prev.incidents.map((i) =>
        i.id === id ? { ...i, ...updates, updated_at: new Date().toISOString() } : i,
      ),
    }))
  }

  const deleteIncident = (id: string) => {
    setData((prev) => ({
      ...prev,
      incidents: prev.incidents.filter((i) => i.id !== id),
    }))
  }

  const getStats = () => {
    const activeThreats = data.threats.filter((t) => t.status === "active").length
    const contractsAudited = data.contractAudits.filter((a) => a.status === "completed").length
    const openIncidents = data.incidents.filter((i) => i.status === "open" || i.status === "investigating").length
    const alerts24h = data.threats.filter((t) => new Date(t.detected_at).getTime() > Date.now() - 86400000).length
    const highRiskThreats = data.threats.filter((t) => t.risk_score >= 70 && t.status === "active").length
    const criticalIncidents = data.incidents.filter((i) => i.severity === "critical" && i.status !== "closed").length

    return {
      activeThreats,
      contractsAudited,
      openIncidents,
      alerts24h,
      highRiskThreats,
      criticalIncidents,
    }
  }

  return (
    <DemoStoreContext.Provider
      value={{
        data,
        addThreat,
        updateThreat,
        addWalletScreening,
        addContractAudit,
        updateContractAudit,
        addIncident,
        updateIncident,
        deleteIncident,
        getStats,
      }}
    >
      {children}
    </DemoStoreContext.Provider>
  )
}

export function useDemoStore() {
  const context = useContext(DemoStoreContext)
  if (!context) {
    throw new Error("useDemoStore must be used within DemoStoreProvider")
  }
  return context
}
