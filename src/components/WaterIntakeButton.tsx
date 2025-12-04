// Componente para registro rápido de água

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { theme } from '../theme';

interface WaterIntakeButtonProps {
  amount: number;
  onPress: (amount: number) => void;
  icon?: string;
  disabled?: boolean;
}

export function WaterIntakeButton({ amount, onPress, icon = '💧', disabled = false }: WaterIntakeButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={() => onPress(amount)}
      activeOpacity={0.7}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={`Adicionar ${amount} mililitros de água`}
      accessibilityHint="Toque duas vezes para registrar o consumo de água"
      accessibilityState={{ disabled }}
    >
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.amount}>{amount}ml</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.secondaryLight,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
    minHeight: 80,
    ...theme.shadows.sm,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  icon: {
    fontSize: 32,
    marginBottom: theme.spacing.xs,
  },
  amount: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
  },
});

