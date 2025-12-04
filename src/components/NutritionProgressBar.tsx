// Componente de barra de progresso nutricional

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { calculateProgress, isNutrientLow } from '../utils/nutrition';
import { CRITICAL_NUTRIENTS } from '../constants';

interface NutritionProgressBarProps {
  label: string;
  current: number;
  target: number;
  unit: string;
  isCritical?: boolean;
  threshold?: number;
}

export function NutritionProgressBar({
  label,
  current,
  target,
  unit,
  isCritical = false,
  threshold = 0.8,
}: NutritionProgressBarProps) {
  const progress = calculateProgress(current, target);
  const isLow = isNutrientLow(current, target, threshold);
  const percentage = Math.min(progress, 100);

  const getBarColor = () => {
    if (isLow && isCritical) return theme.colors.error;
    if (progress >= 100) return theme.colors.success;
    if (progress >= threshold * 100) return theme.colors.primary;
    return theme.colors.warning;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, isLow && isCritical && styles.lowValue]}>
          {current.toFixed(1)} / {target.toFixed(0)} {unit}
        </Text>
      </View>
      <View style={styles.barContainer}>
        <View style={[styles.bar, { width: `${percentage}%`, backgroundColor: getBarColor() }]} />
      </View>
      {isLow && isCritical && (
        <Text style={styles.warning}>⚠️ Abaixo da meta recomendada</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  label: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '500',
  },
  value: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  lowValue: {
    color: theme.colors.error,
    fontWeight: '600',
  },
  barContainer: {
    height: 8,
    backgroundColor: theme.colors.divider,
    borderRadius: theme.borderRadius.sm,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: theme.borderRadius.sm,
  },
  warning: {
    ...theme.typography.caption,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
});

