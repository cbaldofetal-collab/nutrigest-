// Serviço para controle de onboarding

import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_KEY = '@nutrigest:onboarding_completed';

/**
 * Verifica se o onboarding já foi completado
 */
export async function isOnboardingCompleted(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(ONBOARDING_KEY);
    return value === 'true';
  } catch (error) {
    console.error('Erro ao verificar onboarding:', error);
    return false;
  }
}

/**
 * Marca o onboarding como completado
 */
export async function setOnboardingCompleted(): Promise<void> {
  try {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
  } catch (error) {
    console.error('Erro ao salvar onboarding:', error);
  }
}

/**
 * Reseta o onboarding (útil para testes)
 */
export async function resetOnboarding(): Promise<void> {
  try {
    await AsyncStorage.removeItem(ONBOARDING_KEY);
  } catch (error) {
    console.error('Erro ao resetar onboarding:', error);
  }
}

