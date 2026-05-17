export interface Question {
  id: string;
  category: 'SOMMEIL' | 'MATIN' | 'HYGIÈNE' | 'DISCIPLINE DIGITALE' | 'PRODUCTIVITÉ' | 'AVANCÉ';
  text: string;
}

export const BASE_QUESTIONS: Question[] = [
  // Sommeil
  { id: 'sleep_7h', category: 'SOMMEIL', text: 'Tu as dormi au moins 7 heures ?' },
  { id: 'bed_23h', category: 'SOMMEIL', text: "Tu t'es couché avant 23h ?" },
  { id: 'wake_7h', category: 'SOMMEIL', text: "Tu t'es réveillé avant 7h ?" },
  // Matin
  { id: 'no_snooze', category: 'MATIN', text: "Tu t'es levé directement sans rester au lit ?" },
  { id: 'fast_start', category: 'MATIN', text: 'Tu as commencé ta journée rapidement ?' },
  // Hygiène
  { id: 'teeth_morning', category: 'HYGIÈNE', text: "Tu t'es brossé les dents ce matin ?" },
  { id: 'washed', category: 'HYGIÈNE', text: "Tu t'es lavé aujourd'hui ?" },
  // Discipline digitale
  { id: 'no_scroll_morning', category: 'DISCIPLINE DIGITALE', text: 'Tu as évité de scroller au réveil ?' },
  { id: 'limit_screentime', category: 'DISCIPLINE DIGITALE', text: "Tu as limité ton temps d'écran aujourd'hui ?" },
  // Productivité
  { id: 'morning_routine', category: 'PRODUCTIVITÉ', text: 'Tu as fait ta routine complète ?' },
];

export const ADVANCED_QUESTIONS: Question[] = [
  { id: 'read_learn', category: 'AVANCÉ', text: 'Tu as lu ou appris quelque chose de nouveau ?' },
  { id: 'workout', category: 'AVANCÉ', text: "Tu as fait du sport / de l'exercice ?" },
];

export const questionEngine = {
  getQuestionsForDay(lastSleepDuration: number, streak: number): Question[] {
    let list = [...BASE_QUESTIONS];

    // Adaptive 1: Fatigue detected -> Reduce cognitive fatigue (keep only 6 essential questions)
    if (lastSleepDuration < 6) {
      list = list.filter(q => 
        ['sleep_7h', 'no_snooze', 'teeth_morning', 'washed', 'no_scroll_morning', 'morning_routine'].includes(q.id)
      );
    }

    // Adaptive 2: High streak (10+ days) -> Inject advanced challenges to raise the bar
    if (streak >= 10) {
      list = [...list, ...ADVANCED_QUESTIONS];
    }

    return list;
  }
};
