// Store para gerenciamento do estado do usuário

import { create } from 'zustand';
import { User } from '../types';
import { storage } from '../services/storage';

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User) => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  loadUser: () => Promise<void>;
  clearUser: () => Promise<void>;
  clearError: () => void;
}

// Validações
const validateUser = (user: User): string | null => {
  if (!user.name || user.name.trim().length < 2) {
    return 'O nome deve ter pelo menos 2 caracteres';
  }
  if (!user.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
    return 'Email inválido';
  }
  if (user.gestationalWeek < 1 || user.gestationalWeek > 42) {
    return 'Semana gestacional deve estar entre 1 e 42';
  }
  if (user.initialWeight <= 0 || user.initialWeight > 200) {
    return 'Peso inicial deve estar entre 0 e 200 kg';
  }
  if (user.height <= 0 || user.height > 250) {
    return 'Altura deve estar entre 0 e 250 cm';
  }
  if (!user.dueDate || user.dueDate <= new Date()) {
    return 'Data prevista de parto deve ser uma data futura';
  }
  return null;
};

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,

  setUser: async (user: User) => {
    set({ isLoading: true, error: null });
    try {
      const validationError = validateUser(user);
      if (validationError) {
        set({ error: validationError, isLoading: false });
        throw new Error(validationError);
      }

      await storage.saveUser(user);
      set({ user, isLoading: false, error: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao salvar usuário';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  updateUser: async (updates: Partial<User>) => {
    set({ isLoading: true, error: null });
    try {
      const currentUser = get().user;
      if (!currentUser) {
        const errorMessage = 'Nenhum usuário encontrado';
        set({ error: errorMessage, isLoading: false });
        throw new Error(errorMessage);
      }

      const updatedUser = { ...currentUser, ...updates };
      const validationError = validateUser(updatedUser);
      if (validationError) {
        set({ error: validationError, isLoading: false });
        throw new Error(validationError);
      }

      await storage.saveUser(updatedUser);
      set({ user: updatedUser, isLoading: false, error: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar usuário';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  loadUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const user = await storage.getUser();
      if (user) {
        // Converter strings de data para objetos Date
        if (user.dueDate) user.dueDate = new Date(user.dueDate);
        if (user.createdAt) user.createdAt = new Date(user.createdAt);
        set({ user, error: null });
      }
    } catch (error) {
      const errorMessage = 'Erro ao carregar dados do usuário';
      console.error('Erro ao carregar usuário:', error);
      set({ error: errorMessage });
    } finally {
      set({ isLoading: false });
    }
  },

  clearUser: async () => {
    set({ isLoading: true, error: null });
    try {
      await storage.removeUser();
      set({ user: null, isLoading: false, error: null });
    } catch (error) {
      const errorMessage = 'Erro ao remover usuário';
      console.error('Erro ao remover usuário:', error);
      set({ error: errorMessage, isLoading: false });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));

