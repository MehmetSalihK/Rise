import { useAppStore } from '@/store/useAppStore';

// Request notification permission from Safari / Browser
export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  
  return false;
}

interface NotificationOptions {
  title: string;
  body: string;
  type: 'discipline' | 'sleep' | 'routine' | 'streak';
}

export function triggerRiseNotification({ title, body, type }: NotificationOptions) {
  // 1. Push internal elegant toast alert (Universal Fallback)
  useAppStore.getState().addAlert(body, type);

  // 2. Try native system notification if allowed
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: '/apple-icon.png',
        silent: false
      });
    } catch (e) {
      // Fallback for browsers that don't support simple constructor (like Safari under some PWA scopes)
      // by using service worker registration
      navigator.serviceWorker?.ready.then((registration) => {
        registration.showNotification(title, {
          body,
          icon: '/apple-icon.png'
        });
      });
    }
  }
}

// Adaptive Motivation Generator based on Streak and Progression
export function triggerContextualMotivation() {
  const { currentStreak, habits } = useAppStore.getState();
  const completedCount = habits.filter(h => h.completed).length;
  
  let title = "Discipline & Volonté 🎯";
  let body = "Chaque petit effort quotidien façonne ta future identité. Reste focus !";

  if (currentStreak > 5) {
    title = "Série Impressionnante ! 🔥";
    body = `Tu en es à ${currentStreak} jours de discipline absolue. Ne lâche rien aujourd'hui !`;
  } else if (completedCount === 0) {
    title = "Démarrage en douceur 🌱";
    body = "Prends une première action facile. Boire un verre d'eau par exemple ? 💧";
  } else if (completedCount > 0 && completedCount < habits.length) {
    title = "Progression continue ⚡️";
    body = "Tu construis ta routine avec régularité. Continue d'avancer !";
  }

  triggerRiseNotification({ title, body, type: 'discipline' });
}

export function triggerWakeReminder() {
  triggerRiseNotification({
    title: "Debout, Champion ! 🌅",
    body: "Il est l'heure de te lever. Ton objectif du jour commence maintenant.",
    type: 'routine'
  });
}

export function triggerRoutineStartReminder() {
  triggerRiseNotification({
    title: "Morning Routine ☀️",
    body: "Commence tes habitudes matinales. Un verre d'eau en premier !",
    type: 'routine'
  });
}

export function triggerSleepPrepReminder() {
  triggerRiseNotification({
    title: "Sommeil & Récupération 🛌",
    body: "Prépare-toi à dormir. Éteins tes écrans d'ici 30 minutes.",
    type: 'sleep'
  });
}

export function triggerStreakDangerReminder() {
  const { currentStreak } = useAppStore.getState();
  triggerRiseNotification({
    title: "Série en danger ! ⚠️",
    body: `Ta série de ${currentStreak} jours expire bientôt. Valide tes routines avant la nuit !`,
    type: 'streak'
  });
}
