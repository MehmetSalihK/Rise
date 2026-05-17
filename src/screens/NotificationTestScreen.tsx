import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { notificationService } from '../services/notificationService';
import { ArrowLeft, Bell, AlertTriangle, ShieldCheck, RefreshCw, Zap } from 'lucide-react-native';

export function NotificationTestScreen({ navigation }: any) {
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addLog = (msg: string) => {
    setLogs((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);
  };

  const testSimple = async () => {
    addLog("Déclenchement : Test Simple...");
    await notificationService.scheduleDailyReminder(
      'test_simple_id',
      'Test Rise Simple 🔔',
      'Ceci est une notification de test immédiat pour valider tes permissions.',
      new Date(Date.now() + 2000).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) // schedule in next minute
    );
    // Send one immediate as well
    addLog("Notification planifiée pour la minute en cours !");
  };

  const testWakeUp = async () => {
    addLog("Déclenchement : Simulation Wake-Up Alarm dans 5 secondes...");
    // Let's schedule in 5 seconds
    setTimeout(async () => {
      await notificationService.scheduleDailyReminder(
        'test_wakeup_id',
        'Rise Alarme Matinale 🌅',
        'DEBOUT MEHMET ! Cible de réveil de test atteinte.',
        new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      );
      addLog("Alarme Wake-Up simulée reçue ! Retours haptiques actifs.");
    }, 5000);
  };

  const testFlow = async () => {
    addLog("Déclenchement : Flow de 3 rappels consécutifs...");
    
    // Alert 1 (5s)
    setTimeout(async () => {
      addLog("Envoi Rappel 1/3 (Flow)...");
      await notificationService.scheduleDailyReminder(
        'test_flow_1',
        'Discipline Flow (1/3) 🧘',
        'Premier rappel de discipline active.',
        new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      );
    }, 3000);

    // Alert 2 (10s)
    setTimeout(async () => {
      addLog("Envoi Rappel 2/3 (Flow)...");
      await notificationService.scheduleDailyReminder(
        'test_flow_2',
        'Discipline Flow (2/3) ⚠️',
        'Deuxième alerte. Reste vigilant.',
        new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      );
    }, 8000);

    // Alert 3 (15s)
    setTimeout(async () => {
      addLog("Envoi Rappel 3/3 (Flow)...");
      await notificationService.scheduleDailyReminder(
        'test_flow_3',
        'Discipline Flow (3/3) 🚨',
        'Dernière sommation comportementale ! Action requise.',
        new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      );
    }, 13000);
  };

  const testCritical = async () => {
    addLog("Déclenchement : Alerte Critique de Discipline ! 🚨");
    setTimeout(async () => {
      await notificationService.scheduleDailyReminder(
        'test_critical_id',
        '🚨 URGENCE DISCIPLINE 🚨',
        'Vibration d\'avertissement intense. Tu dérives totalement ! Éteins ton écran.',
        new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      );
      addLog("Alerte critique envoyée.");
    }, 2000);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.goBack()} style={styles.backButton}>
            <ArrowLeft size={18} color="#8A9CAE" />
          </TouchableOpacity>
          <View style={styles.headerTitleBox}>
            <Zap size={16} color="#6366F1" />
            <Text style={styles.headerTitle}>Tests Matériels</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        {/* Diagnostic description */}
        <View style={styles.infoBox}>
          <ShieldCheck size={18} color="#22C55E" style={{ marginRight: 8 }} />
          <Text style={styles.infoText}>
            Valide la réception sonore, haptique et l'ordre des canaux sur ton mobile.
          </Text>
        </View>

        {/* Buttons Grid */}
        <View style={styles.buttonsCard}>
          <TouchableOpacity activeOpacity={0.8} onPress={testSimple} style={styles.btn}>
            <Bell size={16} color="#ffffff" style={{ marginRight: 8 }} />
            <Text style={styles.btnText}>Test Notification Simple</Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.8} onPress={testWakeUp} style={styles.btn}>
            <Zap size={16} color="#ffffff" style={{ marginRight: 8 }} />
            <Text style={styles.btnText}>Test Wake-Up Alarm</Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.8} onPress={testFlow} style={styles.btn}>
            <RefreshCw size={16} color="#ffffff" style={{ marginRight: 8 }} />
            <Text style={styles.btnText}>Test Reminder Flow (3 étapes)</Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.8} onPress={testCritical} style={[styles.btn, styles.btnCritical]}>
            <AlertTriangle size={16} color="#ffffff" style={{ marginRight: 8 }} />
            <Text style={styles.btnText}>Test Critical Alert</Text>
          </TouchableOpacity>
        </View>

        {/* Logs terminal card */}
        <View style={styles.terminalCard}>
          <View style={styles.terminalHeader}>
            <Text style={styles.terminalTitle}>TERMINAL DE DIAGNOSTIC</Text>
            <TouchableOpacity onPress={clearLogs}>
              <Text style={styles.clearText}>EFFACER</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.logsScroll} nestedScrollEnabled={true}>
            {logs.length === 0 ? (
              <Text style={styles.emptyLogText}>Aucun événement enregistré. Lance un test ci-dessus.</Text>
            ) : (
              logs.map((log, index) => (
                <Text key={index} style={styles.logLine}>{log}</Text>
              ))
            )}
          </ScrollView>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
  },
  backButton: {
    padding: 10,
  },
  headerTitleBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginLeft: 6,
    letterSpacing: 1,
  },
  infoBox: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderColor: 'rgba(34, 197, 94, 0.2)',
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  infoText: {
    color: '#22C55E',
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
  },
  buttonsCard: {
    backgroundColor: '#121826',
    borderColor: '#1F2E45',
    borderWidth: 1,
    borderRadius: 22,
    padding: 20,
    marginVertical: 10,
  },
  btn: {
    backgroundColor: '#6366F1',
    borderRadius: 14,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  btnCritical: {
    backgroundColor: '#EF4444',
  },
  btnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  terminalCard: {
    backgroundColor: '#070A0F',
    borderColor: '#1F2E45',
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginVertical: 12,
    height: 200,
  },
  terminalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1F2E45',
    paddingBottom: 8,
    marginBottom: 8,
  },
  terminalTitle: {
    color: '#8A9CAE',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
  clearText: {
    color: '#6366F1',
    fontSize: 9,
    fontWeight: '900',
  },
  logsScroll: {
    flex: 1,
  },
  emptyLogText: {
    color: '#1F2E45',
    fontSize: 11,
    fontWeight: '700',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 40,
  },
  logLine: {
    color: '#6366F1',
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'Courier',
    marginVertical: 2,
  },
});
