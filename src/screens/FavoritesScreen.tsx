// Tela de favoritos

import React, { useEffect, useState } from 'react';
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
import { Card, Button, FavoriteButton } from '../components';
import { useFavoritesStore, useMealsStore } from '../store';
import { FavoriteMeal, MealType } from '../types';
import { MEAL_TYPES } from '../constants';
import { getFoodById } from '../services/foodDatabase';

export function FavoritesScreen() {
  const navigation = useNavigation();
  const [showAddModal, setShowAddModal] = useState(false);
  const [favoriteName, setFavoriteName] = useState('');
  const [selectedMealType, setSelectedMealType] = useState<MealType>('breakfast');

  const favorites = useFavoritesStore((state) => state.favorites);
  const loadFavorites = useFavoritesStore((state) => state.loadFavorites);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);
  const addMeal = useMealsStore((state) => state.addMeal);

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleUseFavorite = async (favorite: FavoriteMeal) => {
    try {
      // Buscar os alimentos do favorito
      const mealPromises = favorite.foods.map(async (foodItem) => {
        const food = await getFoodById(foodItem.foodId);
        if (!food) return null;
        return {
          userId: 'current_user',
          foodId: food.id,
          food,
          quantity: foodItem.quantity,
          mealType: favorite.mealType,
          date: new Date(),
        };
      });

      const meals = (await Promise.all(mealPromises)).filter(Boolean) as any[];

      // Registrar todas as refeições do favorito
      for (const meal of meals) {
        await addMeal(meal);
      }

      Alert.alert('Sucesso', `${favorite.name} registrado com sucesso!`);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível registrar a refeição favorita');
      console.error(error);
    }
  };

  const handleRemoveFavorite = (favorite: FavoriteMeal) => {
    Alert.alert(
      'Remover Favorito',
      `Deseja remover ${favorite.name} dos favoritos?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            await removeFavorite(favorite.id);
            Alert.alert('Sucesso', 'Favorito removido');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Refeições Favoritas</Text>
          <Text style={styles.subtitle}>
            Use suas refeições favoritas para registro rápido
          </Text>
        </View>

        {favorites.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>Nenhuma refeição favorita ainda</Text>
            <Text style={styles.emptySubtext}>
              Salve refeições frequentes para registro rápido
            </Text>
          </Card>
        ) : (
          favorites.map((favorite) => {
            const mealTypeInfo = MEAL_TYPES[favorite.mealType];
            const totalFoods = favorite.foods.length;

            return (
              <Card key={favorite.id} style={styles.favoriteCard}>
                <View style={styles.favoriteHeader}>
                  <View style={styles.favoriteInfo}>
                    <Text style={styles.favoriteName}>{favorite.name}</Text>
                    <View style={styles.favoriteMeta}>
                      <Text style={styles.favoriteEmoji}>{mealTypeInfo.icon}</Text>
                      <Text style={styles.favoriteType}>{mealTypeInfo.label}</Text>
                      <Text style={styles.favoriteCount}>
                        • {totalFoods} {totalFoods === 1 ? 'alimento' : 'alimentos'}
                      </Text>
                    </View>
                  </View>
                  <FavoriteButton
                    isFavorite={true}
                    onPress={() => handleRemoveFavorite(favorite)}
                    size="small"
                  />
                </View>

                <View style={styles.favoriteActions}>
                  <Button
                    title="Usar Agora"
                    onPress={() => handleUseFavorite(favorite)}
                    style={styles.useButton}
                  />
                </View>
              </Card>
            );
          })
        )}

        <Button
          title="+ Nova Refeição Favorita"
          onPress={() => setShowAddModal(true)}
          variant="outline"
          style={styles.addButton}
        />
      </ScrollView>

      {/* Modal de adicionar favorito - simplificado por enquanto */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nova Refeição Favorita</Text>
            <Text style={styles.modalText}>
              Para criar uma refeição favorita, primeiro registre os alimentos
              normalmente e depois use a opção "Salvar como favorito" na tela de
              histórico.
            </Text>
            <Button
              title="Entendi"
              onPress={() => setShowAddModal(false)}
              style={styles.modalButton}
            />
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
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  emptyCard: {
    alignItems: 'center',
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.md,
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
  favoriteCard: {
    marginBottom: theme.spacing.md,
  },
  favoriteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  favoriteInfo: {
    flex: 1,
  },
  favoriteName: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  favoriteMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  favoriteEmoji: {
    fontSize: 16,
    marginRight: theme.spacing.xs,
  },
  favoriteType: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginRight: theme.spacing.xs,
  },
  favoriteCount: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  favoriteActions: {
    marginTop: theme.spacing.sm,
  },
  useButton: {
    marginTop: theme.spacing.xs,
  },
  addButton: {
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
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  modalText: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  modalButton: {
    marginTop: theme.spacing.md,
  },
});

