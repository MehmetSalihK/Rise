"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAppStore } from "@/store/useAppStore"
import { Button } from "@/components/ui/Button"
import { Flame, CheckSquare, Zap, Target } from "lucide-react"
import Link from "next/link"

export default function Home() {
  const { habits, currentStreak, checkDailyStreakReset } = useAppStore()

  const [time, setTime] = useState<string>("")
  const [date, setDate] = useState<string>("")

  const completedCount = habits.filter(h => h.completed).length
  const totalCount = habits.length
  const isCompletedToday = completedCount === totalCount && totalCount > 0

  useEffect(() => {
    // Check for daily resets/losses on app open
    checkDailyStreakReset()

    const updateTime = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }))
      setDate(now.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [checkDailyStreakReset])

  return (
    <motion.div 
      animate={{
        // Visual discomfort bg vs visual reward bg
        backgroundColor: isCompletedToday ? "#0B1510" : "#170B0D"
      }}
      transition={{ duration: 0.8 }}
      className="p-6 pt-12 min-h-[calc(100vh-5rem)] flex flex-col justify-between no-scrollbar pb-10"
    >
      {/* Top Header Section */}
      <div className="space-y-4 text-center">
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground capitalize">
          {date}
        </span>
        
        <AnimatePresence mode="popLayout">
          <motion.h1 
            key={time}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="text-6xl font-black tracking-tighter text-foreground font-mono"
          >
            {time || "00:00"}
          </motion.h1>
        </AnimatePresence>
      </div>

      {/* Main Status / Psychological Pressure Display */}
      <div className="flex flex-col items-center justify-center space-y-6 my-auto py-10">
        <motion.div
          animate={{
            scale: isCompletedToday ? [1, 1.03, 1] : 1,
          }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className={`px-6 py-2.5 rounded-full border text-xs font-black tracking-widest uppercase flex items-center space-x-2 ${
            isCompletedToday 
              ? "bg-primary/10 border-primary/30 text-primary shadow-lg shadow-primary/10 animate-pulse" 
              : "bg-destructive/10 border-destructive/30 text-destructive shadow-lg shadow-destructive/10"
          }`}
        >
          <Zap className="w-4 h-4 shrink-0 fill-current" />
          <span>{isCompletedToday ? "COMPLÉTÉ" : "INCOMPLET"}</span>
        </motion.div>

        <div className="text-center space-y-2 max-w-xs">
          <h2 className="text-3xl font-black tracking-tight text-foreground">
            {isCompletedToday ? "Jour gagné." : "Journée incomplète."}
          </h2>
          <p className="text-sm font-medium text-muted-foreground leading-relaxed">
            {isCompletedToday 
              ? "Journée validée. Reste focus et continue sur ta lancée." 
              : "Tu n'as pas encore gagné ta journée."
            }
          </p>
        </div>

        {/* Streak Visual status */}
        <div className="flex items-center space-x-2 bg-card/60 backdrop-blur-xl border border-white/5 px-5 py-3 rounded-2xl">
          <Flame className={`w-5 h-5 ${isCompletedToday ? "text-primary animate-bounce" : "text-amber-500"}`} />
          <span className="text-sm font-black text-foreground font-mono">
            SÉRIE : {currentStreak} JOUR{currentStreak > 1 ? 'S' : ''}
          </span>
        </div>
      </div>

      {/* Single proeminent CTA Button */}
      <div className="space-y-4">
        <Link href="/morning" className="block w-full">
          <Button 
            className={`w-full h-14 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl transition-all ${
              isCompletedToday
                ? "bg-primary text-white hover:bg-primary/90 shadow-primary/20"
                : "bg-accent text-white hover:bg-accent/90 shadow-accent/20"
            }`}
          >
            {isCompletedToday 
              ? "Revoir ma routine" 
              : completedCount > 0 ? "Continuer la routine" : "Démarrer la routine"
            }
          </Button>
        </Link>
      </div>
    </motion.div>
  )
}
