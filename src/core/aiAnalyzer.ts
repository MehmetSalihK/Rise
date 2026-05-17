export const aiAnalyzer = {
  generateLocalFeedback(answers: Record<string, boolean>, score: number): string {
    const falseAnswers = Object.keys(answers).filter(k => answers[k] === false);

    if (score >= 90) {
      return "Discipline impériale aujourd'hui. Tu es en pleine maîtrise de tes habitudes. Continue ainsi !";
    }

    if (score >= 70) {
      return "Une excellente journée globale. Maintiens cet élan pour consolider ta chaîne.";
    }

    if (score < 40) {
      // Find biggest failure group
      if (falseAnswers.includes('sleep_7h') || falseAnswers.includes('bed_23h')) {
        return "Ton manque de sommeil sabote ta discipline. Éteins tes écrans tôt ce soir pour briser ce cycle.";
      }
      if (falseAnswers.includes('no_scroll_morning') || falseAnswers.includes('limit_screentime')) {
        return "Le scroll et le temps d'écran ont volé ton focus aujourd'hui. Demain, impose-toi une zone sans téléphone au réveil.";
      }
      return "Journée difficile. La discipline commence par des choix inconfortables. Relève la tête, demain est une nouvelle chance.";
    }

    // Mid scores: 40 to 70
    if (falseAnswers.includes('no_scroll_morning')) {
      return "Bon effort, mais évite impérativement le scroll matinal. C'est le piège numéro un pour ta motivation.";
    }
    if (falseAnswers.includes('sleep_7h') || falseAnswers.includes('wake_7h')) {
      return "Correct, mais veille à régulariser tes heures de coucher et lever pour hausser ton énergie.";
    }

    return "Journée moyenne. Tu as fait le strict minimum, mais tu peux faire bien mieux. Hausse ton niveau d'exigence demain.";
  }
};
