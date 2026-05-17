import { storageService } from '../services/storageService';

export interface DailyGoals {
  wakeTime: string; // "HH:MM"
  bedTime: string;  // "HH:MM"
  screenTime: number; // hours
  sportTime: number;  // minutes
  readTime: number;   // minutes
}

export const defaultGoals: DailyGoals = {
  wakeTime: '07:00',
  bedTime: '23:00',
  screenTime: 2.0,
  sportTime: 30,
  readTime: 15,
};

export const goalEngine = {
  async getGoals(): Promise<DailyGoals> {
    return await storageService.getItem<DailyGoals>('rise_dailyGoals_targets', defaultGoals);
  },

  async saveGoals(goals: DailyGoals): Promise<void> {
    await storageService.setItem('rise_dailyGoals_targets', goals);
  }
};
