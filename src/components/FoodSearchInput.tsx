// Componente de busca de alimentos

import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { searchFoods } from '../services/foodDatabase';
import { Food } from '../types';
import { theme } from '../theme';

interface FoodSearchInputProps {
  onSelectFood: (food: Food) => void;
  onCreateCustomFood?: (query: string) => void;
  placeholder?: string;
}

export function FoodSearchInput({ onSelectFood, onCreateCustomFood, placeholder = 'Buscar alimento...' }: FoodSearchInputProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Food[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const search = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const foods = await searchFoods(query);
        setResults(foods);
      } catch (error) {
        console.error('Erro ao buscar alimentos:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(search, 300); // Debounce
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSelectFood = (food: Food) => {
    onSelectFood(food);
    setQuery('');
    setResults([]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={query}
          onChangeText={setQuery}
          placeholderTextColor={theme.colors.textSecondary}
          accessibilityLabel="Campo de busca de alimentos"
          accessibilityHint="Digite o nome do alimento que deseja buscar. Os resultados aparecerão abaixo."
          accessibilityRole="searchbox"
        />
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
          </View>
        )}
      </View>
      
      {results.length > 0 && (
        <View style={styles.resultsContainer}>
          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.resultItem}
                onPress={() => handleSelectFood(item)}
                accessibilityRole="button"
                accessibilityLabel={`${item.name}${item.brand ? `, marca ${item.brand}` : ''}`}
                accessibilityHint="Toque duas vezes para selecionar este alimento"
              >
                <Text style={styles.resultText}>{item.name}</Text>
                {item.brand && (
                  <Text style={styles.resultBrand}>{item.brand}</Text>
                )}
              </TouchableOpacity>
            )}
            style={styles.resultsList}
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
          />
        </View>
      )}
      
      {query.length >= 2 && results.length === 0 && !isLoading && (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>
            Nenhum alimento encontrado para "{query}"
          </Text>
          <Text style={styles.noResultsHint}>
            Não encontramos este alimento na nossa base de dados.
          </Text>
          {onCreateCustomFood && (
            <>
              <Text style={styles.createHint}>
                💡 Você pode criar um alimento personalizado com este nome!
              </Text>
              <TouchableOpacity
                style={styles.createButton}
                onPress={() => onCreateCustomFood(query)}
                accessibilityRole="button"
                accessibilityLabel="Criar alimento personalizado"
                accessibilityHint="Toque para criar um novo alimento com este nome"
              >
                <Text style={styles.createButtonText}>➕ Criar "{query}"</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1,
    marginBottom: theme.spacing.md,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    ...theme.typography.body,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.divider,
    color: theme.colors.text,
    minHeight: 48,
  },
  loadingContainer: {
    position: 'absolute',
    right: theme.spacing.md,
    top: theme.spacing.md + 4,
    zIndex: 10,
  },
  resultsContainer: {
    marginTop: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    maxHeight: Platform.OS === 'web' ? 400 : 300,
    borderWidth: 1,
    borderColor: theme.colors.divider,
    ...theme.shadows.lg,
    zIndex: 1000,
    elevation: 10,
    overflow: 'hidden',
  },
  resultsList: {
    maxHeight: 200,
  },
  resultItem: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  resultText: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  resultBrand: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  noResultsContainer: {
    marginTop: theme.spacing.sm,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.divider,
  },
  noResultsText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  noResultsHint: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  createHint: {
    ...theme.typography.bodySmall,
    color: theme.colors.primary,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
    fontWeight: '500',
  },
  createButton: {
    marginTop: theme.spacing.sm,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  createButtonText: {
    ...theme.typography.body,
    color: theme.colors.surface,
    fontWeight: '600',
  },
});

