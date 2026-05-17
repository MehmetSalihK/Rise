"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAppStore } from "@/store/useAppStore"
import { AnimatedCheckbox } from "@/components/ui/AnimatedCheckbox"
import { Card } from "@/components/ui/Card"
import { ProgressBar } from "@/components/ui/ProgressBar"
import { getPositiveFeedback } from "@/lib/motivation"
import { Sun, CheckCircle, Award } from "lucide-react"

export default function MorningRoutine() {
  const { habits, toggleHabit, currentStreak } = useAppStore()
  const [celebrated, setCelebrated] = useState(false)

  const completedHabits = habits.filter(h => h.completed).length
  const totalHabits = habits.length
  const progress = totalHabits === 0 ? 0 : (completedHabits / totalHabits) * 100

  // Trigger celebration popup when complete
  const handleToggle = (id: string) => {
    toggleHabit(id)
    const isNowAllCompleted = habits.map(h => h.id === id ? { ...h, completed: !h.completed } : h).every(h => h.completed)
    if (isNowAllCompleted) {
      setCelebrated(true)
    } else {
      setCelebrated(false)
    }
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  } as const
  
  const item = {
    hidden: { opacity: 0, x: -15 },
    show: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 260, damping: 22 } }
  } as const

  return (
    <motion.div 
      className="p-6 pt-10 min-h-[calc(100vh-5rem)] flex flex-col space-y-6 pb-10"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Header section */}
      <motion.header variants={item} className="space-y-2 flex items-center space-x-4">
        <div className="p-3.5 bg-primary/10 rounded-2xl border border-primary/20 shadow-lg shadow-primary/5">
          <Sun className="w-7 h-7 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Routine</h1>
          <p className="text-sm text-muted-foreground">Construis tes fondations.</p>
        </div>
      </motion.header>

      {/* Progress Card */}
      <motion.div variants={item}>
        <Card className="p-5 space-y-4 bg-gradient-to-b from-card to-card/50 border-white/5 shadow-xl">
          <div className="flex justify-between items-center text-sm font-semibold">
            <span className="text-muted-foreground">Progression</span>
            <span className="text-primary bg-primary/10 px-2 py-0.5 rounded-lg text-xs font-bold">
              {completedHabits} / {totalHabits}
            </span>
          </div>
          <ProgressBar progress={progress} className="h-2" />
          <p className="text-xs text-muted-foreground italic">
            {getPositiveFeedback(completedHabits, totalHabits)}
          </p>
        </Card>
      </motion.div>

      {/* Habits Checklist */}
      <motion.div variants={item} className="flex-1">
        <Card className="p-2 space-y-2 border-white/5 bg-card/60 backdrop-blur-xl shadow-xl">
          <AnimatePresence mode="popLayout">
            {habits.map((habit) => (
              <motion.div
                key={habit.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <AnimatedCheckbox
                  checked={habit.completed}
                  onChange={() => handleToggle(habit.id)}
                  label={habit.name}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </Card>
      </motion.div>

      {/* Celebration Alert Modal */}
      <AnimatePresence>
        {celebrated && progress === 100 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md"
            onClick={() => setCelebrated(false)}
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              exit={{ y: 20 }}
              className="bg-card border border-white/10 p-6 rounded-3xl max-w-sm w-full text-center space-y-6 shadow-2xl relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Decorative light reflection */}
              <div className="absolute -right-20 -top-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
              
              <div className="flex justify-center">
                <div className="p-4 bg-primary/10 rounded-full border border-primary/20 relative">
                  <Award className="w-12 h-12 text-primary animate-bounce" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-foreground">Félicitations ! 🎉</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Tu as complété l'ensemble de ta routine matinale avec brio aujourd'hui. Ton esprit est paré pour la journée.
                </p>
              </div>

              {currentStreak > 0 && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center space-x-2">
                  <span className="text-sm font-bold text-amber-500">Streak actuel :</span>
                  <span className="text-base font-black text-amber-500">{currentStreak} 🔥</span>
                </div>
              )}

              <button
                onClick={() => setCelebrated(false)}
                className="w-full py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-lg transition-colors focus:outline-none"
              >
                C'est parti !
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
