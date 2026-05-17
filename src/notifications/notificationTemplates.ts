export interface NotificationContent {
  title: string;
  body: string;
}

export const notificationTemplates = {
  GOOD_STATE: {
    '07:30': { title: "Rise Coach 🌅", body: "Une nouvelle journée commence Mehmet ! Tes objectifs cibles sont prêts, poursuis ton excellente discipline." },
    '14:00': { title: "Discipline Focus ⚡", body: "Tu te débrouilles exceptionnellement bien. Continue sur cette lancée." },
    '21:30': { title: "Rapport du Soir 📊", body: "Il est temps de valider tes victoires du jour. Déclare tes chiffres." }
  } as Record<string, NotificationContent>,

  MEDIUM_STATE: {
    '07:30': { title: "Nouveau Départ 🌅", body: " Mehmet, réveille ton focus. Ajuste tes cibles d'aujourd'hui pour progresser." },
    '14:00': { title: "Vigilance Temps Écran 📱", body: "N'oublie pas tes objectifs. Limite ton scroll inutile." },
    '21:30': { title: "Enregistrement de Réalité 📊", body: "Reste honnête envers toi-même. Déclare tes chiffres du jour." }
  } as Record<string, NotificationContent>,

  BAD_STATE: {
    '07:30': { title: "Discipline Urgente 🚨", body: "Mehmet, tes habitudes dérivent. Ajuste immédiatement tes cibles pour te reprendre en main !" },
    '10:30': { title: "Rappel Routine 🧘", body: "Tu laisses la procrastination s'installer. Fais tes exercices maintenant !" },
    '14:00': { title: "Temps d'Écran Critique 📱", body: "Alerte ! Pose immédiatement ton téléphone. Tu perds ton temps précieux." },
    '18:00': { title: "Discipline en Danger ⚠️", body: "Tu es en train de perdre ta journée. Il reste quelques heures pour réagir." },
    '22:30': { title: "Préparation Sommeil 🛌", body: "Alerte sommeil ! Couche-toi maintenant pour éviter un nouveau réveil tardif." },
    '23:30': { title: "Rythme Détruit 🚨", body: "Alerte Critique ! Tu détruis ton rythme de sommeil. Éteins TOUT immédiatement." }
  } as Record<string, NotificationContent>
};
