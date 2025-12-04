// Serviço de armazenamento local usando AsyncStorage

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  USER: '@nutrigest:user',
  MEALS: '@nutrigest:meals',
  WEIGHT: '@nutrigest:weight',
  SYMPTOMS: '@nutrigest:symptoms',
  FAVORITES: '@nutrigest:favorites',
  SETTINGS: '@nutrigest:settings',
  CLINIC_CONTACT: '@nutrigest:clinic_contact',
  EXAMS: '@nutrigest:exams',
  CUSTOM_FOODS: '@nutrigest:custom_foods',
};

class StorageError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'StorageError';
  }
}

const safeJsonParse = <T>(data: string | null, defaultValue: T): T => {
  if (!data) return defaultValue;
  try {
    return JSON.parse(data) as T;
  } catch (error) {
    console.error('Erro ao fazer parse do JSON:', error);
    throw new StorageError('Erro ao ler dados do armazenamento', 'PARSE_ERROR');
  }
};

export const storage = {
  // User
  async saveUser(user: any): Promise<void> {
    try {
      if (!user) {
        throw new StorageError('Dados do usuário são obrigatórios', 'VALIDATION_ERROR');
      }
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      if (error instanceof StorageError) throw error;
      throw new StorageError('Erro ao salvar dados do usuário', 'SAVE_ERROR');
    }
  },

  async getUser(): Promise<any | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      return safeJsonParse(data, null);
    } catch (error) {
      if (error instanceof StorageError) throw error;
      throw new StorageError('Erro ao carregar dados do usuário', 'GET_ERROR');
    }
  },

  async removeUser(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    } catch (error) {
      throw new StorageError('Erro ao remover dados do usuário', 'REMOVE_ERROR');
    }
  },

  // Meals
  async saveMeals(meals: any[]): Promise<void> {
    try {
      if (!Array.isArray(meals)) {
        throw new StorageError('Dados de refeições devem ser um array', 'VALIDATION_ERROR');
      }
      await AsyncStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(meals));
    } catch (error) {
      if (error instanceof StorageError) throw error;
      throw new StorageError('Erro ao salvar refeições', 'SAVE_ERROR');
    }
  },

  async getMeals(): Promise<any[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.MEALS);
      return safeJsonParse(data, []);
    } catch (error) {
      if (error instanceof StorageError) throw error;
      throw new StorageError('Erro ao carregar refeições', 'GET_ERROR');
    }
  },

  // Weight
  async saveWeightEntries(entries: any[]): Promise<void> {
    try {
      if (!Array.isArray(entries)) {
        throw new StorageError('Dados de peso devem ser um array', 'VALIDATION_ERROR');
      }
      await AsyncStorage.setItem(STORAGE_KEYS.WEIGHT, JSON.stringify(entries));
    } catch (error) {
      if (error instanceof StorageError) throw error;
      throw new StorageError('Erro ao salvar registros de peso', 'SAVE_ERROR');
    }
  },

  async getWeightEntries(): Promise<any[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.WEIGHT);
      return safeJsonParse(data, []);
    } catch (error) {
      if (error instanceof StorageError) throw error;
      throw new StorageError('Erro ao carregar registros de peso', 'GET_ERROR');
    }
  },

  // Symptoms
  async saveSymptoms(entries: any[]): Promise<void> {
    try {
      if (!Array.isArray(entries)) {
        throw new StorageError('Dados de sintomas devem ser um array', 'VALIDATION_ERROR');
      }
      await AsyncStorage.setItem(STORAGE_KEYS.SYMPTOMS, JSON.stringify(entries));
    } catch (error) {
      if (error instanceof StorageError) throw error;
      throw new StorageError('Erro ao salvar sintomas', 'SAVE_ERROR');
    }
  },

  async getSymptoms(): Promise<any[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SYMPTOMS);
      return safeJsonParse(data, []);
    } catch (error) {
      if (error instanceof StorageError) throw error;
      throw new StorageError('Erro ao carregar sintomas', 'GET_ERROR');
    }
  },

  // Favorites
  async saveFavorites(favorites: any[]): Promise<void> {
    try {
      if (!Array.isArray(favorites)) {
        throw new StorageError('Dados de favoritos devem ser um array', 'VALIDATION_ERROR');
      }
      await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    } catch (error) {
      if (error instanceof StorageError) throw error;
      throw new StorageError('Erro ao salvar favoritos', 'SAVE_ERROR');
    }
  },

  async getFavorites(): Promise<any[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
      return safeJsonParse(data, []);
    } catch (error) {
      if (error instanceof StorageError) throw error;
      throw new StorageError('Erro ao carregar favoritos', 'GET_ERROR');
    }
  },

  // Settings
  async saveSettings(settings: any): Promise<void> {
    try {
      if (!settings) {
        throw new StorageError('Dados de configurações são obrigatórios', 'VALIDATION_ERROR');
      }
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      if (error instanceof StorageError) throw error;
      throw new StorageError('Erro ao salvar configurações', 'SAVE_ERROR');
    }
  },

  async getSettings(): Promise<any | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      return safeJsonParse(data, null);
    } catch (error) {
      if (error instanceof StorageError) throw error;
      throw new StorageError('Erro ao carregar configurações', 'GET_ERROR');
    }
  },

  // Clinic Contact
  async saveClinicContact(contact: { name: string; phone: string } | null): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CLINIC_CONTACT, JSON.stringify(contact));
    } catch (error) {
      if (error instanceof StorageError) throw error;
      throw new StorageError('Erro ao salvar contato da clínica', 'SAVE_ERROR');
    }
  },

  async getClinicContact(): Promise<{ name: string; phone: string } | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.CLINIC_CONTACT);
      return safeJsonParse(data, null);
    } catch (error) {
      if (error instanceof StorageError) throw error;
      throw new StorageError('Erro ao carregar contato da clínica', 'GET_ERROR');
    }
  },

  // Exams
  async saveExams(exams: any[]): Promise<void> {
    try {
      if (!Array.isArray(exams)) {
        throw new StorageError('Dados de exames devem ser um array', 'VALIDATION_ERROR');
      }
      await AsyncStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(exams));
    } catch (error) {
      if (error instanceof StorageError) throw error;
      throw new StorageError('Erro ao salvar exames', 'SAVE_ERROR');
    }
  },

  async getExams(): Promise<any[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.EXAMS);
      return safeJsonParse(data, []);
    } catch (error) {
      if (error instanceof StorageError) throw error;
      throw new StorageError('Erro ao carregar exames', 'GET_ERROR');
    }
  },

  // Custom Foods
  async saveCustomFoods(foods: any[]): Promise<void> {
    try {
      if (!Array.isArray(foods)) {
        throw new StorageError('Dados de alimentos customizados devem ser um array', 'VALIDATION_ERROR');
      }
      await AsyncStorage.setItem(STORAGE_KEYS.CUSTOM_FOODS, JSON.stringify(foods));
    } catch (error) {
      if (error instanceof StorageError) throw error;
      throw new StorageError('Erro ao salvar alimentos customizados', 'SAVE_ERROR');
    }
  },

  async getCustomFoods(): Promise<any[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.CUSTOM_FOODS);
      return safeJsonParse(data, []);
    } catch (error) {
      if (error instanceof StorageError) throw error;
      throw new StorageError('Erro ao carregar alimentos customizados', 'GET_ERROR');
    }
  },

  // Clear all
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    } catch (error) {
      throw new StorageError('Erro ao limpar armazenamento', 'CLEAR_ERROR');
    }
  },
};

