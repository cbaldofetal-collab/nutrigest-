// Serviço de planejamento de refeições

import { Recipe, MealType, DailyNutrition, NutritionTarget } from '../types';
import { getAllRecipes, getRecipesBySymptom } from './recipes';
import { searchFoods } from './foodDatabase';
import { calculateNutritionFromMeals } from '../utils/nutrition';

export interface MealPlan {
  date: Date;
  breakfast: Recipe | null;
  lunch: Recipe | null;
  dinner: Recipe | null;
  snacks: Recipe[];
  estimatedNutrition: DailyNutrition;
}

export interface WeeklyMealPlan {
  weekStart: Date;
  days: MealPlan[];
}

/**
 * Gera um plano de refeições para uma semana
 */
export async function generateWeeklyMealPlan(
  nutritionTargets: NutritionTarget,
  symptoms: string[] = [],
  preferences: string[] = []
): Promise<WeeklyMealPlan> {
  const allRecipes = await getAllRecipes();
  
  // Filtrar receitas adequadas para sintomas
  let suitableRecipes = allRecipes;
  if (symptoms.length > 0) {
    const symptomRecipes = await Promise.all(
      symptoms.map((symptom) => getRecipesBySymptom(symptom as any))
    );
    suitableRecipes = allRecipes.filter((recipe) =>
      symptomRecipes.some((sr) => sr.some((r) => r.id === recipe.id))
    );
  }

  // Filtrar por preferências (tags)
  if (preferences.length > 0) {
    suitableRecipes = suitableRecipes.filter((recipe) =>
      preferences.some((pref) => recipe.tags.includes(pref))
    );
  }

  // Separar receitas por tipo de refeição
  const breakfastRecipes = suitableRecipes.filter((r) =>
    r.tags.some((tag) => ['café da manhã', 'rápido'].includes(tag))
  );
  const lunchRecipes = suitableRecipes.filter((r) =>
    r.tags.some((tag) => ['almoço', 'completo'].includes(tag))
  );
  const dinnerRecipes = suitableRecipes.filter((r) =>
    r.tags.some((tag) => ['jantar', 'completo'].includes(tag))
  );
  const snackRecipes = suitableRecipes.filter((r) =>
    r.tags.some((tag) => ['lanche', 'snack'].includes(tag))
  );

  // Gerar plano para 7 dias
  const weekStart = new Date();
  weekStart.setHours(0, 0, 0, 0);
  const days: MealPlan[] = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + i);

    // Selecionar receitas aleatórias (em produção, seria baseado em algoritmo)
    const breakfast =
      breakfastRecipes.length > 0
        ? breakfastRecipes[i % breakfastRecipes.length]
        : null;
    const lunch =
      lunchRecipes.length > 0
        ? lunchRecipes[i % lunchRecipes.length]
        : null;
    const dinner =
      dinnerRecipes.length > 0
        ? dinnerRecipes[i % dinnerRecipes.length]
        : null;
    const snacks =
      snackRecipes.length > 0
        ? [snackRecipes[i % snackRecipes.length]]
        : [];

    // Calcular nutrição estimada (simplificado)
    const estimatedNutrition: DailyNutrition = {
      date,
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      iron: 0,
      folicAcid: 0,
      calcium: 0,
      omega3: 0,
      vitaminD: 0,
      vitaminC: 0,
      sodium: 0,
      water: 0,
    };

    [breakfast, lunch, dinner, ...snacks].forEach((recipe) => {
      if (recipe?.nutrition) {
        const nutrition = recipe.nutrition;
        estimatedNutrition.calories += nutrition.calories || 0;
        estimatedNutrition.protein += nutrition.protein || 0;
        estimatedNutrition.carbs += nutrition.carbs || 0;
        estimatedNutrition.fat += nutrition.fat || 0;
        estimatedNutrition.fiber += nutrition.fiber || 0;
        estimatedNutrition.iron += nutrition.iron || 0;
        estimatedNutrition.folicAcid += nutrition.folicAcid || 0;
        estimatedNutrition.calcium += nutrition.calcium || 0;
        estimatedNutrition.omega3 += nutrition.omega3 || 0;
        estimatedNutrition.vitaminD += nutrition.vitaminD || 0;
        estimatedNutrition.vitaminC += nutrition.vitaminC || 0;
        estimatedNutrition.sodium += nutrition.sodium || 0;
      }
    });

    days.push({
      date,
      breakfast,
      lunch,
      dinner,
      snacks,
      estimatedNutrition,
    });
  }

  return {
    weekStart,
    days,
  };
}

