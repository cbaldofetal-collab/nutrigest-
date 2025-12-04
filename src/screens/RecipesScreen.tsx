// Tela de Biblioteca de Receitas

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme';
import { Card, Button } from '../components';
import {
  getAllRecipes,
  searchRecipes,
  getRecipesBySymptom,
  getRecipesByTag,
} from '../services/recipes';
import { Recipe, SymptomType } from '../types';
import { SYMPTOM_TYPES } from '../constants';

export function RecipesScreen() {
  const navigation = useNavigation();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSymptom, setSelectedSymptom] = useState<SymptomType | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRecipes();
  }, []);

  useEffect(() => {
    filterRecipes();
  }, [searchQuery, selectedSymptom, selectedTag, recipes]);

  const loadRecipes = async () => {
    setIsLoading(true);
    try {
      const allRecipes = await getAllRecipes();
      setRecipes(allRecipes);
      setFilteredRecipes(allRecipes);
    } catch (error) {
      console.error('Erro ao carregar receitas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterRecipes = async () => {
    let result = recipes;

    // Filtrar por sintoma
    if (selectedSymptom) {
      result = await getRecipesBySymptom(selectedSymptom);
    }

    // Filtrar por tag
    if (selectedTag) {
      const tagRecipes = await getRecipesByTag(selectedTag);
      result = result.filter((r) => tagRecipes.some((tr) => tr.id === r.id));
    }

    // Filtrar por busca
    if (searchQuery.trim()) {
      const searchResults = await searchRecipes(searchQuery);
      result = result.filter((r) => searchResults.some((sr) => sr.id === r.id));
    }

    setFilteredRecipes(result);
  };

  const handleRecipePress = (recipe: Recipe) => {
    navigation.navigate('RecipeDetail' as never, { recipe } as never);
  };

  const allTags = Array.from(
    new Set(recipes.flatMap((r) => r.tags))
  ).sort();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>🍳 Biblioteca de Receitas</Text>
          <Text style={styles.subtitle}>
            Receitas saudáveis adaptadas para gestantes
          </Text>
        </View>

        {/* Busca */}
        <Card style={styles.searchCard}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar receitas..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={theme.colors.textSecondary}
            accessibilityLabel="Buscar receitas"
            accessibilityHint="Digite o nome ou ingrediente da receita que deseja buscar"
          />
        </Card>

        {/* Filtros por Sintoma */}
        <Card style={styles.filtersCard}>
          <Text style={styles.filterTitle}>Filtrar por Sintoma</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filtersScroll}
          >
            <TouchableOpacity
              style={[
                styles.filterChip,
                !selectedSymptom && styles.filterChipActive,
              ]}
              onPress={() => setSelectedSymptom(null)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  !selectedSymptom && styles.filterChipTextActive,
                ]}
              >
                Todas
              </Text>
            </TouchableOpacity>
            {(Object.keys(SYMPTOM_TYPES) as SymptomType[]).map((symptom) => {
              const symptomInfo = SYMPTOM_TYPES[symptom];
              const isSelected = selectedSymptom === symptom;
              return (
                <TouchableOpacity
                  key={symptom}
                  style={[
                    styles.filterChip,
                    isSelected && styles.filterChipActive,
                  ]}
                  onPress={() =>
                    setSelectedSymptom(isSelected ? null : symptom)
                  }
                  accessibilityRole="button"
                  accessibilityLabel={`Filtrar por ${symptomInfo.label}`}
                  accessibilityState={{ selected: isSelected }}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      isSelected && styles.filterChipTextActive,
                    ]}
                  >
                    {symptomInfo.icon} {symptomInfo.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Card>

        {/* Filtros por Tag */}
        {allTags.length > 0 && (
          <Card style={styles.filtersCard}>
            <Text style={styles.filterTitle}>Filtrar por Categoria</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filtersScroll}
            >
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  !selectedTag && styles.filterChipActive,
                ]}
                onPress={() => setSelectedTag(null)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    !selectedTag && styles.filterChipTextActive,
                  ]}
                >
                  Todas
                </Text>
              </TouchableOpacity>
              {allTags.map((tag) => {
                const isSelected = selectedTag === tag;
                return (
                  <TouchableOpacity
                    key={tag}
                    style={[
                      styles.filterChip,
                      isSelected && styles.filterChipActive,
                    ]}
                    onPress={() => setSelectedTag(isSelected ? null : tag)}
                    accessibilityRole="button"
                    accessibilityLabel={`Filtrar por ${tag}`}
                    accessibilityState={{ selected: isSelected }}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        isSelected && styles.filterChipTextActive,
                      ]}
                    >
                      {tag}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </Card>
        )}

        {/* Lista de Receitas */}
        <View style={styles.recipesContainer}>
          <Text style={styles.recipesCount}>
            {filteredRecipes.length} receita{filteredRecipes.length !== 1 ? 's' : ''} encontrada{filteredRecipes.length !== 1 ? 's' : ''}
          </Text>
          {filteredRecipes.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Text style={styles.emptyText}>
                Nenhuma receita encontrada. Tente ajustar os filtros.
              </Text>
            </Card>
          ) : (
            filteredRecipes.map((recipe) => (
              <TouchableOpacity
                key={recipe.id}
                onPress={() => handleRecipePress(recipe)}
                accessibilityRole="button"
                accessibilityLabel={recipe.name}
                accessibilityHint="Toque duas vezes para ver detalhes da receita"
              >
                <Card style={styles.recipeCard}>
                  <View style={styles.recipeHeader}>
                    <View style={styles.recipeInfo}>
                      <Text style={styles.recipeName}>{recipe.name}</Text>
                      <Text style={styles.recipeDescription}>
                        {recipe.description}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.recipeMeta}>
                    <View style={styles.metaItem}>
                      <Text style={styles.metaIcon}>⏱️</Text>
                      <Text style={styles.metaText}>
                        {recipe.prepTime + recipe.cookTime} min
                      </Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Text style={styles.metaIcon}>👥</Text>
                      <Text style={styles.metaText}>
                        {recipe.servings} porção{recipe.servings !== 1 ? 'ões' : ''}
                      </Text>
                    </View>
                    {recipe.nutrition && (
                      <View style={styles.metaItem}>
                        <Text style={styles.metaIcon}>🔥</Text>
                        <Text style={styles.metaText}>
                          {recipe.nutrition.calories} kcal
                        </Text>
                      </View>
                    )}
                  </View>
                  {recipe.tags.length > 0 && (
                    <View style={styles.tagsContainer}>
                      {recipe.tags.slice(0, 3).map((tag, index) => (
                        <View key={index} style={styles.tag}>
                          <Text style={styles.tagText}>{tag}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </Card>
              </TouchableOpacity>
            ))
          )}
        </View>
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
  searchCard: {
    marginBottom: theme.spacing.md,
  },
  searchInput: {
    ...theme.typography.body,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.divider,
    color: theme.colors.text,
  },
  filtersCard: {
    marginBottom: theme.spacing.md,
  },
  filterTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  filtersScroll: {
    marginHorizontal: -theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  filterChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.divider,
    marginRight: theme.spacing.sm,
  },
  filterChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterChipText: {
    ...theme.typography.bodySmall,
    color: theme.colors.text,
  },
  filterChipTextActive: {
    color: theme.colors.surface,
    fontWeight: '600',
  },
  recipesContainer: {
    marginTop: theme.spacing.md,
  },
  recipesCount: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  recipeCard: {
    marginBottom: theme.spacing.md,
  },
  recipeHeader: {
    marginBottom: theme.spacing.sm,
  },
  recipeInfo: {
    flex: 1,
  },
  recipeName: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  recipeDescription: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  recipeMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  metaIcon: {
    fontSize: 16,
    marginRight: theme.spacing.xs,
  },
  metaText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: theme.spacing.sm,
  },
  tag: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    marginRight: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  tagText: {
    ...theme.typography.caption,
    color: theme.colors.primaryDark,
  },
  emptyCard: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});

