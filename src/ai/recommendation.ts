export type UserState = 'LOW ENERGY' | 'NORMAL' | 'HIGH PERFORMANCE';
export type DayRecommendation = 'light day' | 'normal day' | 'strict day';
export type RiskType = 'streak danger' | 'fatigue risk' | 'procrastination risk';

export interface RecommendationInputs {
  mood: 'fatigué' | 'normal' | 'motivé';
  sleepDuration: number;
  routineCompletionRate: number;
  streakCount: number;
  screenTimeHours: number;
}

export interface RecommendationOutput {
  userState: UserState;
  recommendation: DayRecommendation;
  risks: RiskType[];
}

export const recommendation = {
  resolve(inputs: RecommendationInputs): RecommendationOutput {
    let userState: UserState = 'NORMAL';
    let rec: DayRecommendation = 'normal day';
    const risks: RiskType[] = [];

    // 1. User State logic
    if (inputs.mood === 'fatigué' || inputs.sleepDuration < 5.5) {
      userState = 'LOW ENERGY';
    } else if (inputs.mood === 'motivé' && inputs.sleepDuration >= 7) {
      userState = 'HIGH PERFORMANCE';
    }

    // 2. Day Recommendation logic
    if (userState === 'LOW ENERGY') {
      rec = 'light day';
    } else if (userState === 'HIGH PERFORMANCE') {
      rec = 'strict day';
    }

    // 3. Risk Detection logic
    if (inputs.sleepDuration < 6) {
      risks.push('fatigue risk');
    }

    if (inputs.streakCount > 3 && inputs.routineCompletionRate < 0.4) {
      risks.push('streak danger');
    }

    if (inputs.screenTimeHours > 4.5 && inputs.routineCompletionRate < 0.5) {
      risks.push('procrastination risk');
    }

    return {
      userState,
      recommendation: rec,
      risks,
    };
  }
};
