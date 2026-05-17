import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useSleep } from '../hooks/useSleep';
import { Moon, Sparkles, ChevronRight } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';

export function SleepScreen() {
  const { sleepHistory, loading, addSleepLog, reload } = useSleep();

  const [bedtime, setBedtime] = useState('22:30');
  const [waketime, setWaketime] = useState('06:30');
  const [logSuccess, setLogSuccess] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      reload();
    }, [reload])
  );

  const handleSubmit = async () => {
    // Basic time format validation HH:MM
    const timeReg = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeReg.test(bedtime) || !timeReg.test(waketime)) {
      alert("Format de temps invalide (HH:MM)");
      return;
    }

    await addSleepLog(bedtime, waketime);
    setLogSuccess(true);
    setTimeout(() => setLogSuccess(false), 3000);
  };

  const getScoreColor = (score: string) => {
    if (score === 'bon') return '#22C55E';
    if (score === 'mauvais') return '#EF4444';
    return '#F59E0B';
  };

  const lastSleep = sleepHistory[sleepHistory.length - 1];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Moon size={22} color="#A78BFA" />
          </View>
          <Text style={styles.title}>Sommeil</Text>
          <Text style={styles.subtitle}>
            Optimise ta récupération pour un réveil énergique.
          </Text>
        </View>

        {/* Form Log sleep */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Enregistrer ma nuit</Text>

          <View style={styles.inputsRow}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Coucher (HH:MM)</Text>
              <TextInput
                style={styles.textInput}
                value={bedtime}
                onChangeText={setBedtime}
                keyboardType="numbers-and-punctuation"
                placeholder="22:30"
                placeholderTextColor="#8A9CAE"
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Réveil (HH:MM)</Text>
              <TextInput
                style={styles.textInput}
                value={waketime}
                onChangeText={setWaketime}
                keyboardType="numbers-and-punctuation"
                placeholder="06:30"
                placeholderTextColor="#8A9CAE"
              />
            </View>
          </View>

          <TouchableOpacity activeOpacity={0.8} onPress={handleSubmit} style={styles.button}>
            <Text style={styles.buttonText}>Enregistrer la nuit</Text>
          </TouchableOpacity>

          {logSuccess && (
            <Text style={styles.successText}>Nuit enregistrée avec succès ! ✨</Text>
          )}
        </View>

        {/* Current status */}
        {lastSleep && (
          <View style={styles.statsCard}>
            <View style={styles.statsHeader}>
              <Sparkles size={16} color="#A78BFA" />
              <Text style={styles.statsTitle}>Dernière Récupération</Text>
            </View>
            <View style={styles.statsRow}>
              <View>
                <Text style={styles.statsTime}>{lastSleep.duration}h</Text>
                <Text style={styles.statsSub}>Durée de sommeil</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[styles.statsStatus, { color: getScoreColor(lastSleep.score) }]}>
                  {lastSleep.score.toUpperCase()}
                </Text>
                <Text style={styles.statsSub}>Qualité globale</Text>
              </View>
            </View>
          </View>
        )}

        {/* History log list */}
        <View style={styles.historyWrapper}>
          <Text style={styles.historySectionTitle}>Historique des Nuits</Text>
          {loading ? (
            <ActivityIndicator size="small" color="#A78BFA" style={{ marginTop: 20 }} />
          ) : sleepHistory.length === 0 ? (
            <Text style={styles.emptyText}>Aucune nuit enregistrée pour le moment.</Text>
          ) : (
            [...sleepHistory].reverse().map((entry, index) => (
              <View key={index} style={styles.historyItem}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Moon size={16} color="#8A9CAE" />
                  <Text style={styles.historyDate}>{entry.date}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.historyDetails}>
                    {entry.bedtime} - {entry.waketime} ({entry.duration}h)
                  </Text>
                  <View 
                    style={[
                      styles.scoreIndicator, 
                      { backgroundColor: getScoreColor(entry.score) }
                    ]} 
                  />
                </View>
              </View>
            ))
          )}
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
    backgroundColor: 'rgba(167, 139, 250, 0.1)',
    padding: 12,
    borderRadius: 16,
    borderColor: 'rgba(167, 139, 250, 0.2)',
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
  formCard: {
    backgroundColor: '#121826',
    borderColor: '#1F2E45',
    borderWidth: 1,
    borderRadius: 22,
    padding: 20,
    marginVertical: 16,
  },
  formTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 16,
  },
  inputsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  inputWrapper: {
    width: '47%',
  },
  inputLabel: {
    color: '#8A9CAE',
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  textInput: {
    backgroundColor: '#1C2638',
    borderColor: '#1F2E45',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  button: {
    backgroundColor: '#A78BFA',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  successText: {
    color: '#22C55E',
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 12,
  },
  statsCard: {
    backgroundColor: '#121826',
    borderColor: '#1F2E45',
    borderWidth: 1,
    borderRadius: 22,
    padding: 20,
    marginVertical: 8,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statsTitle: {
    color: '#8A9CAE',
    fontSize: 10,
    fontWeight: '800',
    marginLeft: 6,
    textTransform: 'uppercase',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  statsTime: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '900',
  },
  statsSub: {
    color: '#8A9CAE',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
  statsStatus: {
    fontSize: 16,
    fontWeight: '900',
  },
  historyWrapper: {
    marginTop: 20,
  },
  historySectionTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 12,
  },
  emptyText: {
    color: '#8A9CAE',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 20,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#121826',
    borderColor: '#1F2E45',
    borderWidth: 1,
    padding: 14,
    borderRadius: 14,
    marginVertical: 4,
  },
  historyDate: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 8,
  },
  historyDetails: {
    color: '#8A9CAE',
    fontSize: 12,
    fontWeight: '700',
    marginRight: 8,
  },
  scoreIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
