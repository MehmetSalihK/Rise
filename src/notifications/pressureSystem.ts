import { storageService, KEYS } from '../services/storageService';
import { DailyTrackingLog } from '../hooks/useTracking';

export type PressureState = 'GOOD' | 'MEDIUM' | 'BAD';

export const pressureSystem = {
  async evaluateCurrentPressure(): Promise<PressureState> {
    const latest = await storageService.getItem<DailyTrackingLog | null>('rise_latestAudit', null);
    
    // Default fallback
    if (!latest) return 'MEDIUM';

    // Rollover check: If the latest audit is older than 24 hours (inactive)
    const today = new Date().toISOString().split('T')[0];
    const latestDate = new Date(latest.date);
    const differenceInMs = Math.abs(new Date(today).getTime() - latestDate.getTime());
    const differenceInDays = differenceInMs / (1000 * 60 * 60 * 24);

    if (differenceInDays >= 1) {
      // Inactivity triggers strict pressure!
      return 'BAD';
    }

    if (latest.score >= 70) return 'GOOD';
    if (latest.score < 40) return 'BAD';
    return 'MEDIUM';
  }
};
