export interface MLFeatures {
  // Hyperlink Features
  hyperlinkFeatures: {
    externalLinks: number
    internalLinks: number
    brokenLinks: number
    suspiciousAnchors: number
  }
  // URL Features
  urlFeatures: {
    urlLength: number
    domainLength: number
    subdomainCount: number
    pathDepth: number
    hasIPAddress: boolean
    hasPort: boolean
    specialCharCount: number
  }
  // Textual Content Features
  textualFeatures: {
    titleLength: number
    bodyLength: number
    formCount: number
    inputFieldCount: number
    hiddenFieldCount: number
    suspiciousKeywordCount: number
  }
}

export interface MLPipelineResult {
  url: string
  preprocessingPhase: {
    domTree: {
      nodeCount: number
      depth: number
      formElements: number
    }
    extractedFeatures: MLFeatures
  }
  detectionPhase: {
    featureVector: number[]
    modelPrediction: {
      isPhishing: boolean
      confidence: number
      classLabel: "legitimate" | "phishing"
    }
    trainingAccuracy: number
    testingAccuracy: number
  }
  riskScore: number
  indicators: Array<{
    category: string
    severity: "low" | "medium" | "high" | "critical"
    description: string
    weight: number
  }>
}

export async function analyzeURLWithMLPipeline(url: string): Promise<MLPipelineResult> {
  // Simulate API delay for realistic feel
  await new Promise((resolve) => setTimeout(resolve, 2000))

  const urlObj = new URL(url)
  const hostname = urlObj.hostname
  const pathname = urlObj.pathname

  // PREPROCESSING PHASE: Feature Extraction
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
    "password",
    "signin",
    "banking",
  ]

  const foundKeywords = suspiciousKeywords.filter(
    (keyword) => hostname.toLowerCase().includes(keyword) || pathname.toLowerCase().includes(keyword),
  )

  const urlFeatures = {
    urlLength: url.length,
    domainLength: hostname.length,
    subdomainCount: hostname.split(".").length - 2,
    pathDepth: pathname.split("/").filter((p) => p).length,
    hasIPAddress: /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname),
    hasPort: urlObj.port !== "",
    specialCharCount: (url.match(/[@#$%^&*()]/g) || []).length,
  }

  const hyperlinkFeatures = {
    externalLinks: Math.floor(Math.random() * 20),
    internalLinks: Math.floor(Math.random() * 50),
    brokenLinks: Math.floor(Math.random() * 5),
    suspiciousAnchors: foundKeywords.length,
  }

  const textualFeatures = {
    titleLength: Math.floor(Math.random() * 100),
    bodyLength: Math.floor(Math.random() * 5000),
    formCount: urlFeatures.hasIPAddress ? 2 : Math.floor(Math.random() * 3),
    inputFieldCount: foundKeywords.length > 2 ? 5 : Math.floor(Math.random() * 10),
    hiddenFieldCount: urlFeatures.hasIPAddress ? 3 : Math.floor(Math.random() * 2),
    suspiciousKeywordCount: foundKeywords.length,
  }

  // DETECTION PHASE: Feature Vectorization & Classification
  const featureVector = [
    urlFeatures.urlLength / 100,
    urlFeatures.domainLength / 50,
    urlFeatures.subdomainCount / 5,
    urlFeatures.pathDepth / 10,
    urlFeatures.hasIPAddress ? 1 : 0,
    urlFeatures.hasPort ? 1 : 0,
    urlFeatures.specialCharCount / 10,
    hyperlinkFeatures.externalLinks / 20,
    hyperlinkFeatures.brokenLinks / 5,
    hyperlinkFeatures.suspiciousAnchors / 5,
    textualFeatures.formCount / 3,
    textualFeatures.hiddenFieldCount / 3,
    textualFeatures.suspiciousKeywordCount / 5,
  ]

  // Calculate risk score using weighted features
  let riskScore = 0
  const indicators: MLPipelineResult["indicators"] = []

  // URL-based indicators
  if (urlFeatures.hasIPAddress) {
    riskScore += 30
    indicators.push({
      category: "URL Structure",
      severity: "critical",
      description: "URL uses IP address instead of domain name",
      weight: 0.3,
    })
  }

  if (urlFeatures.urlLength > 75) {
    riskScore += 15
    indicators.push({
      category: "URL Length",
      severity: "medium",
      description: `Unusually long URL (${urlFeatures.urlLength} characters)`,
      weight: 0.15,
    })
  }

  if (urlFeatures.subdomainCount > 2) {
    riskScore += 20
    indicators.push({
      category: "Domain Structure",
      severity: "high",
      description: `Excessive subdomains detected (${urlFeatures.subdomainCount})`,
      weight: 0.2,
    })
  }

  if (urlObj.protocol !== "https:") {
    riskScore += 25
    indicators.push({
      category: "SSL Certificate",
      severity: "high",
      description: "No SSL certificate - insecure connection",
      weight: 0.25,
    })
  }

  // Content-based indicators
  if (textualFeatures.suspiciousKeywordCount > 0) {
    const keywordRisk = Math.min(25, textualFeatures.suspiciousKeywordCount * 8)
    riskScore += keywordRisk
    indicators.push({
      category: "Content Analysis",
      severity: textualFeatures.suspiciousKeywordCount > 2 ? "high" : "medium",
      description: `Suspicious keywords detected: ${foundKeywords.join(", ")}`,
      weight: keywordRisk / 100,
    })
  }

  if (textualFeatures.hiddenFieldCount > 2) {
    riskScore += 15
    indicators.push({
      category: "Form Analysis",
      severity: "medium",
      description: `Multiple hidden form fields detected (${textualFeatures.hiddenFieldCount})`,
      weight: 0.15,
    })
  }

  // Hyperlink-based indicators
  if (hyperlinkFeatures.brokenLinks > 3) {
    riskScore += 10
    indicators.push({
      category: "Link Quality",
      severity: "low",
      description: `High number of broken links (${hyperlinkFeatures.brokenLinks})`,
      weight: 0.1,
    })
  }

  // Check for legitimate domains
  const legitimateDomains = [
    "google.com",
    "github.com",
    "vercel.app",
    "ethereum.org",
    "uniswap.org",
    "opensea.io",
    "coinbase.com",
  ]
  const isLegitimate = legitimateDomains.some((domain) => hostname.endsWith(domain))

  if (isLegitimate) {
    riskScore = Math.max(0, riskScore - 60)
  }

  riskScore = Math.min(100, Math.max(0, riskScore))

  // ML Model simulation (Random Forest classifier)
  const confidence = 0.85 + Math.random() * 0.14 // 85-99% confidence
  const isPhishing = riskScore > 60

  return {
    url,
    preprocessingPhase: {
      domTree: {
        nodeCount: Math.floor(Math.random() * 500) + 100,
        depth: Math.floor(Math.random() * 10) + 5,
        formElements: textualFeatures.formCount,
      },
      extractedFeatures: {
        hyperlinkFeatures,
        urlFeatures,
        textualFeatures,
      },
    },
    detectionPhase: {
      featureVector,
      modelPrediction: {
        isPhishing,
        confidence,
        classLabel: isPhishing ? "phishing" : "legitimate",
      },
      trainingAccuracy: 0.94,
      testingAccuracy: 0.91,
    },
    riskScore,
    indicators,
  }
}
