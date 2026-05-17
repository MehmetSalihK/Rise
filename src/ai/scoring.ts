export interface ScoringInputs {
  sleepDuration: number; // hours
  bedtimeStr: string; // "HH:mm"
  routineCompletionRate: number; // 0 to 1 (e.g. 0.8 for 4/5)
  isCompletedEarly: boolean; // completed before 10 AM
  streakCount: number;
  screenTimeHours: number;
}

export const scoring = {
  calculateSleepScore(duration: number, bedtimeStr: string): number {
    let score = 0;
    if (duration >= 7 && duration <= 9) {
      score = 100;
    } else if (duration >= 6 && duration < 7) {
      score = 70;
    } else if (duration > 9) {
      score = 80;
    } else {
      score = 40; // < 6h
    }

    // Bedtime bonus: bedtime before 23:00
    if (bedtimeStr) {
      const [h] = bedtimeStr.split(':').map(Number);
      if (h < 23 || h >= 18) { // Assuming typical sleepers
        score = Math.min(100, score + 10);
      }
    }

    return score;
  },

  calculateRoutineScore(completionRate: number, isCompletedEarly: boolean): number {
    let score = completionRate * 100;

    // Bonus for early morning checks
    if (isCompletedEarly && completionRate > 0) {
      score = Math.min(100, score + 10);
    }

    return Math.round(score);
  },

  calculateStreakScore(streak: number): number {
    if (streak >= 15) return 100;
    if (streak >= 8) return 80;
    if (streak >= 4) return 50;
    if (streak > 0) return 20;
    return 0;
  },

  calculateScreenControlScore(hours: number): number {
    if (hours < 2) return 100;
    if (hours >= 2 && hours < 4) return 70;
    if (hours >= 4 && hours < 6) return 40;
    return 20; // 6h+
  },

  calculateGlobalDisciplineScore(inputs: ScoringInputs): number {
    const sleep = this.calculateSleepScore(inputs.sleepDuration, inputs.bedtimeStr);
    const routine = this.calculateRoutineScore(inputs.routineCompletionRate, inputs.isCompletedEarly);
    const streak = this.calculateStreakScore(inputs.streakCount);
    const screen = this.calculateScreenControlScore(inputs.screenTimeHours);

    const global = (0.4 * sleep) + (0.4 * routine) + (0.1 * streak) + (0.1 * screen);
    return Math.round(global);
  }
};
