import { pressureSystem } from './pressureSystem';
import { notificationTemplates, NotificationContent } from './notificationTemplates';
import { aiService } from '../services/aiService';

export const smartNotificationEngine = {
  async getContextualAlert(timeSlot: string, forceState?: 'GOOD' | 'MEDIUM' | 'BAD'): Promise<NotificationContent> {
    const state = forceState || await pressureSystem.evaluateCurrentPressure();
    
    const stateKey = `${state}_STATE` as 'GOOD_STATE' | 'MEDIUM_STATE' | 'BAD_STATE';
    const templatesForState = notificationTemplates[stateKey];
    let selected = templatesForState[timeSlot];

    if (!selected) {
      // If a slot is missing in GOOD/MEDIUM, fallback to BAD warning for this specific hour
      selected = notificationTemplates.BAD_STATE[timeSlot] || {
        title: "Rise Coach Mehmet ⏰",
        body: "Prends 30 secondes pour évaluer ta discipline aujourd'hui."
      };
    }

    // AI Enhancement: if API key is present, let's inject a premium coach flair!
    const apiKey = await aiService.getApiKey();
    if (apiKey) {
      try {
        const prompt = `Tu es le coach de discipline IA de Mehmet dans l'application Rise.
Il est actuellement dans un état de discipline de niveau : ${state}.
L'heure actuelle du rappel est : ${timeSlot}.
Le message par défaut est : "${selected.body}"

Modifie ce message en 1 phrase courte, percutante, haptique, pour le pousser à agir.
Renvoie STRICTEMENT le message révisé, sans guillemets ni introduction.`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
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
        if (text) {
          return {
            title: selected.title,
            body: text.trim(),
          };
        }
      } catch (e) {
        console.warn("Gemini smart templates enrichments failed, using fallback static templates", e);
      }
    }

    return selected;
  }
};
