"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"

export default function LandingPage() {
  useEffect(() => {
    document.body.style.backgroundColor = "#000000"
    document.body.style.color = "#ffffff"
    return () => {
      document.body.style.backgroundColor = ""
      document.body.style.color = ""
    }
  }, [])

  const ShieldIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )

  const SearchIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  )

  const CodeIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  )

  const ActivityIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  )

  const AlertIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )

  const ChartIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  )

  const CheckIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )

  const ArrowIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )

  const WalletIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
    </svg>
  )

  const ZapIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )

  const securityCards = [
    {
      icon: SearchIcon,
      title: "Phishing Detection",
      description: "AI-powered URL scanning detects malicious websites in real-time with 99.8% accuracy",
      color: "from-red-500 to-orange-500",
      left: "5%",
      top: "8%",
      delay: "0s",
    },
    {
      icon: CodeIcon,
      title: "Smart Contract Audit",
      description: "Automated vulnerability scanning for Solidity contracts across all major chains",
      color: "from-blue-500 to-cyan-500",
      left: "82%",
      top: "12%",
      delay: "0.5s",
    },
    {
      icon: WalletIcon,
      title: "Wallet Screening",
      description: "Risk scoring and sanctions screening for crypto addresses with instant results",
      color: "from-green-500 to-emerald-500",
      left: "8%",
      top: "45%",
      delay: "1s",
    },
    {
      icon: ActivityIcon,
      title: "Real-Time Monitoring",
      description: "Track transactions across 50+ blockchain networks with millisecond latency",
      color: "from-purple-500 to-pink-500",
      left: "78%",
      top: "55%",
      delay: "1.5s",
    },
    {
      icon: AlertIcon,
      title: "Incident Response",
      description: "Automated detection and response workflows with customizable alert rules",
      color: "from-yellow-500 to-orange-500",
      left: "10%",
      top: "75%",
      delay: "2s",
    },
    {
      icon: ChartIcon,
      title: "Advanced Analytics",
      description: "Comprehensive dashboards and security metrics with exportable reports",
      color: "from-indigo-500 to-blue-500",
      left: "75%",
      top: "35%",
      delay: "2.5s",
    },
  ]

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const element = document.querySelector(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <>
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateZ(0px); }
          50% { transform: translateY(-100px) translateZ(50px); }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-80px); }
        }

        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .flip-card {
          perspective: 1500px;
          cursor: pointer;
          transition: transform 0.3s ease;
          pointer-events: auto;
        }

        .flip-card:hover {
          transform: scale(1.05);
          z-index: 100 !important;
        }

        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1);
          transform-style: preserve-3d;
        }

        .flip-card:hover .flip-card-inner {
          transform: rotateY(180deg);
        }

        .flip-card-front,
        .flip-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        .flip-card-back {
          transform: rotateY(180deg);
        }

        .animated-gradient {
          background-size: 200% 200%;
          animation: gradientMove 5s linear infinite;
        }

        .fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        @keyframes cardFloat {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) rotate(0deg);
          }
          25% { 
            transform: translateY(-20px) translateX(10px) rotate(2deg);
          }
          50% { 
            transform: translateY(-40px) translateX(-10px) rotate(-2deg);
          }
          75% { 
            transform: translateY(-20px) translateX(10px) rotate(1deg);
          }
        }

        .floating-card {
          animation: cardFloat 8s ease-in-out infinite;
        }
      `}</style>

      <div className="relative bg-black text-white">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

        <div
          className="absolute inset-0 pointer-events-none"
          style={{ perspective: "2000px", minHeight: "400vh", zIndex: 50 }}
        >
          {securityCards.map((card, i) => (
            <div
              key={i}
              className="floating-card flip-card w-72 h-96 pointer-events-auto absolute"
              style={{
                left: card.left,
                top: card.top,
                animationDelay: card.delay,
                zIndex: 50 + i,
              }}
            >
              <div className="flip-card-inner">
                <div
                  className={`flip-card-front rounded-3xl bg-gradient-to-br ${card.color} p-8 flex flex-col justify-between shadow-2xl`}
                >
                  <div>
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-6">
                      <card.icon />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-4">{card.title}</h3>
                  </div>
                  <div className="text-sm font-medium text-white/80 uppercase tracking-wider">Hover to learn more</div>
                </div>

                <div
                  className={`flip-card-back rounded-3xl bg-gradient-to-br ${card.color} p-8 flex flex-col justify-center shadow-2xl`}
                >
                  <p className="text-lg text-white leading-relaxed mb-6">{card.description}</p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-white/90">
                      <div className="w-5 h-5">
                        <CheckIcon />
                      </div>
                      <span className="text-sm font-medium">Real-time protection</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/90">
                      <div className="w-5 h-5">
                        <CheckIcon />
                      </div>
                      <span className="text-sm font-medium">Automated alerts</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="relative">
          <nav className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="h-8 w-8 text-blue-500 transition-transform group-hover:rotate-[360deg] duration-500">
                  <ShieldIcon />
                </div>
                <span className="text-xl font-bold tracking-tight">ChainSentry</span>
              </Link>

              <div className="hidden md:flex items-center gap-8">
                <a
                  href="#features"
                  onClick={(e) => scrollToSection(e, "#features")}
                  className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  onClick={(e) => scrollToSection(e, "#how-it-works")}
                  className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
                >
                  How It Works
                </a>
              </div>

              <Link href="/dashboard">
                <Button size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700">
                  View Demo
                  <div className="h-4 w-4">
                    <ArrowIcon />
                  </div>
                </Button>
              </Link>
            </div>
          </nav>

          <section className="container mx-auto px-4 pt-32 pb-24 relative min-h-screen flex items-center justify-center">
            <div className="relative z-10 text-center max-w-4xl mx-auto">
              <div className="space-y-8 fade-in-up">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-sm mb-6">
                  <div className="h-4 w-4 text-yellow-500">
                    <ZapIcon />
                  </div>
                  <span>Halloween ChaincKathon 2025 Project</span>
                </div>

                <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight">
                  <span className="block mb-4">Secure your</span>
                  <span className="block bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animated-gradient">
                    Web3 assets.
                  </span>
                </h1>

                <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                  Real-time threat detection, smart contract auditing, and comprehensive monitoring for blockchain
                  security.
                </p>

                <div className="pt-8">
                  <Link href="/auth/signup">
                    <Button
                      size="lg"
                      className="h-14 px-12 text-lg bg-blue-600 hover:bg-blue-700 gap-3 hover:scale-105 transition-transform"
                    >
                      Get Started
                      <div className="h-5 w-5">
                        <ArrowIcon />
                      </div>
                    </Button>
                  </Link>
                  <p className="text-sm text-gray-500 mt-4">Create your free account • Safe sandbox environment</p>
                </div>
              </div>
            </div>
          </section>

          <section id="how-it-works" className="container mx-auto px-4 py-32 relative">
            <div className="max-w-4xl mx-auto text-center space-y-16">
              <div>
                <h2 className="text-5xl md:text-6xl font-bold mb-6">How ChainSentry Works</h2>
                <p className="text-xl text-gray-400">Comprehensive blockchain security in three simple steps</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    step: "01",
                    title: "Connect & Monitor",
                    description: "Link your wallets and smart contracts for continuous security monitoring",
                    icon: ActivityIcon,
                  },
                  {
                    step: "02",
                    title: "Detect Threats",
                    description: "AI-powered analysis identifies phishing, vulnerabilities, and suspicious activity",
                    icon: SearchIcon,
                  },
                  {
                    step: "03",
                    title: "Respond & Protect",
                    description: "Automated alerts and incident response workflows keep your assets safe",
                    icon: ShieldIcon,
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="relative p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:-translate-y-2 transition-transform duration-300"
                  >
                    <div className="text-6xl font-bold text-white/10 mb-4">{item.step}</div>
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 mb-6">
                      <div className="h-7 w-7 text-white">
                        <item.icon />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="features" className="container mx-auto px-4 py-32 relative">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-5xl md:text-6xl font-bold mb-6">Complete Security Suite</h2>
                <p className="text-xl text-gray-400">Everything you need to protect your blockchain operations</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {securityCards.map((card, i) => (
                  <div
                    key={i}
                    className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:scale-105 transition-transform duration-300"
                  >
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} mb-4`}
                    >
                      <div className="h-6 w-6 text-white">
                        <card.icon />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{card.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="container mx-auto px-4 py-32 relative">
            <div className="max-w-4xl mx-auto text-center space-y-8 p-16 rounded-3xl border border-white/10 bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm">
              <h2 className="text-5xl md:text-6xl font-bold">Ready to secure your Web3 assets?</h2>
              <p className="text-xl text-gray-400">
                Try ChainSentry now with our interactive demo. No signup required.
              </p>
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  className="h-14 px-12 text-lg bg-blue-600 hover:bg-blue-700 gap-3 hover:scale-105 transition-transform"
                >
                  Get Started
                  <div className="h-5 w-5">
                    <ArrowIcon />
                  </div>
                </Button>
              </Link>
            </div>
          </section>

          <footer className="border-t border-white/10 py-12">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 text-blue-500">
                    <ShieldIcon />
                  </div>
                  <span className="text-lg font-bold">ChainSentry</span>
                </div>
                <p className="text-sm text-gray-500">© 2025 ChainSentry. Halloween ChaincKathon 2025 Project.</p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  )
}
