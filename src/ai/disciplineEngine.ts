import { scoring, ScoringInputs } from './scoring';
import { recommendation, RecommendationInputs, RecommendationOutput } from './recommendation';
import { messages } from './messages';

export interface AIAnalysisOutput {
  disciplineScore: number;
  aiReport: RecommendationOutput;
  motivationalMessage: string;
}

export const disciplineEngine = {
  analyze(
    mood: 'fatigué' | 'normal' | 'motivé',
    sleepDuration: number,
    bedtimeStr: string,
    routineCompletionRate: number,
    isCompletedEarly: boolean,
    streakCount: number,
    screenTimeHours: number
  ): AIAnalysisOutput {
    // 1. Core scoring
    const scoringInputs: ScoringInputs = {
      sleepDuration,
      bedtimeStr,
      routineCompletionRate,
      isCompletedEarly,
      streakCount,
      screenTimeHours,
    };
    const score = scoring.calculateGlobalDisciplineScore(scoringInputs);

    // 2. Core Recommendations
    const recInputs: RecommendationInputs = {
      mood,
      sleepDuration,
      routineCompletionRate,
      streakCount,
      screenTimeHours,
    };
    const report = recommendation.resolve(recInputs);

    // 3. Dynamic Coaching
    const text = messages.generateDailyCoachingMessage(
      report.userState,
      report.recommendation,
      streakCount,
      routineCompletionRate
    );

    return {
      disciplineScore: score,
      aiReport: report,
      motivationalMessage: text,
    };
  }
};
