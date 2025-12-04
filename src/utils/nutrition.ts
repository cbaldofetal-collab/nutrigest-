// Utilitários para cálculos nutricionais

import { Food, MealEntry, DailyNutrition, NutritionTarget } from '../types';

/**
 * Calcula os valores nutricionais totais de uma lista de entradas de refeição
 */
export function calculateNutritionFromMeals(meals: MealEntry[]): DailyNutrition {
  const initial: DailyNutrition = {
    date: new Date(),
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    iron: 0,
    folicAcid: 0,
    calcium: 0,
    omega3: 0,
    vitaminD: 0,
    vitaminC: 0,
    sodium: 0,
    water: 0,
  };

  return meals.reduce((acc, meal) => {
    const multiplier = meal.quantity;
    const food = meal.food;

    acc.calories += food.calories * multiplier;
    acc.protein += food.protein * multiplier;
    acc.carbs += food.carbs * multiplier;
    acc.fat += food.fat * multiplier;
    acc.fiber += food.fiber * multiplier;
    acc.sugar = (acc.sugar || 0) + (food.sugar || 0) * multiplier;
    acc.iron += food.iron * multiplier;
    acc.folicAcid += food.folicAcid * multiplier;
    acc.calcium += food.calcium * multiplier;
    acc.omega3 += food.omega3 * multiplier;
    acc.vitaminD += food.vitaminD * multiplier;
    acc.vitaminC += food.vitaminC * multiplier;
    acc.sodium += food.sodium * multiplier;

    return acc;
  }, initial);
}

/**
 * Calcula a porcentagem de progresso de um nutriente em relação à meta
 */
export function calculateProgress(current: number, target: number): number {
  if (target === 0) return 0;
  return Math.min((current / target) * 100, 100);
}

/**
 * Verifica se um nutriente está abaixo do threshold
 */
export function isNutrientLow(
  current: number,
  target: number,
  threshold: number = 0.8
): boolean {
  return current < target * threshold;
}

/**
 * Calcula o IMC
 */
export function calculateBMI(weight: number, height: number): number {
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
}

/**
 * Determina a categoria de IMC
 */
export function getBMICategory(bmi: number): 'underweight' | 'normal' | 'overweight' | 'obese' {
  if (bmi < 18.5) return 'underweight';
  if (bmi < 25) return 'normal';
  if (bmi < 30) return 'overweight';
  return 'obese';
}

/**
 * Calcula o ganho de peso ideal para uma gestante baseado no IMC inicial
 */
export function getIdealWeightGain(
  initialBMI: number,
  gestationalWeek: number
): { min: number; max: number; current: number } {
  const category = getBMICategory(initialBMI);
  const { WEIGHT_GAIN_RECOMMENDATIONS } = require('../constants');

  const recommendation = WEIGHT_GAIN_RECOMMENDATIONS[category];
  const totalWeeks = 40;
  const progress = Math.min(gestationalWeek / totalWeeks, 1);

  return {
    min: recommendation.min * progress,
    max: recommendation.max * progress,
    current: ((recommendation.min + recommendation.max) / 2) * progress,
  };
}

/**
 * Formata um valor nutricional para exibição
 */
export function formatNutrient(value: number, unit: string, decimals: number = 1): string {
  return `${value.toFixed(decimals)} ${unit}`;
}

/**
 * Calcula a média nutricional de um período
 */
export function calculateAverageNutrition(
  dailyNutrition: DailyNutrition[]
): DailyNutrition {
  if (dailyNutrition.length === 0) {
    return {
      date: new Date(),
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      iron: 0,
      folicAcid: 0,
      calcium: 0,
      omega3: 0,
      vitaminD: 0,
      vitaminC: 0,
      sodium: 0,
      water: 0,
    };
  }

  const sum = dailyNutrition.reduce(
    (acc, day) => {
      acc.calories += day.calories;
      acc.protein += day.protein;
      acc.carbs += day.carbs;
      acc.fat += day.fat;
      acc.fiber += day.fiber;
      acc.sugar += day.sugar || 0;
      acc.iron += day.iron;
      acc.folicAcid += day.folicAcid;
      acc.calcium += day.calcium;
      acc.omega3 += day.omega3;
      acc.vitaminD += day.vitaminD;
      acc.vitaminC += day.vitaminC;
      acc.sodium += day.sodium;
      acc.water += day.water;
      return acc;
    },
    {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      iron: 0,
      folicAcid: 0,
      calcium: 0,
      omega3: 0,
      vitaminD: 0,
      vitaminC: 0,
      sodium: 0,
      water: 0,
    }
  );

  const count = dailyNutrition.length;

  return {
    date: new Date(),
    calories: sum.calories / count,
    protein: sum.protein / count,
    carbs: sum.carbs / count,
    fat: sum.fat / count,
    fiber: sum.fiber / count,
    sugar: sum.sugar / count,
    iron: sum.iron / count,
    folicAcid: sum.folicAcid / count,
    calcium: sum.calcium / count,
    omega3: sum.omega3 / count,
    vitaminD: sum.vitaminD / count,
    vitaminC: sum.vitaminC / count,
    sodium: sum.sodium / count,
    water: sum.water / count,
  };
}

