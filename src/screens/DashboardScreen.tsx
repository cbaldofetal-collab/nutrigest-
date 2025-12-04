import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme';
import { Card, NutritionProgressBar, Button, DailyMealsBreakdown, MealCaloriesChart, CriticalNutrientsChart } from '../components';
import { useMealsStore, useUserStore, useHydrationStore, useSymptomsStore } from '../store';
import { NUTRITION_TARGETS, CRITICAL_NUTRIENTS, SYMPTOM_TYPES } from '../constants';
import { formatDate } from '../utils';

export function DashboardScreen() {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const user = useUserStore((state) => state.user);
  const loadUser = useUserStore((state) => state.loadUser);
  const getDailyNutrition = useMealsStore((state) => state.getDailyNutrition);
  const getMealsByDate = useMealsStore((state) => state.getMealsByDate);
  const loadMeals = useMealsStore((state) => state.loadMeals);
  const getTodayWater = useHydrationStore((state) => state.getTodayWater);
  const loadHydration = useHydrationStore((state) => state.loadHydration);
  const getSymptomsByDate = useSymptomsStore((state) => state.getSymptomsByDate);
  const loadSymptoms = useSymptomsStore((state) => state.loadSymptoms);

  const today = new Date();
  const dailyNutrition = getDailyNutrition(today);
  const todayWater = getTodayWater();
  const todayMeals = getMealsByDate(today);
  const todaySymptoms = getSymptomsByDate(today);
  
  // Combinar água dos alimentos com água registrada separadamente
  const totalWater = dailyNutrition.water + todayWater;

  // Determinar trimestre e metas
  const trimester = user?.gestationalWeek
    ? user.gestationalWeek <= 13
      ? 1
      : user.gestationalWeek <= 27
      ? 2
      : 3
    : 1;
  const targets = NUTRITION_TARGETS[trimester as keyof typeof NUTRITION_TARGETS] || NUTRITION_TARGETS[1];

  useEffect(() => {
    loadUser();
    loadMeals();
    loadHydration();
    loadSymptoms();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadUser(), loadMeals(), loadHydration(), loadSymptoms()]);
    setRefreshing(false);
  };

  const hasLowNutrients = CRITICAL_NUTRIENTS.some((nutrient) => {
    const current = dailyNutrition[nutrient.key as keyof typeof dailyNutrition] as number;
    const target = targets[nutrient.key as keyof typeof targets] as number;
    return current < target * 0.8;
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.subtitle}>
            {formatDate(today, "EEEE, dd 'de' MMMM")}
          </Text>
        </View>

        {hasLowNutrients && (
          <Card style={styles.alertCard}>
            <Text style={styles.alertTitle}>⚠️ Atenção</Text>
            <Text style={styles.alertText}>
              Alguns nutrientes críticos estão abaixo da meta recomendada. Verifique
              as barras abaixo e ajuste sua alimentação.
            </Text>
          </Card>
        )}

        <Card style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.sectionTitle}>Resumo do Dia</Text>
            {todayMeals.length > 0 && (
              <TouchableOpacity
                onPress={() => navigation.navigate('MealsHistory' as never)}
              >
                <Text style={styles.viewAllButton}>Ver todas ({todayMeals.length})</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {dailyNutrition.calories.toFixed(0)}
              </Text>
              <Text style={styles.summaryLabel}>kcal</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {dailyNutrition.protein.toFixed(1)}g
              </Text>
              <Text style={styles.summaryLabel}>Proteína</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {totalWater.toFixed(0)}ml
              </Text>
              <Text style={styles.summaryLabel}>Água</Text>
            </View>
          </View>
        </Card>

        {todayMeals.length > 0 && (
          <>
            <Card style={styles.chartCard}>
              <MealCaloriesChart meals={todayMeals} />
            </Card>
            <DailyMealsBreakdown meals={todayMeals} />
          </>
        )}

        <Card style={styles.nutritionCard}>
          <CriticalNutrientsChart 
            dailyNutrition={dailyNutrition}
            targets={targets}
          />
        </Card>

        <Card style={styles.macrosCard}>
          <Text style={styles.sectionTitle}>Macronutrientes</Text>
          <NutritionProgressBar
            label="Calorias"
            current={dailyNutrition.calories}
            target={targets.calories}
            unit="kcal"
          />
          <NutritionProgressBar
            label="Proteína"
            current={dailyNutrition.protein}
            target={targets.protein}
            unit="g"
          />
          <NutritionProgressBar
            label="Carboidratos"
            current={dailyNutrition.carbs}
            target={targets.carbs}
            unit="g"
          />
          <NutritionProgressBar
            label="Gorduras"
            current={dailyNutrition.fat}
            target={targets.fat}
            unit="g"
          />
        </Card>

        <Card style={styles.hydrationCard}>
          <Text style={styles.sectionTitle}>💧 Hidratação</Text>
          <NutritionProgressBar
            label="Água"
            current={totalWater}
            target={targets.water}
            unit="ml"
          />
          <Text style={styles.hydrationTip}>
            Beba água regularmente ao longo do dia para manter-se hidratada.
            {todayWater > 0 && (
              <Text style={styles.waterBreakdown}>
                {'\n'}Água registrada hoje: {todayWater.toFixed(0)}ml
              </Text>
            )}
          </Text>
        </Card>

        <Card style={styles.statsCard}>
          <View style={styles.statsHeader}>
            <Text style={styles.sectionTitle}>📈 Estatísticas</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Statistics' as never)}
            >
              <Text style={styles.viewStatsButton}>Ver Gráficos →</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.statsDescription}>
            Visualize gráficos de evolução de peso e nutrientes ao longo do tempo
          </Text>
        </Card>

        <Card style={styles.mealPlannerCard}>
          <View style={styles.mealPlannerHeader}>
            <View>
              <Text style={styles.sectionTitle}>📅 Planejador de Refeições</Text>
              <Text style={styles.mealPlannerDescription}>
                Receba sugestões de cardápio semanal personalizado
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('MealPlanner' as never)}
              style={styles.mealPlannerButton}
              accessibilityRole="button"
              accessibilityLabel="Abrir planejador de refeições"
              accessibilityHint="Veja sugestões de cardápio semanal personalizado"
            >
              <Text style={styles.mealPlannerButtonText}>Abrir →</Text>
            </TouchableOpacity>
          </View>
        </Card>

        <Card style={styles.symptomsCard}>
          <View style={styles.symptomsHeader}>
            <Text style={styles.sectionTitle}>🤒 Sintomas</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Symptoms' as never)}
            >
              <Text style={styles.viewStatsButton}>
                {todaySymptoms.length > 0 ? `Ver (${todaySymptoms.length})` : 'Registrar'} →
              </Text>
            </TouchableOpacity>
          </View>
          {todaySymptoms.length > 0 ? (
            <View style={styles.symptomsPreview}>
              {todaySymptoms.slice(0, 3).map((symptom) => {
                const symptomInfo = SYMPTOM_TYPES[symptom.type];
                return (
                  <View key={symptom.id} style={styles.symptomPreviewItem}>
                    <Text style={styles.symptomPreviewEmoji}>{symptomInfo.icon}</Text>
                    <Text style={styles.symptomPreviewText}>{symptomInfo.label}</Text>
                  </View>
                );
              })}
              {todaySymptoms.length > 3 && (
                <Text style={styles.symptomPreviewMore}>
                  +{todaySymptoms.length - 3} mais
                </Text>
              )}
            </View>
          ) : (
            <Text style={styles.statsDescription}>
              Registre sintomas como náuseas, azia e desejos para acompanhar padrões
            </Text>
          )}
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
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  alertCard: {
    backgroundColor: theme.colors.warning + '20',
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.warning,
    marginBottom: theme.spacing.md,
  },
  alertTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  alertText: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  summaryCard: {
    marginBottom: theme.spacing.md,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
  },
  viewAllButton: {
    ...theme.typography.bodySmall,
    color: theme.colors.primary,
    fontWeight: '600',
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
  nutritionCard: {
    marginBottom: theme.spacing.md,
  },
  chartCard: {
    marginBottom: theme.spacing.md,
  },
  macrosCard: {
    marginBottom: theme.spacing.md,
  },
  hydrationCard: {
    marginBottom: theme.spacing.md,
  },
  hydrationTip: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
    fontStyle: 'italic',
  },
  waterBreakdown: {
    ...theme.typography.bodySmall,
    color: theme.colors.secondary,
    fontWeight: '600',
  },
  mealPlannerCard: {
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.secondaryLight,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.secondary,
  },
  mealPlannerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealPlannerDescription: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  mealPlannerButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.secondary,
  },
  mealPlannerButtonText: {
    ...theme.typography.body,
    color: theme.colors.surface,
    fontWeight: '600',
  },
  statsCard: {
    marginBottom: theme.spacing.md,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  viewStatsButton: {
    ...theme.typography.bodySmall,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  statsDescription: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  symptomsCard: {
    marginBottom: theme.spacing.md,
  },
  symptomsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  symptomsPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    alignItems: 'center',
  },
  symptomPreviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.xs,
  },
  symptomPreviewEmoji: {
    fontSize: 16,
  },
  symptomPreviewText: {
    ...theme.typography.bodySmall,
    color: theme.colors.text,
  },
  symptomPreviewMore: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
});

