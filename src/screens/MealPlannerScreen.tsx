// Tela de Planejador de Refeições

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme';
import { Card, Button, NutritionProgressBar } from '../components';
import { useUserStore, useSymptomsStore } from '../store';
import { NUTRITION_TARGETS } from '../constants';
import {
  generateWeeklyMealPlan,
  WeeklyMealPlan,
  calculateWeeklyNutritionProgress,
} from '../services/mealPlanner';
import { formatDate } from '../utils';
import { Recipe } from '../types';

export function MealPlannerScreen() {
  const navigation = useNavigation();
  const [mealPlan, setMealPlan] = useState<WeeklyMealPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  const user = useUserStore((state) => state.user);
  const symptoms = useSymptomsStore((state) => state.entries);
  const getSymptomsByType = useSymptomsStore((state) => state.getSymptomsByType);

  useEffect(() => {
    if (user) {
      generatePlan();
    }
  }, [user]);

  const generatePlan = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Determinar trimestre e metas
      const trimester = user.gestationalWeek
        ? user.gestationalWeek <= 13
          ? 1
          : user.gestationalWeek <= 27
          ? 2
          : 3
        : 1;
      const targets = NUTRITION_TARGETS[trimester as keyof typeof NUTRITION_TARGETS];

      // Obter sintomas atuais
      const recentSymptoms = symptoms
        .filter((s) => {
          const daysDiff =
            (new Date().getTime() - new Date(s.date).getTime()) /
            (1000 * 60 * 60 * 24);
          return daysDiff <= 7; // Últimos 7 dias
        })
        .map((s) => s.type);

      const plan = await generateWeeklyMealPlan(
        targets,
        Array.from(new Set(recentSymptoms)),
        []
      );

      setMealPlan(plan);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível gerar o plano de refeições');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecipePress = (recipe: Recipe) => {
    navigation.navigate('RecipeDetail' as never, { recipe } as never);
  };

  const handleRegenerate = () => {
    Alert.alert(
      'Regenerar Plano',
      'Deseja gerar um novo plano de refeições?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Regenerar', onPress: generatePlan },
      ]
    );
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const trimester = user.gestationalWeek
    ? user.gestationalWeek <= 13
      ? 1
      : user.gestationalWeek <= 27
      ? 2
      : 3
    : 1;
  const targets = NUTRITION_TARGETS[trimester as keyof typeof NUTRITION_TARGETS];

  const selectedDay = mealPlan?.days[selectedDayIndex];
  const weeklyProgress = mealPlan
    ? calculateWeeklyNutritionProgress(mealPlan, targets)
    : null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>📅 Planejador de Refeições</Text>
          <Text style={styles.subtitle}>
            Sugestões de cardápio semanal personalizado para você
          </Text>
        </View>

        {isLoading ? (
          <Card style={styles.loadingCard}>
            <Text style={styles.loadingText}>Gerando seu plano semanal...</Text>
          </Card>
        ) : mealPlan ? (
          <>
            {/* Resumo Nutricional Semanal */}
            {weeklyProgress && (
              <Card style={styles.summaryCard}>
                <Text style={styles.sectionTitle}>
                  Resumo Nutricional Semanal (Média Diária)
                </Text>
                <NutritionProgressBar
                  label="Calorias"
                  current={weeklyProgress.average.calories}
                  target={targets.calories}
                  unit="kcal"
                />
                <NutritionProgressBar
                  label="Proteína"
                  current={weeklyProgress.average.protein}
                  target={targets.protein}
                  unit="g"
                />
                <NutritionProgressBar
                  label="Ferro"
                  current={weeklyProgress.average.iron}
                  target={targets.iron}
                  unit="mg"
                  isCritical
                />
                <NutritionProgressBar
                  label="Ácido Fólico"
                  current={weeklyProgress.average.folicAcid}
                  target={targets.folicAcid}
                  unit="mcg"
                  isCritical
                />
                <NutritionProgressBar
                  label="Cálcio"
                  current={weeklyProgress.average.calcium}
                  target={targets.calcium}
                  unit="mg"
                  isCritical
                />
              </Card>
            )}

            {/* Seletor de Dias */}
            <Card style={styles.daysCard}>
              <Text style={styles.sectionTitle}>Selecione o Dia</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.daysScroll}
              >
                {mealPlan.days.map((day, index) => {
                  const isSelected = selectedDayIndex === index;
                  const dayName = formatDate(day.date, 'EEE');
                  const dayNumber = formatDate(day.date, 'dd');
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.dayButton,
                        isSelected && styles.dayButtonSelected,
                      ]}
                      onPress={() => setSelectedDayIndex(index)}
                      accessibilityRole="button"
                      accessibilityLabel={`Dia ${dayNumber}, ${dayName}`}
                      accessibilityState={{ selected: isSelected }}
                    >
                      <Text
                        style={[
                          styles.dayName,
                          isSelected && styles.dayNameSelected,
                        ]}
                      >
                        {dayName}
                      </Text>
                      <Text
                        style={[
                          styles.dayNumber,
                          isSelected && styles.dayNumberSelected,
                        ]}
                      >
                        {dayNumber}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </Card>

            {/* Cardápio do Dia Selecionado */}
            {selectedDay && (
              <Card style={styles.menuCard}>
                <Text style={styles.sectionTitle}>
                  Cardápio - {formatDate(selectedDay.date, "dd 'de' MMMM")}
                </Text>

                {/* Café da Manhã */}
                {selectedDay.breakfast && (
                  <View style={styles.mealSection}>
                    <Text style={styles.mealTypeLabel}>🌅 Café da Manhã</Text>
                    <TouchableOpacity
                      style={styles.recipeCard}
                      onPress={() => handleRecipePress(selectedDay.breakfast!)}
                      accessibilityRole="button"
                      accessibilityLabel={selectedDay.breakfast.name}
                    >
                      <Text style={styles.recipeName}>
                        {selectedDay.breakfast.name}
                      </Text>
                      <Text style={styles.recipeDescription}>
                        {selectedDay.breakfast.description}
                      </Text>
                      {selectedDay.breakfast.nutrition && (
                        <Text style={styles.recipeCalories}>
                          {selectedDay.breakfast.nutrition.calories} kcal
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                )}

                {/* Almoço */}
                {selectedDay.lunch && (
                  <View style={styles.mealSection}>
                    <Text style={styles.mealTypeLabel}>🍽️ Almoço</Text>
                    <TouchableOpacity
                      style={styles.recipeCard}
                      onPress={() => handleRecipePress(selectedDay.lunch!)}
                      accessibilityRole="button"
                      accessibilityLabel={selectedDay.lunch.name}
                    >
                      <Text style={styles.recipeName}>
                        {selectedDay.lunch.name}
                      </Text>
                      <Text style={styles.recipeDescription}>
                        {selectedDay.lunch.description}
                      </Text>
                      {selectedDay.lunch.nutrition && (
                        <Text style={styles.recipeCalories}>
                          {selectedDay.lunch.nutrition.calories} kcal
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                )}

                {/* Jantar */}
                {selectedDay.dinner && (
                  <View style={styles.mealSection}>
                    <Text style={styles.mealTypeLabel}>🌙 Jantar</Text>
                    <TouchableOpacity
                      style={styles.recipeCard}
                      onPress={() => handleRecipePress(selectedDay.dinner!)}
                      accessibilityRole="button"
                      accessibilityLabel={selectedDay.dinner.name}
                    >
                      <Text style={styles.recipeName}>
                        {selectedDay.dinner.name}
                      </Text>
                      <Text style={styles.recipeDescription}>
                        {selectedDay.dinner.description}
                      </Text>
                      {selectedDay.dinner.nutrition && (
                        <Text style={styles.recipeCalories}>
                          {selectedDay.dinner.nutrition.calories} kcal
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                )}

                {/* Lanches */}
                {selectedDay.snacks.length > 0 && (
                  <View style={styles.mealSection}>
                    <Text style={styles.mealTypeLabel}>🍎 Lanches</Text>
                    {selectedDay.snacks.map((snack, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.recipeCard}
                        onPress={() => handleRecipePress(snack)}
                        accessibilityRole="button"
                        accessibilityLabel={snack.name}
                      >
                        <Text style={styles.recipeName}>{snack.name}</Text>
                        {snack.nutrition && (
                          <Text style={styles.recipeCalories}>
                            {snack.nutrition.calories} kcal
                          </Text>
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                {/* Nutrição Estimada do Dia */}
                <View style={styles.nutritionSection}>
                  <Text style={styles.nutritionTitle}>
                    Nutrição Estimada do Dia
                  </Text>
                  <View style={styles.nutritionRow}>
                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionLabel}>Calorias</Text>
                      <Text style={styles.nutritionValue}>
                        {selectedDay.estimatedNutrition.calories.toFixed(0)} kcal
                      </Text>
                    </View>
                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionLabel}>Proteína</Text>
                      <Text style={styles.nutritionValue}>
                        {selectedDay.estimatedNutrition.protein.toFixed(1)}g
                      </Text>
                    </View>
                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionLabel}>Ferro</Text>
                      <Text style={styles.nutritionValue}>
                        {selectedDay.estimatedNutrition.iron.toFixed(1)}mg
                      </Text>
                    </View>
                  </View>
                </View>
              </Card>
            )}

            <Button
              title="🔄 Regenerar Plano"
              onPress={handleRegenerate}
              variant="outline"
              style={styles.regenerateButton}
              accessibilityLabel="Regenerar plano de refeições"
              accessibilityHint="Gera um novo plano de refeições semanal"
            />
          </>
        ) : (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              Não foi possível gerar o plano. Tente novamente.
            </Text>
            <Button
              title="Tentar Novamente"
              onPress={generatePlan}
              style={styles.retryButton}
            />
          </Card>
        )}
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  loadingText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  loadingCard: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  summaryCard: {
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  daysCard: {
    marginBottom: theme.spacing.md,
  },
  daysScroll: {
    marginHorizontal: -theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  dayButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.divider,
    marginRight: theme.spacing.sm,
    alignItems: 'center',
    minWidth: 60,
  },
  dayButtonSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  dayName: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  dayNameSelected: {
    color: theme.colors.surface,
  },
  dayNumber: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
  },
  dayNumberSelected: {
    color: theme.colors.surface,
  },
  menuCard: {
    marginBottom: theme.spacing.md,
  },
  mealSection: {
    marginBottom: theme.spacing.lg,
  },
  mealTypeLabel: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  recipeCard: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.divider,
    marginBottom: theme.spacing.sm,
  },
  recipeName: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  recipeDescription: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    lineHeight: 20,
  },
  recipeCalories: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  nutritionSection: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.divider,
  },
  nutritionTitle: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  nutritionValue: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
  },
  regenerateButton: {
    marginTop: theme.spacing.md,
  },
  emptyCard: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  retryButton: {
    marginTop: theme.spacing.md,
  },
});

