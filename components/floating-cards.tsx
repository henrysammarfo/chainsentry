"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { Shield, Lock, Eye, AlertTriangle, Zap, Globe } from "lucide-react"
import { useRef } from "react"

const securityCards = [
  { icon: Shield, title: "Phishing Detection", color: "from-blue-500 to-cyan-500", delay: 0 },
  { icon: Lock, title: "Smart Contract Audit", color: "from-purple-500 to-pink-500", delay: 0.2 },
  { icon: Eye, title: "Threat Monitoring", color: "from-green-500 to-emerald-500", delay: 0.4 },
  { icon: AlertTriangle, title: "Incident Response", color: "from-orange-500 to-red-500", delay: 0.6 },
  { icon: Zap, title: "Real-time Alerts", color: "from-yellow-500 to-orange-500", delay: 0.8 },
  { icon: Globe, title: "Global Coverage", color: "from-indigo-500 to-purple-500", delay: 1 },
]

export function FloatingCards() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const y0 = useTransform(scrollYProgress, [0, 1], [100, -100])
  const y1 = useTransform(scrollYProgress, [0, 1], [150, -150])
  const y2 = useTransform(scrollYProgress, [0, 1], [200, -200])
  const y3 = useTransform(scrollYProgress, [0, 1], [250, -250])
  const y4 = useTransform(scrollYProgress, [0, 1], [300, -300])
  const y5 = useTransform(scrollYProgress, [0, 1], [350, -350])

  const rotateX = useTransform(scrollYProgress, [0, 1], [45, -45])
  const rotateY = useTransform(scrollYProgress, [0, 1], [-20, 20])

  const yOffsets = [y0, y1, y2, y3, y4, y5]

  return (
    <div ref={containerRef} className="relative h-[800px] w-full overflow-hidden">
      {securityCards.map((card, index) => {
        const Icon = card.icon

        return (
          <motion.div
            key={index}
            style={{
              y: yOffsets[index],
              rotateX,
              rotateY,
              position: "absolute",
              left: `${15 + (index % 3) * 30}%`,
              top: `${20 + Math.floor(index / 3) * 40}%`,
            }}
            initial={{ opacity: 0, scale: 0.5, rotateZ: -180 }}
            animate={{
              opacity: 1,
              scale: 1,
              rotateZ: 0,
              transition: {
                delay: card.delay,
                duration: 1,
                ease: "easeOut",
              },
            }}
            whileHover={{
              scale: 1.2,
              rotateZ: 360,
              transition: { duration: 0.6 },
            }}
            className="cursor-pointer"
          >
            <div
              className={`relative h-48 w-40 rounded-2xl bg-gradient-to-br ${card.color} p-6 shadow-2xl backdrop-blur-sm`}
              style={{
                transformStyle: "preserve-3d",
                transform: "translateZ(50px)",
              }}
            >
              <div className="flex h-full flex-col items-center justify-center text-white">
                <Icon className="mb-4 h-12 w-12" />
                <p className="text-center text-sm font-semibold">{card.title}</p>
              </div>
              <div
                className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"
                style={{ transform: "translateZ(25px)" }}
              />
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
