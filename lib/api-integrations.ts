// API Integration utilities and documentation

export interface APIIntegration {
  name: string
  description: string
  baseUrl: string
  docsUrl: string
  requiredEnvVars: string[]
  setupInstructions: string
  exampleUsage: string
}

export const API_INTEGRATIONS: Record<string, APIIntegration> = {
  chainalysis: {
    name: "Chainalysis",
    description: "Blockchain intelligence and compliance platform for transaction monitoring and wallet screening",
    baseUrl: "https://api.chainalysis.com",
    docsUrl: "https://docs.chainalysis.com",
    requiredEnvVars: ["CHAINALYSIS_API_KEY"],
    setupInstructions: `
# Chainalysis API Setup

1. Go to https://www.chainalysis.com/
2. Contact sales or sign up for a trial account
3. Navigate to Settings > API Keys
4. Generate a new API key
5. Add to your environment variables:
   CHAINALYSIS_API_KEY=your_api_key_here

## Pricing
- Contact Chainalysis for enterprise pricing
- Trial available for qualified organizations

## Features Available
- Wallet screening and risk scoring
- Transaction monitoring
- Sanctions list checking
- Entity attribution
- Real-time alerts
    `,
    exampleUsage: `
// Example: Screen a wallet address
async function screenWallet(address: string) {
  const response = await fetch('https://api.chainalysis.com/api/risk/v2/entities', {
    method: 'POST',
    headers: {
      'Token': process.env.CHAINALYSIS_API_KEY!,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      address: address,
      asset: 'ETH'
    })
  })
  
  const data = await response.json()
  return data
}
    `,
  },

  trm: {
    name: "TRM Labs",
    description: "Blockchain intelligence for fraud detection and AML compliance",
    baseUrl: "https://api.trmlabs.com",
    docsUrl: "https://docs.trmlabs.com",
    requiredEnvVars: ["TRM_API_KEY"],
    setupInstructions: `
# TRM Labs API Setup

1. Visit https://www.trmlabs.com/
2. Request access or sign up for an account
3. Go to Dashboard > API Keys
4. Create a new API key
5. Add to environment variables:
   TRM_API_KEY=your_api_key_here

## Pricing
- Contact TRM Labs for pricing
- Free tier available for developers

## Features Available
- Address screening
- Transaction risk scoring
- Sanctions screening
- Fraud detection
- Compliance reporting
    `,
    exampleUsage: `
// Example: Screen an address
async function screenAddress(address: string, chain: string) {
  const response = await fetch(\`https://api.trmlabs.com/public/v2/screening/addresses\`, {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${process.env.TRM_API_KEY}\`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify([{
      address: address,
      chain: chain
    }])
  })
  
  return await response.json()
}
    `,
  },

  etherscan: {
    name: "Etherscan",
    description: "Ethereum blockchain explorer API for transaction and contract data",
    baseUrl: "https://api.etherscan.io",
    docsUrl: "https://docs.etherscan.io",
    requiredEnvVars: ["ETHERSCAN_API_KEY"],
    setupInstructions: `
# Etherscan API Setup

1. Go to https://etherscan.io/
2. Create a free account
3. Navigate to https://etherscan.io/myapikey
4. Generate a new API key (free tier available)
5. Add to environment variables:
   ETHERSCAN_API_KEY=your_api_key_here

## Pricing
- Free tier: 5 calls/second
- Standard: $49/month - 10 calls/second
- Advanced: $199/month - 20 calls/second
- Professional: $499/month - 50 calls/second

## Features Available
- Account balance and transactions
- Contract ABI and source code
- Token transfers and balances
- Gas prices and estimates
- Block and transaction data
    `,
    exampleUsage: `
// Example: Get contract source code
async function getContractSource(address: string) {
  const response = await fetch(
    \`https://api.etherscan.io/api?module=contract&action=getsourcecode&address=\${address}&apikey=\${process.env.ETHERSCAN_API_KEY}\`
  )
  
  const data = await response.json()
  return data.result[0]
}
    `,
  },

  alchemy: {
    name: "Alchemy",
    description: "Web3 development platform with enhanced APIs for blockchain data",
    baseUrl: "https://eth-mainnet.g.alchemy.com",
    docsUrl: "https://docs.alchemy.com",
    requiredEnvVars: ["ALCHEMY_API_KEY"],
    setupInstructions: `
# Alchemy API Setup

1. Visit https://www.alchemy.com/
2. Sign up for a free account
3. Create a new app in the dashboard
4. Select your network (Ethereum, Polygon, etc.)
5. Copy your API key
6. Add to environment variables:
   ALCHEMY_API_KEY=your_api_key_here

## Pricing
- Free tier: 300M compute units/month
- Growth: $49/month - 1.5B compute units
- Scale: $199/month - 6B compute units
- Enterprise: Custom pricing

## Features Available
- Enhanced APIs (NFT, Token, Transaction)
- WebSocket subscriptions
- Archive data access
- Trace API
- Simulation API
    `,
    exampleUsage: `
// Example: Get NFTs owned by address
async function getNFTs(address: string) {
  const response = await fetch(
    \`https://eth-mainnet.g.alchemy.com/v2/\${process.env.ALCHEMY_API_KEY}/getNFTs?owner=\${address}\`
  )
  
  return await response.json()
}
    `,
  },

  openai: {
    name: "OpenAI",
    description: "AI models for threat analysis, code review, and natural language processing",
    baseUrl: "https://api.openai.com",
    docsUrl: "https://platform.openai.com/docs",
    requiredEnvVars: ["OPENAI_API_KEY"],
    setupInstructions: `
# OpenAI API Setup

1. Go to https://platform.openai.com/
2. Sign up or log in
3. Navigate to https://platform.openai.com/api-keys
4. Create a new API key
5. Add to environment variables:
   OPENAI_API_KEY=your_api_key_here

## Pricing (GPT-4)
- GPT-4o: $2.50/1M input tokens, $10/1M output tokens
- GPT-4o-mini: $0.15/1M input tokens, $0.60/1M output tokens
- GPT-3.5-turbo: $0.50/1M input tokens, $1.50/1M output tokens

## Use Cases for CryptoGuardian
- Smart contract vulnerability analysis
- Threat intelligence summarization
- Phishing content detection
- Incident report generation
- Natural language queries for blockchain data
    `,
    exampleUsage: `
// Example: Analyze smart contract for vulnerabilities
async function analyzeContract(sourceCode: string) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${process.env.OPENAI_API_KEY}\`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [{
        role: 'system',
        content: 'You are a smart contract security auditor. Analyze the following Solidity code for vulnerabilities.'
      }, {
        role: 'user',
        content: sourceCode
      }],
      temperature: 0.3
    })
  })
  
  const data = await response.json()
  return data.choices[0].message.content
}
    `,
  },
}

// Helper function to check if API key is configured
export function isAPIConfigured(apiName: keyof typeof API_INTEGRATIONS): boolean {
  const integration = API_INTEGRATIONS[apiName]
  return integration.requiredEnvVars.every(
    (envVar) => typeof process.env[envVar] !== "undefined" && process.env[envVar] !== "",
  )
}

// Helper to get missing env vars for an API
export function getMissingEnvVars(apiName: keyof typeof API_INTEGRATIONS): string[] {
  const integration = API_INTEGRATIONS[apiName]
  return integration.requiredEnvVars.filter(
    (envVar) => typeof process.env[envVar] === "undefined" || process.env[envVar] === "",
  )
}
