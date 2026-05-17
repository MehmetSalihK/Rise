// Streak math & logic helpers for Hard Discipline Mode

export function calculateStreak(
  streakHistory: string[],
  todayCompleted: boolean
): number {
  if (streakHistory.length === 0) return todayCompleted ? 1 : 0;

  const sortedDates = [...streakHistory].sort();
  let currentStreak = 0;
  const todayStr = new Date().toISOString().split('T')[0];

  // Helper to get date string relative to today minus N days
  const getDateOffsetStr = (offset: number): string => {
    const d = new Date();
    d.setDate(d.getDate() - offset);
    return d.toISOString().split('T')[0];
  };

  // Check backwards if consecutive days are completed
  let offset = 0;
  // If completed today, we start checking from offset 0 (today)
  // Else we start checking from yesterday
  if (!todayCompleted) {
    offset = 1;
  }

  while (true) {
    const targetDate = getDateOffsetStr(offset);
    if (sortedDates.includes(targetDate)) {
      currentStreak++;
      offset++;
    } else {
      break;
    }
  }

  return currentStreak;
}
