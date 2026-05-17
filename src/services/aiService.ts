import { aiAnalyzer } from '../core/aiAnalyzer';
import { storageService } from './storageService';

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
    const localFeedback = aiAnalyzer.generateLocalFeedback(answers, score);

    if (!key) {
      // Offline fallback
      return localFeedback;
    }

    try {
      // Call Gemini API dynamically
      const prompt = `Tu es le coach de discipline IA ultra-direct de l'application Rise.
Analyse les réponses de l'utilisateur pour l'audit d'aujourd'hui :
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
