// Componente de gráfico de evolução nutricional

import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { theme } from '../theme';
import { DailyNutrition } from '../types';
import { formatDate } from '../utils';

interface NutritionChartProps {
  dailyNutrition: DailyNutrition[];
  nutrient: 'calories' | 'protein' | 'iron' | 'calcium';
  label: string;
  unit: string;
  target?: number;
}

export function NutritionChart({
  dailyNutrition,
  nutrient,
  label,
  unit,
  target,
}: NutritionChartProps) {
  if (dailyNutrition.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Sem dados para exibir</Text>
      </View>
    );
  }

  // Pegar últimos 7 dias
  const recentData = dailyNutrition.slice(-7);

  const labels = recentData.map((day) => {
    const date = new Date(day.date);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  });

  const values = recentData.map((day) => day[nutrient]);

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
      },
    ],
  };

  const screenWidth = Dimensions.get('window').width - theme.spacing.md * 2;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{label}</Text>
        {target && (
          <Text style={styles.target}>
            Meta: {target.toFixed(0)} {unit}
          </Text>
        )}
      </View>
      <BarChart
        data={chartData}
        width={screenWidth}
        height={200}
        chartConfig={{
          backgroundColor: theme.colors.surface,
          backgroundGradientFrom: theme.colors.surface,
          backgroundGradientTo: theme.colors.surface,
          decimalPlaces: 0,
          color: (opacity = 1) => theme.colors.primary,
          labelColor: (opacity = 1) => theme.colors.textSecondary,
          style: {
            borderRadius: theme.borderRadius.md,
          },
          propsForBackgroundLines: {
            strokeDasharray: '',
            stroke: theme.colors.divider,
            strokeWidth: 1,
          },
          barPercentage: 0.7,
        }}
        style={styles.chart}
        withInnerLines={true}
        withOuterLines={false}
        withVerticalLabels={true}
        withHorizontalLabels={true}
        showValuesOnTopOfBars={true}
        fromZero={true}
        {...(target && {
          segments: 4,
        })}
      />
      {target && (
        <View style={styles.targetLine}>
          <View style={styles.targetLineIndicator} />
          <Text style={styles.targetLineText}>
            Meta diária: {target.toFixed(0)} {unit}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    ...theme.typography.h3,
    color: theme.colors.text,
  },
  target: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  chart: {
    marginVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  emptyContainer: {
    padding: theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 150,
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  targetLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  targetLineIndicator: {
    width: 20,
    height: 2,
    backgroundColor: theme.colors.success,
  },
  targetLineText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
});

