import { storageService } from './storageService';

export const AI_KEYS = {
  USER_MOOD: 'rise_ai_userMood',
  SCREEN_TIME: 'rise_ai_screenTime',
  DAILY_SCORE_HISTORY: 'rise_ai_dailyScoreHistory',
};

export type UserMood = 'fatigué' | 'normal' | 'motivé';

export interface ScoreHistoryEntry {
  date: string;
  score: number;
}

export const aiService = {
  async getUserMood(): Promise<UserMood> {
    return await storageService.getItem<UserMood>(AI_KEYS.USER_MOOD, 'normal');
  },

  async setUserMood(mood: UserMood): Promise<void> {
    await storageService.setItem(AI_KEYS.USER_MOOD, mood);
  },

  async getScreenTimeHours(): Promise<number> {
    return await storageService.getItem<number>(AI_KEYS.SCREEN_TIME, 2.5);
  },

  async setScreenTimeHours(hours: number): Promise<void> {
    await storageService.setItem(AI_KEYS.SCREEN_TIME, hours);
  },

  async logDailyScore(score: number): Promise<void> {
    const todayStr = new Date().toISOString().split('T')[0];
    const history = await storageService.getItem<ScoreHistoryEntry[]>(AI_KEYS.DAILY_SCORE_HISTORY, []);
    
    // Replace today if already logged
    const updated = [...history.filter(e => e.date !== todayStr), { date: todayStr, score }];
    await storageService.setItem(AI_KEYS.DAILY_SCORE_HISTORY, updated);
  },

  async getScoreHistory(): Promise<ScoreHistoryEntry[]> {
    return await storageService.getItem<ScoreHistoryEntry[]>(AI_KEYS.DAILY_SCORE_HISTORY, []);
  }
};
