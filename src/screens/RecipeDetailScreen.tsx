// Tela de detalhes da receita

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
import { useNavigation, useRoute } from '@react-navigation/native';
import { theme } from '../theme';
import { Card, Button } from '../components';
import { Recipe, Food } from '../types';
import { getRecipeIngredientsWithFoods } from '../services/recipes';
import { useMealsStore } from '../store';
import { MEAL_TYPES } from '../constants';

export function RecipeDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const recipe = (route.params as any)?.recipe as Recipe;
  const [ingredientsWithFoods, setIngredientsWithFoods] = useState<
    Array<{ ingredient: Recipe['ingredients'][0]; food: Food | null }>
  >([]);
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');

  const addMeal = useMealsStore((state) => state.addMeal);

  useEffect(() => {
    if (recipe) {
      loadIngredients();
    }
  }, [recipe]);

  const loadIngredients = async () => {
    if (!recipe) return;
    try {
      const ingredients = await getRecipeIngredientsWithFoods(recipe);
      setIngredientsWithFoods(ingredients);
    } catch (error) {
      console.error('Erro ao carregar ingredientes:', error);
    }
  };

  const handleAddToMeals = async () => {
    if (!recipe) return;

    try {
      // Adicionar cada ingrediente como uma refeição
      for (const { ingredient, food } of ingredientsWithFoods) {
        if (food) {
          await addMeal({
            userId: 'current_user',
            foodId: food.id,
            food: food,
            quantity: ingredient.quantity / food.servingSize, // Converter para porções
            mealType: selectedMealType,
            date: new Date(),
          });
        }
      }

      Alert.alert(
        'Sucesso!',
        'Receita adicionada às suas refeições do dia!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível adicionar a receita');
      console.error(error);
    }
  };

  if (!recipe) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Receita não encontrada</Text>
        </View>
      </SafeAreaView>
    );
  }

  const totalTime = recipe.prepTime + recipe.cookTime;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{recipe.name}</Text>
          <Text style={styles.description}>{recipe.description}</Text>
        </View>

        {/* Informações da Receita */}
        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>⏱️</Text>
              <Text style={styles.infoLabel}>Preparo</Text>
              <Text style={styles.infoValue}>{recipe.prepTime} min</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>🔥</Text>
              <Text style={styles.infoLabel}>Cozimento</Text>
              <Text style={styles.infoValue}>{recipe.cookTime} min</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>⏰</Text>
              <Text style={styles.infoLabel}>Total</Text>
              <Text style={styles.infoValue}>{totalTime} min</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>👥</Text>
              <Text style={styles.infoLabel}>Porções</Text>
              <Text style={styles.infoValue}>{recipe.servings}</Text>
            </View>
          </View>
        </Card>

        {/* Informação Nutricional */}
        {recipe.nutrition && (
          <Card style={styles.nutritionCard}>
            <Text style={styles.sectionTitle}>Informação Nutricional (por porção)</Text>
            <View style={styles.nutritionGrid}>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Calorias</Text>
                <Text style={styles.nutritionValue}>
                  {recipe.nutrition.calories} kcal
                </Text>
              </View>
              {recipe.nutrition.protein && (
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionLabel}>Proteína</Text>
                  <Text style={styles.nutritionValue}>
                    {recipe.nutrition.protein}g
                  </Text>
                </View>
              )}
              {recipe.nutrition.iron && (
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionLabel}>Ferro</Text>
                  <Text style={styles.nutritionValue}>
                    {recipe.nutrition.iron}mg
                  </Text>
                </View>
              )}
              {recipe.nutrition.folicAcid && (
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionLabel}>Ácido Fólico</Text>
                  <Text style={styles.nutritionValue}>
                    {recipe.nutrition.folicAcid}mcg
                  </Text>
                </View>
              )}
              {recipe.nutrition.calcium && (
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionLabel}>Cálcio</Text>
                  <Text style={styles.nutritionValue}>
                    {recipe.nutrition.calcium}mg
                  </Text>
                </View>
              )}
            </View>
          </Card>
        )}

        {/* Ingredientes */}
        <Card style={styles.ingredientsCard}>
          <Text style={styles.sectionTitle}>Ingredientes</Text>
          {ingredientsWithFoods.map((item, index) => (
            <View key={index} style={styles.ingredientItem}>
              <Text style={styles.ingredientBullet}>•</Text>
              <Text style={styles.ingredientText}>
                {item.food?.name || 'Ingrediente'} - {item.ingredient.quantity}{' '}
                {item.ingredient.unit}
              </Text>
            </View>
          ))}
        </Card>

        {/* Modo de Preparo */}
        <Card style={styles.instructionsCard}>
          <Text style={styles.sectionTitle}>Modo de Preparo</Text>
          {recipe.instructions.map((instruction, index) => (
            <View key={index} style={styles.instructionItem}>
              <View style={styles.instructionNumber}>
                <Text style={styles.instructionNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.instructionText}>{instruction}</Text>
            </View>
          ))}
        </Card>

        {/* Tags */}
        {recipe.tags.length > 0 && (
          <Card style={styles.tagsCard}>
            <Text style={styles.sectionTitle}>Tags</Text>
            <View style={styles.tagsContainer}>
              {recipe.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </Card>
        )}

        {/* Adicionar às Refeições */}
        <Card style={styles.addCard}>
          <Text style={styles.sectionTitle}>Adicionar às Minhas Refeições</Text>
          <Text style={styles.addDescription}>
            Selecione o tipo de refeição e adicione todos os ingredientes de uma vez
          </Text>
          
          <View style={styles.mealTypeContainer}>
            <Text style={styles.mealTypeLabel}>Tipo de Refeição</Text>
            <View style={styles.mealTypeButtons}>
              {(Object.keys(MEAL_TYPES) as Array<keyof typeof MEAL_TYPES>).map((type) => {
                const mealType = MEAL_TYPES[type];
                const isSelected = selectedMealType === type;
                return (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.mealTypeButton,
                      isSelected && styles.mealTypeButtonSelected,
                    ]}
                    onPress={() => setSelectedMealType(type)}
                    accessibilityRole="button"
                    accessibilityLabel={mealType.label}
                    accessibilityState={{ selected: isSelected }}
                  >
                    <Text style={styles.mealTypeEmoji}>{mealType.icon}</Text>
                    <Text
                      style={[
                        styles.mealTypeText,
                        isSelected && styles.mealTypeTextSelected,
                      ]}
                    >
                      {mealType.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <Button
            title="Adicionar Receita"
            onPress={handleAddToMeals}
            style={styles.addButton}
            accessibilityLabel="Adicionar receita às refeições"
            accessibilityHint="Adiciona todos os ingredientes da receita às suas refeições do dia"
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
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  description: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    lineHeight: 24,
  },
  infoCard: {
    marginBottom: theme.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  infoItem: {
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    minWidth: 80,
  },
  infoIcon: {
    fontSize: 24,
    marginBottom: theme.spacing.xs,
  },
  infoLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  infoValue: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
  },
  nutritionCard: {
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  nutritionItem: {
    flex: 1,
    minWidth: '45%',
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
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
  ingredientsCard: {
    marginBottom: theme.spacing.md,
  },
  ingredientItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
    alignItems: 'flex-start',
  },
  ingredientBullet: {
    ...theme.typography.body,
    color: theme.colors.primary,
    marginRight: theme.spacing.sm,
    fontWeight: 'bold',
  },
  ingredientText: {
    ...theme.typography.body,
    color: theme.colors.text,
    flex: 1,
  },
  instructionsCard: {
    marginBottom: theme.spacing.md,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
    alignItems: 'flex-start',
  },
  instructionNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  instructionNumberText: {
    ...theme.typography.bodySmall,
    color: theme.colors.surface,
    fontWeight: '600',
  },
  instructionText: {
    ...theme.typography.body,
    color: theme.colors.text,
    flex: 1,
    lineHeight: 24,
  },
  tagsCard: {
    marginBottom: theme.spacing.md,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  tag: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  tagText: {
    ...theme.typography.bodySmall,
    color: theme.colors.primaryDark,
  },
  addCard: {
    marginBottom: theme.spacing.xl,
  },
  addDescription: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  mealTypeContainer: {
    marginBottom: theme.spacing.md,
  },
  mealTypeLabel: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    fontWeight: '500',
  },
  mealTypeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  mealTypeButton: {
    flex: 1,
    minWidth: '45%',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.divider,
    alignItems: 'center',
  },
  mealTypeButtonSelected: {
    backgroundColor: theme.colors.primaryLight,
    borderColor: theme.colors.primary,
  },
  mealTypeEmoji: {
    fontSize: 24,
    marginBottom: theme.spacing.xs,
  },
  mealTypeText: {
    ...theme.typography.bodySmall,
    color: theme.colors.text,
  },
  mealTypeTextSelected: {
    color: theme.colors.primaryDark,
    fontWeight: '600',
  },
  addButton: {
    marginTop: theme.spacing.md,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  errorText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
});

