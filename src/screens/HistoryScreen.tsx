import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { storageService } from '../services/storageService';
import { AuditLog } from '../hooks/useCheckIn';
import { Calendar, AlertCircle } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';

export function HistoryScreen() {
  const [history, setHistory] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      const loadHistory = async () => {
        setLoading(true);
        const saved = await storageService.getItem<AuditLog[]>('rise_auditHistory', []);
        setHistory(saved.reverse()); // Show newest first
        setLoading(false);
      };
      loadHistory();
    }, [])
  );

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
          <View style={styles.iconContainer}>
            <Calendar size={22} color="#6366F1" />
          </View>
          <Text style={styles.title}>Mon Historique</Text>
          <Text style={styles.subtitle}>
            Retrace ton évolution comportementale au fil des jours.
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#6366F1" style={{ marginTop: 40 }} />
        ) : history.length === 0 ? (
          <View style={styles.emptyState}>
            <AlertCircle size={32} color="#8A9CAE" />
            <Text style={styles.emptyText}>Aucun audit enregistré pour le moment.</Text>
            <Text style={styles.emptySub}>Fais ton premier check-in aujourd'hui !</Text>
          </View>
        ) : (
          <View style={styles.list}>
            {history.map((log, idx) => (
              <View key={idx} style={styles.logCard}>
                <View style={styles.logHeader}>
                  <Text style={styles.logDate}>
                    {new Date(log.date).toLocaleDateString('fr-FR', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                    }).toUpperCase()}
                  </Text>
                  <View style={[styles.scoreBadge, { backgroundColor: `${getCategoryColor(log.category)}15`, borderColor: getCategoryColor(log.category) }]}>
                    <Text style={[styles.scoreText, { color: getCategoryColor(log.category) }]}>
                      {log.score}%
                    </Text>
                  </View>
                </View>

                <Text style={styles.logFeedback} numberOfLines={2}>
                  {log.feedback}
                </Text>
              </View>
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 12,
    textAlign: 'center',
  },
  emptySub: {
    color: '#8A9CAE',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
  list: {
    marginTop: 10,
  },
  logCard: {
    backgroundColor: '#121826',
    borderColor: '#1F2E45',
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginVertical: 6,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  logDate: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  scoreBadge: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  scoreText: {
    fontSize: 10,
    fontWeight: '900',
  },
  logFeedback: {
    color: '#8A9CAE',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
    fontStyle: 'italic',
  },
});
