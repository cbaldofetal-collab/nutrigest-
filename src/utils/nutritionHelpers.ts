// Helpers para acesso seguro a nutrientes

import { DailyNutrition, NutritionTarget } from '../types';

/**
 * Obtém o valor de um nutriente de forma segura
 */
export function getNutrientValue(
  nutrition: DailyNutrition | NutritionTarget,
  key: string
): number {
  const value = nutrition[key as keyof typeof nutrition];
  return typeof value === 'number' ? value : 0;
}

