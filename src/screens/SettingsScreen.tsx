import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, SafeAreaView, Switch, Platform, Modal } from 'react-native';
import { storageService, KEYS } from '../services/storageService';
import { notificationService } from '../services/notificationService';
import { aiService } from '../services/aiService';
import { notificationScheduler } from '../notifications/notificationScheduler';
import { widgetDataBuilder } from '../widgets/widgetDataBuilder';
import { Settings, User, Bell, Trash2, Shield, Brain, Activity, ChevronRight, LayoutGrid, X, HelpCircle, Flame } from 'lucide-react-native';

export function SettingsScreen({ navigation }: any) {
  const [userName, setUserName] = useState('Mehmet');
  const [wakeGoal, setWakeGoal] = useState('07:00');
  const [sleepGoal, setSleepGoal] = useState('23:00');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [geminiKey, setGeminiKey] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [testSuccessMessage, setTestSuccessMessage] = useState('');
  
  // V9 Widget modal states
  const [widgetModalVisible, setWidgetModalVisible] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);

  useEffect(() => {
    const loadSettings = async () => {
      const name = await storageService.getItem<string>(KEYS.USER_NAME, 'Mehmet');
      const wake = await storageService.getItem<string>(KEYS.WAKE_GOAL, '07:00');
      const sleep = await storageService.getItem<string>(KEYS.SLEEP_GOAL, '23:00');
      const streak = await storageService.getItem<number>(KEYS.CURRENT_STREAK, 0);
      const key = await aiService.getApiKey();
      
      setUserName(name);
      setWakeGoal(wake);
      setSleepGoal(sleep);
      setCurrentStreak(streak);
      setGeminiKey(key || '');

      const granted = await notificationService.registerForPushNotifications();
      setNotificationsEnabled(granted);
    };
    loadSettings();
  }, []);

  const handleSave = async () => {
    const timeReg = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeReg.test(wakeGoal) || !timeReg.test(sleepGoal)) {
      alert("Format de temps invalide (HH:MM)");
      return;
    }

    await storageService.setItem(KEYS.USER_NAME, userName);
    await storageService.setItem(KEYS.WAKE_GOAL, wakeGoal);
    await storageService.setItem(KEYS.SLEEP_GOAL, sleepGoal);
    
    // Save Gemini key
    if (geminiKey.trim()) {
      await aiService.setApiKey(geminiKey.trim());
    } else {
      await storageService.setItem('rise_ai_gemini_key', null);
    }

    if (notificationsEnabled) {
      await notificationScheduler.schedulePressureCoachAlerts('MEDIUM');
    } else {
      await notificationService.cancelAllReminders();
    }

    // Update Widget pontoon with latest goals
    await widgetDataBuilder.syncWidgetData(78, currentStreak, 'EXCELLENT', '#22C55E');

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleToggleNotifications = async (value: boolean) => {
    if (value) {
      const granted = await notificationService.registerForPushNotifications();
      setNotificationsEnabled(granted);
      if (granted) {
        await notificationScheduler.schedulePressureCoachAlerts('MEDIUM');
      } else {
        alert("Permission de notification refusée. Activez-la dans les réglages.");
      }
    } else {
      setNotificationsEnabled(false);
      await notificationService.cancelAllReminders();
    }
  };

  const triggerPressureTest = async (state: 'GOOD' | 'BAD') => {
    try {
      setTestSuccessMessage(`Planification du test ${state} en cours...`);
      await notificationScheduler.schedulePressureCoachAlerts(state);
      setTestSuccessMessage(`Test ${state} planifié avec succès ! ⚡`);
      setTimeout(() => setTestSuccessMessage(''), 4000);
    } catch (e) {
      alert("Erreur lors de la planification du test.");
      setTestSuccessMessage('');
    }
  };

  // V9 Widget Pin launcher simulator
  const handlePinWidget = async () => {
    // 1. Force state serialization to local bridges
    await widgetDataBuilder.syncWidgetData(78, currentStreak, 'EXCELLENT', '#22C55E');
    // 2. Open premium instructions modal based on OS
    setWidgetModalVisible(true);
  };

  const handleReset = async () => {
    if (confirm("Voulez-vous vraiment réinitialiser toutes vos données locales ?")) {
      await storageService.clearAll();
      setUserName('Mehmet');
      setWakeGoal('07:00');
      setSleepGoal('23:00');
      setNotificationsEnabled(false);
      setGeminiKey('');
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
            Personnalise tes objectifs quotidiens et ton IA.
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
              placeholder="07:00"
              placeholderTextColor="#8A9CAE"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Heure de coucher cible (HH:MM)</Text>
            <TextInput
              style={styles.textInput}
              value={sleepGoal}
              onChangeText={setSleepGoal}
              placeholder="23:00"
              placeholderTextColor="#8A9CAE"
            />
          </View>
        </View>

        {/* V9 Premium home widget setup card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <LayoutGrid size={16} color="#6366F1" />
            <Text style={styles.cardTitle}>Widget Écran d'Accueil</Text>
          </View>

          {/* Simulated Premium widget preview widget visual mockup */}
          <View style={styles.widgetMockup}>
            <View style={styles.mockupHeader}>
              <Text style={styles.mockupTitle}>DISCIPLINE ACTIVE</Text>
              <Flame size={12} color="#F59E0B" />
            </View>
            <View style={styles.mockupBody}>
              <Text style={styles.mockupScore}>78%</Text>
              <View style={styles.mockupStats}>
                <Text style={styles.mockupStreak}>🔥 {currentStreak} JOURS</Text>
                <Text style={styles.mockupStatus}>🟢 EXCELLENT</Text>
              </View>
            </View>
          </View>

          <Text style={[styles.inputDesc, { marginBottom: 12, color: '#8A9CAE', fontSize: 11 }]}>
            Affiche ton score de discipline, ta série active de streaks 🔥 et ton heure de réveil sans ouvrir Rise.
          </Text>

          <TouchableOpacity activeOpacity={0.8} onPress={handlePinWidget} style={styles.widgetButton}>
            <LayoutGrid size={14} color="#ffffff" style={{ marginRight: 6 }} />
            <Text style={styles.widgetButtonText}>Épingler le Widget d'État</Text>
          </TouchableOpacity>
        </View>

        {/* AI Key Config Form */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Brain size={16} color="#6366F1" />
            <Text style={styles.cardTitle}>Configuration de l'IA</Text>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Clé API Google Gemini</Text>
            <TextInput
              style={styles.textInput}
              value={geminiKey}
              onChangeText={setGeminiKey}
              secureTextEntry
              placeholder="AIzaSy..."
              placeholderTextColor="#8A9CAE"
            />
            <Text style={styles.inputDesc}>
              Optionnel. Si vide, l'application utilise son moteur d'analyse hors-ligne ultra-rapide par défaut.
            </Text>
          </View>

          <TouchableOpacity activeOpacity={0.8} onPress={handleSave} style={styles.button}>
            <Text style={styles.buttonText}>Enregistrer</Text>
          </TouchableOpacity>

          {saveSuccess && (
            <Text style={styles.successText}>Paramètres sauvegardés avec succès ! ✨</Text>
          )}
        </View>

        {/* AI Pressure Simulator Testing Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Activity size={16} color="#6366F1" />
            <Text style={styles.cardTitle}>Simulateur de Pression IA</Text>
          </View>

          <Text style={[styles.inputDesc, { marginBottom: 12, color: '#8A9CAE', fontSize: 11 }]}>
            Teste immédiatement le comportement sonore et haptique du planificateur selon tes états de discipline réels.
          </Text>

          <View style={styles.testButtonsRow}>
            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={() => triggerPressureTest('GOOD')}
              style={[styles.testButton, { backgroundColor: 'rgba(34, 197, 94, 0.1)', borderColor: '#22C55E' }]}
            >
              <Text style={[styles.testButtonText, { color: '#22C55E' }]}>🟢 TEST GOOD</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={() => triggerPressureTest('BAD')}
              style={[styles.testButton, { backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: '#EF4444' }]}
            >
              <Text style={[styles.testButtonText, { color: '#EF4444' }]}>🔴 TEST BAD</Text>
            </TouchableOpacity>
          </View>

          {/* Diagnostic screen access portal link */}
          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={() => navigation.navigate('NotificationTest')}
            style={styles.diagnosticLinkButton}
          >
            <Text style={styles.diagnosticLinkText}>Ouvrir les diagnostics de notifications</Text>
            <ChevronRight size={12} color="#6366F1" />
          </TouchableOpacity>

          {testSuccessMessage !== '' && (
            <Text style={styles.testSuccessText}>{testSuccessMessage}</Text>
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
              <Text style={styles.toggleDesc}>Check-in comportemental</Text>
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

      {/* V9 Elegant OS Custom Widget Installer Instructions Overlay Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={widgetModalVisible}
        onRequestClose={() => setWidgetModalVisible(false)}
      >
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <LayoutGrid size={18} color="#6366F1" />
              <Text style={styles.modalTitle}>GUIDE DU WIDGET D'ÉTAT</Text>
              <TouchableOpacity onPress={() => setWidgetModalVisible(false)} style={styles.modalClose}>
                <X size={16} color="#8A9CAE" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.successMessage}>
                ⚡ Synchronisation locale effectuée avec succès ! Les données sont prêtes.
              </Text>

              {Platform.OS === 'ios' ? (
                <View>
                  <Text style={styles.osTitle}>🍏 INSTRUCTIONS POUR IPHONE (iOS)</Text>
                  <View style={styles.step}>
                    <Text style={styles.stepNum}>1</Text>
                    <Text style={styles.stepText}>Maintenez le doigt appuyé sur une zone vide de votre écran d'accueil jusqu'à ce que les icônes bougent.</Text>
                  </View>
                  <View style={styles.step}>
                    <Text style={styles.stepNum}>2</Text>
                    <Text style={styles.stepText}>Appuyez sur le bouton "+" en haut à gauche.</Text>
                  </View>
                  <View style={styles.step}>
                    <Text style={styles.stepNum}>3</Text>
                    <Text style={styles.stepText}>Recherchez ou sélectionnez "Rise" dans la liste, choisissez la taille et ajoutez le widget !</Text>
                  </View>
                </View>
              ) : (
                <View>
                  <Text style={styles.osTitle}>🤖 INSTRUCTIONS POUR ANDROID</Text>
                  <View style={styles.step}>
                    <Text style={styles.stepNum}>1</Text>
                    <Text style={styles.stepText}>Le pont de données local est chargé. Maintenez le doigt appuyé sur votre écran d'accueil.</Text>
                  </View>
                  <View style={styles.step}>
                    <Text style={styles.stepNum}>2</Text>
                    <Text style={styles.stepText}>Appuyez sur "Widgets" ou "Araçlar".</Text>
                  </View>
                  <View style={styles.step}>
                    <Text style={styles.stepNum}>3</Text>
                    <Text style={styles.stepText}>Faites défiler jusqu'à "Rise", maintenez le widget et déposez-le à l'emplacement souhaité !</Text>
                  </View>
                </View>
              )}

              <View style={styles.helpBox}>
                <HelpCircle size={14} color="#8A9CAE" style={{ marginRight: 6 }} />
                <Text style={styles.helpText}>
                  Les statistiques se mettront à jour automatiquement sur ton écran d'accueil à chaque check-in.
                </Text>
              </View>

              <TouchableOpacity 
                activeOpacity={0.8} 
                onPress={() => setWidgetModalVisible(false)} 
                style={styles.closeBtn}
              >
                <Text style={styles.closeBtnText}>COMPRIS</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  inputDesc: {
    color: '#8A9CAE',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 6,
    lineHeight: 14,
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
  widgetMockup: {
    backgroundColor: '#0B0F14',
    borderColor: '#1F2E45',
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
  },
  mockupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1C2638',
    paddingBottom: 6,
    marginBottom: 6,
  },
  mockupTitle: {
    color: '#8A9CAE',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  mockupBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mockupScore: {
    color: '#22C55E',
    fontSize: 22,
    fontWeight: '900',
  },
  mockupStats: {
    alignItems: 'flex-end',
  },
  mockupStreak: {
    color: '#F59E0B',
    fontSize: 10,
    fontWeight: '900',
  },
  mockupStatus: {
    color: '#22C55E',
    fontSize: 9,
    fontWeight: '800',
    marginTop: 2,
  },
  widgetButton: {
    backgroundColor: '#6366F1',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  widgetButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  successText: {
    color: '#22C55E',
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 12,
  },
  testButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  testButton: {
    width: '48%',
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  testButtonText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  diagnosticLinkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: '#1F2E45',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  diagnosticLinkText: {
    color: '#6366F1',
    fontSize: 11,
    fontWeight: '800',
  },
  testSuccessText: {
    color: '#6366F1',
    fontSize: 11,
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
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(7, 10, 15, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#121826',
    borderColor: '#1F2E45',
    borderWidth: 1,
    borderRadius: 24,
    padding: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#1F2E45',
    paddingBottom: 12,
    marginBottom: 16,
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
    flex: 1,
    marginLeft: 8,
  },
  modalClose: {
    padding: 4,
  },
  modalBody: {},
  successMessage: {
    color: '#22C55E',
    fontSize: 11,
    fontWeight: '800',
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    lineHeight: 15,
  },
  osTitle: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '900',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  step: {
    flexDirection: 'row',
    marginVertical: 6,
    alignItems: 'flex-start',
  },
  stepNum: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    color: '#6366F1',
    fontSize: 10,
    fontWeight: '900',
    width: 18,
    height: 18,
    borderRadius: 9,
    textAlign: 'center',
    lineHeight: 18,
    marginRight: 10,
    marginTop: 2,
  },
  stepText: {
    color: '#E0E7FF',
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 15,
    flex: 1,
  },
  helpBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0C111C',
    borderRadius: 12,
    padding: 12,
    marginVertical: 14,
  },
  helpText: {
    color: '#8A9CAE',
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 14,
    flex: 1,
  },
  closeBtn: {
    backgroundColor: '#6366F1',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  closeBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
