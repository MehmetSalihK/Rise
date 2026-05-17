"use client"

import { useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAppStore, DailyHistoryEntry } from "@/store/useAppStore"
import { Card } from "@/components/ui/Card"
import { BarChart2, Star, TrendingUp, Calendar as CalendarIcon, Moon, Clock, Flame, X, Info } from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts"

export default function Stats() {
  const { sleepHistory, hygieneHistory, history, wakeGoal } = useAppStore()
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  // Dynamic Sleep Metrics
  const sleepStats = useMemo(() => {
    if (sleepHistory.length === 0) {
      return [
        { name: "Lun", duration: 7.2 },
        { name: "Mar", duration: 6.5 },
        { name: "Mer", duration: 8.1 },
        { name: "Jeu", duration: 7.8 },
        { name: "Ven", duration: 6.2 },
        { name: "Sam", duration: 9.0 },
        { name: "Dim", duration: 8.5 },
      ]
    }
    
    return sleepHistory.slice(-7).map(entry => {
      const date = new Date(entry.date)
      return {
        name: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
        duration: Number(entry.duration.toFixed(1))
      }
    })
  }, [sleepHistory])

  // Average Sleep Duration
  const averageSleep = useMemo(() => {
    if (sleepHistory.length === 0) return 7.6;
    const sum = sleepHistory.reduce((acc, curr) => acc + curr.duration, 0)
    return Number((sum / sleepHistory.length).toFixed(1))
  }, [sleepHistory])

  // Brushing Habit Score
  const hygieneBrushingRate = useMemo(() => {
    if (hygieneHistory.length === 0) return 85;
    const totalSlots = hygieneHistory.length * 3;
    let completedSlots = 0;
    hygieneHistory.forEach(day => {
      if (day.morning) completedSlots++;
      if (day.noon) completedSlots++;
      if (day.night) completedSlots++;
    });
    return Math.round((completedSlots / totalSlots) * 100);
  }, [hygieneHistory])

  // Generate visual pastilles grid representing last 28 days
  const calendarDays = useMemo(() => {
    const list = []
    const today = new Date()
    for (let i = 27; i >= 0; i--) {
      const d = new Date()
      d.setDate(today.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      list.push({
        dateStr,
        label: d.getDate(),
        dayOfWeek: d.toLocaleDateString('fr-FR', { weekday: 'short' })
      })
    }
    return list
  }, [])

  const getPastilleColor = (dateStr: string) => {
    const entry = history[dateStr]
    if (!entry) return "bg-secondary/40 border border-white/5 text-muted-foreground/60"
    
    if (entry.routineCompleted && entry.sleepGoalMet) {
      return "bg-green-500/25 border border-green-500/50 text-green-400 font-bold"
    }
    if (entry.routineCompleted || entry.sleepGoalMet) {
      return "bg-amber-500/25 border border-amber-500/50 text-amber-400 font-bold"
    }
    return "bg-rose-500/25 border border-rose-500/50 text-rose-400 font-bold"
  }

  const selectedDayData = selectedDate ? history[selectedDate] : null

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

  return (
    <motion.div 
      className="p-6 pt-10 min-h-[calc(100vh-5rem)] flex flex-col space-y-6 pb-12 no-scrollbar"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Header section */}
      <motion.header variants={item} className="space-y-2 flex items-center space-x-4">
        <div className="p-3.5 bg-purple-500/10 rounded-2xl border border-purple-500/20 shadow-lg shadow-purple-500/5">
          <BarChart2 className="w-7 h-7 text-purple-400" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Statistiques</h1>
          <p className="text-sm text-muted-foreground">Suis ton évolution.</p>
        </div>
      </motion.header>

      {/* Grid Quick Stats Summary */}
      <motion.div variants={item} className="grid grid-cols-2 gap-4">
        <Card className="p-4 flex flex-col justify-between h-28 border-white/5 bg-card/60 backdrop-blur-xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <TrendingUp className="text-indigo-400 w-5 h-5" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Moy. Sommeil</span>
          </div>
          <div>
            <span className="text-2xl font-black text-foreground">{averageSleep}h</span>
            <p className="text-[9px] text-muted-foreground mt-0.5">Par nuit</p>
          </div>
        </Card>
        
        <Card className="p-4 flex flex-col justify-between h-28 border-white/5 bg-card/60 backdrop-blur-xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <Star className="text-amber-500 w-5 h-5" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Hygiène dentaire</span>
          </div>
          <div>
            <span className="text-2xl font-black text-foreground">{hygieneBrushingRate}%</span>
            <p className="text-[9px] text-muted-foreground mt-0.5">Taux hebdo</p>
          </div>
        </Card>
      </motion.div>

      {/* V4 Visual Habit Grid Calendar */}
      <motion.div variants={item}>
        <Card className="p-5 bg-gradient-to-b from-card to-card/50 border-white/5 shadow-xl space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center space-x-2">
              <CalendarIcon className="w-4 h-4 text-primary" />
              <span>Calendrier de Discipline</span>
            </h3>
            <span className="text-[10px] font-black text-muted-foreground">28 Derniers Jours</span>
          </div>

          <div className="grid grid-cols-7 gap-2.5 pt-1">
            {calendarDays.map((day) => (
              <button
                key={day.dateStr}
                onClick={() => setSelectedDate(day.dateStr)}
                className={`h-10 w-full rounded-xl flex flex-col items-center justify-center text-xs transition-all duration-200 active:scale-95 ${getPastilleColor(day.dateStr)}`}
              >
                <span className="text-[8px] uppercase tracking-tighter opacity-50 font-bold">{day.dayOfWeek.slice(0, 3)}</span>
                <span className="font-bold mt-0.5">{day.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-center space-x-4 pt-1.5 text-[9px] uppercase tracking-wider font-bold text-muted-foreground">
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/30 border border-green-500/40" />
              <span>Parfait</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/30 border border-amber-500/40" />
              <span>Partiel</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/30 border border-rose-500/40" />
              <span>Manqué</span>
            </span>
          </div>
        </Card>
      </motion.div>

      {/* Main Sleep Graph */}
      <motion.div variants={item}>
        <Card className="p-5 bg-gradient-to-b from-card to-card/50 border-white/5 shadow-xl space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground flex items-center space-x-2">
              <CalendarIcon className="w-4 h-4 text-purple-400" />
              <span>Sommeil (7 derniers jours)</span>
            </h3>
          </div>
          
          <div className="h-44 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sleepStats} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDuration" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: '600' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: '600' }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '12px', fontSize: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="duration" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorDuration)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>

      {/* Drawer / Popup Panel for clicked day (V4) */}
      <AnimatePresence>
        {selectedDate && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDate(null)}
              className="fixed inset-0 bg-black z-50 pointer-events-auto"
            />
            
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-white/5 rounded-t-3xl p-6 pb-10 space-y-6 max-w-md mx-auto pointer-events-auto shadow-2xl"
            >
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[10px] uppercase font-bold text-primary tracking-widest">Bilan du jour</span>
                  <h3 className="text-xl font-black text-foreground">
                    {new Date(selectedDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedDate(null)}
                  className="p-2 bg-secondary rounded-xl text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {selectedDayData ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="p-4 bg-secondary/40 border-white/5 flex items-center space-x-3.5">
                      <div className="p-2 bg-green-500/10 rounded-xl text-green-400">
                        <CalendarIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-wider font-bold text-muted-foreground">Routine</span>
                        <p className="text-xs font-black text-foreground">{selectedDayData.routineCompleted ? "Complète" : "Incomplète"}</p>
                      </div>
                    </Card>

                    <Card className="p-4 bg-secondary/40 border-white/5 flex items-center space-x-3.5">
                      <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400">
                        <Moon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-wider font-bold text-muted-foreground">Sommeil</span>
                        <p className="text-xs font-black text-foreground">{selectedDayData.sleepGoalMet ? "Objectif Atteint" : "Objectif Manqué"}</p>
                      </div>
                    </Card>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Card className="p-4 bg-secondary/40 border-white/5 flex items-center space-x-3.5">
                      <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-wider font-bold text-muted-foreground">Réveil Loggé</span>
                        <p className="text-xs font-black text-foreground">{selectedDayData.wakeTimeLogged}</p>
                      </div>
                    </Card>

                    <Card className="p-4 bg-secondary/40 border-white/5 flex items-center space-x-3.5">
                      <div className="p-2 bg-primary/10 rounded-xl text-primary animate-pulse">
                        <Flame className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-wider font-bold text-muted-foreground">Énergie globale</span>
                        <p className="text-xs font-black text-foreground">{selectedDayData.energyScore}%</p>
                      </div>
                    </Card>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center bg-secondary/20 rounded-2xl border border-white/[0.03] space-y-2">
                  <Info className="w-8 h-8 text-muted-foreground mx-auto" />
                  <h4 className="font-bold text-sm text-foreground">Aucune donnée historique</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">
                    Cette journée n'a pas encore été archivée. Continue à valider tes routines quotidiennes pour remplir ton calendrier !
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
