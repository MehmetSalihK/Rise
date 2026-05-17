import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { storageService, KEYS } from '../services/storageService';
import { StreakBadge } from '../components/StreakBadge';
import { ChevronRight, Brain, Clock, ShieldAlert } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import { AuditLog } from '../hooks/useCheckIn';

export function HomeScreen({ navigation }: any) {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [currentStreak, setCurrentStreak] = useState(0);
  const [latestAudit, setLatestAudit] = useState<AuditLog | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      const loadDashboard = async () => {
        const streak = await storageService.getItem<number>(KEYS.CURRENT_STREAK, 0);
        const todayStr = new Date().toISOString().split('T')[0];
        const latest = await storageService.getItem<AuditLog | null>('rise_latestAudit', null);
        
        setCurrentStreak(streak);
        
        if (latest && latest.date === todayStr) {
          setLatestAudit(latest);
        } else {
          setLatestAudit(null);
        }
      };
      loadDashboard();
    }, [])
  );

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));
      setDate(now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getCategoryColor = (cat: string) => {
    if (cat === 'EXCELLENT') return '#22C55E';
    if (cat === 'MOYEN') return '#F59E0B';
    return '#EF4444';
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Clock */}
        <View style={styles.header}>
          <Text style={styles.dateText}>{date}</Text>
          <Text style={styles.timeText}>{time || '00:00'}</Text>
        </View>

        {/* Streak 🔥 Badge */}
        <View style={styles.streakWrapper}>
          <StreakBadge streak={currentStreak} />
        </View>

        {/* Core Behavior State card */}
        {latestAudit ? (
          <View style={[styles.statusCard, { borderColor: getCategoryColor(latestAudit.category) }]}>
            <View style={styles.statusHeader}>
              <View style={styles.statusHeaderLeft}>
                <Brain size={14} color="#6366F1" />
                <Text style={styles.statusTitle}>AUDIT COMPLÉTÉ</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: `${getCategoryColor(latestAudit.category)}15` }]}>
                <Text style={[styles.badgeText, { color: getCategoryColor(latestAudit.category) }]}>
                  {latestAudit.category}
                </Text>
              </View>
            </View>
            <View style={styles.scoreRow}>
              <Text style={[styles.scoreNumber, { color: getCategoryColor(latestAudit.category) }]}>
                {latestAudit.score}%
              </Text>
              <Text style={styles.scoreLabel}>Score de discipline</Text>
            </View>
            <Text style={styles.feedbackText}>{latestAudit.feedback}</Text>
          </View>
        ) : (
          <View style={[styles.statusCard, { borderColor: '#EF4444' }]}>
            <View style={styles.statusHeader}>
              <View style={styles.statusHeaderLeft}>
                <ShieldAlert size={14} color="#EF4444" />
                <Text style={[styles.statusTitle, { color: '#EF4444' }]}>AUDIT REQUIS</Text>
              </View>
            </View>
            <Text style={styles.feedbackTextEmpty}>
              Tu n'as pas encore validé ta journée. Fais ton check-in comportemental maintenant.
            </Text>
          </View>
        )}

        {/* Main large visual audit button CTA */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('CheckIn')}
          style={[styles.ctaButton, latestAudit ? styles.ctaCompleted : styles.ctaActive]}
        >
          <Text style={styles.ctaButtonText}>
            {latestAudit ? 'REFAIRE LE CHECK-IN' : 'COMMENCER LE CHECK-IN'}
          </Text>
          <ChevronRight size={18} color="#ffffff" style={{ marginLeft: 6 }} />
        </TouchableOpacity>

        {/* Additional minimal info panel */}
        <View style={styles.infoCard}>
          <Clock size={14} color="#8A9CAE" style={{ marginRight: 6 }} />
          <Text style={styles.infoText}>Check-in quotidien • Durée inférieure à 60 secondes</Text>
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
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginVertical: 20,
  },
  dateText: {
    color: '#8A9CAE',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  timeText: {
    color: '#ffffff',
    fontSize: 48,
    fontWeight: '900',
    fontFamily: 'System',
    marginTop: 6,
    letterSpacing: -1,
  },
  streakWrapper: {
    alignItems: 'center',
    marginVertical: 12,
  },
  statusCard: {
    backgroundColor: '#121826',
    borderWidth: 1,
    borderRadius: 22,
    padding: 20,
    marginVertical: 16,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusTitle: {
    color: '#6366F1',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
    marginLeft: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 8,
    fontWeight: '900',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginVertical: 8,
  },
  scoreNumber: {
    fontSize: 34,
    fontWeight: '900',
    fontFamily: 'System',
  },
  scoreLabel: {
    color: '#8A9CAE',
    fontSize: 10,
    fontWeight: '800',
    marginLeft: 8,
    textTransform: 'uppercase',
  },
  feedbackText: {
    color: '#E0E7FF',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    fontStyle: 'italic',
  },
  feedbackTextEmpty: {
    color: '#8A9CAE',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18,
  },
  ctaButton: {
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaActive: {
    backgroundColor: '#6366F1',
  },
  ctaCompleted: {
    backgroundColor: '#1C2638',
    borderColor: '#1F2E45',
    borderWidth: 1,
  },
  ctaButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },
  infoText: {
    color: '#8A9CAE',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
});
