import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';

interface TaskItemProps {
  name: string;
  completed: boolean;
  onToggle: () => void;
}

export function TaskItem({ name, completed, onToggle }: TaskItemProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onToggle}
      style={[
        styles.container,
        completed ? styles.containerCompleted : styles.containerIncomplete,
      ]}
    >
      <Text
        style={[
          styles.text,
          completed ? styles.textCompleted : styles.textIncomplete,
        ]}
      >
        {name}
      </Text>

      <View
        style={[
          styles.checkbox,
          completed ? styles.checkboxCompleted : styles.checkboxIncomplete,
        ]}
      >
        {completed && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    marginVertical: 6,
    width: '100%',
  },
  containerIncomplete: {
    backgroundColor: '#121826',
    borderColor: '#1F2E45',
  },
  containerCompleted: {
    backgroundColor: 'rgba(34, 197, 94, 0.05)',
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  text: {
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
  },
  textIncomplete: {
    color: '#ffffff',
  },
  textCompleted: {
    color: '#8A9CAE',
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxIncomplete: {
    borderColor: '#8A9CAE',
    backgroundColor: 'transparent',
  },
  checkboxCompleted: {
    borderColor: '#22C55E',
    backgroundColor: '#22C55E',
  },
});
