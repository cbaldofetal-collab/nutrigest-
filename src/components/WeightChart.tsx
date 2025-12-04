// Componente de gráfico de evolução de peso

import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { theme } from '../theme';
import { WeightEntry } from '../types';
import { formatDate } from '../utils';

interface WeightChartProps {
  entries: WeightEntry[];
  idealMin?: number;
  idealMax?: number;
  initialWeight?: number;
}

export function WeightChart({
  entries,
  idealMin,
  idealMax,
  initialWeight,
}: WeightChartProps) {
  if (entries.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Nenhum registro de peso ainda</Text>
        <Text style={styles.emptySubtext}>
          Registre seu peso para ver a evolução
        </Text>
      </View>
    );
  }

  // Ordenar por data (mais antigo primeiro)
  const sortedEntries = [...entries].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Preparar dados para o gráfico
  const labels = sortedEntries.map((entry) => {
    const date = new Date(entry.date);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  });

  const weights = sortedEntries.map((entry) => entry.weight);

  // Preparar dados da linha ideal
  const idealData = idealMin && idealMax && initialWeight
    ? sortedEntries.map((_, index) => {
        const progress = index / Math.max(sortedEntries.length - 1, 1);
        return initialWeight + idealMin + (idealMax - idealMin) * progress;
      })
    : [];

  const chartData = {
    labels: labels.length > 7 ? labels.slice(-7) : labels, // Mostrar últimos 7 pontos
    datasets: [
      {
        data: weights.length > 7 ? weights.slice(-7) : weights,
        color: (opacity = 1) => theme.colors.primary,
        strokeWidth: 2,
      },
      ...(idealData.length > 0
        ? [
            {
              data: idealData.length > 7 ? idealData.slice(-7) : idealData,
              color: (opacity = 0.3) => theme.colors.success,
              strokeWidth: 1,
              withDots: false,
            },
          ]
        : []),
    ],
  };

  const screenWidth = Dimensions.get('window').width - theme.spacing.md * 2;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Evolução de Peso</Text>
      <LineChart
        data={chartData}
        width={screenWidth}
        height={220}
        chartConfig={{
          backgroundColor: theme.colors.surface,
          backgroundGradientFrom: theme.colors.surface,
          backgroundGradientTo: theme.colors.surface,
          decimalPlaces: 1,
          color: (opacity = 1) => theme.colors.text,
          labelColor: (opacity = 1) => theme.colors.textSecondary,
          style: {
            borderRadius: theme.borderRadius.md,
          },
          propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: theme.colors.primary,
          },
          propsForBackgroundLines: {
            strokeDasharray: '',
            stroke: theme.colors.divider,
            strokeWidth: 1,
          },
        }}
        bezier
        style={styles.chart}
        withInnerLines={true}
        withOuterLines={false}
        withVerticalLabels={true}
        withHorizontalLabels={true}
        withDots={true}
        withShadow={false}
      />
      {idealMin && idealMax && (
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: theme.colors.primary }]} />
            <Text style={styles.legendText}>Peso Real</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: theme.colors.success }]} />
            <Text style={styles.legendText}>Faixa Ideal</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.md,
  },
  title: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  chart: {
    marginVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  emptyContainer: {
    padding: theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  emptySubtext: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: theme.spacing.md,
    gap: theme.spacing.lg,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
});

