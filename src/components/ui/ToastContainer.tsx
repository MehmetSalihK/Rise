"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAppStore, Alert } from "@/store/useAppStore"
import { Bell, Flame, Moon, CheckCircle2, X } from "lucide-react"

export function ToastContainer() {
  const alerts = useAppStore((s) => s.activeAlerts)
  const removeAlert = useAppStore((s) => s.removeAlert)

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm px-4 flex flex-col space-y-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {alerts.map((alert) => (
          <ToastCard key={alert.id} alert={alert} onClose={() => removeAlert(alert.id)} />
        ))}
      </AnimatePresence>
    </div>
  )
}

function ToastCard({ alert, onClose }: { alert: Alert; onClose: () => void }) {
  useEffect(() => {
    // Auto-dismiss after 6 seconds
    const timer = setTimeout(onClose, 6000)
    return () => clearTimeout(timer)
  }, [onClose])

  const iconMap = {
    discipline: <Bell className="w-5 h-5 text-indigo-400" />,
    sleep: <Moon className="w-5 h-5 text-purple-400" />,
    routine: <CheckCircle2 className="w-5 h-5 text-primary" />,
    streak: <Flame className="w-5 h-5 text-amber-500" />
  }

  const borderMap = {
    discipline: "border-indigo-500/20 shadow-indigo-500/5",
    sleep: "border-purple-500/20 shadow-purple-500/5",
    routine: "border-primary/20 shadow-primary/5",
    streak: "border-amber-500/20 shadow-amber-500/5"
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -15, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className={`pointer-events-auto flex items-center justify-between p-4 rounded-2xl bg-card/85 backdrop-blur-xl border ${borderMap[alert.type]} shadow-2xl relative overflow-hidden`}
    >
      <div className="flex items-center space-x-3.5">
        <div className="p-2 bg-secondary/60 rounded-xl">
          {iconMap[alert.type]}
        </div>
        <p className="text-xs font-bold text-foreground leading-relaxed pr-4">
          {alert.message}
        </p>
      </div>
      
      <button 
        onClick={onClose}
        className="p-1 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  )
}
