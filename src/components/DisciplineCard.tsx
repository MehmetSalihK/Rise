"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"

interface DisciplineCardProps {
  name: string;
  completed: boolean;
  onToggle: () => void;
}

export function DisciplineCard({ name, completed, onToggle }: DisciplineCardProps) {
  return (
    <motion.div
      onClick={onToggle}
      whileTap={{ scale: 0.96 }}
      className={`p-5 rounded-2xl cursor-pointer flex items-center justify-between border transition-all duration-300 ${
        completed 
          ? "bg-primary/5 border-primary/30 shadow-lg shadow-primary/5" 
          : "bg-card border-white/5 hover:border-white/10"
      }`}
    >
      <span className={`text-base font-black tracking-tight select-none transition-all ${
        completed ? "line-through text-muted-foreground opacity-60" : "text-foreground"
      }`}>
        {name}
      </span>

      {/* Large Custom Tactical Checkbox */}
      <motion.div
        animate={{
          scale: completed ? 1.05 : 1,
          backgroundColor: completed ? "#22C55E" : "transparent",
          borderColor: completed ? "#22C55E" : "#8A9CAE"
        }}
        transition={{ type: "spring", stiffness: 350, damping: 20 }}
        className="w-7 h-7 rounded-xl border-2 flex items-center justify-center shrink-0"
      >
        {completed && (
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 450, damping: 18 }}
          >
            <Check className="w-4 h-4 text-white stroke-[3px]" />
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}
