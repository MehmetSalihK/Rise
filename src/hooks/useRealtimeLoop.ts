"use client"

import { useEffect, useRef } from 'react';
import { useAppStore, DailyHistoryEntry, getEnergyScore } from '@/store/useAppStore';
import { 
  triggerWakeReminder, 
  triggerRoutineStartReminder, 
  triggerSleepPrepReminder, 
  triggerStreakDangerReminder, 
  triggerContextualMotivation,
  triggerRiseNotification
} from '@/lib/notifications';

function getCurrentTimeStr(): string {
  const now = new Date();
  return now.toTimeString().slice(0, 5); // Returns HH:mm
}

function getTodayDateStr(): string {
  return new Date().toISOString().split('T')[0]; // Returns YYYY-MM-DD
}

function getYesterdayDateStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

function addMinutesToTime(timeStr: string, minutes: number): string {
  const [h, m] = timeStr.split(':').map(Number);
  const date = new Date();
  date.setHours(h, m + minutes, 0, 0);
  return date.toTimeString().slice(0, 5);
}

export function useRealtimeLoop() {
  const store = useAppStore();
  const lastCheckedMinute = useRef<string>("");

  useEffect(() => {
    // 1. Run immediate Daily Reset Check on initial load
    const checkDailyReset = () => {
      const todayStr = getTodayDateStr();
      const lastActiveDate = localStorage.getItem('rise-last-active-date');

      if (lastActiveDate && lastActiveDate !== todayStr) {
        // A day rollover occurred! Let's archive yesterday before resetting
        const yesterdayStr = getYesterdayDateStr();
        
        // Compute yesterday's metrics
        const allCompleted = store.habits.every(h => h.completed);
        const energyResult = getEnergyScore({
          sleepHistory: store.sleepHistory,
          habits: store.habits,
          currentStreak: store.currentStreak
        });

        const lastSleep = store.sleepHistory[store.sleepHistory.length - 1];
        const sleepMet = lastSleep ? (lastSleep.date === yesterdayStr && lastSleep.duration >= 7) : false;

        const historyEntry: DailyHistoryEntry = {
          routineCompleted: allCompleted,
          sleepGoalMet: sleepMet,
          energyScore: energyResult.score,
          wakeTimeLogged: lastSleep?.wakeTime || store.wakeGoal
        };

        // Archive into history log
        store.saveDayToHistory(yesterdayStr, historyEntry);

        // Check if streak was broken (routine was not completed yesterday)
        const isYesterdayInStreak = store.streakHistory.includes(yesterdayStr);
        if (!allCompleted && !isYesterdayInStreak) {
          // Streak broken - Cognitive-friendly resets
          useAppStore.setState({ currentStreak: 0 });
          
          setTimeout(() => {
            triggerRiseNotification({
              title: "Nouveau départ ! 🌱",
              body: "Hier est derrière nous. Aujourd'hui est une page blanche. Prêt(e) à recommencer ?",
              type: 'discipline'
            });
          }, 3000);
        }

        // Clean slate reset
        store.resetDailyHabits();
      }

      // Record today as the active date
      localStorage.setItem('rise-last-active-date', todayStr);
    };

    checkDailyReset();

    // 2. Schedule looping alarm checks every 60 seconds
    const interval = setInterval(() => {
      const currentTime = getCurrentTimeStr();
      if (currentTime === lastCheckedMinute.current) return; // Prevent double trigger in the same minute
      lastCheckedMinute.current = currentTime;

      const todayStr = getTodayDateStr();

      // Check daily reset rollover dynamically in case tab is left open past midnight
      const lastActiveDate = localStorage.getItem('rise-last-active-date');
      if (lastActiveDate && lastActiveDate !== todayStr) {
        checkDailyReset();
      }

      // A. Wake Goal Alarm
      if (currentTime === store.wakeGoal) {
        triggerWakeReminder();
      }

      // B. Routine Starter (+10 mins after wakeGoal)
      if (currentTime === addMinutesToTime(store.wakeGoal, 10)) {
        triggerRoutineStartReminder();
      }

      // C. Sleep Prep Alarm (-30 mins before sleepGoal)
      if (currentTime === addMinutesToTime(store.sleepGoal, -30)) {
        triggerSleepPrepReminder();
      }

      // D. Midday checkin (14:00)
      if (currentTime === "14:00") {
        triggerContextualMotivation();
      }

      // E. Streak Warning check (21:00)
      if (currentTime === "21:00") {
        const habitsNotDone = store.habits.some(h => !h.completed);
        if (habitsNotDone && store.currentStreak > 0) {
          triggerStreakDangerReminder();
        }
      }

    }, 60000);

    return () => clearInterval(interval);
  }, [store]);
}
