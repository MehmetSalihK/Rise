import { useState, useCallback } from 'react';
import { storageService, KEYS } from '../services/storageService';
import { questionEngine, Question } from '../core/questionEngine';
import { scoringEngine, ScoreReport } from '../core/scoringEngine';
import { streakEngine } from '../core/streakEngine';
import { aiService } from '../services/aiService';

export interface AuditLog {
  date: string;
  answers: Record<string, boolean>;
  score: number;
  category: 'MAUVAIS' | 'MOYEN' | 'EXCELLENT';
  feedback: string;
}

export function useCheckIn() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<ScoreReport | null>(null);
  const [feedback, setFeedback] = useState('');

  const startCheckIn = useCallback(async () => {
    setLoading(true);
    
    // Load last sleep duration to trigger adaptive rules
    const sleepLogs = await storageService.getItem<any[]>(KEYS.SLEEP_HISTORY, []);
    const lastSleepLog = sleepLogs[sleepLogs.length - 1];
    const duration = lastSleepLog ? lastSleepLog.duration : 7.5;

    const streak = await storageService.getItem<number>(KEYS.CURRENT_STREAK, 0);

    // Get customized question list
    const list = questionEngine.getQuestionsForDay(duration, streak);
    setQuestions(list);
    setCurrentIndex(0);
    setAnswers({});
    setReport(null);
    setFeedback('');
    setLoading(false);
  }, []);

  const answerQuestion = async (yesNo: boolean) => {
    const currentQ = questions[currentIndex];
    const nextAnswers = { ...answers, [currentQ.id]: yesNo };
    setAnswers(nextAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Completed Check-In Audit!
      setLoading(true);
      
      const scoreReport = scoringEngine.calculateScore(nextAnswers);
      setReport(scoreReport);

      // Streak assessment
      const currentStreak = await storageService.getItem<number>(KEYS.CURRENT_STREAK, 0);
      const streakResult = streakEngine.evaluateStreak(currentStreak, scoreReport.score);

      await storageService.setItem(KEYS.CURRENT_STREAK, streakResult.nextStreak);
      
      const bestStreak = await storageService.getItem<number>(KEYS.BEST_STREAK, 0);
      if (streakResult.nextStreak > bestStreak) {
        await storageService.setItem(KEYS.BEST_STREAK, streakResult.nextStreak);
      }

      // Generate AI summary
      const aiReport = await aiService.generateDailyAuditReport(
        nextAnswers,
        scoreReport.score,
        streakResult.nextStreak
      );
      setFeedback(aiReport);

      // Log into history logs
      const todayStr = new Date().toISOString().split('T')[0];
      const auditLogs = await storageService.getItem<AuditLog[]>('rise_auditHistory', []);
      const newLog: AuditLog = {
        date: todayStr,
        answers: nextAnswers,
        score: scoreReport.score,
        category: scoreReport.category,
        feedback: aiReport,
      };

      const updatedLogs = [...auditLogs.filter(l => l.date !== todayStr), newLog];
      await storageService.setItem('rise_auditHistory', updatedLogs);
      await storageService.setItem('rise_latestAudit', newLog);
      
      setLoading(false);
    }
  };

  return {
    questions,
    currentIndex,
    answers,
    report,
    feedback,
    loading,
    startCheckIn,
    answerQuestion,
  };
}
