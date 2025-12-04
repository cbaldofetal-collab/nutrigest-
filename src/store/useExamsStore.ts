// Store para gerenciar exames médicos

import { create } from 'zustand';
import { ExamEntry, ExamType } from '../types';
import { storage } from '../services/storage';
import { isSameDate } from '../utils/date';

interface ExamsState {
  entries: ExamEntry[];
  isLoading: boolean;
  error: string | null;
  addExam: (examData: Omit<ExamEntry, 'id' | 'createdAt'>) => Promise<void>;
  removeExam: (examId: string) => Promise<void>;
  getExamsByDate: (date: Date) => ExamEntry[];
  getExamsByType: (type: ExamType) => ExamEntry[];
  loadExams: () => Promise<void>;
  clearError: () => void;
}

const validateExamEntry = (examData: Omit<ExamEntry, 'id' | 'createdAt'>): string | null => {
  if (!examData.userId || examData.userId.trim().length === 0) {
    return 'ID do usuário é obrigatório';
  }
  if (!examData.name || examData.name.trim().length === 0) {
    return 'Nome do exame é obrigatório';
  }
  if (!examData.type) {
    return 'Tipo do exame é obrigatório';
  }
  if (!examData.date || !(examData.date instanceof Date)) {
    return 'Data do exame é obrigatória';
  }
  return null;
};

export const useExamsStore = create<ExamsState>((set, get) => ({
  entries: [],
  isLoading: false,
  error: null,

  addExam: async (examData) => {
    set({ isLoading: true, error: null });
    try {
      const validationError = validateExamEntry(examData);
      if (validationError) {
        set({ error: validationError, isLoading: false });
        throw new Error(validationError);
      }

      const newEntry: ExamEntry = {
        ...examData,
        id: `exam_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
      };

      const entries = [...get().entries, newEntry];
      await storage.saveExams(entries);
      set({ entries, isLoading: false, error: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao adicionar exame';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  removeExam: async (examId: string) => {
    set({ isLoading: true, error: null });
    try {
      if (!examId || examId.trim().length === 0) {
        const errorMessage = 'ID do exame é obrigatório';
        set({ error: errorMessage, isLoading: false });
        throw new Error(errorMessage);
      }

      const entries = get().entries.filter((entry) => entry.id !== examId);
      
      if (entries.length === get().entries.length) {
        const errorMessage = 'Exame não encontrado';
        set({ error: errorMessage, isLoading: false });
        throw new Error(errorMessage);
      }

      await storage.saveExams(entries);
      set({ entries, isLoading: false, error: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao remover exame';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  getExamsByDate: (date: Date) => {
    return get().entries.filter((entry) => isSameDate(new Date(entry.date), date));
  },

  getExamsByType: (type: ExamType) => {
    return get().entries.filter((entry) => entry.type === type);
  },

  loadExams: async () => {
    set({ isLoading: true, error: null });
    try {
      const exams = await storage.getExams();
      // Converter strings de data para Date objects
      const entries = exams.map((exam) => ({
        ...exam,
        date: new Date(exam.date),
        createdAt: new Date(exam.createdAt),
      }));
      set({ entries, isLoading: false, error: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar exames';
      set({ error: errorMessage, isLoading: false, entries: [] });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));