/**
 * Gera sugestões de receitas baseadas em déficits nutricionais
 */
export async function suggestRecipesForDeficiency(
  deficiency: keyof NutritionTarget,
  currentValue: number,
  targetValue: number
): Promise<Recipe[]> {
  const allRecipes = await getAllRecipes();
  
  // Filtrar receitas que são ricas no nutriente em déficit
  const recipesWithNutrient = allRecipes.filter((recipe) => {
    if (!recipe.nutrition) return false;
    const nutrientValue = recipe.nutrition[deficiency] as number;
    return nutrientValue && nutrientValue > 0;
  });

  // Ordenar por maior quantidade do nutriente
  recipesWithNutrient.sort((a, b) => {
    const aValue = (a.nutrition?.[deficiency] as number) || 0;
    const bValue = (b.nutrition?.[deficiency] as number) || 0;
    return bValue - aValue;
  });

  return recipesWithNutrient.slice(0, 5); // Top 5
}

/**
 * Calcula o progresso nutricional do plano semanal
 */
export function calculateWeeklyNutritionProgress(
  mealPlan: WeeklyMealPlan,
  targets: NutritionTarget
): {
  average: DailyNutrition;
  progress: Record<string, number>;
} {
  const sum: DailyNutrition = {
    date: new Date(),
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    iron: 0,
    folicAcid: 0,
    calcium: 0,
    omega3: 0,
    vitaminD: 0,
    vitaminC: 0,
    sodium: 0,
    water: 0,
  };

  mealPlan.days.forEach((day) => {
    const nutrition = day.estimatedNutrition;
    sum.calories += nutrition.calories;
    sum.protein += nutrition.protein;
    sum.carbs += nutrition.carbs;
    sum.fat += nutrition.fat;
    sum.fiber += nutrition.fiber;
    sum.iron += nutrition.iron;
    sum.folicAcid += nutrition.folicAcid;
    sum.calcium += nutrition.calcium;
    sum.omega3 += nutrition.omega3;
    sum.vitaminD += nutrition.vitaminD;
    sum.vitaminC += nutrition.vitaminC;
    sum.sodium += nutrition.sodium;
    sum.water += nutrition.water;
  });

  const count = mealPlan.days.length;
  const average: DailyNutrition = {
    date: new Date(),
    calories: sum.calories / count,
    protein: sum.protein / count,
    carbs: sum.carbs / count,
    fat: sum.fat / count,
    fiber: sum.fiber / count,
    iron: sum.iron / count,
    folicAcid: sum.folicAcid / count,
    calcium: sum.calcium / count,
    omega3: sum.omega3 / count,
    vitaminD: sum.vitaminD / count,
    vitaminC: sum.vitaminC / count,
    sodium: sum.sodium / count,
    water: sum.water / count,
  };

  const progress: Record<string, number> = {
    calories: (average.calories / targets.calories) * 100,
    protein: (average.protein / targets.protein) * 100,
    carbs: (average.carbs / targets.carbs) * 100,
    fat: (average.fat / targets.fat) * 100,
    iron: (average.iron / targets.iron) * 100,
    folicAcid: (average.folicAcid / targets.folicAcid) * 100,
    calcium: (average.calcium / targets.calcium) * 100,
    omega3: (average.omega3 / targets.omega3) * 100,
    vitaminD: (average.vitaminD / targets.vitaminD) * 100,
    vitaminC: (average.vitaminC / targets.vitaminC) * 100,
  };

  return { average, progress };
}

