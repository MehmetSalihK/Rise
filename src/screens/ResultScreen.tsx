import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { storageService } from '../services/storageService';
import { AuditLog } from '../hooks/useCheckIn';
import { CheckCircle2, ChevronRight, Brain } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';

export function ResultScreen({ navigation }: any) {
  const [log, setLog] = useState<AuditLog | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      const loadResult = async () => {
        setLoading(true);
        const latest = await storageService.getItem<AuditLog | null>('rise_latestAudit', null);
        setLog(latest);
        setLoading(false);
      };
      loadResult();
    }, [])
  );

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
        <Text style={styles.errorText}>Aucun audit trouvé pour aujourd'hui.</Text>
        <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('Home')} style={styles.button}>
          <Text style={styles.buttonText}>Retour à l'accueil</Text>
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
          <CheckCircle2 size={32} color="#22C55E" />
          <Text style={styles.title}>Bilan Complété</Text>
          <Text style={styles.subtitle}>Ta vérité quotidienne est enregistrée.</Text>
        </View>

        {/* Score Ring / Card */}
        <View style={[styles.scoreCard, { borderColor: getCategoryColor(log.category) }]}>
          <Text style={[styles.scoreNumber, { color: getCategoryColor(log.category) }]}>
            {log.score}%
          </Text>
          <Text style={styles.scoreCategory}>{log.category}</Text>
          <Text style={styles.scoreSub}>SCORE COMPORTEMENTAL DU JOUR</Text>
        </View>

        {/* AI Report Card */}
        <View style={styles.aiReportCard}>
          <View style={styles.aiHeader}>
            <Brain size={16} color="#6366F1" style={{ marginRight: 6 }} />
            <Text style={styles.aiTitle}>Analyse du Coach IA</Text>
          </View>
          <Text style={styles.aiText}>{log.feedback}</Text>
        </View>

        {/* Details Breakdown */}
        <View style={styles.breakdownCard}>
          <Text style={styles.breakdownTitle}>Détails de l'audit</Text>
          {Object.keys(log.answers).map((key) => {
            const val = log.answers[key];
            return (
              <View key={key} style={styles.row}>
                <Text style={styles.rowText}>{key.replace(/_/g, ' ').toUpperCase()}</Text>
                <View style={[styles.badge, { backgroundColor: val ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)' }]}>
                  <Text style={[styles.badgeText, { color: val ? '#22C55E' : '#EF4444' }]}>
                    {val ? 'OUI' : 'NON'}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Confirm Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Home')}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Terminer la journée</Text>
          <ChevronRight size={16} color="#ffffff" style={{ marginLeft: 4 }} />
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
    padding: 24,
  },
  errorText: {
    color: '#8A9CAE',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginVertical: 20,
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
  },
  scoreCard: {
    backgroundColor: '#121826',
    borderWidth: 1,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginVertical: 12,
  },
  scoreNumber: {
    fontSize: 54,
    fontWeight: '900',
    fontFamily: 'System',
  },
  scoreCategory: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
    marginTop: 4,
  },
  scoreSub: {
    color: '#8A9CAE',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginTop: 8,
  },
  aiReportCard: {
    backgroundColor: '#121826',
    borderColor: 'rgba(99, 102, 241, 0.25)',
    borderWidth: 1,
    borderRadius: 22,
    padding: 20,
    marginVertical: 12,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  aiTitle: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  aiText: {
    color: '#E0E7FF',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    fontStyle: 'italic',
  },
  breakdownCard: {
    backgroundColor: '#121826',
    borderColor: '#1F2E45',
    borderWidth: 1,
    borderRadius: 22,
    padding: 20,
    marginVertical: 12,
  },
  breakdownTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1F2E45',
    paddingVertical: 10,
  },
  rowText: {
    color: '#8A9CAE',
    fontSize: 10,
    fontWeight: '800',
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '900',
  },
  button: {
    backgroundColor: '#6366F1',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
