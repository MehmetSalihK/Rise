import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { storageService, KEYS } from '../services/storageService';
import { Moon, ShieldCheck, Clock } from 'lucide-react-native';

export function SleepScreen() {
  const [bedtime, setBedtime] = useState('22:30');
  const [waketime, setWaketime] = useState('06:30');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSleep = async () => {
    const timeReg = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeReg.test(bedtime) || !timeReg.test(waketime)) {
      alert("Format de temps invalide (HH:MM)");
      return;
    }

    const [bedH, bedM] = bedtime.split(':').map(Number);
    const [wakeH, wakeM] = waketime.split(':').map(Number);

    let duration = 0;
    if (wakeH > bedH || (wakeH === bedH && wakeM >= bedM)) {
      duration = (wakeH * 60 + wakeM - (bedH * 60 + bedM)) / 60;
    } else {
      duration = ((24 * 60 - (bedH * 60 + bedM)) + (wakeH * 60 + wakeM)) / 60;
    }

    duration = Number(duration.toFixed(1));

    let score: 'mauvais' | 'moyen' | 'bon' = 'moyen';
    if (duration < 6) {
      score = 'mauvais';
    } else if (duration >= 7.5 && duration <= 9) {
      score = 'bon';
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const newLog = {
      date: todayStr,
      bedtime,
      waketime,
      duration,
      score,
    };

    const sleepLogs = await storageService.getItem<any[]>(KEYS.SLEEP_HISTORY, []);
    const updated = [...sleepLogs.filter(s => s.date !== todayStr), newLog];
    await storageService.setItem(KEYS.SLEEP_HISTORY, updated);

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconBox}>
            <Moon size={22} color="#6366F1" />
          </View>
          <Text style={styles.title}>Sommeil</Text>
          <Text style={styles.subtitle}>Enregistre tes heures de repos pour évaluer ta vitalité.</Text>
        </View>

        {/* Inputs details */}
        <View style={styles.card}>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Heure de coucher (HH:MM)</Text>
            <TextInput
              style={styles.textInput}
              value={bedtime}
              onChangeText={setBedtime}
              placeholder="22:30"
              placeholderTextColor="#8A9CAE"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Heure de réveil (HH:MM)</Text>
            <TextInput
              style={styles.textInput}
              value={waketime}
              onChangeText={setWaketime}
              placeholder="06:30"
              placeholderTextColor="#8A9CAE"
            />
          </View>

          <TouchableOpacity activeOpacity={0.8} onPress={handleSaveSleep} style={styles.mainButton}>
            <Text style={styles.mainButtonText}>Enregistrer la nuit</Text>
          </TouchableOpacity>

          {savedSuccess && (
            <View style={styles.successRow}>
              <ShieldCheck size={14} color="#22C55E" style={{ marginRight: 6 }} />
              <Text style={styles.successText}>Sommeil mis à jour !</Text>
            </View>
          )}
        </View>

        <View style={styles.tipCard}>
          <Clock size={14} color="#6366F1" style={{ marginRight: 6 }} />
          <Text style={styles.tipText}>
            L'IA de Rise utilise ces heures de sommeil pour ajuster le niveau de difficulté de tes objectifs quotidiens.
          </Text>
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
  card: {
    backgroundColor: '#121826',
    borderColor: '#1F2E45',
    borderWidth: 1,
    borderRadius: 22,
    padding: 20,
    marginVertical: 16,
  },
  inputWrapper: {
    marginBottom: 16,
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
  mainButton: {
    backgroundColor: '#6366F1',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  mainButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  successRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },
  successText: {
    color: '#22C55E',
    fontSize: 11,
    fontWeight: '800',
  },
  tipCard: {
    backgroundColor: '#121826',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipText: {
    color: '#8A9CAE',
    fontSize: 11,
    fontWeight: '600',
    flex: 1,
    lineHeight: 15,
  },
});
