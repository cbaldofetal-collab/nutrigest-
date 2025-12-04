import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme';
import { FoodSearchInput, FoodQuantityInput, Button, Card } from '../components';
import { useMealsStore } from '../store';
import { Food, MealType } from '../types';
import { MEAL_TYPES } from '../constants';
import { formatDate } from '../utils';
import { addCustomFood } from '../services/foodDatabase';

export function RegisterScreen() {
  const navigation = useNavigation();
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedMealType, setSelectedMealType] = useState<MealType>('breakfast');
  const [isRegistering, setIsRegistering] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [customFoodName, setCustomFoodName] = useState('');
  const [customFoodBrand, setCustomFoodBrand] = useState('');
  const [customFoodServingSize, setCustomFoodServingSize] = useState('100');
  const [customFoodServingUnit, setCustomFoodServingUnit] = useState('g');
  const [customFoodCalories, setCustomFoodCalories] = useState('');
  const [customFoodProtein, setCustomFoodProtein] = useState('');
  const [customFoodIron, setCustomFoodIron] = useState('');
  const [isCreatingFood, setIsCreatingFood] = useState(false);
  const addMeal = useMealsStore((state) => state.addMeal);
  const error = useMealsStore((state) => state.error);
  const isLoading = useMealsStore((state) => state.isLoading);
  const clearError = useMealsStore((state) => state.clearError);

  const handleSelectFood = (food: Food) => {
    setSelectedFood(food);
    setQuantity(1);
    clearError();
  };

  const handleCreateCustomFood = (query: string) => {
    setCustomFoodName(query);
    setCustomFoodBrand('');
    setCustomFoodServingSize('100');
    setCustomFoodServingUnit('g');
    setCustomFoodCalories('');
    setCustomFoodProtein('');
    setCustomFoodIron('');
    setShowCreateModal(true);
  };

  const handleSaveCustomFood = async () => {
    if (!customFoodName.trim()) {
      Alert.alert('Atenção', 'O nome do alimento é obrigatório');
      return;
    }

    if (!customFoodCalories || parseFloat(customFoodCalories) <= 0) {
      Alert.alert('Atenção', 'Informe as calorias (por 100g/ml)');
      return;
    }

    setIsCreatingFood(true);
    try {
      const servingSize = parseFloat(customFoodServingSize) || 100;
      const calories = parseFloat(customFoodCalories);
      const protein = parseFloat(customFoodProtein) || 0;
      const iron = parseFloat(customFoodIron) || 0;

      // Calcular valores por porção
      const caloriesPerServing = (calories * servingSize) / 100;
      const proteinPerServing = (protein * servingSize) / 100;
      const ironPerServing = (iron * servingSize) / 100;

      const newFood: Food = {
        id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: customFoodName.trim(),
        brand: customFoodBrand.trim() || undefined,
        servingSize: servingSize,
        servingUnit: customFoodServingUnit,
        calories: caloriesPerServing,
        protein: proteinPerServing,
        carbs: 0, // Opcional - pode adicionar campo depois
        fat: 0, // Opcional
        fiber: 0, // Opcional
        iron: ironPerServing,
        folicAcid: 0, // Opcional
        calcium: 0, // Opcional
        omega3: 0, // Opcional
        vitaminD: 0, // Opcional
        vitaminC: 0, // Opcional
        sodium: 0, // Opcional
      };

      const createdFood = await addCustomFood(newFood);
      setShowCreateModal(false);
      setSelectedFood(createdFood);
      setQuantity(1);
      Alert.alert('Sucesso', 'Alimento criado com sucesso!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Não foi possível criar o alimento';
      Alert.alert('Erro', errorMessage);
      console.error('Erro ao criar alimento:', error);
    } finally {
      setIsCreatingFood(false);
    }
  };

  const handleRegister = async () => {
    if (!selectedFood) {
      Alert.alert('Atenção', 'Selecione um alimento primeiro');
      return;
    }

    if (quantity <= 0) {
      Alert.alert('Atenção', 'A quantidade deve ser maior que zero');
      return;
    }

    if (quantity > 100) {
      Alert.alert('Atenção', 'A quantidade não pode ser maior que 100 porções');
      return;
    }

    setIsRegistering(true);
    try {
      await addMeal({
        userId: 'current_user', // Em produção, viria do store do usuário
        foodId: selectedFood.id,
        food: selectedFood,
        quantity: quantity,
        mealType: selectedMealType,
        date: new Date(),
      });

      Alert.alert('Sucesso', 'Alimento registrado com sucesso!', [
        {
          text: 'OK',
          onPress: () => {
            setSelectedFood(null);
            setQuantity(1);
            clearError();
          },
        },
      ]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Não foi possível registrar o alimento';
      Alert.alert('Erro', errorMessage);
      console.error('Erro ao registrar alimento:', error);
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Registrar Alimento</Text>
          <Text style={styles.subtitle}>
            Registre suas refeições de forma rápida e fácil
          </Text>
        </View>

        <Card style={styles.searchCard}>
          <View style={styles.searchHeader}>
            <Text style={styles.sectionTitle}>Buscar Alimento</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Favorites' as never)}
              style={styles.favoritesButton}
            >
              <Text style={styles.favoritesButtonText}>⭐ Favoritos</Text>
            </TouchableOpacity>
          </View>
          <FoodSearchInput 
            onSelectFood={handleSelectFood}
            onCreateCustomFood={handleCreateCustomFood}
          />
        </Card>

        {selectedFood && (
          <Card style={styles.foodCard}>
            <View style={styles.foodHeader}>
              <Text style={styles.foodName}>{selectedFood.name}</Text>
              {selectedFood.brand && (
                <Text style={styles.foodBrand}>{selectedFood.brand}</Text>
              )}
            </View>

            <View style={styles.nutritionInfo}>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Calorias</Text>
                <Text style={styles.nutritionValue}>
                  {(selectedFood.calories * quantity).toFixed(0)} kcal
                </Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Proteína</Text>
                <Text style={styles.nutritionValue}>
                  {(selectedFood.protein * quantity).toFixed(1)}g
                </Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Ferro</Text>
                <Text style={styles.nutritionValue}>
                  {(selectedFood.iron * quantity).toFixed(1)}mg
                </Text>
              </View>
            </View>

            <FoodQuantityInput
              food={selectedFood}
              quantity={quantity}
              onQuantityChange={setQuantity}
            />

            <View style={styles.mealTypeContainer}>
              <Text style={styles.sectionTitle}>Tipo de Refeição</Text>
              <View style={styles.mealTypeButtons}>
                {(Object.keys(MEAL_TYPES) as MealType[]).map((type) => {
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
                    >
                      <Text style={styles.mealTypeEmoji}>{mealType.icon}</Text>
                      <Text
                        style={[
                          styles.mealTypeLabel,
                          isSelected && styles.mealTypeLabelSelected,
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
              title="Registrar Refeição"
              onPress={handleRegister}
              style={styles.registerButton}
              loading={isRegistering}
              disabled={isRegistering}
            />
          </Card>
        )}

        <Card style={styles.infoCard}>
          <Text style={styles.infoTitle}>💡 Dica</Text>
          <Text style={styles.infoText}>
            Você pode buscar alimentos digitando o nome. Se não encontrar, pode criar um alimento personalizado!
          </Text>
        </Card>
      </ScrollView>

      <Modal
        visible={showCreateModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCreateModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <SafeAreaView style={styles.modalContainer}>
            <ScrollView contentContainerStyle={styles.modalContent}>
              <Text style={styles.modalTitle}>Criar Alimento Personalizado</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nome do Alimento *</Text>
                <TextInput
                  style={styles.textInput}
                  value={customFoodName}
                  onChangeText={setCustomFoodName}
                  placeholder="Ex: Pão francês"
                  placeholderTextColor={theme.colors.textSecondary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Marca (opcional)</Text>
                <TextInput
                  style={styles.textInput}
                  value={customFoodBrand}
                  onChangeText={setCustomFoodBrand}
                  placeholder="Ex: Padaria do João"
                  placeholderTextColor={theme.colors.textSecondary}
                />
              </View>

              <View style={styles.rowInputs}>
                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Text style={styles.inputLabel}>Tamanho da Porção *</Text>
                  <TextInput
                    style={styles.textInput}
                    value={customFoodServingSize}
                    onChangeText={setCustomFoodServingSize}
                    placeholder="100"
                    keyboardType="numeric"
                    placeholderTextColor={theme.colors.textSecondary}
                  />
                </View>
                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Text style={styles.inputLabel}>Unidade *</Text>
                  <TextInput
                    style={styles.textInput}
                    value={customFoodServingUnit}
                    onChangeText={setCustomFoodServingUnit}
                    placeholder="g ou ml"
                    placeholderTextColor={theme.colors.textSecondary}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Calorias (por 100g/ml) *</Text>
                <TextInput
                  style={styles.textInput}
                  value={customFoodCalories}
                  onChangeText={setCustomFoodCalories}
                  placeholder="Ex: 250"
                  keyboardType="numeric"
                  placeholderTextColor={theme.colors.textSecondary}
                />
                <Text style={styles.inputHint}>Valores nutricionais por 100g ou 100ml</Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Proteína (g por 100g/ml)</Text>
                <TextInput
                  style={styles.textInput}
                  value={customFoodProtein}
                  onChangeText={setCustomFoodProtein}
                  placeholder="Ex: 8.5"
                  keyboardType="numeric"
                  placeholderTextColor={theme.colors.textSecondary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Ferro (mg por 100g/ml)</Text>
                <TextInput
                  style={styles.textInput}
                  value={customFoodIron}
                  onChangeText={setCustomFoodIron}
                  placeholder="Ex: 1.2"
                  keyboardType="numeric"
                  placeholderTextColor={theme.colors.textSecondary}
                />
              </View>

              <Button
                title={isCreatingFood ? 'Criando...' : 'Criar Alimento'}
                onPress={handleSaveCustomFood}
                style={styles.modalButton}
                loading={isCreatingFood}
                disabled={isCreatingFood}
              />
              <Button
                title="Cancelar"
                onPress={() => setShowCreateModal(false)}
                variant="secondary"
                style={styles.modalButton}
              />
            </ScrollView>
          </SafeAreaView>
        </KeyboardAvoidingView>
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
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  searchCard: {
    marginBottom: theme.spacing.md,
  },
  searchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
  },
  favoritesButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.warning + '20',
  },
  favoritesButtonText: {
    ...theme.typography.bodySmall,
    color: theme.colors.warning,
    fontWeight: '600',
  },
  foodCard: {
    marginBottom: theme.spacing.md,
  },
  foodHeader: {
    marginBottom: theme.spacing.md,
  },
  foodName: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  foodBrand: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  nutritionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: theme.spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.colors.divider,
    marginBottom: theme.spacing.md,
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
  mealTypeContainer: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  mealTypeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
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
  mealTypeLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.text,
  },
  mealTypeLabelSelected: {
    color: theme.colors.primaryDark,
    fontWeight: '600',
  },
  registerButton: {
    marginTop: theme.spacing.md,
  },
  infoCard: {
    backgroundColor: theme.colors.secondaryLight,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.secondary,
  },
  infoTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  infoText: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    maxHeight: '90%',
  },
  modalTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: theme.spacing.md,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  halfWidth: {
    flex: 1,
  },
  inputLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    fontWeight: '600',
  },
  textInput: {
    ...theme.typography.body,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.divider,
    color: theme.colors.text,
  },
  inputHint: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    fontStyle: 'italic',
  },
  modalButton: {
    marginTop: theme.spacing.md,
  },
});

