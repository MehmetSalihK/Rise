import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { useRoutine, Habit } from '../hooks/useRoutine';
import { useAI } from '../hooks/useAI';
import { TaskItem } from '../components/TaskItem';
import { ProgressBar } from '../components/ProgressBar';
import { CheckSquare, Sparkles } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';

export function RoutineScreen() {
  const { habits, loading, toggleHabit, reload } = useRoutine();
  const { analysis, recalculate } = useAI();

  // Local state to track the bonus high performance task
  const [bonusCompleted, setBonusCompleted] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      reload();
      recalculate();
    }, [reload, recalculate])
  );

  const getAdaptedHabits = (): Habit[] => {
    const rec = analysis.aiReport.recommendation;

    // 1. Light Day (LOW ENERGY) -> keep only 3 core tasks
    if (rec === 'light day') {
      return habits.filter(h => ['water', 'bed', 'teeth'].includes(h.id));
    }

    // 2. Strict Day (HIGH PERFORMANCE) -> add 6th bonus task
    if (rec === 'strict day') {
      const bonusTask: Habit = {
        id: 'bonus',
        name: 'Lecture / Sport (Bonus IA) 📚🏋️',
        completed: bonusCompleted,
      };
      return [...habits, bonusTask];
    }

    // 3. Normal Day -> standard 5 tasks
    return habits;
  };

  const visibleHabits = getAdaptedHabits();
  const completedCount = visibleHabits.filter(h => h.completed).length;
  const totalCount = visibleHabits.length;
  const progressPercent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);
  const isFinished = progressPercent === 100;

  const handleToggle = async (habitId: string) => {
    if (habitId === 'bonus') {
      setBonusCompleted(!bonusCompleted);
    } else {
      await toggleHabit(habitId);
    }
    // Instantly trigger AI scoring updates
    setTimeout(() => recalculate(), 100);
  };

  const getRecMessage = () => {
    const rec = analysis.aiReport.recommendation;
    if (rec === 'light day') return "Journée allégée : focus sur l'essentiel.";
    if (rec === 'strict day') return "Journée intensive : tâche bonus IA activée !";
    return "Discipline quotidienne standard.";
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <CheckSquare size={22} color="#6366F1" />
          </View>
          <Text style={styles.title}>Ma Routine</Text>
          <Text style={styles.subtitle}>
            Focalise-toi sur chaque action sans distraction.
          </Text>
        </View>

        {/* Progress Tracker */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={[styles.progressLabel, isFinished && styles.textSuccess]}>
              {isFinished ? 'Félicitations ! 🏆' : 'Discipline quotidienne'}
            </Text>
            <Text style={styles.progressRatio}>
              {completedCount} / {totalCount}
            </Text>
          </View>
          <ProgressBar progress={progressPercent} />
          <Text style={styles.progressPercentText}>{progressPercent}% complété</Text>
        </View>

        {/* AI adaptive badge */}
        <View style={styles.aiBadge}>
          <Sparkles size={12} color="#6366F1" style={{ marginRight: 6 }} />
          <Text style={styles.aiBadgeText}>{getRecMessage()}</Text>
        </View>

        {/* Tasks list */}
        {loading ? (
          <ActivityIndicator size="large" color="#6366F1" style={{ marginTop: 40 }} />
        ) : (
          <View style={styles.tasksWrapper}>
            {visibleHabits.map((habit) => (
              <TaskItem
                key={habit.id}
                name={habit.name}
                completed={habit.completed}
                onToggle={() => handleToggle(habit.id)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0B0F14',
  },
  container: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginVertical: 16,
  },
  iconContainer: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    padding: 12,
    borderRadius: 16,
    borderColor: 'rgba(99, 102, 241, 0.2)',
    borderWidth: 1,
  },
  title: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '900',
    marginTop: 12,
  },
  subtitle: {
    color: '#8A9CAE',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 20,
  },
  progressCard: {
    backgroundColor: '#121826',
    borderColor: '#1F2E45',
    borderWidth: 1,
    borderRadius: 22,
    padding: 20,
    marginVertical: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  textSuccess: {
    color: '#22C55E',
  },
  progressRatio: {
    color: '#8A9CAE',
    fontSize: 12,
    fontWeight: '800',
    fontFamily: 'System',
  },
  progressPercentText: {
    color: '#8A9CAE',
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'right',
    marginTop: 2,
    textTransform: 'uppercase',
  },
  tasksWrapper: {
    marginTop: 10,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
    borderColor: 'rgba(99, 102, 241, 0.15)',
    borderWidth: 1,
    padding: 12,
    borderRadius: 14,
    marginBottom: 12,
  },
  aiBadgeText: {
    color: '#E0E7FF',
    fontSize: 11,
    fontWeight: '800',
  },
});
