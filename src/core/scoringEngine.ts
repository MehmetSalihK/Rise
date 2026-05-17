export type DayCategory = 'MAUVAIS' | 'MOYEN' | 'EXCELLENT';

export interface ScoreReport {
  score: number;
  category: DayCategory;
  color: string;
}

export const scoringEngine = {
  calculateScore(answers: Record<string, boolean>): ScoreReport {
    const keys = Object.keys(answers);
    if (keys.length === 0) {
      return { score: 0, category: 'MAUVAIS', color: '#EF4444' };
    }

    const yesCount = keys.filter(k => answers[k] === true).length;
    const score = Math.round((yesCount / keys.length) * 100);

    let category: DayCategory = 'MOYEN';
    let color = '#F59E0B'; // Warning (orange)

    if (score >= 70) {
      category = 'EXCELLENT';
      color = '#22C55E'; // Success (green)
    } else if (score < 40) {
      category = 'MAUVAIS';
      color = '#EF4444'; // Danger (red)
    }

    return {
      score,
      category,
      color,
    };
  }
};
