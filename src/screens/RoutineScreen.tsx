import React from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { useRoutine } from '../hooks/useRoutine';
import { TaskItem } from '../components/TaskItem';
import { ProgressBar } from '../components/ProgressBar';
import { CheckSquare } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';

export function RoutineScreen() {
  const { habits, loading, toggleHabit, reload } = useRoutine();

  useFocusEffect(
    React.useCallback(() => {
      reload();
    }, [reload])
  );

  const completedCount = habits.filter(h => h.completed).length;
  const totalCount = habits.length;
  const progressPercent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);
  const isFinished = progressPercent === 100;

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

        {/* Tasks list */}
        {loading ? (
          <ActivityIndicator size="large" color="#6366F1" style={{ marginTop: 40 }} />
        ) : (
          <View style={styles.tasksWrapper}>
            {habits.map((habit) => (
              <TaskItem
                key={habit.id}
                name={habit.name}
                completed={habit.completed}
                onToggle={() => toggleHabit(habit.id)}
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
});
