import AsyncStorage from '@react-native-async-storage/async-storage';

export const KEYS = {
  USER_NAME: 'rise_userName',
  WAKE_GOAL: 'rise_wakeGoal',
  SLEEP_GOAL: 'rise_sleepGoal',
  HABITS: 'rise_habits',
  SLEEP_HISTORY: 'rise_sleepHistory',
  CURRENT_STREAK: 'rise_currentStreak',
  BEST_STREAK: 'rise_bestStreak',
  STREAK_HISTORY: 'rise_streakHistory',
  LAST_COMPLETED_DATE: 'rise_lastCompletedDate',
};

export const storageService = {
  async getItem<T>(key: string, defaultValue: T): Promise<T> {
    try {
      const val = await AsyncStorage.getItem(key);
      return val !== null ? (JSON.parse(val) as T) : defaultValue;
    } catch (e) {
      console.warn(`Storage get error for key ${key}:`, e);
      return defaultValue;
    }
  },

  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`Storage set error for key ${key}:`, e);
    }
  },

  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      console.warn("Storage clear error:", e);
    }
  }
};
