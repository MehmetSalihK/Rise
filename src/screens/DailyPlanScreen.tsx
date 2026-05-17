import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useDailyPlan } from '../hooks/useDailyPlan';
import { Sparkles, CheckSquare, Square, BrainCircuit } from 'lucide-react-native';

export function DailyPlanScreen({ navigation }: any) {
  const { plan, loading, toggleAction } = useDailyPlan();

  if (loading || !plan) {
    return (
      <SafeAreaView style={styles.loadingSafe}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Génération du plan IA...</Text>
      </SafeAreaView>
    );
  }

  const getDifficultyColor = (diff: string) => {
    if (diff === 'strict') return '#EF4444';
    if (diff === 'normal') return '#6366F1';
    return '#22C55E';
  };

  const completedCount = plan.actions.filter(a => a.completed).length;
  const isAllCompleted = completedCount === plan.actions.length && plan.actions.length > 0;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconBox}>
            <Sparkles size={20} color="#6366F1" />
          </View>
          <Text style={styles.title}>Plan de Journée</Text>
          <Text style={styles.subtitle}>Voici ton guide comportemental d'aujourd'hui.</Text>
        </View>

        {/* Goal Card */}
        <View style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <Text style={styles.goalHeaderLabel}>OBJECTIF IA DU JOUR</Text>
            <View style={[styles.diffBadge, { backgroundColor: `${getDifficultyColor(plan.difficulty)}15`, borderColor: getDifficultyColor(plan.difficulty) }]}>
              <Text style={[styles.diffText, { color: getDifficultyColor(plan.difficulty) }]}>
                {plan.difficulty.toUpperCase()}
              </Text>
            </View>
          </View>
          <Text style={styles.goalText}>"{plan.goal}"</Text>
        </View>

        {/* Coach Advice card */}
        <View style={styles.coachCard}>
          <View style={styles.coachHeader}>
            <BrainCircuit size={16} color="#6366F1" style={{ marginRight: 6 }} />
            <Text style={styles.coachTitle}>Le Conseil du Coach</Text>
          </View>
          <Text style={styles.coachText}>{plan.motivation}</Text>
        </View>

        {/* Priorities Checklist */}
        <Text style={styles.sectionLabel}>Actions Prioritaires ({completedCount}/{plan.actions.length})</Text>
        <View style={styles.list}>
          {plan.actions.map((action) => (
            <TouchableOpacity
              key={action.id}
              activeOpacity={0.8}
              onPress={() => toggleAction(action.id)}
              style={[styles.taskItem, action.completed ? styles.taskCompleted : styles.taskActive]}
            >
              <View style={styles.taskLeft}>
                {action.completed ? (
                  <CheckSquare size={20} color="#22C55E" />
                ) : (
                  <Square size={20} color="#8A9CAE" />
                )}
                <Text style={[styles.taskText, action.completed && styles.taskTextDone]}>
                  {action.text}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Complete State confirmation */}
        {isAllCompleted ? (
          <View style={styles.victoryBanner}>
            <Text style={styles.victoryTitle}>Toutes les actions sont validées ! 🎉</Text>
            <Text style={styles.victorySub}>
              Excellente discipline. N'oublie pas de faire ton check-in Oui/Non ce soir.
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Home')}
            style={styles.mainButton}
          >
            <Text style={styles.mainButtonText}>Exécuter le plan</Text>
          </TouchableOpacity>
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
  loadingSafe: {
    flex: 1,
    backgroundColor: '#0B0F14',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#8A9CAE',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 12,
    textTransform: 'uppercase',
  },
  header: {
    alignItems: 'center',
    marginVertical: 12,
  },
  iconBox: {
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
  },
  goalCard: {
    backgroundColor: '#121826',
    borderColor: '#1F2E45',
    borderWidth: 1,
    borderRadius: 22,
    padding: 20,
    marginVertical: 12,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  goalHeaderLabel: {
    color: '#8A9CAE',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
  diffBadge: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  diffText: {
    fontSize: 8,
    fontWeight: '900',
  },
  goalText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 22,
  },
  coachCard: {
    backgroundColor: '#121826',
    borderColor: 'rgba(99, 102, 241, 0.25)',
    borderWidth: 1,
    borderRadius: 20,
    padding: 18,
    marginVertical: 6,
  },
  coachHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  coachTitle: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  coachText: {
    color: '#E0E7FF',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    fontStyle: 'italic',
  },
  sectionLabel: {
    color: '#8A9CAE',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 20,
    marginBottom: 10,
  },
  list: {
    marginVertical: 6,
  },
  taskItem: {
    borderRadius: 16,
    padding: 16,
    marginVertical: 4,
    borderWidth: 1,
  },
  taskActive: {
    backgroundColor: '#121826',
    borderColor: '#1F2E45',
  },
  taskCompleted: {
    backgroundColor: 'rgba(34, 197, 94, 0.05)',
    borderColor: 'rgba(34, 197, 94, 0.2)',
  },
  taskLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
    marginLeft: 12,
  },
  taskTextDone: {
    color: '#8A9CAE',
    textDecorationLine: 'line-through',
  },
  victoryBanner: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderColor: 'rgba(34, 197, 94, 0.2)',
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginVertical: 20,
  },
  victoryTitle: {
    color: '#22C55E',
    fontSize: 14,
    fontWeight: '900',
    textAlign: 'center',
  },
  victorySub: {
    color: '#8A9CAE',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 16,
  },
  mainButton: {
    backgroundColor: '#6366F1',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  mainButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
