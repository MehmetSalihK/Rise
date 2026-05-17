import { DailyGoals } from './goalEngine';

export interface TrackingValues {
  wakeTime: string;
  bedTime: string;
  screenTime: number;
  sportTime: number;
  readTime: number;
}

export interface MetricComparison {
  metric: string;
  label: string;
  target: string;
  actual: string;
  success: boolean;
}

export function parseTimeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  // Adjusted scale: late hours after midnight (00:00 - 06:00) are mapped as 24:00 to 30:00
  const adjustedH = h < 6 ? h + 24 : h;
  return adjustedH * 60 + m;
}

export const comparisonEngine = {
  compare(goals: DailyGoals, actuals: TrackingValues): MetricComparison[] {
    const results: MetricComparison[] = [];

    // 1. Wake Time (actual <= target)
    const wakeTargetMin = parseTimeToMinutes(goals.wakeTime);
    const wakeActualMin = parseTimeToMinutes(actuals.wakeTime);
    results.push({
      metric: 'wakeTime',
      label: 'HEURE DE RÉVEIL',
      target: `≤ ${goals.wakeTime}`,
      actual: actuals.wakeTime,
      success: wakeActualMin <= wakeTargetMin,
    });

    // 2. Bedtime (actual <= target)
    const bedTargetMin = parseTimeToMinutes(goals.bedTime);
    const bedActualMin = parseTimeToMinutes(actuals.bedTime);
    results.push({
      metric: 'bedTime',
      label: 'HEURE DE COUCHER',
      target: `≤ ${goals.bedTime}`,
      actual: actuals.bedTime,
      success: bedActualMin <= bedTargetMin,
    });

    // 3. Screen Time (actual <= target)
    results.push({
      metric: 'screenTime',
      label: "TEMPS D'ÉCRAN",
      target: `≤ ${goals.screenTime}h`,
      actual: `${actuals.screenTime}h`,
      success: actuals.screenTime <= goals.screenTime,
    });

    // 4. Sport (actual >= target)
    results.push({
      metric: 'sportTime',
      label: 'DURÉE SPORT',
      target: `≥ ${goals.sportTime} min`,
      actual: `${actuals.sportTime} min`,
      success: actuals.sportTime >= goals.sportTime,
    });

    // 5. Reading (actual >= target)
    results.push({
      metric: 'readTime',
      label: 'DURÉE LECTURE',
      target: `≥ ${goals.readTime} min`,
      actual: `${actuals.readTime} min`,
      success: actuals.readTime >= goals.readTime,
    });

    return results;
  }
};
