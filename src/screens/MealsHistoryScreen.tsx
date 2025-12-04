// Tela de histórico de refeições do dia

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme';
import { Card, Button, MealSummaryCard, DailyMealsBreakdown } from '../components';
import { useMealsStore, useFavoritesStore } from '../store';
import { MealEntry, MealType } from '../types';
import { MEAL_TYPES } from '../constants';
import { formatDate, formatDateTime } from '../utils';

export function MealsHistoryScreen() {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showSaveFavoriteModal, setShowSaveFavoriteModal] = useState(false);
  const [favoriteName, setFavoriteName] = useState('');
  const [selectedMealsForFavorite, setSelectedMealsForFavorite] = useState<MealEntry[]>([]);
  
  const getMealsByDate = useMealsStore((state) => state.getMealsByDate);
  const removeMeal = useMealsStore((state) => state.removeMeal);
  const loadMeals = useMealsStore((state) => state.loadMeals);
  const addFavorite = useFavoritesStore((state) => state.addFavorite);

  const meals = getMealsByDate(selectedDate);

  useEffect(() => {
    loadMeals();
  }, []);

  const handleSaveAsFavorite = (meals: MealEntry[]) => {
    if (meals.length === 0) {
      Alert.alert('Atenção', 'Selecione pelo menos uma refeição');
      return;
    }
    setSelectedMealsForFavorite(meals);
    setShowSaveFavoriteModal(true);
  };

  const handleConfirmSaveFavorite = async () => {
    if (!favoriteName.trim()) {
      Alert.alert('Atenção', 'Digite um nome para a refeição favorita');
      return;
    }

    if (selectedMealsForFavorite.length === 0) {
      Alert.alert('Atenção', 'Nenhuma refeição selecionada');
      return;
    }

    // Agrupar por tipo de refeição (pegar o primeiro tipo)
    const mealType = selectedMealsForFavorite[0].mealType;

    try {
      await addFavorite({
        userId: 'current_user',
        name: favoriteName.trim(),
        foods: selectedMealsForFavorite.map((meal) => ({
          foodId: meal.foodId,
          quantity: meal.quantity,
        })),
        mealType,
      });

      Alert.alert('Sucesso', 'Refeição salva como favorita!');
      setShowSaveFavoriteModal(false);
      setFavoriteName('');
      setSelectedMealsForFavorite([]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o favorito');
      console.error(error);
    }
  };

  const handleRemoveMeal = (mealId: string, foodName: string) => {
    Alert.alert(
      'Remover Refeição',
      `Deseja remover ${foodName}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            await removeMeal(mealId);
            Alert.alert('Sucesso', 'Refeição removida');
          },
        },
      ]
    );
  };

  const groupMealsByType = (meals: MealEntry[]) => {
    const grouped: Record<MealType, MealEntry[]> = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snack: [],
    };

    meals.forEach((meal) => {
      grouped[meal.mealType].push(meal);
    });

    return grouped;
  };

  const groupedMeals = groupMealsByType(meals);
  const totalCalories = meals.reduce((sum, meal) => {
    return sum + meal.food.calories * meal.quantity;
  }, 0);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Refeições do Dia</Text>
          <Text style={styles.date}>{formatDate(selectedDate, "EEEE, dd 'de' MMMM")}</Text>
        </View>

        <Card style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View>
              <Text style={styles.summaryLabel}>Total de Refeições</Text>
              <Text style={styles.summaryValue}>{meals.length}</Text>
            </View>
            <View>
              <Text style={styles.summaryLabel}>Calorias Totais</Text>
              <Text style={styles.summaryValue}>{totalCalories.toFixed(0)} kcal</Text>
            </View>
          </View>
        </Card>

        <DailyMealsBreakdown meals={meals} />

        {(Object.keys(MEAL_TYPES) as MealType[]).map((mealType) => {
          const mealsOfType = groupedMeals[mealType];
          if (mealsOfType.length === 0) return null;

          return (
            <MealSummaryCard
              key={mealType}
              meals={mealsOfType}
              mealType={mealType}
            />
          );
        })}

        {meals.length === 0 && (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>Nenhuma refeição registrada hoje</Text>
            <Text style={styles.emptySubtext}>
              Comece registrando suas refeições na aba "Registrar"
            </Text>
          </Card>
        )}

        {meals.length > 0 && (
          <Button
            title="⭐ Salvar Refeições como Favorito"
            onPress={() => handleSaveAsFavorite(meals)}
            variant="outline"
            style={styles.saveFavoriteButton}
          />
        )}
      </ScrollView>

      {/* Modal de salvar favorito */}
      <Modal
        visible={showSaveFavoriteModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowSaveFavoriteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Salvar como Favorito</Text>
            <Text style={styles.modalSubtitle}>
              {selectedMealsForFavorite.length} refeição(ões) selecionada(s)
            </Text>

            <Text style={styles.modalLabel}>Nome da Refeição</Text>
            <TextInput
              style={styles.modalInput}
              value={favoriteName}
              onChangeText={setFavoriteName}
              placeholder="Ex: Café da Manhã Completo"
              placeholderTextColor={theme.colors.textSecondary}
              autoFocus
            />

            <View style={styles.modalButtons}>
              <Button
                title="Cancelar"
                onPress={() => {
                  setShowSaveFavoriteModal(false);
                  setFavoriteName('');
                }}
                variant="outline"
                style={styles.modalCancelButton}
              />
              <Button
                title="Salvar"
                onPress={handleConfirmSaveFavorite}
                style={styles.modalSaveButton}
              />
            </View>
          </View>
        </View>
      </Modal>
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
    marginBottom: theme.spacing.xs,
  },
  date: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  summaryCard: {
    marginBottom: theme.spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  summaryValue: {
    ...theme.typography.h2,
    color: theme.colors.primary,
  },
  mealTypeCard: {
    marginBottom: theme.spacing.md,
  },
  mealTypeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  mealTypeEmoji: {
    fontSize: 24,
    marginRight: theme.spacing.sm,
  },
  mealTypeTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
  },
  mealItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  mealItemContent: {
    flex: 1,
  },
  mealItemName: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  mealItemQuantity: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  mealItemNutrition: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.xs,
  },
  mealItemNutritionText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginRight: theme.spacing.sm,
  },
  mealItemTime: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.error + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    ...theme.typography.h2,
    color: theme.colors.error,
    lineHeight: 32,
  },
  emptyCard: {
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  emptySubtext: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  saveFavoriteButton: {
    marginTop: theme.spacing.md,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  modalSubtitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  modalLabel: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    fontWeight: '500',
  },
  modalInput: {
    ...theme.typography.body,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.divider,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  modalCancelButton: {
    flex: 1,
  },
  modalSaveButton: {
    flex: 1,
  },
});

