import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useTracking } from '../hooks/useTracking';
import { Brain, ArrowLeft } from 'lucide-react-native';

export function InputTrackingScreen({ navigation }: any) {
  const {
    actuals,
    loading,
    report,
    initializeTracking,
    saveTrackingDeclaration,
  } = useTracking();

  const [wakeTime, setWakeTime] = useState('07:00');
  const [bedTime, setBedTime] = useState('23:00');
  const [screenTime, setScreenTime] = useState('2.0');
  const [sportTime, setSportTime] = useState('30');
  const [readTime, setReadTime] = useState('15');

  useEffect(() => {
    initializeTracking();
  }, [initializeTracking]);

  useEffect(() => {
    if (actuals) {
      setWakeTime(actuals.wakeTime);
      setBedTime(actuals.bedTime);
      setScreenTime(String(actuals.screenTime));
      setSportTime(String(actuals.sportTime));
      setReadTime(String(actuals.readTime));
    }
  }, [actuals]);

  useEffect(() => {
    if (report) {
      navigation.navigate('Result');
    }
  }, [report, navigation]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingSafe}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Analyse de ta réalité...</Text>
      </SafeAreaView>
    );
  }

  const handleDeclaration = async () => {
    const screenVal = Number(screenTime);
    const sportVal = Number(sportTime);
    const readVal = Number(readTime);

    if (isNaN(screenVal) || isNaN(sportVal) || isNaN(readVal)) {
      alert("Veuillez renseigner des chiffres valides.");
      return;
    }

    await saveTrackingDeclaration({
      wakeTime,
      bedTime,
      screenTime: screenVal,
      sportTime: sportVal,
      readTime: readVal,
    });
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
            <Brain size={16} color="#6366F1" />
            <Text style={styles.headerTitle}>Déclarer ma Réalité</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        {/* Declaration Card */}
        <View style={styles.card}>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Heure de réveil réelle (HH:MM)</Text>
            <TextInput
              style={styles.textInput}
              value={wakeTime}
              onChangeText={setWakeTime}
              placeholder="06:45"
              placeholderTextColor="#8A9CAE"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Heure de coucher réelle (HH:MM)</Text>
            <TextInput
              style={styles.textInput}
              value={bedTime}
              onChangeText={setBedTime}
              placeholder="22:30"
              placeholderTextColor="#8A9CAE"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Temps d'écran réel (heures)</Text>
            <TextInput
              style={styles.textInput}
              value={screenTime}
              onChangeText={setScreenTime}
              keyboardType="numeric"
              placeholder="1.5"
              placeholderTextColor="#8A9CAE"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Minutes de sport réelles</Text>
            <TextInput
              style={styles.textInput}
              value={sportTime}
              onChangeText={setSportTime}
              keyboardType="numeric"
              placeholder="40"
              placeholderTextColor="#8A9CAE"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Minutes de lecture réelles</Text>
            <TextInput
              style={styles.textInput}
              value={readTime}
              onChangeText={setReadTime}
              keyboardType="numeric"
              placeholder="20"
              placeholderTextColor="#8A9CAE"
            />
          </View>

          <TouchableOpacity activeOpacity={0.8} onPress={handleDeclaration} style={styles.mainButton}>
            <Text style={styles.mainButtonText}>Soumettre mes chiffres</Text>
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
  loadingSafe: {
    flex: 1,
    backgroundColor: '#0B0F14',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#8A9CAE',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 12,
    textTransform: 'uppercase',
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
});
