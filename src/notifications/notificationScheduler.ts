import { notificationService } from '../services/notificationService';
import { smartNotificationEngine } from './smartNotificationEngine';
import { pressureSystem } from './pressureSystem';

export const notificationScheduler = {
  async schedulePressureCoachAlerts(forceState?: 'GOOD' | 'MEDIUM' | 'BAD'): Promise<void> {
    await notificationService.cancelAllReminders();

    const activeState = forceState || await pressureSystem.evaluateCurrentPressure();
    
    // GOOD slots: 07:30, 14:00, 21:30 (light messages)
    // MEDIUM slots: 07:30, 14:00, 21:30 (medium messages)
    // BAD slots: 07:30, 10:30, 14:00, 18:00, 22:30, 23:30 (strict hourly pressure)
    const slots = activeState === 'BAD'
      ? ['07:30', '10:30', '14:00', '18:00', '22:30', '23:30']
      : ['07:30', '14:00', '21:30'];

    for (const slot of slots) {
      const alert = await smartNotificationEngine.getContextualAlert(slot, forceState);
      const identifier = `rise_pressure_${slot.replace(':', '')}`;
      
      await notificationService.scheduleDailyReminder(
        identifier,
        alert.title,
        alert.body,
        slot
      );
    }
  }
};
