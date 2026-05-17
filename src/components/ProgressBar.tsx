import React from 'react';
import { View, StyleSheet } from 'react-native';

interface ProgressBarProps {
  progress: number; // 0 to 100
}

export function ProgressBar({ progress }: ProgressBarProps) {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <View style={styles.track}>
      <View style={[styles.bar, { width: `${clampedProgress}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 10,
    width: '100%',
    backgroundColor: '#1C2638',
    borderRadius: 5,
    overflow: 'hidden',
    marginVertical: 8,
  },
  bar: {
    height: '100%',
    backgroundColor: '#22C55E',
    borderRadius: 5,
  },
});
