export interface PlanAction {
  id: string;
  text: string;
  completed: boolean;
}

export interface DailyPlan {
  date: string;
  goal: string;
  actions: PlanAction[];
  difficulty: 'light' | 'normal' | 'strict';
  motivation: string;
}

export const dailyPlanGenerator = {
  generateLocalPlan(sleepHours: number, streak: number, screenTime: number): DailyPlan {
    const todayStr = new Date().toISOString().split('T')[0];
    
    let goal = "Reprendre le contrôle de ton focus aujourd'hui.";
    let difficulty: 'light' | 'normal' | 'strict' = 'normal';
    let motivation = "Chaque petite victoire construit ta discipline.";
    let actions: PlanAction[] = [
      { id: 'water', text: "Boire 1.5L d'eau 💧", completed: false },
      { id: 'nosleepscreen', text: "Zéro écran 30 min avant de dormir 📱", completed: false },
      { id: 'audit', text: "Faire le Life Audit en fin de journée 🧠", completed: false },
    ];

    if (sleepHours < 6) {
      goal = "Objectif du jour : Récupérer et recharger ton énergie.";
      difficulty = 'light';
      motivation = "Ne force pas trop aujourd'hui. Fais le strict minimum pour maintenir la flamme.";
      actions = [
        { id: 'sleep_early', text: "Te coucher avant 22h30 ce soir 🛌", completed: false },
        { id: 'hydrate', text: "Boire un grand verre d'eau au réveil 💧", completed: false },
        { id: 'brush', text: "Brosser les dents et te laver rapidement 🪥", completed: false },
      ];
    } else if (streak >= 7 && screenTime < 3) {
      goal = "Objectif du jour : Franchir un palier de performance extrême.";
      difficulty = 'strict';
      motivation = "Tu es sur une excellente lancée. C'est le moment d'accélérer.";
      actions = [
        { id: 'workout', text: "Faire 20 min de sport ou d'étirements 🏋️", completed: false },
        { id: 'read', text: "Lire ou apprendre quelque chose pendant 15 min 📚", completed: false },
        { id: 'no_scroll', text: "Zéro réseaux sociaux ou scroll inutile aujourd'hui 🚫", completed: false },
        { id: 'routine', text: "Compléter ta routine matinale en moins de 15 min ⏱️", completed: false },
      ];
    }

    return {
      date: todayStr,
      goal,
      actions,
      difficulty,
      motivation,
    };
  },

  async generatePlanViaAI(
    apiKey: string,
    sleepHours: number,
    streak: number,
    screenTime: number
  ): Promise<DailyPlan> {
    const localFallback = this.generateLocalPlan(sleepHours, streak, screenTime);
    
    try {
      const prompt = `Tu es le coach personnel de discipline de l'application Rise.
Génère un plan de journée personnalisé sous format JSON pour l'utilisateur avec les données suivantes :
- Heures de sommeil : ${sleepHours} heures
- Streak de discipline : ${streak} jours
- Temps écran estimé : ${screenTime} heures

Renvoie STRICTEMENT un objet JSON valide avec les clés suivantes :
- "goal": phrase unique résumant l'objectif principal du jour
- "difficulty": chaîne de caractères parmi "light", "normal", "strict"
- "motivation": message de motivation court et percutant (style Apple Fitness)
- "actions": un tableau d'objets, chaque objet ayant :
  - "id": identifiant unique court de l'action (ex: "water", "no_phone")
  - "text": texte de l'action prioritaire avec un emoji (ex: "Boire de l'eau 💧")
  - "completed": initialisé à false

Exemple de réponse attendue :
{
  "goal": "Reprendre le contrôle de ton temps d'écran.",
  "difficulty": "normal",
  "motivation": "La discipline commence au réveil.",
  "actions": [
    { "id": "no_scroll", "text": "Éviter le scroll au lit 📱", "completed": false },
    { "id": "hydrate", "text": "Boire 1.5L d'eau 💧", "completed": false }
  ]
}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: 'application/json',
            },
          }),
        }
      );

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (rawText) {
        const plan = JSON.parse(rawText.trim()) as DailyPlan;
        plan.date = new Date().toISOString().split('T')[0];
        return plan;
      }
      return localFallback;
    } catch (e) {
      console.warn("Gemini plan generation error, falling back to rule engine", e);
      return localFallback;
    }
  }
};
