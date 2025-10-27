export interface ThreatEvent {
  id: string
  timestamp: Date
  type: "phishing" | "malware" | "suspicious_transaction" | "contract_exploit" | "ddos"
  severity: "low" | "medium" | "high" | "critical"
  source: string
  target?: string
  description: string
  status: "active" | "investigating" | "resolved" | "false_positive"
  details: {
    blockchain?: string
    transactionHash?: string
    amount?: string
    affectedUsers?: number
  }
}

export class ThreatMonitor {
  private listeners: ((event: ThreatEvent) => void)[] = []
  private interval: NodeJS.Timeout | null = null

  subscribe(callback: (event: ThreatEvent) => void) {
    this.listeners.push(callback)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback)
    }
  }

  start() {
    if (this.interval) return

    this.interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const event = this.generateThreatEvent()
        this.listeners.forEach((listener) => listener(event))
      }
    }, 5000)
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }
  }

  private generateThreatEvent(): ThreatEvent {
    const types: ThreatEvent["type"][] = ["phishing", "malware", "suspicious_transaction", "contract_exploit", "ddos"]
    const severities: ThreatEvent["severity"][] = ["low", "medium", "high", "critical"]
    const blockchains = ["Ethereum", "BSC", "Polygon", "Arbitrum", "Optimism"]

    const type = types[Math.floor(Math.random() * types.length)]
    const severity = severities[Math.floor(Math.random() * severities.length)]

    const descriptions: Record<ThreatEvent["type"], string[]> = {
      phishing: [
        "Phishing site detected mimicking MetaMask",
        "Fake Uniswap interface attempting credential theft",
        "Malicious wallet connection request detected",
      ],
      malware: [
        "Clipboard hijacker detected modifying wallet addresses",
        "Keylogger attempting to capture seed phrases",
        "Malicious browser extension detected",
      ],
      suspicious_transaction: [
        "Large transfer to newly created wallet",
        "Unusual transaction pattern detected",
        "High-value transfer to mixer service",
      ],
      contract_exploit: [
        "Reentrancy attack detected on DeFi protocol",
        "Flash loan attack in progress",
        "Unauthorized token minting detected",
      ],
      ddos: ["Network congestion attack detected", "RPC endpoint under heavy load", "Mempool spam attack in progress"],
    }

    return {
      id: `THR-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date(),
      type,
      severity,
      source: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
      target:
        Math.random() > 0.5
          ? `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`
          : undefined,
      description: descriptions[type][Math.floor(Math.random() * descriptions[type].length)],
      status: "active",
      details: {
        blockchain: blockchains[Math.floor(Math.random() * blockchains.length)],
        transactionHash: `0x${Math.random().toString(16).slice(2, 66)}`,
        amount: `${(Math.random() * 1000).toFixed(2)} ETH`,
        affectedUsers: Math.floor(Math.random() * 1000),
      },
    }
  }
}

export const threatMonitor = new ThreatMonitor()
