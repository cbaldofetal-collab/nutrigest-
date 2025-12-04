// Componente de gráfico de nutrientes críticos

import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { theme } from '../theme';
import { DailyNutrition, NutritionTarget } from '../types';
import { CRITICAL_NUTRIENTS } from '../constants';

interface CriticalNutrientsChartProps {
  dailyNutrition: DailyNutrition;
  targets: NutritionTarget;
}

export function CriticalNutrientsChart({
  dailyNutrition,
  targets,
}: CriticalNutrientsChartProps) {
  // Preparar dados para o gráfico
  const labels: string[] = [];
  const data: number[] = [];
  const colors: string[] = [];
  const percentages: number[] = [];
  const targetValues: number[] = [];

  CRITICAL_NUTRIENTS.forEach((nutrient) => {
    const current = dailyNutrition[nutrient.key as keyof DailyNutrition] as number;
    const target = targets[nutrient.key as keyof NutritionTarget] as number;
    const percentage = target > 0 ? (current / target) * 100 : 0;
    const isLow = percentage < (nutrient.threshold * 100);

    labels.push(nutrient.label);
    data.push(current);
    targetValues.push(target);
    percentages.push(percentage);
    
    // Vermelho se abaixo da meta, verde se acima
    colors.push(isLow ? theme.colors.error : theme.colors.success);
  });

  const screenWidth = Dimensions.get('window').width - theme.spacing.md * 4;

  const chartData = {
    labels: labels,
    datasets: [
      {
        data: data,
      },
    ],
  };

  // Calcular altura máxima para o gráfico baseado no maior valor
  const maxValue = Math.max(...data, ...CRITICAL_NUTRIENTS.map(n => 
    targets[n.key as keyof NutritionTarget] as number
  ));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nutrientes Críticos</Text>
      <Text style={styles.subtitle}>
        Status dos nutrientes essenciais para a gestação
      </Text>
      <BarChart
        data={chartData}
        width={screenWidth}
        height={240}
        chartConfig={{
          backgroundColor: theme.colors.surface,
          backgroundGradientFrom: theme.colors.surface,
          backgroundGradientTo: theme.colors.surface,
          decimalPlaces: 1,
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
        yAxisLabel=""
        yAxisSuffix=""
      />
      
      {/* Informação sobre metas */}
      <View style={styles.targetInfo}>
        <Text style={styles.targetInfoText}>
          💡 Barras vermelhas indicam nutrientes abaixo da meta recomendada
        </Text>
      </View>

      {/* Legenda com valores */}
      <View style={styles.legend}>
        {CRITICAL_NUTRIENTS.map((nutrient, index) => {
          const current = dailyNutrition[nutrient.key as keyof DailyNutrition] as number;
          const target = targets[nutrient.key as keyof NutritionTarget] as number;
          const percentage = percentages[index];
          const isLow = percentage < (nutrient.threshold * 100);

          return (
            <View key={nutrient.key} style={styles.legendItem}>
              <View style={[styles.legendColor, { 
                backgroundColor: isLow ? theme.colors.error : theme.colors.success 
              }]} />
              <View style={styles.legendTextContainer}>
                <Text style={styles.legendLabel}>{nutrient.label}:</Text>
                <Text style={[
                  styles.legendValue,
                  isLow && styles.legendValueLow
                ]}>
                  {current.toFixed(1)} / {target.toFixed(0)} {nutrient.unit}
                  {isLow && ' ⚠️'}
                </Text>
              </View>
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
  targetInfo: {
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.sm,
  },
  targetInfoText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  legend: {
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: theme.spacing.sm,
  },
  legendTextContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  legendLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.text,
    fontWeight: '500',
  },
  legendValue: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  legendValueLow: {
    color: theme.colors.error,
    fontWeight: '600',
  },
});

