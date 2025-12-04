// Store para gerenciamento de peso

import { create } from 'zustand';
import { WeightEntry } from '../types';
import { storage } from '../services/storage';

interface WeightState {
  entries: WeightEntry[];
  isLoading: boolean;
  error: string | null;
  addWeight: (weight: Omit<WeightEntry, 'id'>) => Promise<void>;
  removeWeight: (entryId: string) => Promise<void>;
  getLatestWeight: () => WeightEntry | null;
  getWeightEntriesByDateRange: (startDate: Date, endDate: Date) => WeightEntry[];
  loadWeights: () => Promise<void>;
  clearWeights: () => Promise<void>;
  clearError: () => void;
}

// Validações
const validateWeightEntry = (entry: Omit<WeightEntry, 'id'>): string | null => {
  if (entry.weight <= 0 || entry.weight > 200) {
    return 'Peso deve estar entre 0 e 200 kg';
  }
  if (!entry.date || !(entry.date instanceof Date) || isNaN(entry.date.getTime())) {
    return 'Data inválida';
  }
  if (entry.date > new Date()) {
    return 'Data não pode ser futura';
  }
  return null;
};

export const useWeightStore = create<WeightState>((set, get) => ({
  entries: [],
  isLoading: false,
  error: null,

  addWeight: async (weightData) => {
    set({ isLoading: true, error: null });
    try {
      const validationError = validateWeightEntry(weightData);
      if (validationError) {
        set({ error: validationError, isLoading: false });
        throw new Error(validationError);
      }

      const newEntry: WeightEntry = {
        ...weightData,
        id: `weight_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      };

      const entries = [...get().entries, newEntry].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      await storage.saveWeightEntries(entries);
      set({ entries, isLoading: false, error: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao adicionar peso';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  removeWeight: async (entryId: string) => {
    set({ isLoading: true, error: null });
    try {
      if (!entryId || entryId.trim().length === 0) {
        const errorMessage = 'ID do registro é obrigatório';
        set({ error: errorMessage, isLoading: false });
        throw new Error(errorMessage);
      }

      const entries = get().entries.filter((entry) => entry.id !== entryId);
      
      if (entries.length === get().entries.length) {
        const errorMessage = 'Registro de peso não encontrado';
        set({ error: errorMessage, isLoading: false });
        throw new Error(errorMessage);
      }

      await storage.saveWeightEntries(entries);
      set({ entries, isLoading: false, error: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao remover peso';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  getLatestWeight: () => {
    const entries = get().entries;
    if (entries.length === 0) return null;
    return entries[0]; // Já está ordenado por data
  },

  getWeightEntriesByDateRange: (startDate: Date, endDate: Date) => {
    return get().entries.filter((entry) => {
      const entryDate = new Date(entry.date);
      return entryDate >= startDate && entryDate <= endDate;
    });
  },

  loadWeights: async () => {
    set({ isLoading: true, error: null });
    try {
      const entries = await storage.getWeightEntries();
      // Converter strings de data para objetos Date
      const parsedEntries = entries.map((entry: any) => ({
        ...entry,
        date: new Date(entry.date),
      }));
      // Ordenar por data (mais recente primeiro)
      parsedEntries.sort(
        (a: WeightEntry, b: WeightEntry) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      set({ entries: parsedEntries, error: null });
    } catch (error) {
      const errorMessage = 'Erro ao carregar registros de peso';
      console.error('Erro ao carregar pesos:', error);
      set({ error: errorMessage });
    } finally {
      set({ isLoading: false });
    }
  },

  clearWeights: async () => {
    set({ isLoading: true, error: null });
    try {
      await storage.saveWeightEntries([]);
      set({ entries: [], isLoading: false, error: null });
    } catch (error) {
      const errorMessage = 'Erro ao limpar registros de peso';
      console.error('Erro ao limpar pesos:', error);
      set({ error: errorMessage, isLoading: false });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));

