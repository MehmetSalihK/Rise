import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useRoutine } from '../hooks/useRoutine';
import { useStreak } from '../hooks/useStreak';
import { useAI } from '../hooks/useAI';
import { storageService, KEYS } from '../services/storageService';
import { StreakBadge } from '../components/StreakBadge';
import { Clock, Moon, ChevronRight, Zap, Brain, ShieldAlert } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';

export function HomeScreen({ navigation }: any) {
  const { habits, reload: reloadRoutine } = useRoutine();
  const { currentStreak, reload: reloadStreak } = useStreak();
  const { analysis, loading: aiLoading, recalculate } = useAI();

  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [wakeGoal, setWakeGoal] = useState('06:30');
  const [userName, setUserName] = useState('Mehmet');

  useFocusEffect(
    React.useCallback(() => {
      reloadRoutine();
      reloadStreak();
      recalculate();
      
      const loadProfile = async () => {
        const goal = await storageService.getItem<string>(KEYS.WAKE_GOAL, '06:30');
        const name = await storageService.getItem<string>(KEYS.USER_NAME, 'Mehmet');
        setWakeGoal(goal);
        setUserName(name);
      };
      loadProfile();
    }, [reloadRoutine, reloadStreak, recalculate])
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

  const completedCount = habits.filter(h => h.completed).length;
  const totalCount = habits.length;
  const isFinishedToday = completedCount === totalCount && totalCount > 0;

  const getEnergyColor = (state: string) => {
    if (state === 'HIGH PERFORMANCE') return '#22C55E';
    if (state === 'LOW ENERGY') return '#EF4444';
    return '#6366F1';
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.dateText}>{date}</Text>
          <Text style={styles.timeText}>{time || '00:00'}</Text>
        </View>

        {/* Level & Streaks */}
        <View style={styles.badgeWrapper}>
          <StreakBadge streak={currentStreak} />
        </View>

        <Text style={styles.greetingText}>Salut, {userName} 👋</Text>

        {/* AI Discipline Score & Status Card */}
        {aiLoading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="small" color="#6366F1" />
          </View>
        ) : (
          <View style={styles.aiCard}>
            <View style={styles.aiHeader}>
              <View style={styles.aiHeaderLeft}>
                <Brain size={16} color="#6366F1" />
                <Text style={styles.aiTitle}>Coach IA Discipline</Text>
              </View>
              <View 
                style={[
                  styles.energyBadge, 
                  { backgroundColor: `${getEnergyColor(analysis.aiReport.userState)}20` }
                ]}
              >
                <Text 
                  style={[
                    styles.energyText, 
                    { color: getEnergyColor(analysis.aiReport.userState) }
                  ]}
                >
                  {analysis.aiReport.userState}
                </Text>
              </View>
            </View>

            {/* Score view */}
            <View style={styles.scoreWrapper}>
              <Text style={styles.scoreNum}>{analysis.disciplineScore}</Text>
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.scoreLabel}>Score Discipline</Text>
                <Text style={styles.scoreSub}>Ajustement automatique actif</Text>
              </View>
            </View>

            {/* Dynamic AI message coaching */}
            <Text style={styles.aiCoachText}>
              {analysis.motivationalMessage}
            </Text>

            {/* Risks warnings list */}
            {analysis.aiReport.risks.length > 0 && (
              <View style={styles.risksWrapper}>
                {analysis.aiReport.risks.map((risk, idx) => (
                  <View key={idx} style={styles.riskBadge}>
                    <ShieldAlert size={12} color="#EF4444" style={{ marginRight: 4 }} />
                    <Text style={styles.riskText}>{risk.toUpperCase()}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
        
        {/* Interactive Stats cards */}
        <View style={styles.row}>
          <View style={styles.cardHalf}>
            <View style={styles.iconBox}>
              <Clock size={18} color="#6366F1" />
            </View>
            <Text style={styles.statLabel}>Réveil Cible</Text>
            <Text style={styles.statValue}>{wakeGoal}</Text>
          </View>

          <View style={styles.cardHalf}>
            <View style={[styles.iconBox, { backgroundColor: 'rgba(34, 197, 94, 0.1)' }]}>
              <Zap size={18} color="#22C55E" />
            </View>
            <Text style={styles.statLabel}>Routine</Text>
            <Text style={styles.statValue}>{completedCount}/{totalCount}</Text>
          </View>
        </View>

        {/* CTA Panel */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Routine')}
          style={[styles.ctaCard, isFinishedToday ? styles.ctaCardSuccess : styles.ctaCardAction]}
        >
          <View style={styles.ctaContent}>
            <Text style={styles.ctaTitle}>
              {isFinishedToday ? 'Journée Validée ! 🏆' : 'Ma Routine Matinale'}
            </Text>
            <Text style={styles.ctaSubtitle}>
              {isFinishedToday 
                ? 'Tu as complété toutes tes habitudes de discipline.' 
                : `${totalCount - completedCount} tâches restantes à accomplir.`}
            </Text>
          </View>
          <ChevronRight size={20} color="#ffffff" />
        </TouchableOpacity>

        {/* Sleep Fast-Access Card */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Sleep')}
          style={styles.sleepCard}
        >
          <View style={styles.sleepContent}>
            <View style={styles.iconBoxMoon}>
              <Moon size={18} color="#A78BFA" />
            </View>
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.sleepTitle}>Suivi du Sommeil</Text>
              <Text style={styles.sleepSubtitle}>Logue tes nuits pour optimiser ta vitalité</Text>
            </View>
          </View>
          <ChevronRight size={18} color="#8A9CAE" />
        </TouchableOpacity>
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
    marginVertical: 12,
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
  badgeWrapper: {
    marginVertical: 10,
    alignItems: 'center',
  },
  greetingText: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 20,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  cardHalf: {
    backgroundColor: '#121826',
    borderColor: '#1F2E45',
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    width: '48%',
    height: 120,
    justifyContent: 'space-between',
  },
  iconBox: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    color: '#8A9CAE',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '900',
  },
  ctaCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaCardAction: {
    backgroundColor: '#6366F1',
    borderColor: '#818CF8',
  },
  ctaCardSuccess: {
    backgroundColor: '#22C55E',
    borderColor: '#4ADE80',
  },
  ctaContent: {
    flex: 1,
    paddingRight: 12,
  },
  ctaTitle: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '900',
  },
  ctaSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  sleepCard: {
    backgroundColor: '#121826',
    borderColor: '#1F2E45',
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  sleepContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconBoxMoon: {
    backgroundColor: 'rgba(167, 139, 250, 0.1)',
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sleepTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  sleepSubtitle: {
    color: '#8A9CAE',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  aiCard: {
    backgroundColor: '#121826',
    borderColor: 'rgba(99, 102, 241, 0.25)',
    borderWidth: 1,
    borderRadius: 22,
    padding: 20,
    marginVertical: 12,
  },
  aiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  aiHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiTitle: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
    marginLeft: 6,
    textTransform: 'uppercase',
  },
  energyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  energyText: {
    fontSize: 8,
    fontWeight: '900',
  },
  scoreWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
  },
  scoreNum: {
    color: '#ffffff',
    fontSize: 36,
    fontWeight: '900',
    fontFamily: 'System',
  },
  scoreLabel: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
  },
  scoreSub: {
    color: '#8A9CAE',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  aiCoachText: {
    color: '#E0E7FF',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    marginVertical: 4,
    fontStyle: 'italic',
  },
  risksWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  riskBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderColor: 'rgba(239, 68, 68, 0.2)',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 6,
    marginBottom: 4,
  },
  riskText: {
    color: '#EF4444',
    fontSize: 8,
    fontWeight: '900',
  },
  loadingBox: {
    height: 160,
    backgroundColor: '#121826',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
});
