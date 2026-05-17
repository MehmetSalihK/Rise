export interface StreakUpdateResult {
  nextStreak: number;
  isReset: boolean;
  isIncremented: boolean;
}

export const streakEngine = {
  evaluateStreak(currentStreak: number, score: number): StreakUpdateResult {
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

    // Maintain current streak if score is between 40 and 70
    return {
      nextStreak: currentStreak,
      isReset: false,
      isIncremented: false,
    };
  }
};
