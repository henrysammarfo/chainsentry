"use client"

import { Card } from "@/components/ui/card"
import { ArrowRight, Database, Brain, Shield, CheckCircle2 } from "lucide-react"

export function MLPipelineVisualization() {
  const stages = [
    {
      icon: Database,
      title: "Data Collection",
      description: "URL & DOM extraction",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Brain,
      title: "Feature Extraction",
      description: "Hyperlink, URL, textual analysis",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Shield,
      title: "ML Classification",
      description: "Random Forest, Neural Network",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: CheckCircle2,
      title: "Detection",
      description: "Legitimate vs Phishing",
      color: "from-green-500 to-emerald-500",
    },
  ]

  return (
    <Card className="border-slate-800 bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur">
      <div className="p-6">
        <h3 className="mb-6 text-lg font-semibold text-white">ML Detection Pipeline</h3>
        <div className="flex items-center justify-between">
          {stages.map((stage, index) => (
            <div key={index} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`mb-3 rounded-xl bg-gradient-to-br ${stage.color} p-4 shadow-lg`}>
                  <stage.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-center">
                  <div className="mb-1 text-sm font-semibold text-white">{stage.title}</div>
                  <div className="text-xs text-slate-400">{stage.description}</div>
                </div>
              </div>
              {index < stages.length - 1 && <ArrowRight className="mx-4 h-5 w-5 text-slate-600" />}
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
