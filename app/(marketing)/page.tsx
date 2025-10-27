import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Search, Activity, AlertTriangle, BarChart3, Lock, CheckCircle2, Zap, ArrowRight } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">CryptoGuardian</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">
                Log In
              </Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button size="sm">Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container py-24 md:py-32 lg:py-40">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 text-center">
            <Badge variant="secondary" className="px-4 py-1.5">
              Trusted by 500+ Web3 Projects
            </Badge>
            <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Enterprise-Grade Security for Web3
            </h1>
            <p className="text-pretty max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Protect your blockchain assets with AI-powered threat detection, smart contract auditing, and real-time
              monitoring. Trusted by leading DeFi protocols.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth/sign-up">
                <Button size="lg" className="gap-2">
                  Start Free Trial
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button size="lg" variant="outline">
                  Watch Demo
                </Button>
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-primary">99.9%</div>
                <div className="text-sm text-muted-foreground">Threat Detection</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">$2B+</div>
                <div className="text-sm text-muted-foreground">Assets Protected</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">Monitoring</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="border-t bg-muted/50 py-24">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Complete Security Suite</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Everything you need to secure your blockchain infrastructure
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <Search className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Threat Detection</CardTitle>
                  <CardDescription>AI-powered phishing detection and malicious contract identification</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      URL & Domain Analysis
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      Machine Learning Detection
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      Real-time Threat Intelligence
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Shield className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Smart Contract Audits</CardTitle>
                  <CardDescription>Comprehensive vulnerability scanning for Solidity contracts</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      Automated Code Analysis
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      Security Score Reports
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      Best Practice Recommendations
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Activity className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Real-Time Monitoring</CardTitle>
                  <CardDescription>24/7 blockchain activity monitoring and alerting</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      Transaction Monitoring
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      Instant Alerts
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      Multi-Chain Support
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <AlertTriangle className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Incident Response</CardTitle>
                  <CardDescription>Rapid response and case management for security events</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      Automated Workflows
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      Case Tracking
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      Team Collaboration
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <BarChart3 className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Analytics & Reports</CardTitle>
                  <CardDescription>Comprehensive security metrics and compliance reporting</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      Custom Dashboards
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      Exportable Reports
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      Compliance Tracking
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Lock className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>API Integrations</CardTitle>
                  <CardDescription>Connect with leading blockchain security providers</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      Chainalysis Integration
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      Etherscan API
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      Custom Webhooks
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-24">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How It Works</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Get started in minutes with our simple three-step process
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4">
                    1
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
                  <p className="text-muted-foreground">
                    Sign up and connect your blockchain wallets and smart contracts for monitoring
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4">
                    2
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Configure Alerts</h3>
                  <p className="text-muted-foreground">
                    Set up custom security rules and notification preferences for your team
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4">
                    3
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Stay Protected</h3>
                  <p className="text-muted-foreground">
                    Receive real-time alerts and comprehensive security reports 24/7
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="border-t bg-muted/50 py-24">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Simple, Transparent Pricing</h2>
              <p className="mt-4 text-lg text-muted-foreground">Choose the plan that fits your security needs</p>
            </div>
            <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Starter</CardTitle>
                  <CardDescription>For individual developers</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">$49</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      <span className="text-sm">5 Smart Contract Audits/month</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      <span className="text-sm">Basic Threat Detection</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      <span className="text-sm">Email Alerts</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      <span className="text-sm">Community Support</span>
                    </li>
                  </ul>
                  <Link href="/auth/sign-up">
                    <Button className="w-full bg-transparent" variant="outline">
                      Get Started
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-primary shadow-lg">
                <CardHeader>
                  <Badge className="w-fit mb-2">Most Popular</Badge>
                  <CardTitle>Professional</CardTitle>
                  <CardDescription>For growing teams</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">$199</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      <span className="text-sm">Unlimited Audits</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      <span className="text-sm">Advanced AI Detection</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      <span className="text-sm">Real-time Monitoring</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      <span className="text-sm">Priority Support</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      <span className="text-sm">API Access</span>
                    </li>
                  </ul>
                  <Link href="/auth/sign-up">
                    <Button className="w-full">Get Started</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Enterprise</CardTitle>
                  <CardDescription>For large organizations</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">Custom</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      <span className="text-sm">Everything in Professional</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      <span className="text-sm">Dedicated Account Manager</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      <span className="text-sm">Custom Integrations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      <span className="text-sm">SLA Guarantee</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      <span className="text-sm">On-premise Deployment</span>
                    </li>
                  </ul>
                  <Button className="w-full bg-transparent" variant="outline">
                    Contact Sales
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="container">
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="flex flex-col items-center gap-6 p-12 text-center">
                <Zap className="h-12 w-12" />
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Ready to Secure Your Web3 Infrastructure?
                </h2>
                <p className="max-w-2xl text-lg text-primary-foreground/90">
                  Join hundreds of projects protecting billions in blockchain assets with CryptoGuardian
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/auth/sign-up">
                    <Button size="lg" variant="secondary" className="gap-2">
                      Start Free Trial
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
                  >
                    Schedule Demo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-primary" />
                <span className="font-bold">CryptoGuardian</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Enterprise-grade blockchain security platform trusted by leading Web3 projects.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#features" className="hover:text-foreground">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-foreground">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    API
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2025 CryptoGuardian. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
