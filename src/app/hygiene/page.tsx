"use client"

import { motion } from "framer-motion"
import { useAppStore } from "@/store/useAppStore"
import { AnimatedCheckbox } from "@/components/ui/AnimatedCheckbox"
import { Card } from "@/components/ui/Card"
import { Droplets, Sparkles } from "lucide-react"

export default function HygieneTracker() {
  const { hygieneHistory, updateHygiene } = useAppStore()
  const today = new Date().toISOString().split('T')[0]
  
  const todayData = hygieneHistory.find(h => h.date === today) || {
    date: today, morning: false, noon: false, night: false
  }

  // Calculate brushing completion rate
  const completedTodayCount = [todayData.morning, todayData.noon, todayData.night].filter(Boolean).length
  const completionPercent = Math.round((completedTodayCount / 3) * 100)

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  } as const
  
  const item = {
    hidden: { opacity: 0, scale: 0.98 },
    show: { opacity: 1, scale: 1, transition: { type: "spring" as const, stiffness: 260, damping: 22 } }
  } as const

  const times = [
    { id: 'morning', label: 'Matin 🌅' },
    { id: 'noon', label: 'Midi ☀️' },
    { id: 'night', label: 'Soir 🌙' }
  ] as const

  return (
    <motion.div 
      className="p-6 pt-10 min-h-[calc(100vh-5rem)] flex flex-col space-y-6 pb-10 no-scrollbar"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Header section */}
      <motion.header variants={item} className="space-y-2 flex items-center space-x-4">
        <div className="p-3.5 bg-blue-500/10 rounded-2xl border border-blue-500/20 shadow-lg shadow-blue-500/5">
          <Droplets className="w-7 h-7 text-blue-400" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Hygiène</h1>
          <p className="text-sm text-muted-foreground">Brossage des dents quotidien.</p>
        </div>
      </motion.header>

      {/* Main Checklist */}
      <motion.div variants={item} className="flex-1 space-y-6">
        <Card className="p-2 space-y-2 border-white/5 bg-card/60 backdrop-blur-xl shadow-xl">
          {times.map((t) => (
            <motion.div
              key={t.id}
              layout
              className="rounded-xl overflow-hidden"
            >
              <AnimatedCheckbox
                checked={todayData[t.id]}
                onChange={(checked) => updateHygiene(today, t.id, checked)}
                label={t.label}
              />
            </motion.div>
          ))}
        </Card>

        {/* Dynamic statistics panel */}
        <Card className="p-5 bg-gradient-to-b from-card to-card/50 border-white/5 shadow-xl relative overflow-hidden space-y-4">
          <div className="absolute -right-10 -bottom-10 w-24 h-24 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Progression d'aujourd'hui</h3>
            <span className="text-xs font-bold px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md">
              {completedTodayCount} / 3
            </span>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <span className="text-2xl font-black text-foreground">{completionPercent}%</span>
              <p className="text-[10px] text-muted-foreground mt-0.5">Taux de complétion</p>
            </div>
            {completionPercent === 100 && (
              <div className="flex items-center space-x-1.5 text-xs text-amber-500 font-bold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Routine Hygiène OK !</span>
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  )
}
