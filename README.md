# 🛡️ ChainSentry - Blockchain Security Platform

> Real-time blockchain threat detection, smart contract auditing, and incident response platform built for the Halloween ChaincKathon 2025.

## 🎯 Overview

ChainSentry is an enterprise-grade blockchain security platform that provides comprehensive Web3 security monitoring, threat detection, and incident response capabilities. Built with Next.js 15 and powered by AI-driven analysis, it offers real-time protection for blockchain users and organizations.

**Live Demo**: (https://chainsentry-iota.vercel.app/)

## ✨ Key Features

### 🔍 Phishing Detection Center
- Real-time URL scanning with AI-powered threat analysis
- Suspicious keyword and pattern detection
- Domain reputation scoring
- Historical threat tracking
- Instant risk assessment

### 📝 Smart Contract Auditing
- Multi-chain support (Ethereum, BSC, Polygon, Arbitrum, Optimism, Base)
- Automated vulnerability detection
- Gas optimization analysis
- Security best practices validation
- Comprehensive audit reports

### 💼 Wallet Screening
- Blockchain-specific address validation
- Risk score calculation based on transaction patterns
- Multi-network support (Ethereum, Bitcoin, Solana, and more)
- Real-time screening results
- Historical screening data

### 👁️ Real-Time Monitoring
- Live threat intelligence feed
- Automated alert generation
- Severity classification (Critical, High, Medium, Low)
- Alert management and resolution tracking
- Activity-based monitoring dashboard

### 🚨 Incident Response
- Complete incident lifecycle management
- Status tracking (Open, Investigating, Resolved, Closed)
- Priority assignment and escalation
- Search and filter capabilities
- Incident timeline and notes

### 📊 Analytics & Reporting
- Real-time security metrics
- Threat trend analysis
- Risk distribution visualization
- Blockchain activity insights
- Downloadable reports (PDF/CSV)

## 🎨 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui + Radix UI
- **State Management**: React Context API
- **Data Persistence**: localStorage (demo mode) / Supabase (production)
- **Charts**: Recharts
- **Authentication**: Custom auth system with user isolation
- **Theme**: Dark/Light mode with next-themes

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- npm, yarn, or pnpm

### Installation

\`\`\`bash
# Clone the repository
git clone https://github.com/yourusername/chainsentry.git
cd chainsentry

# Install dependencies
npm install

# Run development server
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Mode

ChainSentry runs in full demo mode with simulated data:
- ✅ No API keys required
- ✅ Fresh dashboard for each new user (starts at 0, 0, 0, 0)
- ✅ Real input validation (wallet addresses, contracts, URLs)
- ✅ Live updates across all features
- ✅ Persistent user sessions

## 🚢 Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/chainsentry)

Or manually:

\`\`\`bash
# Build for production
npm run build

# Start production server
npm start
\`\`\`

## 🔐 Security Features

### Input Validation
- **Wallet Addresses**: Network-specific format validation (Ethereum: 0x + 40 hex chars, Bitcoin: base58, Solana: base58)
- **Smart Contracts**: Blockchain-aware address validation
- **URLs**: Proper URL format checking with protocol validation
- **Rejects Invalid Input**: No fake data accepted (e.g., "ABCD" or random text)

### User Isolation
- Each user gets isolated data storage
- No data leakage between sessions
- Fresh dashboard for new users
- Secure authentication flow

### Real-Time Updates
- Dashboard metrics update instantly
- Analytics reflect user actions
- Monitoring alerts generated from activity
- Incident management syncs across views

## 🏆 Halloween ChaincKathon 2025

ChainSentry addresses all hackathon security categories:

✅ **Phishing/Scam Prevention**: AI-powered URL scanning with real-time threat detection  
✅ **Secure Authentication**: User isolation with demo auth system  
✅ **Incident Response**: Complete threat monitoring and incident management dashboard  
✅ **Smart Contract Security**: Multi-chain contract auditing with vulnerability detection

## 📁 Project Structure

\`\`\`
chainsentry/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── auth/                    # Authentication pages
│   └── dashboard/               # Dashboard pages
│       ├── threats/             # Threat detection
│       ├── audit/               # Contract auditing
│       ├── wallet-screening/    # Wallet screening
│       ├── monitoring/          # Live monitoring
│       ├── incidents/           # Incident response
│       ├── analytics/           # Analytics
│       └── reports/             # Reports
├── components/                  # React components
├── lib/                         # Utilities and contexts
└── public/                      # Static assets
\`\`\`

## 🎯 Features Showcase

### For Users
- Scan suspicious URLs before clicking
- Verify wallet addresses before transactions
- Audit smart contracts before interaction
- Monitor real-time security threats
- Generate comprehensive security reports

### For Organizations
- Enterprise-grade security monitoring
- Incident response workflow
- Team collaboration features
- Comprehensive analytics
- Downloadable audit reports

## 🐛 Troubleshooting

**Dashboard shows 0, 0, 0, 0**  
This is correct for new users! Start using features to populate data.

**Wallet screening rejects my address**  
Ensure you've selected the correct blockchain network.

**Theme not switching**  
Use the theme toggle in the dashboard header.

## 📝 License

MIT License - see [LICENSE](./LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Built for Halloween ChaincKathon 2025** 🎃  
**Powered by Next.js, Vercel, and Supabase**
