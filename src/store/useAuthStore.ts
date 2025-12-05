// Store para gerenciamento de autenticação

import { create } from 'zustand';
import { getSession, getCurrentUser, onAuthStateChange } from '../services/auth';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  checkAuth: () => Promise<void>;
  setAuthenticated: (authenticated: boolean, user?: any) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: true,
  user: null,

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const session = await getSession();
      const user = session ? await getCurrentUser() : null;
      
      set({
        isAuthenticated: !!session,
        user,
        isLoading: false,
      });
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      set({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
    }
  },

  setAuthenticated: (authenticated: boolean, user?: any) => {
    set({
      isAuthenticated: authenticated,
      user: user || null,
    });
  },
}));

