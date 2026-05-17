import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, SafeAreaView, Switch } from 'react-native';
import { storageService, KEYS } from '../services/storageService';
import { notificationService } from '../services/notificationService';
import { Settings, User, Bell, Trash2, Shield } from 'lucide-react-native';

export function SettingsScreen() {
  const [userName, setUserName] = useState('Mehmet');
  const [wakeGoal, setWakeGoal] = useState('06:30');
  const [sleepGoal, setSleepGoal] = useState('22:30');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      const name = await storageService.getItem<string>(KEYS.USER_NAME, 'Mehmet');
      const wake = await storageService.getItem<string>(KEYS.WAKE_GOAL, '06:30');
      const sleep = await storageService.getItem<string>(KEYS.SLEEP_GOAL, '22:30');
      
      setUserName(name);
      setWakeGoal(wake);
      setSleepGoal(sleep);

      // Check notification channel permissions
      const granted = await notificationService.registerForPushNotifications();
      setNotificationsEnabled(granted);
    };
    loadSettings();
  }, []);

  const handleSave = async () => {
    await storageService.setItem(KEYS.USER_NAME, userName);
    await storageService.setItem(KEYS.WAKE_GOAL, wakeGoal);
    await storageService.setItem(KEYS.SLEEP_GOAL, sleepGoal);

    // Dynamic Alarms schedule sync if allowed
    if (notificationsEnabled) {
      // Wake up reminder
      await notificationService.scheduleDailyReminder(
        'wake_reminder',
        'Debout, Champion ! 🌅',
        'Il est temps de commencer ta journée de discipline.',
        wakeGoal
      );

      // Bedtime reminder
      await notificationService.scheduleDailyReminder(
        'sleep_reminder',
        'Sommeil & Récupération 🛌',
        'Prépare-toi à dormir. Éteins tes écrans dans 30 minutes.',
        sleepGoal
      );
    } else {
      await notificationService.cancelAllReminders();
    }

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleToggleNotifications = async (value: boolean) => {
    if (value) {
      const granted = await notificationService.registerForPushNotifications();
      setNotificationsEnabled(granted);
      if (!granted) {
        alert("Permission de notification refusée. Activez-la dans les réglages de votre téléphone.");
      }
    } else {
      setNotificationsEnabled(false);
      await notificationService.cancelAllReminders();
    }
  };

  const handleReset = async () => {
    if (confirm("Voulez-vous vraiment réinitialiser toutes vos données locales ?")) {
      await storageService.clearAll();
      setUserName('Mehmet');
      setWakeGoal('06:30');
      setSleepGoal('22:30');
      setNotificationsEnabled(false);
      alert("Toutes les données ont été réinitialisées.");
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Settings size={22} color="#6366F1" />
          </View>
          <Text style={styles.title}>Paramètres</Text>
          <Text style={styles.subtitle}>
            Personnalise tes objectifs quotidiens de discipline.
          </Text>
        </View>

        {/* Profile Card settings */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <User size={16} color="#6366F1" />
            <Text style={styles.cardTitle}>Profil & Objectifs</Text>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Prénom de l'utilisateur</Text>
            <TextInput
              style={styles.textInput}
              value={userName}
              onChangeText={setUserName}
              placeholder="Mehmet"
              placeholderTextColor="#8A9CAE"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Heure de réveil cible (HH:MM)</Text>
            <TextInput
              style={styles.textInput}
              value={wakeGoal}
              onChangeText={setWakeGoal}
              placeholder="06:30"
              placeholderTextColor="#8A9CAE"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Heure de coucher cible (HH:MM)</Text>
            <TextInput
              style={styles.textInput}
              value={sleepGoal}
              onChangeText={setSleepGoal}
              placeholder="22:30"
              placeholderTextColor="#8A9CAE"
            />
          </View>

          <TouchableOpacity activeOpacity={0.8} onPress={handleSave} style={styles.button}>
            <Text style={styles.buttonText}>Enregistrer</Text>
          </TouchableOpacity>

          {saveSuccess && (
            <Text style={styles.successText}>Paramètres sauvegardés avec succès ! ✨</Text>
          )}
        </View>

        {/* Notifications toggle card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Bell size={16} color="#6366F1" />
            <Text style={styles.cardTitle}>Notifications</Text>
          </View>

          <View style={styles.toggleRow}>
            <View>
              <Text style={styles.toggleLabel}>Rappels Quotidiens</Text>
              <Text style={styles.toggleDesc}>Réveil, routine et coucher</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: '#1C2638', true: '#6366F1' }}
              thumbColor={notificationsEnabled ? '#ffffff' : '#8A9CAE'}
            />
          </View>
        </View>

        {/* Security Reset Card settings */}
        <View style={[styles.card, { borderColor: 'rgba(239, 68, 68, 0.15)' }]}>
          <View style={styles.cardHeader}>
            <Shield size={16} color="#EF4444" />
            <Text style={[styles.cardTitle, { color: '#EF4444' }]}>Zone de Danger</Text>
          </View>

          <TouchableOpacity activeOpacity={0.8} onPress={handleReset} style={styles.resetButton}>
            <Trash2 size={16} color="#ffffff" style={{ marginRight: 6 }} />
            <Text style={styles.resetButtonText}>Réinitialiser les données</Text>
          </TouchableOpacity>
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
  card: {
    backgroundColor: '#121826',
    borderColor: '#1F2E45',
    borderWidth: 1,
    borderRadius: 22,
    padding: 20,
    marginVertical: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
    marginLeft: 8,
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
  button: {
    backgroundColor: '#6366F1',
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
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleLabel: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  toggleDesc: {
    color: '#8A9CAE',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  resetButton: {
    backgroundColor: '#EF4444',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
