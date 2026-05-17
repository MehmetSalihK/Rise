export interface Quote {
  text: string;
  author: string;
}

export const quotes: Quote[] = [
  { text: "La discipline est le pont entre les objectifs et les accomplissements.", author: "Jim Rohn" },
  { text: "Nous sommes ce que nous répétons sans cesse. L'excellence n'est pas un acte, mais une habitude.", author: "Aristote" },
  { text: "Le meilleur moment pour planter un arbre était il y a 20 ans. Le deuxième meilleur moment est maintenant.", author: "Proverbe chinois" },
  { text: "Le secret pour avancer est de commencer.", author: "Mark Twain" },
  { text: "Chaque matin, nous naissons à nouveau. Ce que nous faisons aujourd'hui est ce qui importe le plus.", author: "Bouddha" },
  { text: "Les habitudes atomiques façonnent votre identité. Petit effort quotidien = grand résultat.", author: "James Clear" },
  { text: "Le bonheur réside dans la discipline de soi.", author: "Mencius" },
  { text: "La vie commence là où s'arrête votre zone de confort.", author: "Neale Donald Walsch" },
  { text: "Ne comparez pas votre progression à celle des autres. Comparez-la à qui vous étiez hier.", author: "Jordan Peterson" },
  { text: "La discipline n'est pas une punition, c'est l'outil ultime pour obtenir ce que vous voulez vraiment.", author: "Inconnu" }
];

export function getDailyQuote(): Quote {
  // Use day of year to cycle through quotes so it changes daily
  const today = new Date();
  const start = new Date(today.getFullYear(), 0, 0);
  const diff = today.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  
  return quotes[dayOfYear % quotes.length];
}

export function getGreeting(userName: string): string {
  const hour = new Date().getHours();
  
  if (hour < 5) {
    return `Couche-toi tôt, ${userName}. Le sommeil est ton super-pouvoir. 🌙`;
  } else if (hour < 12) {
    return `Bon matin, ${userName}. Aujourd'hui tu construis ton futur. ⚡️`;
  } else if (hour < 18) {
    return `Bon après-midi, ${userName}. Reste focus sur tes objectifs. 🎯`;
  } else {
    return `Bonne soirée, ${userName}. Prépare tranquillement ton repos. 🛌`;
  }
}

export function getPositiveFeedback(completedCount: number, totalCount: number): string {
  if (completedCount === 0) {
    return "Commence doucement, une habitude après l'autre. 🌱";
  }
  
  const ratio = completedCount / totalCount;
  if (ratio === 1) {
    return "Journée parfaite ! Tu as tout complété. Incroyable ! 🔥🏆";
  } else if (ratio >= 0.7) {
    return "Tu y es presque ! Continue sur cette lancée. 💪";
  } else if (ratio >= 0.4) {
    return "La moitié est faite. Garde la discipline ! ⚡️";
  } else {
    return "C'est un bon début. Continue d'avancer ! 👍";
  }
}
