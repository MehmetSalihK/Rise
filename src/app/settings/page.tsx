"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAppStore } from "@/store/useAppStore"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Settings as SettingsIcon, Bell, Trash2, User, Cloud, CloudOff, Loader2, LogOut, Check } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function Settings() {
  const { userName, wakeGoal, sleepGoal, userId, syncing, setSettings, resetAll } = useAppStore()
  
  const [localName, setLocalName] = useState(userName)
  const [localWake, setLocalWake] = useState(wakeGoal)
  const [localSleep, setLocalSleep] = useState(sleepGoal)

  // Auth local inputs
  const [email, setEmail] = useState("")
  const [authLoading, setAuthLoading] = useState(false)
  const [authSent, setAuthSent] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    // Get logged-in user email
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserEmail(session.user.email || null)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email || null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSave = () => {
    setSettings({
      userName: localName,
      wakeGoal: localWake,
      sleepGoal: localSleep,
    })
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    
    setAuthLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined
      }
    })
    
    setAuthLoading(false)
    if (!error) {
      setAuthSent(true)
      setTimeout(() => setAuthSent(false), 8000)
    } else {
      alert(error.message)
    }
  }

  const handleLogout = async () => {
    if (window.confirm("Se déconnecter de votre compte cloud ? Votre progression locale restera intacte.")) {
      await supabase.auth.signOut()
    }
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  } as const
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  } as const

  return (
    <motion.div 
      className="p-6 pt-12 min-h-[calc(100vh-5rem)] flex flex-col space-y-8 no-scrollbar pb-10"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Header section */}
      <motion.header variants={item} className="space-y-2 flex items-center space-x-4">
        <div className="p-3.5 bg-secondary rounded-2xl border border-white/5 shadow-md">
          <SettingsIcon className="w-8 h-8 text-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Paramètres</h1>
          <p className="text-sm text-muted-foreground">Personnalise ton expérience.</p>
        </div>
      </motion.header>

      <motion.div variants={item} className="space-y-6">
        {/* Profile Settings */}
        <Card className="p-5 space-y-4 border-white/5 bg-gradient-to-b from-card to-card/50 shadow-xl">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider flex items-center space-x-2 text-muted-foreground">
              <User className="w-4 h-4 text-primary" />
              <span>Nom</span>
            </label>
            <input 
              type="text" 
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              className="w-full bg-secondary/60 text-foreground px-4 py-3 rounded-xl border border-white/5 focus:ring-1 focus:ring-primary outline-none text-sm font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider flex items-center space-x-2 text-muted-foreground">
                <Bell className="w-4 h-4 text-amber-500" />
                <span>Réveil</span>
              </label>
              <input 
                type="time" 
                value={localWake}
                onChange={(e) => setLocalWake(e.target.value)}
                className="w-full bg-secondary/60 text-foreground px-4 py-3 rounded-xl border border-white/5 focus:ring-1 focus:ring-primary outline-none text-sm font-semibold font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider flex items-center space-x-2 text-muted-foreground">
                <Bell className="w-4 h-4 text-indigo-400" />
                <span>Coucher</span>
              </label>
              <input 
                type="time" 
                value={localSleep}
                onChange={(e) => setLocalSleep(e.target.value)}
                className="w-full bg-secondary/60 text-foreground px-4 py-3 rounded-xl border border-white/5 focus:ring-1 focus:ring-primary outline-none text-sm font-semibold font-mono"
              />
            </div>
          </div>

          <Button className="w-full h-12 rounded-xl font-bold mt-2 shadow-md" onClick={handleSave}>
            Enregistrer
          </Button>
        </Card>

        {/* Supabase Backup / Sync section */}
        <Card className="p-5 space-y-4 border-white/5 bg-gradient-to-b from-card to-card/50 shadow-xl relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
          
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              {userId ? (
                <div className="p-1.5 bg-green-500/10 rounded-lg text-green-400">
                  <Cloud className="w-4 h-4" />
                </div>
              ) : (
                <div className="p-1.5 bg-secondary rounded-lg text-muted-foreground">
                  <CloudOff className="w-4 h-4" />
                </div>
              )}
              <h3 className="font-bold text-sm uppercase tracking-wider text-foreground">Sauvegarde Cloud</h3>
            </div>
            
            {userId && (
              <span className="text-[10px] uppercase font-bold text-green-400 px-2 py-0.5 bg-green-500/10 rounded-full border border-green-500/20">
                {syncing ? "Synchro..." : "Sauvegardé"}
              </span>
            )}
          </div>

          <AnimatePresence mode="wait">
            {userId ? (
              <motion.div 
                key="logged-in"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-3 pt-1 text-xs"
              >
                <div className="flex justify-between items-center bg-secondary/35 p-3 rounded-xl border border-white/5">
                  <span className="text-muted-foreground">Compte connecté</span>
                  <span className="font-mono font-bold text-foreground/90">{userEmail || "Connecté"}</span>
                </div>
                
                <Button 
                  variant="outline"
                  className="w-full h-11 border-destructive/20 hover:bg-destructive/10 text-destructive-foreground font-bold rounded-xl mt-1.5"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Se déconnecter
                </Button>
              </motion.div>
            ) : (
              <motion.form 
                key="logged-out"
                onSubmit={handleMagicLink}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-3 pt-1"
              >
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Sauvegardez vos routines, statistiques et streaks en toute sécurité. Reconnectez-vous en un clic sur tous vos appareils.
                </p>

                <div className="space-y-2">
                  <input 
                    type="email" 
                    placeholder="Saisissez votre email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-secondary/60 text-foreground px-4 py-3 rounded-xl border border-white/5 focus:ring-1 focus:ring-primary outline-none text-xs font-semibold"
                  />
                </div>

                <Button 
                  type="submit"
                  disabled={authLoading || authSent}
                  className="w-full h-11 font-bold rounded-xl shadow-md bg-foreground text-background hover:bg-foreground/90"
                >
                  {authLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : authSent ? (
                    <span className="flex items-center justify-center space-x-1.5 text-green-500 font-black">
                      <Check className="w-4 h-4" />
                      <span>Lien de connexion envoyé !</span>
                    </span>
                  ) : (
                    "Recevoir mon lien Magic Link"
                  )}
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </Card>

        {/* Reset / Danger Zone */}
        <Card className="p-5 border-destructive/10 bg-destructive/[0.02] shadow-sm space-y-4 rounded-2xl">
          <div>
            <h3 className="font-bold text-sm text-destructive uppercase tracking-wider">Zone sensible</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Réinitialiser l'ensemble de votre base de données locale.</p>
          </div>
          <Button 
            variant="destructive" 
            className="w-full h-12 rounded-xl font-bold shadow-md"
            onClick={() => {
              if (window.confirm("Êtes-vous absolument sûr de vouloir réinitialiser l'application ? Tout votre historique local et vos réglages seront définitivement effacés.")) {
                resetAll()
              }
            }}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Tout effacer
          </Button>
        </Card>
      </motion.div>
    </motion.div>
  )
}
