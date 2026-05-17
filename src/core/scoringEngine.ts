import { MetricComparison } from './comparisonEngine';

export interface ScoreReport {
  score: number;
  category: 'MAUVAIS' | 'MOYEN' | 'EXCELLENT';
  color: string;
  successCount: number;
}

export const scoringEngine = {
  calculateScore(comparisons: MetricComparison[]): ScoreReport {
    if (comparisons.length === 0) {
      return { score: 0, category: 'MAUVAIS', color: '#EF4444', successCount: 0 };
    }

    const successCount = comparisons.filter(c => c.success).length;
    const score = Math.round((successCount / comparisons.length) * 100);

    let category: 'MAUVAIS' | 'MOYEN' | 'EXCELLENT' = 'MOYEN';
    let color = '#F59E0B'; // Orange

    if (score >= 70) {
      category = 'EXCELLENT';
      color = '#22C55E'; // Green
    } else if (score < 40) {
      category = 'MAUVAIS';
      color = '#EF4444'; // Red
    }

    return {
      score,
      category,
      color,
      successCount,
    };
  }
};
