// Store para gerenciamento de sintomas

import { create } from 'zustand';
import { SymptomEntry, SymptomType } from '../types';
import { storage } from '../services/storage';
import { isSameDate } from '../utils';

interface SymptomsState {
  entries: SymptomEntry[];
  isLoading: boolean;
  error: string | null;
  addSymptom: (symptom: Omit<SymptomEntry, 'id'>) => Promise<void>;
  removeSymptom: (entryId: string) => Promise<void>;
  getSymptomsByDate: (date: Date) => SymptomEntry[];
  getSymptomsByType: (type: string) => SymptomEntry[];
  loadSymptoms: () => Promise<void>;
  clearSymptoms: () => Promise<void>;
  clearError: () => void;
}

// Validações
const validateSymptomEntry = (entry: Omit<SymptomEntry, 'id'>): string | null => {
  const validTypes: SymptomType[] = ['nausea', 'heartburn', 'cravings', 'aversions', 'fatigue', 'other'];
  if (!entry.type || !validTypes.includes(entry.type)) {
    return 'Tipo de sintoma inválido';
  }
  if (!entry.intensity || entry.intensity < 1 || entry.intensity > 5) {
    return 'Intensidade deve estar entre 1 e 5';
  }
  if (!entry.date || !(entry.date instanceof Date) || isNaN(entry.date.getTime())) {
    return 'Data inválida';
  }
  if (entry.date > new Date()) {
    return 'Data não pode ser futura';
  }
  return null;
};

export const useSymptomsStore = create<SymptomsState>((set, get) => ({
  entries: [],
  isLoading: false,
  error: null,

  addSymptom: async (symptomData) => {
    set({ isLoading: true, error: null });
    try {
      const validationError = validateSymptomEntry(symptomData);
      if (validationError) {
        set({ error: validationError, isLoading: false });
        throw new Error(validationError);
      }

      const newEntry: SymptomEntry = {
        ...symptomData,
        id: `symptom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      };

      const entries = [...get().entries, newEntry];
      await storage.saveSymptoms(entries);
      set({ entries, isLoading: false, error: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao adicionar sintoma';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  removeSymptom: async (entryId: string) => {
    set({ isLoading: true, error: null });
    try {
      if (!entryId || entryId.trim().length === 0) {
        const errorMessage = 'ID do registro é obrigatório';
        set({ error: errorMessage, isLoading: false });
        throw new Error(errorMessage);
      }

      const entries = get().entries.filter((entry) => entry.id !== entryId);
      
      if (entries.length === get().entries.length) {
        const errorMessage = 'Registro de sintoma não encontrado';
        set({ error: errorMessage, isLoading: false });
        throw new Error(errorMessage);
      }

      await storage.saveSymptoms(entries);
      set({ entries, isLoading: false, error: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao remover sintoma';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  getSymptomsByDate: (date: Date) => {
    return get().entries.filter((entry) => isSameDate(new Date(entry.date), date));
  },

  getSymptomsByType: (type: string) => {
    return get().entries.filter((entry) => entry.type === type);
  },

  loadSymptoms: async () => {
    set({ isLoading: true, error: null });
    try {
      const entries = await storage.getSymptoms();
      // Converter strings de data para objetos Date
      const parsedEntries = entries.map((entry: any) => ({
        ...entry,
        date: new Date(entry.date),
      }));
      set({ entries: parsedEntries, error: null });
    } catch (error) {
      const errorMessage = 'Erro ao carregar sintomas';
      console.error('Erro ao carregar sintomas:', error);
      set({ error: errorMessage });
    } finally {
      set({ isLoading: false });
    }
  },

  clearSymptoms: async () => {
    set({ isLoading: true, error: null });
    try {
      await storage.saveSymptoms([]);
      set({ entries: [], isLoading: false, error: null });
    } catch (error) {
      const errorMessage = 'Erro ao limpar sintomas';
      console.error('Erro ao limpar sintomas:', error);
      set({ error: errorMessage, isLoading: false });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));

