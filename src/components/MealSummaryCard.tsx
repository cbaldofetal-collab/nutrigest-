// Componente que mostra resumo nutricional por tipo de refeição

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from './Card';
import { theme } from '../theme';
import { MealEntry, MealType } from '../types';
import { MEAL_TYPES } from '../constants';

interface MealSummaryCardProps {
  meals: MealEntry[];
  mealType: MealType;
}

export function MealSummaryCard({ meals, mealType }: MealSummaryCardProps) {
  if (meals.length === 0) return null;

  const mealTypeInfo = MEAL_TYPES[mealType];

  // Calcular totais da refeição
  const totals = meals.reduce(
    (acc, meal) => {
      const multiplier = meal.quantity;
      acc.calories += meal.food.calories * multiplier;
      acc.protein += meal.food.protein * multiplier;
      acc.carbs += meal.food.carbs * multiplier;
      acc.fat += meal.food.fat * multiplier;
      acc.sugar += (meal.food.sugar || 0) * multiplier;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0, sugar: 0 }
  );

  // Calcular porcentagens de macronutrientes
  // 1g proteína = 4 kcal, 1g carboidrato = 4 kcal, 1g gordura = 9 kcal
  const proteinCalories = totals.protein * 4;
  const carbsCalories = totals.carbs * 4;
  const fatCalories = totals.fat * 9;
  const totalMacroCalories = proteinCalories + carbsCalories + fatCalories;

  const proteinPercent = totalMacroCalories > 0 ? (proteinCalories / totalMacroCalories) * 100 : 0;
  const carbsPercent = totalMacroCalories > 0 ? (carbsCalories / totalMacroCalories) * 100 : 0;
  const fatPercent = totalMacroCalories > 0 ? (fatCalories / totalMacroCalories) * 100 : 0;

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.emoji}>{mealTypeInfo.icon}</Text>
        <View style={styles.headerText}>
          <Text style={styles.title}>{mealTypeInfo.label}</Text>
          <Text style={styles.subtitle}>{meals.length} alimento(s)</Text>
        </View>
        <View style={styles.caloriesBadge}>
          <Text style={styles.caloriesValue}>{totals.calories.toFixed(0)}</Text>
          <Text style={styles.caloriesUnit}>kcal</Text>
        </View>
      </View>

      <View style={styles.macrosContainer}>
        <Text style={styles.macrosTitle}>Macronutrientes</Text>
        <View style={styles.macrosBars}>
          <View style={styles.macroBar}>
            <View style={styles.macroBarHeader}>
              <Text style={styles.macroLabel}>Proteína</Text>
              <Text style={styles.macroValue}>
                {totals.protein.toFixed(1)}g ({proteinPercent.toFixed(0)}%)
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${proteinPercent}%`, backgroundColor: theme.colors.primary },
                ]}
              />
            </View>
          </View>

          <View style={styles.macroBar}>
            <View style={styles.macroBarHeader}>
              <Text style={styles.macroLabel}>Carboidratos</Text>
              <Text style={styles.macroValue}>
                {totals.carbs.toFixed(1)}g ({carbsPercent.toFixed(0)}%)
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${carbsPercent}%`, backgroundColor: theme.colors.secondary },
                ]}
              />
            </View>
          </View>

          <View style={styles.macroBar}>
            <View style={styles.macroBarHeader}>
              <Text style={styles.macroLabel}>Gorduras</Text>
              <Text style={styles.macroValue}>
                {totals.fat.toFixed(1)}g ({fatPercent.toFixed(0)}%)
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${fatPercent}%`, backgroundColor: theme.colors.warning },
                ]}
              />
            </View>
          </View>
        </View>
      </View>

      <View style={styles.detailsGrid}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Proteína</Text>
          <Text style={styles.detailValue}>{totals.protein.toFixed(1)}g</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Carboidratos</Text>
          <Text style={styles.detailValue}>{totals.carbs.toFixed(1)}g</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Gorduras</Text>
          <Text style={styles.detailValue}>{totals.fat.toFixed(1)}g</Text>
        </View>
        {totals.sugar > 0 && (
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Açúcar</Text>
            <Text style={styles.detailValue}>{totals.sugar.toFixed(1)}g</Text>
          </View>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  emoji: {
    fontSize: 32,
    marginRight: theme.spacing.sm,
  },
  headerText: {
    flex: 1,
  },
  title: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  caloriesBadge: {
    alignItems: 'center',
    backgroundColor: theme.colors.primaryLight,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    minWidth: 70,
  },
  caloriesValue: {
    ...theme.typography.h2,
    color: theme.colors.primaryDark,
  },
  caloriesUnit: {
    ...theme.typography.caption,
    color: theme.colors.primaryDark,
  },
  macrosContainer: {
    marginBottom: theme.spacing.md,
  },
  macrosTitle: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
  },
  macrosBars: {
    gap: theme.spacing.sm,
  },
  macroBar: {
    marginBottom: theme.spacing.xs,
  },
  macroBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  macroLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.text,
  },
  macroValue: {
    ...theme.typography.bodySmall,
    color: theme.colors.text,
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.colors.divider,
    borderRadius: theme.borderRadius.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: theme.borderRadius.sm,
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.divider,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  detailValue: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
  },
});

