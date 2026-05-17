import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { storageService } from '../services/storageService';
import { DailyTrackingLog } from '../hooks/useTracking';
import { Award, CheckCircle, XCircle, BrainCircuit } from 'lucide-react-native';

export function ResultScreen({ navigation }: any) {
  const [log, setLog] = useState<DailyTrackingLog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
      const latest = await storageService.getItem<DailyTrackingLog | null>('rise_latestAudit', null);
      setLog(latest);
      setLoading(false);
    };
    fetchLatest();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingSafe}>
        <ActivityIndicator size="large" color="#6366F1" />
      </SafeAreaView>
    );
  }

  if (!log) {
    return (
      <SafeAreaView style={styles.loadingSafe}>
        <Text style={styles.errorText}>Aucune donnée d'audit aujourd'hui.</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.mainButton}>
          <Text style={styles.mainButtonText}>Retour à l'accueil</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const getCategoryColor = (cat: string) => {
    if (cat === 'EXCELLENT') return '#22C55E';
    if (cat === 'MOYEN') return '#F59E0B';
    return '#EF4444';
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconBox}>
            <Award size={22} color={getCategoryColor(log.category)} />
          </View>
          <Text style={styles.title}>Bilan Comportemental</Text>
          <Text style={styles.subtitle}>Voici le verdict chiffré de ta journée.</Text>
        </View>

        {/* Score Ring / Badge */}
        <View style={styles.scoreCard}>
          <Text style={[styles.scoreNumber, { color: getCategoryColor(log.category) }]}>
            {log.score}%
          </Text>
          <View style={[styles.badge, { backgroundColor: `${getCategoryColor(log.category)}15` }]}>
            <Text style={[styles.badgeText, { color: getCategoryColor(log.category) }]}>
              {log.category}
            </Text>
          </View>
        </View>

        {/* Coach Advice */}
        <View style={styles.coachCard}>
          <View style={styles.coachHeader}>
            <BrainCircuit size={16} color="#6366F1" style={{ marginRight: 6 }} />
            <Text style={styles.coachTitle}>Rapport du Coach IA</Text>
          </View>
          <Text style={styles.coachText}>{log.feedback}</Text>
        </View>

        {/* Targets comparison list */}
        <Text style={styles.sectionLabel}>Cibles vs Réalité</Text>
        <View style={styles.list}>
          {log.comparisons.map((c) => (
            <View key={c.metric} style={styles.comparisonItem}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemLabel}>{c.label}</Text>
                <View style={styles.statusBox}>
                  {c.success ? (
                    <CheckCircle size={14} color="#22C55E" />
                  ) : (
                    <XCircle size={14} color="#EF4444" />
                  )}
                  <Text style={[styles.statusText, { color: c.success ? '#22C55E' : '#EF4444' }]}>
                    {c.success ? 'RÉUSSI' : 'ÉCHOUÉ'}
                  </Text>
                </View>
              </View>

              <View style={styles.comparisonRow}>
                <View style={styles.valBox}>
                  <Text style={styles.valLabel}>CIBLE</Text>
                  <Text style={styles.valText}>{c.target}</Text>
                </View>
                <View style={styles.arrowBox}>
                  <Text style={styles.arrow}>➔</Text>
                </View>
                <View style={styles.valBox}>
                  <Text style={styles.valLabel}>RÉEL</Text>
                  <Text style={[styles.valText, { color: c.success ? '#22C55E' : '#EF4444' }]}>
                    {c.actual}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Button CTA */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Home')}
          style={styles.mainButton}
        >
          <Text style={styles.mainButtonText}>Terminer la journée</Text>
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
  loadingSafe: {
    flex: 1,
    backgroundColor: '#0B0F14',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#8A9CAE',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 20,
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
  scoreCard: {
    backgroundColor: '#121826',
    borderColor: '#1F2E45',
    borderWidth: 1,
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
    marginVertical: 12,
  },
  scoreNumber: {
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: -1,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  coachCard: {
    backgroundColor: '#121826',
    borderColor: 'rgba(99, 102, 241, 0.2)',
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
  comparisonItem: {
    backgroundColor: '#121826',
    borderColor: '#1F2E45',
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginVertical: 6,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemLabel: {
    color: '#8A9CAE',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 9,
    fontWeight: '900',
    marginLeft: 4,
  },
  comparisonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  valBox: {
    width: '40%',
  },
  valLabel: {
    color: '#8A9CAE',
    fontSize: 8,
    fontWeight: '800',
    marginBottom: 2,
  },
  valText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  arrowBox: {
    width: '20%',
    alignItems: 'center',
  },
  arrow: {
    color: '#8A9CAE',
    fontSize: 14,
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
