import React, { useMemo } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { useStreak } from '../hooks/useStreak';
import { useRoutine } from '../hooks/useRoutine';
import { Card } from '../components/ui/Card';
import { Flame, Calendar, ShieldAlert, Award } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';

export function StreakScreen() {
  const { currentStreak, bestStreak, streakHistory, loading, reload: reloadStreak } = useStreak();
  const { habits, reload: reloadRoutine } = useRoutine();

  useFocusEffect(
    React.useCallback(() => {
      reloadStreak();
      reloadRoutine();
    }, [reloadStreak, reloadRoutine])
  );

  const completedCount = habits.filter(h => h.completed).length;
  const isCompletedToday = completedCount === habits.length && habits.length > 0;

  // Streak status card resolver
  const status = useMemo(() => {
    if (currentStreak === 0) {
      return {
        label: "Tu as cassé la chaîne",
        color: '#8A9CAE',
        bg: 'rgba(138, 156, 174, 0.05)',
        borderColor: 'rgba(138, 156, 174, 0.15)',
        icon: <ShieldAlert size={18} color="#8A9CAE" />
      };
    }

    if (!isCompletedToday) {
      return {
        label: "Série en danger !",
        color: '#EF4444',
        bg: 'rgba(239, 68, 68, 0.05)',
        borderColor: 'rgba(239, 68, 68, 0.2)',
        icon: <Flame size={18} color="#EF4444" />
      };
    }

    return {
      label: "Discipline solide",
      color: '#22C55E',
      bg: 'rgba(34, 197, 94, 0.05)',
      borderColor: 'rgba(34, 197, 94, 0.2)',
      icon: <Award size={18} color="#22C55E" />
    };
  }, [currentStreak, isCompletedToday]);

  // Generate 28 past days
  const historyDays = useMemo(() => {
    const list = [];
    const today = new Date();
    for (let i = 27; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      list.push({
        dateStr,
        label: d.getDate(),
        dayOfWeek: d.toLocaleDateString('fr-FR', { weekday: 'short' }),
        isFuture: d > today,
        isToday: dateStr === today.toISOString().split('T')[0]
      });
    }
    return list;
  }, []);

  const getDayStatusColor = (day: any) => {
    if (day.isFuture) return '#1A2333';
    
    const isCompleted = streakHistory.includes(day.dateStr);
    if (isCompleted) return '#22C55E';
    
    if (day.isToday) return '#6366F1';
    
    return '#EF4444';
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Flame size={22} color="#F59E0B" fill="#F59E0B" />
          </View>
          <Text style={styles.title}>Discipline</Text>
          <Text style={styles.subtitle}>
            Mesure ta régularité et évite de casser ta série de victoires.
          </Text>
        </View>

        {/* Central Giant streak */}
        {loading ? (
          <ActivityIndicator size="large" color="#F59E0B" style={{ marginVertical: 30 }} />
        ) : (
          <View style={styles.streakDisplay}>
            <View style={styles.badgeLarge}>
              <Flame size={48} color="#F59E0B" fill="#F59E0B" />
            </View>
            <Text style={styles.streakNumber}>🔥 {currentStreak} JOUR{currentStreak > 1 ? 'S' : ''}</Text>
            <Text style={styles.streakBest}>Record Personnel : {bestStreak} jours</Text>
          </View>
        )}

        {/* Status card banner */}
        <View style={[styles.statusBanner, { backgroundColor: status.bg, borderColor: status.borderColor }]}>
          {status.icon}
          <Text style={[styles.statusLabel, { color: status.color }]}>{status.label}</Text>
        </View>

        {/* 28-day chain grid */}
        <View style={styles.calendarCard}>
          <View style={styles.calendarHeader}>
            <Calendar size={16} color="#6366F1" />
            <Text style={styles.calendarTitle}>Chaîne de Discipline</Text>
          </View>

          <View style={styles.grid}>
            {historyDays.map((day, idx) => (
              <View key={idx} style={[styles.gridItem, { backgroundColor: getDayStatusColor(day) }]}>
                <Text style={styles.gridDayOfWeek}>{day.dayOfWeek.slice(0, 3)}</Text>
                <Text style={styles.gridDayNum}>{day.label}</Text>
              </View>
            ))}
          </View>

          {/* Legend */}
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: '#22C55E' }]} />
              <Text style={styles.legendText}>Réussi</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: '#EF4444' }]} />
              <Text style={styles.legendText}>Manqué</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: '#1A2333' }]} />
              <Text style={styles.legendText}>Futur</Text>
            </View>
          </View>
        </View>
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
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    padding: 12,
    borderRadius: 16,
    borderColor: 'rgba(245, 158, 11, 0.2)',
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
  streakDisplay: {
    alignItems: 'center',
    marginVertical: 16,
  },
  badgeLarge: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(245, 158, 11, 0.05)',
    borderColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakNumber: {
    color: '#ffffff',
    fontSize: 34,
    fontWeight: '900',
    marginTop: 12,
    fontFamily: 'System',
  },
  streakBest: {
    color: '#8A9CAE',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginTop: 4,
    letterSpacing: 1,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginVertical: 12,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '900',
    marginLeft: 8,
    textTransform: 'uppercase',
  },
  calendarCard: {
    backgroundColor: '#121826',
    borderColor: '#1F2E45',
    borderWidth: 1,
    borderRadius: 22,
    padding: 20,
    marginVertical: 12,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  calendarTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
    marginLeft: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '12%',
    height: 40,
    borderRadius: 10,
    marginVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridDayOfWeek: {
    color: '#ffffff',
    fontSize: 7,
    fontWeight: '800',
    opacity: 0.6,
    textTransform: 'uppercase',
  },
  gridDayNum: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '900',
    marginTop: 1,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    color: '#8A9CAE',
    fontSize: 9,
    fontWeight: '800',
    marginLeft: 6,
    textTransform: 'uppercase',
  },
});
