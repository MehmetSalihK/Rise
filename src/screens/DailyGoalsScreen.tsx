import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useDailyGoals } from '../hooks/useDailyGoals';
import { Sparkles, ArrowLeft, ShieldCheck } from 'lucide-react-native';

export function DailyGoalsScreen({ navigation }: any) {
  const { goals, loading, saveGoals } = useDailyGoals();
  
  const [wakeTime, setWakeTime] = useState('07:00');
  const [bedTime, setBedTime] = useState('23:00');
  const [screenTime, setScreenTime] = useState('2.0');
  const [sportTime, setSportTime] = useState('30');
  const [readTime, setReadTime] = useState('15');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (goals) {
      setWakeTime(goals.wakeTime);
      setBedTime(goals.bedTime);
      setScreenTime(String(goals.screenTime));
      setSportTime(String(goals.sportTime));
      setReadTime(String(goals.readTime));
    }
  }, [goals]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingSafe}>
        <ActivityIndicator size="large" color="#6366F1" />
      </SafeAreaView>
    );
  }

  const handleSave = async () => {
    const timeReg = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeReg.test(wakeTime) || !timeReg.test(bedTime)) {
      alert("Format de temps invalide (HH:MM)");
      return;
    }

    const screenVal = Number(screenTime);
    const sportVal = Number(sportTime);
    const readVal = Number(readTime);

    if (isNaN(screenVal) || isNaN(sportVal) || isNaN(readVal)) {
      alert("Veuillez saisir des nombres valides.");
      return;
    }

    await saveGoals({
      wakeTime,
      bedTime,
      screenTime: screenVal,
      sportTime: sportVal,
      readTime: readVal,
    });

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      navigation.navigate('Home');
    }, 1500);
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
            <Sparkles size={16} color="#6366F1" />
            <Text style={styles.headerTitle}>Définir mes Cibles</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        {/* Inputs Cards */}
        <View style={styles.card}>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Heure de réveil cible (HH:MM)</Text>
            <TextInput
              style={styles.textInput}
              value={wakeTime}
              onChangeText={setWakeTime}
              placeholder="07:00"
              placeholderTextColor="#8A9CAE"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Heure de coucher cible (HH:MM)</Text>
            <TextInput
              style={styles.textInput}
              value={bedTime}
              onChangeText={setBedTime}
              placeholder="23:00"
              placeholderTextColor="#8A9CAE"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Temps d'écran max (heures)</Text>
            <TextInput
              style={styles.textInput}
              value={screenTime}
              onChangeText={setScreenTime}
              keyboardType="numeric"
              placeholder="2.0"
              placeholderTextColor="#8A9CAE"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Durée de sport cible (minutes)</Text>
            <TextInput
              style={styles.textInput}
              value={sportTime}
              onChangeText={setSportTime}
              keyboardType="numeric"
              placeholder="30"
              placeholderTextColor="#8A9CAE"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Durée de lecture cible (minutes)</Text>
            <TextInput
              style={styles.textInput}
              value={readTime}
              onChangeText={setReadTime}
              keyboardType="numeric"
              placeholder="15"
              placeholderTextColor="#8A9CAE"
            />
          </View>

          <TouchableOpacity activeOpacity={0.8} onPress={handleSave} style={styles.mainButton}>
            <Text style={styles.mainButtonText}>Valider mes objectifs</Text>
          </TouchableOpacity>

          {saveSuccess && (
            <View style={styles.successRow}>
              <ShieldCheck size={14} color="#22C55E" style={{ marginRight: 6 }} />
              <Text style={styles.successText}>Cibles enregistrées !</Text>
            </View>
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
  loadingSafe: {
    flex: 1,
    backgroundColor: '#0B0F14',
    alignItems: 'center',
    justifyContent: 'center',
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
  card: {
    backgroundColor: '#121826',
    borderColor: '#1F2E45',
    borderWidth: 1,
    borderRadius: 22,
    padding: 20,
    marginVertical: 20,
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
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
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
});
