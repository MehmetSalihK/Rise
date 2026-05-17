"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Moon, Sun, Droplets, BarChart2, Settings } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/morning", icon: Sun, label: "Matin" },
  { href: "/sleep", icon: Moon, label: "Sommeil" },
  { href: "/hygiene", icon: Droplets, label: "Hygiène" },
  { href: "/stats", icon: BarChart2, label: "Stats" },
]

import { useAppStore } from "@/store/useAppStore"

export function BottomNavigation() {
  const pathname = usePathname()
  const focusModeActive = useAppStore((s) => s.focusModeActive)

  if (focusModeActive) return null

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full bg-background/80 backdrop-blur-lg border-t border-border pb-safe">
      <div className="flex h-16 items-center justify-around px-4">
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
                  "relative flex items-center justify-center rounded-full p-2 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute -bottom-1 h-1 w-1 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
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
