import { notificationService } from '../services/notificationService';
import { storageService } from '../services/storageService';

export const wakeUpEngine = {
  async scheduleSequentialWakeUp(wakeTimeStr: string): Promise<void> {
    // 1. Cancel previous alarms if any
    await this.cancelSequentialWakeUp();

    const [h, m] = wakeTimeStr.split(':').map(Number);
    
    // Alarme 1: Exact Time
    const time1 = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    await notificationService.scheduleDailyReminder(
      'rise_alarm_1',
      `Rise Alarme 🌅`,
      `Il est ${time1} — Réveille-toi maintenant !`,
      time1
    );

    // Alarme 2: +5 minutes
    let m2 = m + 5;
    let h2 = h;
    if (m2 >= 60) {
      m2 -= 60;
      h2 = (h2 + 1) % 24;
    }
    const time2 = `${String(h2).padStart(2, '0')}:${String(m2).padStart(2, '0')}`;
    await notificationService.scheduleDailyReminder(
      'rise_alarm_2',
      `Rise Retard ⚠️`,
      `Tu devais être debout depuis 5 minutes maintenant. Secoue-toi.`,
      time2
    );

    // Alarme 3: +10 minutes
    let m3 = m + 10;
    let h3 = h;
    if (m3 >= 60) {
      m3 -= 60;
      h3 = (h3 + 1) % 24;
    }
    const time3 = `${String(h3).padStart(2, '0')}:${String(m3).padStart(2, '0')}`;
    await notificationService.scheduleDailyReminder(
      'rise_alarm_3',
      `Rise Discipline Critique 🚨`,
      `Commence ta journée maintenant. La procrastination matinale détruit ton élan !`,
      time3
    );

    // Save alarm target state
    await storageService.setItem('rise_wake_alarm_time', wakeTimeStr);
    await storageService.setItem('rise_awake_today', false);
  },

  async cancelSequentialWakeUp(): Promise<void> {
    await notificationService.cancelReminder('rise_alarm_1');
    await notificationService.cancelReminder('rise_alarm_2');
    await notificationService.cancelReminder('rise_alarm_3');
  },

  async setAwakeStatus(status: boolean): Promise<void> {
    await storageService.setItem('rise_awake_today', status);
    if (status) {
      // Cancel remaining warnings if user woke up!
      await this.cancelSequentialWakeUp();
    }
  }
};
