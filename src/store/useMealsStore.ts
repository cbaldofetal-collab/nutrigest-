// Store para gerenciamento de refeições

import { create } from 'zustand';
import { MealEntry, Food, DailyNutrition } from '../types';
import { storage } from '../services/storage';
import { calculateNutritionFromMeals, isSameDate } from '../utils';

interface MealsState {
  meals: MealEntry[];
  isLoading: boolean;
  error: string | null;
  addMeal: (meal: Omit<MealEntry, 'id' | 'createdAt'>) => Promise<void>;
  removeMeal: (mealId: string) => Promise<void>;
  getMealsByDate: (date: Date) => MealEntry[];
  getDailyNutrition: (date: Date) => DailyNutrition;
  loadMeals: () => Promise<void>;
  clearMeals: () => Promise<void>;
  clearError: () => void;
}

// Validações
const validateMeal = (meal: Omit<MealEntry, 'id' | 'createdAt'>): string | null => {
  if (!meal.food || !meal.food.id) {
    return 'Alimento inválido';
  }
  if (!meal.foodId || meal.foodId.trim().length === 0) {
    return 'ID do alimento é obrigatório';
  }
  if (meal.quantity <= 0 || meal.quantity > 100) {
    return 'Quantidade deve estar entre 0 e 100 porções';
  }
  if (!meal.mealType || !['breakfast', 'lunch', 'dinner', 'snack'].includes(meal.mealType)) {
    return 'Tipo de refeição inválido';
  }
  if (!meal.date || !(meal.date instanceof Date) || isNaN(meal.date.getTime())) {
    return 'Data inválida';
  }
  return null;
};

export const useMealsStore = create<MealsState>((set, get) => ({
  meals: [],
  isLoading: false,
  error: null,

  addMeal: async (mealData) => {
    set({ isLoading: true, error: null });
    try {
      const validationError = validateMeal(mealData);
      if (validationError) {
        set({ error: validationError, isLoading: false });
        throw new Error(validationError);
      }

      const newMeal: MealEntry = {
        ...mealData,
        id: `meal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
      };

      const meals = [...get().meals, newMeal];
      await storage.saveMeals(meals);
      set({ meals, isLoading: false, error: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao adicionar refeição';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  removeMeal: async (mealId: string) => {
    set({ isLoading: true, error: null });
    try {
      if (!mealId || mealId.trim().length === 0) {
        const errorMessage = 'ID da refeição é obrigatório';
        set({ error: errorMessage, isLoading: false });
        throw new Error(errorMessage);
      }

      const meals = get().meals.filter((meal) => meal.id !== mealId);
      
      if (meals.length === get().meals.length) {
        const errorMessage = 'Refeição não encontrada';
        set({ error: errorMessage, isLoading: false });
        throw new Error(errorMessage);
      }

      await storage.saveMeals(meals);
      set({ meals, isLoading: false, error: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao remover refeição';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  getMealsByDate: (date: Date) => {
    return get().meals.filter((meal) => isSameDate(new Date(meal.date), date));
  },

  getDailyNutrition: (date: Date) => {
    const meals = get().getMealsByDate(date);
    return calculateNutritionFromMeals(meals);
  },

  loadMeals: async () => {
    set({ isLoading: true, error: null });
    try {
      const meals = await storage.getMeals();
      // Converter strings de data para objetos Date
      const parsedMeals = meals.map((meal: any) => ({
        ...meal,
        date: new Date(meal.date),
        createdAt: new Date(meal.createdAt),
      }));
      set({ meals: parsedMeals, error: null });
    } catch (error) {
      const errorMessage = 'Erro ao carregar refeições';
      console.error('Erro ao carregar refeições:', error);
      set({ error: errorMessage });
    } finally {
      set({ isLoading: false });
    }
  },

  clearMeals: async () => {
    set({ isLoading: true, error: null });
    try {
      await storage.saveMeals([]);
      set({ meals: [], isLoading: false, error: null });
    } catch (error) {
      const errorMessage = 'Erro ao limpar refeições';
      console.error('Erro ao limpar refeições:', error);
      set({ error: errorMessage, isLoading: false });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));

