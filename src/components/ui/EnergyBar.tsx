"use client"

import { useAppStore, getEnergyScore } from "@/store/useAppStore"
import { Card } from "./Card"
import { motion } from "framer-motion"
import { Zap } from "lucide-react"

export function EnergyBar() {
  const store = useAppStore()
  const { score, emoji, label, colorClass } = getEnergyScore({
    sleepHistory: store.sleepHistory,
    habits: store.habits,
    currentStreak: store.currentStreak
  })

  return (
    <Card className="relative overflow-hidden p-5 border border-white/5 bg-card/60 backdrop-blur-xl shadow-xl transition-all duration-300">
      {/* Background radial soft light */}
      <div className="absolute -right-16 -top-16 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-primary/10 rounded-xl">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-base">Jauge d'Énergie</h3>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        </div>
        <motion.span 
          key={emoji}
          initial={{ scale: 0.5, rotate: -20, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
          className="text-3xl filter drop-shadow-md"
        >
          {emoji}
        </motion.span>
      </div>

      <div className="relative pt-2">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="text-xs font-semibold inline-block py-1 px-2.5 uppercase rounded-full bg-primary/10 text-primary">
              Vitalité
            </span>
          </div>
          <div className="text-right">
            <span className="text-sm font-bold text-foreground">
              {score}%
            </span>
          </div>
        </div>
        
        {/* Animated Bar with elegant CSS gradients */}
        <div className="overflow-hidden h-3 text-xs flex rounded-full bg-secondary border border-white/5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`shadow-lg flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r ${colorClass} rounded-full`}
          />
        </div>
      </div>
    </Card>
  )
}
