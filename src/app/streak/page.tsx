"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { useAppStore } from "@/store/useAppStore"
import { Card } from "@/components/ui/Card"
import { Flame, ShieldAlert, Award, Calendar } from "lucide-react"

export default function StreakScreen() {
  const { currentStreak, bestStreak, streakHistory, habits, history } = useAppStore()

  const completedCount = habits.filter(h => h.completed).length
  const isCompletedToday = completedCount === habits.length && habits.length > 0

  // 1. Determine Streak dynamic text/color state
  const getStreakStatus = () => {
    if (currentStreak === 0) {
      return {
        label: "Tu as cassé la chaîne",
        colorClass: "text-muted-foreground",
        bgClass: "bg-secondary/40 border-white/5",
        icon: <ShieldAlert className="w-6 h-6 text-muted-foreground" />
      };
    }
    
    if (!isCompletedToday) {
      return {
        label: "Ton streak est en danger !",
        colorClass: "text-destructive animate-pulse",
        bgClass: "bg-destructive/10 border-destructive/25",
        icon: <Flame className="w-6 h-6 text-destructive animate-bounce" />
      };
    }

    return {
      label: "Tu construis une discipline solide",
      colorClass: "text-primary",
      bgClass: "bg-primary/10 border-primary/25",
      icon: <Award className="w-6 h-6 text-primary" />
    };
  }

  const status = getStreakStatus()

  // 2. Generate past 28 days for visual history grid (4 weeks)
  const historyDays = useMemo(() => {
    const list = []
    const today = new Date()
    for (let i = 27; i >= 0; i--) {
      const d = new Date()
      d.setDate(today.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      list.push({
        dateStr,
        label: d.getDate(),
        dayOfWeek: d.toLocaleDateString('fr-FR', { weekday: 'short' }),
        isFuture: d > today,
        isToday: dateStr === today.toISOString().split('T')[0]
      })
    }
    return list
  }, [])

  // Helper to resolve day status colors
  const getDayStatusColor = (day: { dateStr: string; isFuture: boolean; isToday: boolean }) => {
    const todayStr = new Date().toISOString().split('T')[0]
    
    if (day.isFuture) return "bg-[#1E2530] border-transparent text-[#3A4A5E]"; // ⚪ Future (subtle gray)
    
    // Check if recorded as complete
    const isCompleted = streakHistory.includes(day.dateStr) || history[day.dateStr]?.completed === true
    
    if (isCompleted) {
      return "bg-primary/30 border border-primary text-primary font-bold shadow-lg shadow-primary/5"; // 🟢 Complete
    }

    if (day.isToday) {
      return "bg-accent/25 border border-accent/60 text-accent font-bold animate-pulse"; // Today neutral waiting
    }

    return "bg-destructive/30 border border-destructive text-destructive font-bold"; // 🔴 Missed day
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
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  } as const

  return (
    <motion.div 
      className="p-6 pt-12 min-h-[calc(100vh-5rem)] flex flex-col justify-between no-scrollbar pb-10"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <div className="space-y-6">
        {/* Header */}
        <motion.header variants={item} className="space-y-1 text-center">
          <h1 className="text-3xl font-black tracking-tight text-foreground">Discipline</h1>
          <p className="text-xs text-muted-foreground">Créer de la pression psychologique positive.</p>
        </motion.header>

        {/* Center Massive Streak Indicator */}
        <motion.div variants={item} className="flex flex-col items-center justify-center py-6 text-center space-y-4">
          <motion.div
            animate={{
              scale: currentStreak > 0 && isCompletedToday ? [1, 1.05, 1] : 1,
            }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            className={`w-32 h-32 rounded-full border flex items-center justify-center shrink-0 ${
              currentStreak === 0 
                ? "bg-secondary/20 border-white/5" 
                : isCompletedToday ? "bg-primary/5 border-primary/20 shadow-2xl shadow-primary/5" : "bg-destructive/5 border-destructive/20 animate-pulse"
            }`}
          >
            <Flame className={`w-16 h-16 ${
              currentStreak === 0 
                ? "text-muted-foreground opacity-50" 
                : isCompletedToday ? "text-primary fill-primary" : "text-destructive"
            }`} />
          </motion.div>

          <div className="space-y-1">
            <h2 className="text-5xl font-black tracking-tighter text-foreground font-mono">
              🔥 {currentStreak} JOUR{currentStreak > 1 ? 'S' : ''}
            </h2>
            <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              Record Personnel : {bestStreak} jours
            </p>
          </div>
        </motion.div>

        {/* Dynamic Streak warning / encouragement message */}
        <motion.div variants={item}>
          <div className={`p-4 rounded-2xl border text-center flex items-center justify-center space-x-2.5 ${status.bgClass}`}>
            {status.icon}
            <span className={`text-xs font-black uppercase tracking-wider ${status.colorClass}`}>
              {status.label}
            </span>
          </div>
        </motion.div>

        {/* Hard Discipline Visual Pastilles Calendar */}
        <motion.div variants={item}>
          <Card className="p-5 bg-card border-white/5 space-y-4 shadow-xl">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span>Chaîne de Discipline</span>
              </h3>
              <span className="text-[10px] font-black text-muted-foreground">28 Derniers Jours</span>
            </div>

            <div className="grid grid-cols-7 gap-2 pt-1">
              {historyDays.map((day) => (
                <div
                  key={day.dateStr}
                  className={`h-9 w-full rounded-xl flex flex-col items-center justify-center text-xs transition-all duration-200 ${getDayStatusColor(day)}`}
                >
                  <span className="text-[7px] uppercase tracking-tighter opacity-50 font-bold">{day.dayOfWeek.slice(0, 3)}</span>
                  <span className="font-bold mt-0.5">{day.label}</span>
                </div>
              ))}
            </div>

            {/* Calendar legend */}
            <div className="flex items-center justify-center space-x-4 pt-1 text-[9px] uppercase tracking-wider font-bold text-muted-foreground">
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-primary/30 border border-primary" />
                <span>Réussi</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-destructive/30 border border-destructive" />
                <span>Manqué</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1E2530]" />
                <span>Futur</span>
              </span>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
