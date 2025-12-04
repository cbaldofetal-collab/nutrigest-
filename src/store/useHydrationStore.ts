// Store para gerenciamento de hidratação

import { create } from 'zustand';
import { storage } from '../services/storage';
import { isSameDate } from '../utils';

interface HydrationEntry {
  id: string;
  userId: string;
  amount: number; // ml
  date: Date;
  createdAt: Date;
}

interface HydrationState {
  entries: HydrationEntry[];
  isLoading: boolean;
  error: string | null;
  addWater: (amount: number, date?: Date) => Promise<void>;
  getTodayWater: () => number;
  getWaterByDate: (date: Date) => number;
  loadHydration: () => Promise<void>;
  clearHydration: () => Promise<void>;
  clearError: () => void;
}

// Validações
const validateWaterAmount = (amount: number): string | null => {
  if (amount <= 0 || amount > 5000) {
    return 'Quantidade de água deve estar entre 0 e 5000 ml';
  }
  return null;
};

export const useHydrationStore = create<HydrationState>((set, get) => ({
  entries: [],
  isLoading: false,
  error: null,

  addWater: async (amount: number, date?: Date) => {
    set({ isLoading: true, error: null });
    try {
      const validationError = validateWaterAmount(amount);
      if (validationError) {
        set({ error: validationError, isLoading: false });
        throw new Error(validationError);
      }

      const entryDate = date || new Date();
      if (entryDate > new Date()) {
        const errorMessage = 'Data não pode ser futura';
        set({ error: errorMessage, isLoading: false });
        throw new Error(errorMessage);
      }

      const newEntry: HydrationEntry = {
        id: `hydration_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: 'current_user', // Em produção, viria do store do usuário
        amount,
        date: entryDate,
        createdAt: new Date(),
      };

      const entries = [...get().entries, newEntry];
      // Salvar em formato simplificado (apenas para MVP)
      await storage.saveMeals(entries as any); // Reutilizando storage temporariamente
      set({ entries, isLoading: false, error: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao adicionar água';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  getTodayWater: () => {
    const today = new Date();
    return get().entries
      .filter((entry) => isSameDate(new Date(entry.date), today))
      .reduce((sum, entry) => sum + entry.amount, 0);
  },

  getWaterByDate: (date: Date) => {
    return get().entries
      .filter((entry) => isSameDate(new Date(entry.date), date))
      .reduce((sum, entry) => sum + entry.amount, 0);
  },

  loadHydration: async () => {
    set({ isLoading: true, error: null });
    try {
      // Em produção, teria um storage específico
      const data = await storage.getMeals();
      const hydrationEntries = data
        .filter((entry: any) => entry.type === 'hydration')
        .map((entry: any) => ({
          ...entry,
          date: new Date(entry.date),
          createdAt: new Date(entry.createdAt),
        }));
      set({ entries: hydrationEntries, error: null });
    } catch (error) {
      const errorMessage = 'Erro ao carregar dados de hidratação';
      console.error('Erro ao carregar hidratação:', error);
      set({ error: errorMessage });
    } finally {
      set({ isLoading: false });
    }
  },

  clearHydration: async () => {
    set({ isLoading: true, error: null });
    try {
      set({ entries: [], isLoading: false, error: null });
    } catch (error) {
      const errorMessage = 'Erro ao limpar dados de hidratação';
      console.error('Erro ao limpar hidratação:', error);
      set({ error: errorMessage, isLoading: false });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));

