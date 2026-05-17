import { storageService } from './storageService';

function generateLocalFeedback(answers: Record<string, boolean>, score: number): string {
  if (score >= 80) {
    return "Journée exceptionnelle ! Ta discipline est au sommet. Continue ainsi demain. 🔥";
  }
  if (score < 40) {
    return "Alerte de discipline ! Tu as raté la majorité de tes cibles aujourd'hui. Reprends-toi dès ce soir. ⚠️";
  }
  
  const failed: string[] = [];
  if (answers.wakeTime === false) failed.push("le réveil tardif ⏰");
  if (answers.bedTime === false) failed.push("le coucher tardif 🛌");
  if (answers.screenTime === false) failed.push("le temps d'écran excessif 📱");
  if (answers.sportTime === false) failed.push("le manque d'activité physique 🏋️");
  if (answers.readTime === false) failed.push("le manque de lecture 📚");

  if (failed.length > 0) {
    return `Discipline moyenne aujourd'hui. Ton principal point faible a été ${failed[0]}. Ajuste cela demain.`;
  }
  return "Bonne discipline globale aujourd'hui. Reste concentré pour atteindre l'excellence !";
}

export const aiService = {
  async getApiKey(): Promise<string | null> {
    return await storageService.getItem<string | null>('rise_ai_gemini_key', null);
  },

  async setApiKey(key: string): Promise<void> {
    await storageService.setItem('rise_ai_gemini_key', key);
  },

  async generateDailyAuditReport(
    answers: Record<string, boolean>,
    score: number,
    streak: number
  ): Promise<string> {
    const key = await this.getApiKey();
    const localFeedback = generateLocalFeedback(answers, score);

    if (!key) {
      return localFeedback;
    }

    try {
      const prompt = `Tu es le coach de discipline IA ultra-direct de l'application Rise.
Analyse les réponses de l'utilisateur pour l'audit d'aujourd'hui (les valeurs indiquent si l'objectif a été réussi (true) ou échoué (false)) :
${JSON.stringify(answers)}
Score obtenu : ${score}/100.
Streak actuel : ${streak} jours.

Rédige un bilan en 2-3 phrases maximum, percutant, direct, sans fioritures (style Apple Fitness). Dis-lui précisément quel est son point faible aujourd'hui et donne-lui une consigne claire pour demain.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      return text ? text.trim() : localFeedback;
    } catch (e) {
      console.warn("Gemini API error, falling back to local analyzer", e);
      return localFeedback;
    }
  }
};
