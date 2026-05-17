"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAppStore, SleepData } from "@/store/useAppStore"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Moon, Sunrise, Clock, AlertCircle } from "lucide-react"

export default function SleepTracker() {
  const { sleepGoal, addSleepData, sleepHistory } = useAppStore()
  
  const [bedtime, setBedtime] = useState("22:30")
  const [wakeTime, setWakeTime] = useState("06:30")
  const [saved, setSaved] = useState(false)

  const calculateDuration = (bed: string, wake: string) => {
    const [bedH, bedM] = bed.split(':').map(Number)
    const [wakeH, wakeM] = wake.split(':').map(Number)
    
    let hours = wakeH - bedH
    let mins = wakeM - bedM
    
    if (mins < 0) {
      hours -= 1
      mins += 60
    }
    if (hours < 0) {
      hours += 24
    }
    
    return hours + mins / 60
  }

  const handleSave = () => {
    const duration = calculateDuration(bedtime, wakeTime)
    
    // Perfect score calculation (perfect sleep duration is around 8 hours)
    const score = Math.max(0, 100 - Math.abs(8 - duration) * 15)
    const today = new Date().toISOString().split('T')[0]
    
    const data: SleepData = {
      date: today,
      bedtime,
      wakeTime,
      duration,
      score: Math.round(score)
    }

    addSleepData(data)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  } as const
  
  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 260, damping: 22 } }
  } as const

  const duration = calculateDuration(bedtime, wakeTime)
  const isGoalMet = duration >= 7 && duration <= 9

  return (
    <motion.div 
      className="p-6 pt-10 min-h-[calc(100vh-5rem)] flex flex-col space-y-6 pb-10 no-scrollbar"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Header section */}
      <motion.header variants={item} className="space-y-2 flex items-center space-x-4">
        <div className="p-3.5 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 shadow-lg shadow-indigo-500/5">
          <Moon className="w-7 h-7 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Sommeil</h1>
          <p className="text-sm text-muted-foreground">Objectif idéal : {sleepGoal}</p>
        </div>
      </motion.header>

      {/* Interactive Sleep Logger */}
      <motion.div variants={item} className="space-y-4">
        <Card className="p-5 space-y-5 bg-gradient-to-b from-card to-card/50 border-white/5 shadow-xl relative overflow-hidden">
          {/* Subtle light effect */}
          <div className="absolute -left-10 -bottom-10 w-24 h-24 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-4">
            <div className="flex justify-between items-center bg-secondary/30 p-3 rounded-2xl border border-white/5">
              <label className="text-xs font-bold uppercase tracking-wider flex items-center space-x-2 text-muted-foreground">
                <Moon className="w-4 h-4 text-indigo-400" />
                <span>Coucher</span>
              </label>
              <input 
                type="time" 
                value={bedtime}
                onChange={(e) => setBedtime(e.target.value)}
                className="bg-secondary/60 text-foreground px-4 py-2 font-mono font-bold rounded-xl border border-white/5 focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
            
            <div className="flex justify-between items-center bg-secondary/30 p-3 rounded-2xl border border-white/5">
              <label className="text-xs font-bold uppercase tracking-wider flex items-center space-x-2 text-muted-foreground">
                <Sunrise className="w-4 h-4 text-amber-400" />
                <span>Réveil</span>
              </label>
              <input 
                type="time" 
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                className="bg-secondary/60 text-foreground px-4 py-2 font-mono font-bold rounded-xl border border-white/5 focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
          </div>
          
          <div className="pt-4 border-t border-white/5 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <span className="text-lg font-black text-foreground">
                {Math.floor(duration)}h {Math.round((duration % 1) * 60)}m
              </span>
            </div>
            <div>
              {isGoalMet ? (
                <span className="text-xs font-bold px-2.5 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full">
                  Optimal
                </span>
              ) : (
                <span className="text-xs font-bold px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full">
                  Améliorable
                </span>
              )}
            </div>
          </div>
        </Card>

        {/* Prediction Tip card */}
        <Card className="p-4 border-white/5 bg-secondary/20 flex items-start space-x-3 text-xs leading-relaxed">
          <AlertCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-muted-foreground">
            {isGoalMet 
              ? "Un sommeil compris entre 7 et 9 heures optimise grandement votre jauge d'énergie et votre focus de la journée." 
              : "Attention : trop peu ou trop de sommeil peut dérégler votre vigilance et votre score global de discipline."}
          </p>
        </Card>

        <Button 
          className="w-full h-14 text-base rounded-2xl font-bold shadow-lg"
          onClick={handleSave}
          disabled={saved}
        >
          {saved ? "Enregistré !" : "Sauvegarder ma nuit"}
        </Button>
      </motion.div>

      {/* History log header */}
      {sleepHistory.length > 0 && (
        <motion.div variants={item} className="space-y-3">
          <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Dernières Nuits</h3>
          <div className="space-y-2">
            {sleepHistory.slice(-3).reverse().map((entry, index) => (
              <Card key={index} className="p-4 flex items-center justify-between border-white/5 bg-card/40 text-sm">
                <div className="flex items-center space-x-3">
                  <div className="p-1.5 bg-indigo-500/10 rounded-lg text-indigo-400 font-mono text-[10px] font-bold">
                    {new Date(entry.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                  </div>
                  <div>
                    <span className="font-bold text-foreground">{entry.duration.toFixed(1)} heures</span>
                    <p className="text-[10px] text-muted-foreground">{entry.bedtime} → {entry.wakeTime}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-primary">{entry.score}/100</span>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold">Sommeil</p>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
