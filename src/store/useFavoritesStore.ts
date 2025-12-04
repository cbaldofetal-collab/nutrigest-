// Store para gerenciamento de refeições favoritas

import { create } from 'zustand';
import { FavoriteMeal, MealType } from '../types';
import { storage } from '../services/storage';

interface FavoritesState {
  favorites: FavoriteMeal[];
  isLoading: boolean;
  error: string | null;
  addFavorite: (favorite: Omit<FavoriteMeal, 'id'>) => Promise<void>;
  removeFavorite: (favoriteId: string) => Promise<void>;
  getFavoriteById: (favoriteId: string) => FavoriteMeal | null;
  loadFavorites: () => Promise<void>;
  clearFavorites: () => Promise<void>;
  clearError: () => void;
}

// Validações
const validateFavorite = (favorite: Omit<FavoriteMeal, 'id'>): string | null => {
  if (!favorite.name || favorite.name.trim().length < 2) {
    return 'Nome do favorito deve ter pelo menos 2 caracteres';
  }
  if (!favorite.foods || favorite.foods.length === 0) {
    return 'Favorito deve conter pelo menos um alimento';
  }
  if (favorite.foods.some((food) => !food.foodId || food.quantity <= 0)) {
    return 'Todos os alimentos devem ter ID válido e quantidade maior que zero';
  }
  if (!favorite.mealType || !['breakfast', 'lunch', 'dinner', 'snack'].includes(favorite.mealType)) {
    return 'Tipo de refeição inválido';
  }
  return null;
};

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  isLoading: false,
  error: null,

  addFavorite: async (favoriteData) => {
    set({ isLoading: true, error: null });
    try {
      const validationError = validateFavorite(favoriteData);
      if (validationError) {
        set({ error: validationError, isLoading: false });
        throw new Error(validationError);
      }

      const newFavorite: FavoriteMeal = {
        ...favoriteData,
        id: `favorite_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      };

      const favorites = [...get().favorites, newFavorite];
      await storage.saveFavorites(favorites);
      set({ favorites, isLoading: false, error: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao adicionar favorito';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  removeFavorite: async (favoriteId: string) => {
    set({ isLoading: true, error: null });
    try {
      if (!favoriteId || favoriteId.trim().length === 0) {
        const errorMessage = 'ID do favorito é obrigatório';
        set({ error: errorMessage, isLoading: false });
        throw new Error(errorMessage);
      }

      const favorites = get().favorites.filter((fav) => fav.id !== favoriteId);
      
      if (favorites.length === get().favorites.length) {
        const errorMessage = 'Favorito não encontrado';
        set({ error: errorMessage, isLoading: false });
        throw new Error(errorMessage);
      }

      await storage.saveFavorites(favorites);
      set({ favorites, isLoading: false, error: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao remover favorito';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  getFavoriteById: (favoriteId: string) => {
    return get().favorites.find((fav) => fav.id === favoriteId) || null;
  },

  loadFavorites: async () => {
    set({ isLoading: true, error: null });
    try {
      const favorites = await storage.getFavorites();
      set({ favorites, error: null });
    } catch (error) {
      const errorMessage = 'Erro ao carregar favoritos';
      console.error('Erro ao carregar favoritos:', error);
      set({ error: errorMessage });
    } finally {
      set({ isLoading: false });
    }
  },

  clearFavorites: async () => {
    set({ isLoading: true, error: null });
    try {
      await storage.saveFavorites([]);
      set({ favorites: [], isLoading: false, error: null });
    } catch (error) {
      const errorMessage = 'Erro ao limpar favoritos';
      console.error('Erro ao limpar favoritos:', error);
      set({ error: errorMessage, isLoading: false });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));

