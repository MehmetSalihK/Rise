// LocalStorage helpers for Hard Discipline Mode

export const storage = {
  getRoutine: (defaultValue: any = null) => {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const data = localStorage.getItem('rise-habits');
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  },

  saveRoutine: (habits: any) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('rise-habits', JSON.stringify(habits));
    } catch (e) {
      console.warn("Storage write error:", e);
    }
  },

  saveStreak: (streak: number, bestStreak: number) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('currentStreak', String(streak));
      localStorage.setItem('bestStreak', String(bestStreak));
    } catch (e) {
      console.warn("Streak write error:", e);
    }
  }
};
