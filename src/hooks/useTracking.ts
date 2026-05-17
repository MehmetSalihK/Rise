import { useState, useCallback } from 'react';
import { storageService, KEYS } from '../services/storageService';
import { goalEngine } from '../core/goalEngine';
import { comparisonEngine, TrackingValues, MetricComparison } from '../core/comparisonEngine';
import { scoringEngine, ScoreReport } from '../core/scoringEngine';
import { streakEngine } from '../core/streakEngine';
import { aiService } from '../services/aiService';
import { widgetDataBuilder } from '../widgets/widgetDataBuilder';
import { notificationScheduler } from '../notifications/notificationScheduler';

export interface DailyTrackingLog {
  date: string;
  goals: any;
  actuals: TrackingValues;
  comparisons: MetricComparison[];
  score: number;
  category: 'MAUVAIS' | 'MOYEN' | 'EXCELLENT';
  feedback: string;
}

export function useTracking() {
  const [actuals, setActuals] = useState<TrackingValues>({
    wakeTime: '07:00',
    bedTime: '23:00',
    screenTime: 2.0,
    sportTime: 30,
    readTime: 15,
  });
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<ScoreReport | null>(null);
  const [comparisons, setComparisons] = useState<MetricComparison[]>([]);
  const [feedback, setFeedback] = useState('');

  const initializeTracking = useCallback(async () => {
    setLoading(true);
    const goals = await goalEngine.getGoals();
    
    // Default actuals loaded to be identical to target for ease of use
    setActuals({
      wakeTime: goals.wakeTime,
      bedTime: goals.bedTime,
      screenTime: goals.screenTime,
      sportTime: goals.sportTime,
      readTime: goals.readTime,
    });
    setReport(null);
    setComparisons([]);
    setFeedback('');
    setLoading(false);
  }, []);

  const saveTrackingDeclaration = async (values: TrackingValues) => {
    setLoading(true);
    setActuals(values);

    const goals = await goalEngine.getGoals();
    const evaluation = comparisonEngine.compare(goals, values);
    setComparisons(evaluation);

    const scoreReport = scoringEngine.calculateScore(evaluation);
    setReport(scoreReport);

    // Streak calculation
    const currentStreak = await storageService.getItem<number>(KEYS.CURRENT_STREAK, 0);
    const streakResult = streakEngine.evaluateStreak(currentStreak, scoreReport.score);
    await storageService.setItem(KEYS.CURRENT_STREAK, streakResult.nextStreak);

    const bestStreak = await storageService.getItem<number>(KEYS.BEST_STREAK, 0);
    if (streakResult.nextStreak > bestStreak) {
      await storageService.setItem(KEYS.BEST_STREAK, streakResult.nextStreak);
    }

    // Call Gemini AI
    const apiAnswersMap: Record<string, boolean> = {};
    evaluation.forEach(c => {
      apiAnswersMap[c.metric] = c.success;
    });

    const aiReport = await aiService.generateDailyAuditReport(
      apiAnswersMap,
      scoreReport.score,
      streakResult.nextStreak
    );
    setFeedback(aiReport);

    // Save into history database
    const todayStr = new Date().toISOString().split('T')[0];
    const newLog: DailyTrackingLog = {
      date: todayStr,
      goals,
      actuals: values,
      comparisons: evaluation,
      score: scoreReport.score,
      category: scoreReport.category,
      feedback: aiReport,
    };

    const history = await storageService.getItem<DailyTrackingLog[]>('rise_auditHistory', []);
    const updated = [...history.filter(h => h.date !== todayStr), newLog];
    await storageService.setItem('rise_auditHistory', updated);
    await storageService.setItem('rise_latestAudit', newLog);

    // Widget State Sync
    await widgetDataBuilder.syncWidgetData(
      scoreReport.score,
      streakResult.nextStreak,
      scoreReport.category,
      scoreReport.color
    );

    // Scheduler reset based on V6 active pressure
    const stateMapping: 'GOOD' | 'MEDIUM' | 'BAD' = 
      scoreReport.category === 'EXCELLENT' ? 'GOOD' :
      scoreReport.category === 'MAUVAIS' ? 'BAD' : 'MEDIUM';
    
    await notificationScheduler.schedulePressureCoachAlerts(stateMapping);

    setLoading(false);
  };

  return {
    actuals,
    loading,
    report,
    comparisons,
    feedback,
    initializeTracking,
    saveTrackingDeclaration,
  };
}
