import { behaviorAnalyzer, BehaviorDiagnosis } from './behaviorAnalyzer';
import { dailyPlanGenerator, DailyPlan } from './dailyPlanGenerator';
import { aiService } from '../services/aiService';

export const aiCoachEngine = {
  async getDailyPlan(
    sleepHours: number,
    streak: number,
    screenTime: number
  ): Promise<DailyPlan> {
    const apiKey = await aiService.getApiKey();
    if (!apiKey) {
      return dailyPlanGenerator.generateLocalPlan(sleepHours, streak, screenTime);
    }
    return await dailyPlanGenerator.generatePlanViaAI(apiKey, sleepHours, streak, screenTime);
  },

  diagnoseBehavior(
    sleepDuration: number,
    streak: number,
    screenTime: number,
    averageScore: number
  ): BehaviorDiagnosis {
    return behaviorAnalyzer.diagnoseUser(sleepDuration, streak, screenTime, averageScore);
  }
};
