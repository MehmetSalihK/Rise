import { UserState, DayRecommendation } from './recommendation';

export const messages = {
  generateDailyCoachingMessage(
    userState: UserState,
    rec: DayRecommendation,
    streak: number,
    completionRate: number
  ): string {
    const hour = new Date().getHours();

    // Morning coachings
    if (hour < 12) {
      if (userState === 'LOW ENERGY') {
        return "Batterie faible aujourd'hui. Fais le minimum mais fais-le bien. Focus repos.";
      }
      if (userState === 'HIGH PERFORMANCE') {
        return "Tu es dans ta zone de puissance ! C'est le moment de repousser tes limites.";
      }
      return "Une nouvelle journée pour construire ta discipline. Reste focus et avance.";
    }

    // Midday / Afternoon check-ins
    if (hour >= 12 && hour < 18) {
      if (completionRate === 1) {
        return "Routine déjà pliée ! Tu es une machine aujourd'hui.";
      }
      if (completionRate > 0) {
        return "Tu es sur la bonne voie. Termine ce que tu as commencé.";
      }
      return "L'après-midi est là. Ne laisse pas la procrastination voler tes victoires.";
    }

    // Night review / warnings
    if (streak > 0 && completionRate < 1) {
      return `Alerte 🔥 : Ton streak de ${streak} jours est en danger. Valide ta routine avant de dormir.`;
    }

    if (completionRate === 1) {
      return "Journée gagnée. Dors l'esprit tranquille, tu as fait le travail.";
    }

    return "La discipline commence par des choix difficiles. Relève la tête pour demain.";
  }
};
