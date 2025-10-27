"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Shield } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { signup } = useAuth()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const success = await signup(email, password, name)

    if (success) {
      toast.success("Account created successfully!")
      router.push("/dashboard")
    } else {
      toast.error("Email already exists")
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">ChainSentry</h1>
          <p className="mt-2 text-slate-400">Blockchain Security Platform</p>
        </div>

        <Card className="border-slate-800 bg-slate-900/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Create your account</CardTitle>
            <CardDescription className="text-slate-400">Get started with ChainSentry demo</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup}>
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-slate-200">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border-slate-700 bg-slate-800/50 text-white placeholder:text-slate-500"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-slate-200">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-slate-700 bg-slate-800/50 text-white placeholder:text-slate-500"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password" className="text-slate-200">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-slate-700 bg-slate-800/50 text-white"
                  />
                </div>
                <div className="rounded-lg bg-cyan-500/10 border border-cyan-500/20 p-3">
                  <p className="text-sm text-cyan-400">Demo Mode: Your data is stored locally in your browser</p>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Create account"}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm text-slate-400">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4">
                  Sign in
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
