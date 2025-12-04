// Tela de estatísticas e gráficos

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme';
import { Card, WeightChart, NutritionChart } from '../components';
import { useMealsStore, useWeightStore, useUserStore } from '../store';
import { NUTRITION_TARGETS } from '../constants';
import { calculateAverageNutrition, subtractDaysFromDate } from '../utils';

type Period = 'week' | 'month';

export function StatisticsScreen() {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [period, setPeriod] = useState<Period>('week');

  const user = useUserStore((state) => state.user);
  const loadUser = useUserStore((state) => state.loadUser);
  const weights = useWeightStore((state) => state.entries);
  const loadWeights = useWeightStore((state) => state.loadWeights);
  const getMealsByDate = useMealsStore((state) => state.getMealsByDate);
  const getDailyNutrition = useMealsStore((state) => state.getDailyNutrition);
  const loadMeals = useMealsStore((state) => state.loadMeals);

  useEffect(() => {
    loadUser();
    loadWeights();
    loadMeals();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadUser(), loadWeights(), loadMeals()]);
    setRefreshing(false);
  };

  // Calcular dados do período
  const daysToShow = period === 'week' ? 7 : 30;
  const endDate = new Date();
  const startDate = subtractDaysFromDate(endDate, daysToShow - 1);

  // Coletar dados diários do período
  const dailyData: Array<{ date: Date; nutrition: any }> = [];
  for (let i = 0; i < daysToShow; i++) {
    const date = subtractDaysFromDate(endDate, daysToShow - 1 - i);
    const nutrition = getDailyNutrition(date);
    dailyData.push({ date, nutrition });
  }

  // Filtrar pesos do período
  const periodWeights = weights.filter(
    (entry) =>
      new Date(entry.date) >= startDate && new Date(entry.date) <= endDate
  );

  // Calcular médias
  const averageNutrition = calculateAverageNutrition(
    dailyData.map((d) => d.nutrition)
  );

  // Determinar trimestre e metas
  const trimester = user?.gestationalWeek
    ? user.gestationalWeek <= 13
      ? 1
      : user.gestationalWeek <= 27
      ? 2
      : 3
    : 1;
  const targets = NUTRITION_TARGETS[trimester as keyof typeof NUTRITION_TARGETS] || NUTRITION_TARGETS[1];

  // Calcular ganho de peso ideal
  const getIdealWeightGain = () => {
    if (!user) return null;
    const bmi = user.initialBMI;
    if (bmi < 18.5) return { min: 12.5, max: 18 };
    if (bmi < 25) return { min: 11.5, max: 16 };
    if (bmi < 30) return { min: 7, max: 11.5 };
    return { min: 5, max: 9 };
  };

  const idealGain = getIdealWeightGain();
  const totalWeeks = 40;
  const progress = user ? user.gestationalWeek / totalWeeks : 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Estatísticas</Text>
          <View style={styles.periodSelector}>
            <TouchableOpacity
              style={[styles.periodButton, period === 'week' && styles.periodButtonActive]}
              onPress={() => setPeriod('week')}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  period === 'week' && styles.periodButtonTextActive,
                ]}
              >
                7 dias
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.periodButton, period === 'month' && styles.periodButtonActive]}
              onPress={() => setPeriod('month')}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  period === 'month' && styles.periodButtonTextActive,
                ]}
              >
                30 dias
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Card style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Médias do Período</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {averageNutrition.calories.toFixed(0)}
              </Text>
              <Text style={styles.summaryLabel}>kcal/dia</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {averageNutrition.protein.toFixed(1)}g
              </Text>
              <Text style={styles.summaryLabel}>Proteína/dia</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {averageNutrition.iron.toFixed(1)}mg
              </Text>
              <Text style={styles.summaryLabel}>Ferro/dia</Text>
            </View>
          </View>
        </Card>

        <Card style={styles.chartCard}>
          <WeightChart
            entries={periodWeights}
            idealMin={idealGain ? idealGain.min * progress : undefined}
            idealMax={idealGain ? idealGain.max * progress : undefined}
            initialWeight={user?.initialWeight}
          />
        </Card>

        <Card style={styles.chartCard}>
          <NutritionChart
            dailyNutrition={dailyData.map((d) => d.nutrition)}
            nutrient="calories"
            label="Calorias"
            unit="kcal"
            target={targets.calories}
          />
        </Card>

        <Card style={styles.chartCard}>
          <NutritionChart
            dailyNutrition={dailyData.map((d) => d.nutrition)}
            nutrient="protein"
            label="Proteína"
            unit="g"
            target={targets.protein}
          />
        </Card>

        <Card style={styles.chartCard}>
          <NutritionChart
            dailyNutrition={dailyData.map((d) => d.nutrition)}
            nutrient="iron"
            label="Ferro"
            unit="mg"
            target={targets.iron}
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.md,
  },
  header: {
    marginBottom: theme.spacing.lg,
  },
  backButton: {
    ...theme.typography.body,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  periodSelector: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  periodButton: {
    flex: 1,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.divider,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  periodButtonText: {
    ...theme.typography.bodySmall,
    color: theme.colors.text,
  },
  periodButtonTextActive: {
    color: theme.colors.surface,
    fontWeight: '600',
  },
  summaryCard: {
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    ...theme.typography.h2,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  summaryLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  chartCard: {
    marginBottom: theme.spacing.md,
  },
});

