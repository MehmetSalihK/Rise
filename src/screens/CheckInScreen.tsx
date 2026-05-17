import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useCheckIn } from '../hooks/useCheckIn';
import { Brain, ArrowLeft } from 'lucide-react-native';

export function CheckInScreen({ navigation }: any) {
  const {
    questions,
    currentIndex,
    loading,
    startCheckIn,
    answerQuestion,
    report,
  } = useCheckIn();

  useEffect(() => {
    startCheckIn();
  }, [startCheckIn]);

  // Navigate to Result screen once evaluation completes
  useEffect(() => {
    if (report) {
      navigation.navigate('Result');
    }
  }, [report, navigation]);

  if (loading || questions.length === 0) {
    return (
      <SafeAreaView style={styles.loadingSafe}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Calcul de l'audit IA...</Text>
      </SafeAreaView>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progressPercent = Math.round(((currentIndex) / questions.length) * 100);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={18} color="#8A9CAE" />
        </TouchableOpacity>
        <View style={styles.headerTitleBox}>
          <Brain size={16} color="#6366F1" />
          <Text style={styles.headerTitle}>Life Audit</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${progressPercent}%` }]} />
      </View>

      {/* Card Content container */}
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.categoryLabel}>{currentQuestion.category}</Text>
          <Text style={styles.questionText}>{currentQuestion.text}</Text>
        </View>

        {/* Buttons choices */}
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => answerQuestion(true)}
            style={[styles.choiceButton, styles.yesButton]}
          >
            <Text style={styles.choiceText}>OUI</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => answerQuestion(false)}
            style={[styles.choiceButton, styles.noButton]}
          >
            <Text style={styles.choiceText}>NON</Text>
          </TouchableOpacity>
        </View>

        {/* Counter */}
        <Text style={styles.counterText}>
          QUESTION {currentIndex + 1} SUR {questions.length}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0B0F14',
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
    paddingHorizontal: 20,
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
  progressContainer: {
    height: 4,
    backgroundColor: '#1F2E45',
    width: '100%',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#6366F1',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#121826',
    borderColor: '#1F2E45',
    borderWidth: 1,
    borderRadius: 24,
    padding: 30,
    height: '45%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryLabel: {
    color: '#6366F1',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 20,
  },
  questionText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 34,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  choiceButton: {
    width: '48%',
    height: 90,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  yesButton: {
    backgroundColor: '#22C55E',
  },
  noButton: {
    backgroundColor: '#EF4444',
  },
  choiceText: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1,
  },
  counterText: {
    color: '#8A9CAE',
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
