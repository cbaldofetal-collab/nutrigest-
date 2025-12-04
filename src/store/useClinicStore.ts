// Store para gerenciar contato da clínica

import { create } from 'zustand';
import { storage } from '../services/storage';

interface ClinicContact {
  name: string;
  phone: string;
}

interface ClinicState {
  contact: ClinicContact | null;
  isLoading: boolean;
  error: string | null;
  setContact: (contact: ClinicContact | null) => Promise<void>;
  loadContact: () => Promise<void>;
  clearError: () => void;
}

const validateContact = (contact: ClinicContact): string | null => {
  if (!contact.name || contact.name.trim().length === 0) {
    return 'Nome da clínica é obrigatório';
  }
  if (!contact.phone || contact.phone.trim().length === 0) {
    return 'Telefone da clínica é obrigatório';
  }
  // Validação básica de telefone (pelo menos 10 dígitos)
  const cleanPhone = contact.phone.replace(/\D/g, '');
  if (cleanPhone.length < 10) {
    return 'Telefone inválido';
  }
  return null;
};

export const useClinicStore = create<ClinicState>((set, get) => ({
  contact: null,
  isLoading: false,
  error: null,

  setContact: async (contact) => {
    set({ isLoading: true, error: null });
    try {
      if (contact) {
        const validationError = validateContact(contact);
        if (validationError) {
          set({ error: validationError, isLoading: false });
          throw new Error(validationError);
        }
      }

      await storage.saveClinicContact(contact);
      set({ contact, isLoading: false, error: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao salvar contato da clínica';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  loadContact: async () => {
    set({ isLoading: true, error: null });
    try {
      const contact = await storage.getClinicContact();
      set({ contact, isLoading: false, error: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar contato da clínica';
      set({ error: errorMessage, isLoading: false, contact: null });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));

