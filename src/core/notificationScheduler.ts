import { notificationService } from '../services/notificationService';

export const notificationScheduler = {
  async scheduleAllCoachReminders(): Promise<void> {
    await notificationService.cancelAllReminders();

    // 1. 07:00 -> Plan du jour IA
    await notificationService.scheduleDailyReminder(
      'coach_0700',
      'Rise AI Coach 🌅',
      "Ton plan du jour personnalisé t'attend. Viens découvrir ton objectif !",
      '07:00'
    );

    // 2. 10:00 -> Rappel routine
    await notificationService.scheduleDailyReminder(
      'coach_1000',
      'Discipline Routine 🧘',
      "As-tu accompli tes premières actions prioritaires ? Maintiens le focus.",
      '10:00'
    );

    // 3. 14:00 -> Rappel temps écran / focus
    await notificationService.scheduleDailyReminder(
      'coach_1400',
      'Discipline Digitale 📱',
      "Attention aux distractions. Pose ton téléphone et poursuis tes efforts.",
      '14:00'
    );

    // 4. 18:00 -> Check progression
    await notificationService.scheduleDailyReminder(
      'coach_1800',
      'Life Audit ce soir 🧠',
      "Ta journée touche à sa fin. Prépare-toi à dresser ton bilan Oui/Non.",
      '18:00'
    );

    // 5. 22:00 -> Rappel Sommeil
    await notificationService.scheduleDailyReminder(
      'coach_2200',
      'Discipline Sommeil 🛌',
      "Éteins tes écrans. Ta réussite de demain se prépare ce soir.",
      '22:00'
    );
  }
};
