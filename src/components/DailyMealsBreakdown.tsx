// Componente que mostra breakdown de calorias por refeição do dia

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from './Card';
import { theme } from '../theme';
import { MealEntry, MealType } from '../types';
import { MEAL_TYPES } from '../constants';

interface DailyMealsBreakdownProps {
  meals: MealEntry[];
}

export function DailyMealsBreakdown({ meals }: DailyMealsBreakdownProps) {
  if (meals.length === 0) return null;

  // Agrupar por tipo de refeição e calcular calorias
  const mealCalories: Record<MealType, number> = {
    breakfast: 0,
    lunch: 0,
    dinner: 0,
    snack: 0,
  };

  meals.forEach((meal) => {
    mealCalories[meal.mealType] += meal.food.calories * meal.quantity;
  });

  const totalCalories = Object.values(mealCalories).reduce((sum, cal) => sum + cal, 0);

  // Calcular porcentagens
  const getPercentage = (calories: number) => {
    return totalCalories > 0 ? (calories / totalCalories) * 100 : 0;
  };

  return (
    <Card style={styles.card}>
      <Text style={styles.title}>Distribuição Calórica do Dia</Text>
      <Text style={styles.subtitle}>Total: {totalCalories.toFixed(0)} kcal</Text>

      <View style={styles.breakdown}>
        {(Object.keys(MEAL_TYPES) as MealType[]).map((mealType) => {
          const calories = mealCalories[mealType];
          const percentage = getPercentage(calories);
          const mealTypeInfo = MEAL_TYPES[mealType];

          if (calories === 0) return null;

          return (
            <View key={mealType} style={styles.mealRow}>
              <View style={styles.mealInfo}>
                <Text style={styles.mealEmoji}>{mealTypeInfo.icon}</Text>
                <Text style={styles.mealLabel}>{mealTypeInfo.label}</Text>
              </View>
              <View style={styles.mealValues}>
                <Text style={styles.mealCalories}>{calories.toFixed(0)} kcal</Text>
                <Text style={styles.mealPercentage}>{percentage.toFixed(0)}%</Text>
              </View>
              <View style={styles.mealBar}>
                <View
                  style={[
                    styles.mealBarFill,
                    {
                      width: `${percentage}%`,
                      backgroundColor:
                        mealType === 'breakfast'
                          ? theme.colors.primary
                          : mealType === 'lunch'
                          ? theme.colors.secondary
                          : mealType === 'dinner'
                          ? theme.colors.accent
                          : theme.colors.warning,
                    },
                  ]}
                />
              </View>
            </View>
          );
        })}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.md,
  },
  title: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  breakdown: {
    gap: theme.spacing.md,
  },
  mealRow: {
    marginBottom: theme.spacing.sm,
  },
  mealInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  mealEmoji: {
    fontSize: 20,
    marginRight: theme.spacing.sm,
  },
  mealLabel: {
    ...theme.typography.body,
    color: theme.colors.text,
    flex: 1,
  },
  mealValues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  mealCalories: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
  },
  mealPercentage: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  mealBar: {
    height: 12,
    backgroundColor: theme.colors.divider,
    borderRadius: theme.borderRadius.sm,
    overflow: 'hidden',
  },
  mealBarFill: {
    height: '100%',
    borderRadius: theme.borderRadius.sm,
  },
});

