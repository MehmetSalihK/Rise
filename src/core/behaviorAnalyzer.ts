export interface BehaviorDiagnosis {
  userState: 'LOW ENERGY' | 'NORMAL' | 'HIGH DISCIPLINE';
  problem: string;
  recommendation: string;
}

export const behaviorAnalyzer = {
  diagnoseUser(
    sleepDuration: number,
    streak: number,
    screenTime: number,
    averageScore: number
  ): BehaviorDiagnosis {
    let userState: 'LOW ENERGY' | 'NORMAL' | 'HIGH DISCIPLINE' = 'NORMAL';
    let problem = "Aucun problème majeur détecté.";
    let recommendation = "Maintiens ton rythme et continue à documenter tes check-ins.";

    if (sleepDuration < 6) {
      userState = 'LOW ENERGY';
      problem = "Déficit de sommeil critique (sommeil < 6h).";
      recommendation = "Priorise la récupération. Couche-toi 30 minutes plus tôt et évite les écrans le soir.";
    } else if (screenTime >= 4) {
      problem = "Temps d'écran excessif détruisant ton focus.";
      recommendation = "Force-toi à mettre ton téléphone dans une autre pièce 1 heure avant le coucher.";
    } else if (streak >= 7 && averageScore >= 80) {
      userState = 'HIGH DISCIPLINE';
      problem = "Aucun. Discipline optimale.";
      recommendation = "Tu es en plein contrôle. C'est le moment idéal pour lancer un défi exigeant.";
    }

    return {
      userState,
      problem,
      recommendation,
    };
  }
};
