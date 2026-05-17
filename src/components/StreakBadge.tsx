import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Flame } from 'lucide-react-native';

interface StreakBadgeProps {
  streak: number;
}

export function StreakBadge({ streak }: StreakBadgeProps) {
  return (
    <View style={styles.container}>
      <Flame size={20} color="#F59E0B" fill="#F59E0B" />
      <Text style={styles.text}>
        {streak} JOUR{streak > 1 ? 'S' : ''} DE FEU
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121826',
    borderColor: '#1F2E45',
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    alignSelf: 'center',
  },
  text: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
    marginLeft: 8,
    fontFamily: 'System',
    letterSpacing: 1,
  },
});
