"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { useAppStore } from "@/store/useAppStore"
import { Card } from "@/components/ui/Card"
import { BarChart2, Star, TrendingUp, Calendar } from "lucide-react"
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
  const { sleepHistory, hygieneHistory, currentStreak } = useAppStore()

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

  // Brushing Habit Score (Noon, Night, Morning completion rates)
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
      className="p-6 pt-10 min-h-[calc(100vh-5rem)] flex flex-col space-y-6 pb-10 no-scrollbar"
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

      {/* Main Sleep Graph */}
      <motion.div variants={item}>
        <Card className="p-5 bg-gradient-to-b from-card to-card/50 border-white/5 shadow-xl space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span>Sommeil (7 derniers jours)</span>
            </h3>
          </div>
          
          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sleepStats} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDuration" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
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
                  stroke="#6366f1" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorDuration)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  )
}
