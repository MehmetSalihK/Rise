"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, CheckSquare, Flame } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", icon: Home, label: "Discipline" },
  { href: "/morning", icon: CheckSquare, label: "Routine" },
  { href: "/streak", icon: Flame, label: "Série" },
]

export function BottomNavigation() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full bg-background/90 backdrop-blur-xl border-t border-white/5 pb-safe">
      <div className="flex h-16 items-center justify-around px-6 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex h-full w-full flex-col items-center justify-center space-y-1"
            >
              <div
                className={cn(
                  "relative flex items-center justify-center rounded-2xl p-2 transition-all",
                  isActive ? "text-primary scale-110" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute -bottom-1 h-1 w-1.5 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  />
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
