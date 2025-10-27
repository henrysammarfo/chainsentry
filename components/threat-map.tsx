"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"

interface ThreatLocation {
  lat: number
  lng: number
  severity: "critical" | "high" | "medium" | "low"
  type: string
  count: number
}

export function ThreatMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [threats] = useState<ThreatLocation[]>([
    { lat: 40.7128, lng: -74.006, severity: "critical", type: "Phishing", count: 45 },
    { lat: 51.5074, lng: -0.1278, severity: "high", type: "Malware", count: 32 },
    { lat: 35.6762, lng: 139.6503, severity: "medium", type: "DDoS", count: 18 },
    { lat: -33.8688, lng: 151.2093, severity: "high", type: "Ransomware", count: 27 },
    { lat: 1.3521, lng: 103.8198, severity: "critical", type: "Zero-day", count: 52 },
    { lat: 55.7558, lng: 37.6173, severity: "medium", type: "Exploit", count: 21 },
    { lat: 37.7749, lng: -122.4194, severity: "high", type: "Phishing", count: 38 },
  ])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // Clear canvas
    ctx.fillStyle = "#0a0f1e"
    ctx.fillRect(0, 0, width, height)

    // Draw world map outline (simplified)
    ctx.strokeStyle = "#1e293b"
    ctx.lineWidth = 1
    ctx.beginPath()
    // Simplified continents outline
    ctx.moveTo(100, 150)
    ctx.lineTo(200, 140)
    ctx.lineTo(300, 160)
    ctx.lineTo(400, 150)
    ctx.stroke()

    // Draw threat locations
    threats.forEach((threat) => {
      const x = ((threat.lng + 180) / 360) * width
      const y = ((90 - threat.lat) / 180) * height

      // Pulsing glow effect
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, 30)

      const colors = {
        critical: ["rgba(239, 68, 68, 0.8)", "rgba(239, 68, 68, 0)"],
        high: ["rgba(251, 146, 60, 0.8)", "rgba(251, 146, 60, 0)"],
        medium: ["rgba(234, 179, 8, 0.8)", "rgba(234, 179, 8, 0)"],
        low: ["rgba(34, 197, 94, 0.8)", "rgba(34, 197, 94, 0)"],
      }

      gradient.addColorStop(0, colors[threat.severity][0])
      gradient.addColorStop(1, colors[threat.severity][1])

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(x, y, 20, 0, Math.PI * 2)
      ctx.fill()

      // Draw node
      ctx.fillStyle = colors[threat.severity][0]
      ctx.beginPath()
      ctx.arc(x, y, 5, 0, Math.PI * 2)
      ctx.fill()
    })
  }, [threats])

  return (
    <Card className="relative overflow-hidden border-slate-800 bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur">
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Global Threat Map</h3>
          <div className="flex gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-red-500" />
              <span className="text-slate-400">Critical</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-orange-500" />
              <span className="text-slate-400">High</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-yellow-500" />
              <span className="text-slate-400">Medium</span>
            </div>
          </div>
        </div>
        <canvas ref={canvasRef} width={800} height={400} className="w-full rounded-lg" />
      </div>
    </Card>
  )
}
