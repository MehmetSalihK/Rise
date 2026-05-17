"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useAppStore } from "@/store/useAppStore"
import { DisciplineCard } from "@/components/DisciplineCard"
import { ProgressBar } from "@/components/ui/ProgressBar"
import { Target, CheckCircle2, ChevronLeft, ShieldAlert } from "lucide-react"
import Link from "next/link"

export default function MorningRoutine() {
  const { habits, toggleHabit } = useAppStore()

  const completedCount = habits.filter(h => h.completed).length
  const totalCount = habits.length
  const progressPercent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100)
  const isFinished = progressPercent === 100

  // Dynamic progression motivation copy
  const getProgressLabel = () => {
    if (progressPercent === 100) return "Tu as gagné ta journée. 🏆";
    if (progressPercent >= 80) return "Dernière ligne droite ! 🔥";
    if (progressPercent >= 40) return `Tu es à ${progressPercent}%`;
    return "Tu avances, continue ⚡️";
  }

  // Framer motion variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.06 }
    }
  } as const
  
  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  } as const

  return (
    <motion.div 
      className="p-6 pt-12 min-h-[calc(100vh-5rem)] flex flex-col justify-between no-scrollbar pb-10"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <div className="space-y-6">
        {/* Navigation / Header */}
        <motion.header variants={item} className="flex justify-between items-center">
          <Link href="/" className="p-2 bg-card hover:bg-secondary rounded-xl border border-white/5 text-muted-foreground hover:text-foreground transition-all">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
            Mode Hard Focus
          </span>
          <div className="w-9 h-9" /> {/* Spacer */}
        </motion.header>

        {/* Title & Static Description */}
        <motion.div variants={item} className="space-y-1 text-center">
          <h1 className="text-3xl font-black tracking-tight text-foreground">Ma Routine</h1>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto">
            Pas de distraction. Exécute chaque tâche avec discipline.
          </p>
        </motion.div>

        {/* Focus Progression Meter */}
        <motion.div variants={item} className="space-y-2">
          <div className="flex justify-between items-center text-xs font-black uppercase tracking-wider">
            <span className={isFinished ? "text-primary" : "text-accent animate-pulse"}>
              {getProgressLabel()}
            </span>
            <span className="text-muted-foreground font-mono">
              {completedCount} / {totalCount}
            </span>
          </div>
          <ProgressBar progress={progressPercent} className="h-3 shadow-sm" />
        </motion.div>

        {/* Interactive 5 checklist items list */}
        <motion.div variants={item} className="space-y-3 pt-2">
          {habits.map((habit) => (
            <DisciplineCard
              key={habit.id}
              name={habit.name}
              completed={habit.completed}
              onToggle={() => toggleHabit(habit.id)}
            />
          ))}
        </motion.div>
      </div>

      {/* Persistent Fail/Success State Banners (Psychological pressure) */}
      <motion.div variants={item} className="pt-6">
        <AnimatePresence mode="wait">
          {isFinished ? (
            <motion.div
              key="finished"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="p-4 rounded-2xl bg-primary/10 border border-primary/20 text-center flex items-center justify-center space-x-2.5 text-primary"
            >
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span className="text-xs font-black uppercase tracking-widest">Tu as gagné aujourd'hui !</span>
            </motion.div>
          ) : (
            <motion.div
              key="unfinished"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="p-4 rounded-2xl bg-destructive/5 border border-destructive/15 text-center flex items-center justify-center space-x-2.5 text-destructive"
            >
              <ShieldAlert className="w-5 h-5 shrink-0 animate-pulse" />
              <span className="text-xs font-black uppercase tracking-widest">Tu as quitté sans terminer.</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
