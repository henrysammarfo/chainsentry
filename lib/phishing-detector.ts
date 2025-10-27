export interface PhishingAnalysis {
  url: string
  isPhishing: boolean
  riskScore: number
  indicators: {
    category: string
    severity: "low" | "medium" | "high" | "critical"
    description: string
  }[]
  urlFeatures: {
    domainAge: string
    hasSSL: boolean
    suspiciousKeywords: string[]
    ipAddress: boolean
    urlLength: number
    subdomainCount: number
  }
}

export async function analyzeURL(url: string): Promise<PhishingAnalysis> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const urlObj = new URL(url)
  const hostname = urlObj.hostname
  const pathname = urlObj.pathname

  // Real URL feature extraction
  const suspiciousKeywords = [
    "login",
    "verify",
    "account",
    "secure",
    "update",
    "confirm",
    "wallet",
    "metamask",
    "uniswap",
  ]
  const foundKeywords = suspiciousKeywords.filter(
    (keyword) => hostname.toLowerCase().includes(keyword) || pathname.toLowerCase().includes(keyword),
  )

  const hasSSL = urlObj.protocol === "https:"
  const isIPAddress = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)
  const subdomainCount = hostname.split(".").length - 2
  const urlLength = url.length

  // Calculate risk score based on features
  let riskScore = 0
  const indicators: PhishingAnalysis["indicators"] = []

  if (!hasSSL) {
    riskScore += 25
    indicators.push({
      category: "SSL Certificate",
      severity: "high",
      description: "No SSL certificate detected - insecure connection",
    })
  }

  if (isIPAddress) {
    riskScore += 30
    indicators.push({
      category: "Domain Type",
      severity: "critical",
      description: "URL uses IP address instead of domain name",
    })
  }

  if (foundKeywords.length > 0) {
    riskScore += foundKeywords.length * 10
    indicators.push({
      category: "Suspicious Keywords",
      severity: foundKeywords.length > 2 ? "high" : "medium",
      description: `Found suspicious keywords: ${foundKeywords.join(", ")}`,
    })
  }

  if (subdomainCount > 2) {
    riskScore += 15
    indicators.push({
      category: "Subdomain Count",
      severity: "medium",
      description: `Excessive subdomains detected (${subdomainCount})`,
    })
  }

  if (urlLength > 75) {
    riskScore += 10
    indicators.push({
      category: "URL Length",
      severity: "low",
      description: "Unusually long URL detected",
    })
  }

  // Check for common legitimate domains
  const legitimateDomains = ["google.com", "github.com", "vercel.app", "ethereum.org", "uniswap.org"]
  const isLegitimate = legitimateDomains.some((domain) => hostname.endsWith(domain))

  if (isLegitimate) {
    riskScore = Math.max(0, riskScore - 50)
  }

  riskScore = Math.min(100, riskScore)

  return {
    url,
    isPhishing: riskScore > 60,
    riskScore,
    indicators,
    urlFeatures: {
      domainAge: isLegitimate ? "5+ years" : "Unknown",
      hasSSL,
      suspiciousKeywords: foundKeywords,
      ipAddress: isIPAddress,
      urlLength,
      subdomainCount,
    },
  }
}

export const analyzePhishingURL = analyzeURL
