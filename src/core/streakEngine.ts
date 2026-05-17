export interface StreakResult {
  nextStreak: number;
  isReset: boolean;
  isIncremented: boolean;
}

export const streakEngine = {
  evaluateStreak(currentStreak: number, score: number): StreakResult {
    if (score >= 70) {
      return {
        nextStreak: currentStreak + 1,
        isReset: false,
        isIncremented: true,
      };
    }

    if (score < 40) {
      return {
        nextStreak: 0,
        isReset: true,
        isIncremented: false,
      };
    }

    return {
      nextStreak: currentStreak,
      isReset: false,
      isIncremented: false,
    };
  }
};
