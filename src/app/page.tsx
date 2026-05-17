"use client"

import { useEffect, useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAppStore, getDisciplineLevel } from "@/store/useAppStore"
import { Card } from "@/components/ui/Card"
import { ProgressBar } from "@/components/ui/ProgressBar"
import { EnergyBar } from "@/components/ui/EnergyBar"
import { getGreeting, getDailyQuote } from "@/lib/motivation"
import { Flame, Target, CheckCircle2, ChevronRight, Moon, Cloud, Loader2, Zap, Eye, EyeOff, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function Home() {
  const { 
    userName, wakeGoal, currentStreak, habits, sleepHistory, 
    xp, userId, syncing, focusModeActive, setSettings 
  } = useAppStore()

  const [time, setTime] = useState<string>("")
  const [date, setDate] = useState<string>("")
  const [quote, setQuote] = useState({ text: "", author: "" })

  const completedHabits = habits.filter(h => h.completed).length
  const totalHabits = habits.length
  const progress = totalHabits === 0 ? 0 : (completedHabits / totalHabits) * 100

  // Latest sleep info
  const lastSleep = sleepHistory[sleepHistory.length - 1]

  // V3 Level information
  const { levelName, badge, nextLevelXp, percent } = getDisciplineLevel(xp || 0)

  useEffect(() => {
    // Generate daily quote
    setQuote(getDailyQuote())

    const updateTime = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }))
      setDate(now.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  // V4 Dynamic Risk Warnings
  const riskWarnings = useMemo(() => {
    const list = []
    const now = new Date()
    const hour = now.getHours()
    const minute = now.getMinutes()
    const [wakeH, wakeM] = wakeGoal.split(':').map(Number)
    
    // 1. Routine late (no actions completed 2h after wakeGoal)
    const isRoutineLate = completedHabits === 0 && (hour * 60 + minute) > (wakeH * 60 + wakeM + 120)
    if (isRoutineLate) {
      list.push("Routine en retard : Tu n'as pas encore validé tes premières habitudes ce matin.")
    }

    // 2. Streak in danger (streak active, habits incomplete, and it's past 18:00)
    const isStreakInDanger = currentStreak > 0 && completedHabits < totalHabits && hour >= 18
    if (isStreakInDanger) {
      list.push("Série en danger : Complète tes habitudes ce soir pour ne pas éteindre ta flamme !")
    }

    // 3. Sleep insufficient (< 6 hours logged today)
    const isSleepInsufficient = lastSleep ? lastSleep.duration < 6.0 : false
    if (isSleepInsufficient) {
      list.push(`Sommeil insuffisant : Seulement ${lastSleep?.duration.toFixed(1)}h dormies. Privilégie une sieste ou couche-toi plus tôt ce soir.`)
    }

    return list
  }, [wakeGoal, completedHabits, currentStreak, totalHabits, lastSleep])

  // Framer motion variants
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

  const toggleFocusMode = () => {
    setSettings({ focusModeActive: !focusModeActive })
  }

  const focusHabits = habits.slice(0, 3)

  return (
    <motion.div 
      className="p-6 pt-8 min-h-[calc(100vh-5rem)] flex flex-col space-y-6 no-scrollbar pb-12"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* V3 Header with Cloud Sync and Focus Toggler */}
      <motion.div variants={item} className="flex justify-between items-start">
        <div className="space-y-1">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground capitalize">{date}</h2>
          <div className="flex items-baseline space-x-3">
            <AnimatePresence mode="popLayout">
              <motion.h1 
                key={time}
                initial={{ y: -5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 5, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="text-5xl font-black tracking-tighter text-foreground font-mono"
              >
                {time || "00:00"}
              </motion.h1>
            </AnimatePresence>

            {/* Cloud Connected Indicator */}
            {userId && (
              <span className="flex items-center text-green-400 text-xs font-bold bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
                {syncing ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                ) : (
                  <Cloud className="w-3.5 h-3.5 mr-1" />
                )}
                <span>Cloud</span>
              </span>
            )}
          </div>
        </div>

        {/* Focus Mode Switch Button */}
        <button
          onClick={toggleFocusMode}
          className={`p-2.5 rounded-xl border transition-all duration-300 ${
            focusModeActive 
              ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20" 
              : "bg-secondary/40 border-white/5 text-muted-foreground hover:text-foreground"
          }`}
          title={focusModeActive ? "Quitter le mode Focus" : "Activer le mode Focus"}
        >
          {focusModeActive ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </motion.div>

      {/* Focus Mode UI (Ultra Minimal View) */}
      <AnimatePresence mode="wait">
        {focusModeActive ? (
          <motion.div
            key="focus"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="flex-1 flex flex-col justify-center space-y-8 py-10"
          >
            <div className="text-center space-y-2">
              <span className="text-sm font-bold text-primary uppercase tracking-widest flex items-center justify-center space-x-1.5">
                <Zap className="w-4 h-4 text-primary fill-primary animate-pulse" />
                <span>Mode Focus Actif</span>
              </span>
              <h2 className="text-3xl font-black text-foreground">Objectif du Matin</h2>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                Pas de distractions. Cochez vos 3 actions prioritaires pour aujourd'hui.
              </p>
            </div>

            <Card className="p-3 space-y-2.5 border-white/5 bg-card/40 backdrop-blur-xl shadow-2xl">
              {focusHabits.map((habit) => (
                <div key={habit.id} className="p-3 bg-secondary/30 rounded-xl flex items-center justify-between border border-transparent hover:border-white/5">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => useAppStore.getState().toggleHabit(habit.id)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        habit.completed 
                          ? "bg-primary border-primary text-primary-foreground" 
                          : "border-muted-foreground/60 bg-transparent"
                      }`}
                    >
                      {habit.completed && <CheckCircle2 className="w-4 h-4 text-white fill-white" />}
                    </button>
                    <span className={`text-sm font-bold ${habit.completed ? "line-through text-muted-foreground opacity-60" : "text-foreground"}`}>
                      {habit.name}
                    </span>
                  </div>
                  {habit.completed && (
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded-md">
                      +10 XP
                    </span>
                  )}
                </div>
              ))}
            </Card>

            <button
              onClick={toggleFocusMode}
              className="py-3 bg-secondary/50 hover:bg-secondary/70 border border-white/5 text-xs font-bold text-muted-foreground hover:text-foreground rounded-xl transition-colors"
            >
              Retour au tableau de bord complet
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Gamification Level Status Bar */}
            <motion.div variants={item}>
              <Card className="p-4 border-white/5 bg-card/50 backdrop-blur-xl relative overflow-hidden shadow-xl">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{badge}</span>
                    <div>
                      <h4 className="text-sm font-black text-foreground">{levelName}</h4>
                      <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">Niveau discipline</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-primary bg-primary/10 px-2 py-0.5 rounded-lg border border-primary/20">
                    {xp || 0} XP
                  </span>
                </div>
                <ProgressBar progress={percent} className="h-1.5 mb-1" />
                <div className="flex justify-between text-[9px] text-muted-foreground font-semibold">
                  <span>Progression</span>
                  {nextLevelXp < 9999 ? <span>Vers le grade suivant</span> : <span>Grade Max</span>}
                </div>
              </Card>
            </motion.div>

            {/* V4 Risk Warnings Alerts Card */}
            {riskWarnings.length > 0 && (
              <motion.div variants={item}>
                <Card className="p-4 border-rose-500/20 bg-rose-500/[0.03] shadow-md relative overflow-hidden space-y-3">
                  <div className="flex items-center space-x-2 text-rose-400">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <h4 className="text-xs font-black uppercase tracking-wider">Alerte & Risque</h4>
                  </div>
                  <ul className="space-y-2 text-xs text-muted-foreground list-disc list-inside font-semibold leading-relaxed">
                    {riskWarnings.map((warning, i) => (
                      <li key={i}>{warning}</li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            )}

            {/* Greeting */}
            <motion.p variants={item} className="text-lg font-bold text-foreground/90 pt-1">
              {getGreeting(userName)}
            </motion.p>

            {/* Energy Level Widget */}
            <motion.div variants={item}>
              <EnergyBar />
            </motion.div>

            {/* Primary Goal Widgets */}
            <motion.div variants={item} className="grid grid-cols-2 gap-4">
              <Card className="p-4 flex flex-col justify-between h-32 relative overflow-hidden bg-gradient-to-b from-card to-card/40 border-white/5">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Target className="text-primary w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Réveil</span>
                </div>
                <div>
                  <span className="text-2xl font-black text-foreground">{wakeGoal}</span>
                  <p className="text-[9px] text-muted-foreground mt-0.5">Objectif Quotidien</p>
                </div>
              </Card>
              
              <Card className="p-4 flex flex-col justify-between h-32 relative overflow-hidden bg-gradient-to-b from-card to-card/40 border-white/5 shadow-xl">
                {currentStreak > 0 && (
                  <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none animate-pulse" />
                )}
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-amber-500/10 rounded-lg">
                    <Flame className="text-amber-500 w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Streak</span>
                </div>
                <div>
                  <div className="flex items-center space-x-1">
                    <span className="text-2xl font-black text-foreground">{currentStreak}</span>
                    {currentStreak > 0 && <span className="text-lg">🔥</span>}
                  </div>
                  <p className="text-[9px] text-muted-foreground mt-0.5">Jours consécutifs</p>
                </div>
              </Card>
            </motion.div>

            {/* Sleep Status summary */}
            <motion.div variants={item}>
              <Link href="/sleep">
                <Card className="p-4 hover:bg-secondary/40 transition-colors flex items-center justify-between border-white/5 bg-card/40">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-indigo-500/10 rounded-lg">
                      <Moon className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">Dernier sommeil</h4>
                      <p className="text-xs text-muted-foreground">
                        {lastSleep ? `${lastSleep.duration.toFixed(1)}h dormies (${lastSleep.score}/100)` : "Aucune donnée enregistrée"}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </Card>
              </Link>
            </motion.div>

            {/* Routine Progress Widget */}
            <motion.div variants={item}>
              <Link href="/morning">
                <Card className="p-5 space-y-4 hover:bg-secondary/40 transition-all border-white/5 bg-card/40">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-base flex items-center space-x-2 text-foreground">
                      <CheckCircle2 className="text-primary w-5 h-5" />
                      <span>Routine Matinale</span>
                    </h3>
                    <span className="text-xs font-semibold px-2 py-1 bg-secondary rounded-lg text-muted-foreground">
                      {completedHabits} / {totalHabits}
                    </span>
                  </div>
                  
                  <ProgressBar progress={progress} className="h-2.5" />
                  
                  {progress === 100 ? (
                    <p className="text-center text-xs font-bold text-primary">
                      Routine complétée ! Excellente discipline. ✨🏆
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground flex justify-between items-center">
                      <span>Reste {totalHabits - completedHabits} tâche{totalHabits - completedHabits > 1 ? 's' : ''}</span>
                      <span className="text-primary flex items-center font-bold">Compléter <ChevronRight className="w-3 h-3 ml-0.5" /></span>
                    </p>
                  )}
                </Card>
              </Link>
            </motion.div>

            {/* Motivation Quote */}
            <motion.div variants={item} className="bg-secondary/20 p-5 rounded-2xl border border-white/[0.03] space-y-2">
              <p className="text-sm text-foreground/80 leading-relaxed italic font-medium">
                "{quote.text}"
              </p>
              <p className="text-right text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                — {quote.author}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
