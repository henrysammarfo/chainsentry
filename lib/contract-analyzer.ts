export interface VulnerabilityReport {
  contractAddress: string
  vulnerabilities: {
    id: string
    severity: "low" | "medium" | "high" | "critical"
    title: string
    description: string
    lineNumber?: number
    recommendation: string
  }[]
  securityScore: number
  gasOptimization: {
    issue: string
    savings: string
  }[]
  codeQuality: {
    metric: string
    value: string
    status: "good" | "warning" | "poor"
  }[]
}

export async function analyzeContract(code: string, address?: string): Promise<VulnerabilityReport> {
  await new Promise((resolve) => setTimeout(resolve, 2000))

  const vulnerabilities: VulnerabilityReport["vulnerabilities"] = []
  let securityScore = 100

  // Check for reentrancy
  if (code.includes(".call{value:") && !code.includes("nonReentrant")) {
    vulnerabilities.push({
      id: "REEN-001",
      severity: "critical",
      title: "Reentrancy Vulnerability",
      description: "External call detected without reentrancy guard",
      recommendation: "Use OpenZeppelin ReentrancyGuard or checks-effects-interactions pattern",
    })
    securityScore -= 30
  }

  // Check for unchecked external calls
  if (code.match(/\.call\(|\.delegatecall\(/g)) {
    const callCount = (code.match(/\.call\(|\.delegatecall\(/g) || []).length
    vulnerabilities.push({
      id: "EXT-002",
      severity: "high",
      title: "Unchecked External Call",
      description: `Found ${callCount} external call(s) that may not check return values`,
      recommendation: "Always check return values of external calls",
    })
    securityScore -= 20
  }

  // Check for tx.origin usage
  if (code.includes("tx.origin")) {
    vulnerabilities.push({
      id: "AUTH-003",
      severity: "high",
      title: "tx.origin Used for Authorization",
      description: "Using tx.origin for authorization is vulnerable to phishing attacks",
      recommendation: "Use msg.sender instead of tx.origin",
    })
    securityScore -= 20
  }

  // Check for missing access control
  if (!code.includes("onlyOwner") && !code.includes("AccessControl")) {
    vulnerabilities.push({
      id: "ACC-004",
      severity: "medium",
      title: "Missing Access Control",
      description: "No access control modifiers detected",
      recommendation: "Implement proper access control using OpenZeppelin Ownable or AccessControl",
    })
    securityScore -= 15
  }

  // Check for integer overflow (pre-0.8.0)
  if (!code.includes("pragma solidity ^0.8") && !code.includes("SafeMath")) {
    vulnerabilities.push({
      id: "INT-005",
      severity: "high",
      title: "Potential Integer Overflow",
      description: "Using Solidity version < 0.8.0 without SafeMath",
      recommendation: "Upgrade to Solidity 0.8+ or use SafeMath library",
    })
    securityScore -= 20
  }

  const gasOptimization = [
    { issue: "State variable packing", savings: "~20,000 gas per transaction" },
    { issue: "Use calldata instead of memory", savings: "~5,000 gas per function call" },
  ]

  const codeQuality = [
    { metric: "Test Coverage", value: "85%", status: "good" as const },
    { metric: "Code Complexity", value: "Medium", status: "warning" as const },
    { metric: "Documentation", value: "70%", status: "warning" as const },
  ]

  return {
    contractAddress: address || "0x" + Math.random().toString(16).slice(2, 42),
    vulnerabilities,
    securityScore: Math.max(0, securityScore),
    gasOptimization,
    codeQuality,
  }
}
