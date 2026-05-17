import { notificationService } from '../services/notificationService';

export const notificationEngine = {
  async scheduleAllV5Reminders(): Promise<void> {
    await notificationService.cancelAllReminders();

    // 1. Matin -> Target goals definition reminder
    await notificationService.scheduleDailyReminder(
      'goals_morning',
      'Rise Cibles 🌅',
      "Définis tes objectifs cibles de discipline pour aujourd'hui.",
      '07:30'
    );

    // 2. Journée -> Screentime vigilance reminder
    await notificationService.scheduleDailyReminder(
      'goals_midday',
      'Discipline Digitale 📱',
      "N'oublie pas de surveiller ton temps d'écran aujourd'hui.",
      '14:00'
    );

    // 3. Soir -> Actual verification declarations
    await notificationService.scheduleDailyReminder(
      'goals_evening',
      'Enregistrement de Réalité 📊',
      "L'heure du bilan a sonné. Déclare ta réalité de la journée.",
      '21:30'
    );
  }
};
