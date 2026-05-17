"use client"

import * as React from "react"
import { motion, useAnimation } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedCheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  className?: string
}

export function AnimatedCheckbox({ checked, onChange, label, className }: AnimatedCheckboxProps) {
  const controls = useAnimation()

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Spark animation when checked
    if (!checked) {
      controls.start({
        scale: [1, 1.15, 0.95, 1],
        transition: { duration: 0.4, ease: "easeInOut" }
      })
    } else {
      controls.start({
        scale: [1, 0.95, 1],
        transition: { duration: 0.2 }
      })
    }
    
    onChange(!checked)
  }

  return (
    <motion.div
      whileTap={{ scale: 0.96 }}
      onClick={handleToggle}
      className={cn(
        "flex items-center space-x-4 cursor-pointer select-none p-3.5 rounded-xl transition-all duration-300 border border-transparent",
        checked 
          ? "bg-primary/5 border-primary/10 shadow-sm" 
          : "bg-secondary/40 hover:bg-secondary/70 hover:border-white/5"
      )}
    >
      <motion.div
        animate={controls}
        className={cn(
          "relative flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 shadow-sm",
          checked 
            ? "border-primary bg-primary shadow-primary/20 shadow-md" 
            : "border-muted-foreground/60 bg-transparent"
        )}
      >
        <motion.svg
          initial={false}
          animate={{ opacity: checked ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="absolute h-4.5 w-4.5 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: checked ? 1 : 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            d="M5 12l5 5L20 7"
          />
        </motion.svg>
      </motion.div>
      {label && (
        <span
          className={cn(
            "text-base font-semibold transition-all duration-300 tracking-tight",
            checked ? "text-muted-foreground line-through opacity-70" : "text-foreground"
          )}
        >
          {label}
        </span>
      )}
    </motion.div>
  )
}
