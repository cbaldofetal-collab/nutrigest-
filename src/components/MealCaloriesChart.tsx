// Componente de gráfico de calorias por refeição

import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { theme } from '../theme';
import { MealEntry, MealType } from '../types';
import { MEAL_TYPES } from '../constants';

interface MealCaloriesChartProps {
  meals: MealEntry[];
}

export function MealCaloriesChart({ meals }: MealCaloriesChartProps) {
  if (meals.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Nenhuma refeição registrada ainda</Text>
        <Text style={styles.emptySubtext}>
          Registre suas refeições para ver o gráfico
        </Text>
      </View>
    );
  }

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

  // Preparar dados para o gráfico
  const labels: string[] = [];
  const data: number[] = [];
  const colors: string[] = [];

  (Object.keys(MEAL_TYPES) as MealType[]).forEach((mealType) => {
    const calories = mealCalories[mealType];
    if (calories > 0) {
      labels.push(MEAL_TYPES[mealType].label);
      data.push(calories);
      
      // Cores diferentes para cada tipo de refeição
      if (mealType === 'breakfast') {
        colors.push(theme.colors.primary);
      } else if (mealType === 'lunch') {
        colors.push(theme.colors.secondary);
      } else if (mealType === 'dinner') {
        colors.push(theme.colors.accent);
      } else {
        colors.push(theme.colors.warning);
      }
    }
  });

  if (data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Nenhuma refeição registrada ainda</Text>
      </View>
    );
  }

  const totalCalories = data.reduce((sum, cal) => sum + cal, 0);
  const screenWidth = Dimensions.get('window').width - theme.spacing.md * 4;

  const chartData = {
    labels: labels,
    datasets: [
      {
        data: data,
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calorias por Refeição</Text>
      <Text style={styles.subtitle}>Total: {totalCalories.toFixed(0)} kcal</Text>
      <BarChart
        data={chartData}
        width={screenWidth}
        height={220}
        chartConfig={{
          backgroundColor: theme.colors.surface,
          backgroundGradientFrom: theme.colors.surface,
          backgroundGradientTo: theme.colors.surface,
          decimalPlaces: 0,
          color: (opacity = 1, index) => {
            return colors[index] || theme.colors.primary;
          },
          labelColor: (opacity = 1) => theme.colors.textSecondary,
          style: {
            borderRadius: theme.borderRadius.md,
          },
          propsForBackgroundLines: {
            strokeDasharray: '',
            stroke: theme.colors.divider,
            strokeWidth: 1,
          },
          barPercentage: 0.6,
        }}
        style={styles.chart}
        withInnerLines={true}
        withOuterLines={false}
        withVerticalLabels={true}
        withHorizontalLabels={true}
        showValuesOnTopOfBars={true}
        fromZero={true}
        segments={4}
      />
      <View style={styles.legend}>
        {(Object.keys(MEAL_TYPES) as MealType[]).map((mealType) => {
          const calories = mealCalories[mealType];
          if (calories === 0) return null;
          
          let color = theme.colors.primary;
          if (mealType === 'breakfast') color = theme.colors.primary;
          else if (mealType === 'lunch') color = theme.colors.secondary;
          else if (mealType === 'dinner') color = theme.colors.accent;
          else color = theme.colors.warning;

          return (
            <View key={mealType} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: color }]} />
              <Text style={styles.legendText}>
                {MEAL_TYPES[mealType].icon} {MEAL_TYPES[mealType].label}: {calories.toFixed(0)} kcal
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  chart: {
    marginVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: theme.spacing.xs,
  },
  legendText: {
    ...theme.typography.bodySmall,
    color: theme.colors.text,
  },
  emptyContainer: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  emptySubtext: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
});

