// Serviço de receitas adaptadas para gestantes

import { Recipe, SymptomType, Food } from '../types';
import { searchFoods } from './foodDatabase';

// Receitas mock adaptadas para gestantes
const MOCK_RECIPES: Recipe[] = [
  {
    id: '1',
    name: 'Smoothie de Banana e Espinafre',
    description: 'Rico em ácido fólico e ferro, ideal para o primeiro trimestre',
    prepTime: 5,
    cookTime: 0,
    servings: 1,
    ingredients: [
      { foodId: '7', quantity: 1, unit: 'unidade' }, // Banana
      { foodId: '4', quantity: 50, unit: 'g' }, // Espinafre
      { foodId: '10', quantity: 150, unit: 'ml' }, // Iogurte
    ],
    instructions: [
      'Lave bem o espinafre',
      'Descasque a banana',
      'Coloque todos os ingredientes no liquidificador',
      'Bata até ficar homogêneo',
      'Sirva imediatamente',
    ],
    tags: ['rápido', 'café da manhã', 'rico em ferro', 'ácido fólico'],
    suitableForSymptoms: ['nausea'],
    nutrition: {
      calories: 180,
      protein: 8,
      carbs: 35,
      fat: 2,
      fiber: 4,
      iron: 2.5,
      folicAcid: 85,
      calcium: 150,
      vitaminC: 25,
    },
  },
  {
    id: '2',
    name: 'Salmão Grelhado com Brócolis',
    description: 'Excelente fonte de ômega-3 e vitamina D para o desenvolvimento do bebê',
    prepTime: 10,
    cookTime: 20,
    servings: 2,
    ingredients: [
      { foodId: '5', quantity: 200, unit: 'g' }, // Salmão
      { foodId: '12', quantity: 200, unit: 'g' }, // Brócolis
      { foodId: '29', quantity: 100, unit: 'g' }, // Tomate
    ],
    instructions: [
      'Tempere o salmão com sal, limão e ervas',
      'Grelhe o salmão por 8-10 minutos de cada lado',
      'Cozinhe o brócolis no vapor por 5 minutos',
      'Corte os tomates em rodelas',
      'Sirva o salmão com os vegetais',
    ],
    tags: ['jantar', 'rico em ômega-3', 'proteína', 'vitamina D'],
    suitableForSymptoms: [],
    nutrition: {
      calories: 450,
      protein: 35,
      carbs: 12,
      fat: 28,
      iron: 2.5,
      folicAcid: 85,
      calcium: 120,
      omega3: 4500,
      vitaminD: 24,
      vitaminC: 140,
    },
  },
  {
    id: '3',
    name: 'Aveia com Frutas e Castanhas',
    description: 'Café da manhã nutritivo rico em fibras e energia',
    prepTime: 5,
    cookTime: 5,
    servings: 1,
    ingredients: [
      { foodId: '9', quantity: 40, unit: 'g' }, // Aveia
      { foodId: '6', quantity: 200, unit: 'ml' }, // Leite
      { foodId: '17', quantity: 100, unit: 'g' }, // Mamão
      { foodId: '18', quantity: 10, unit: 'unidades' }, // Castanha do Pará
    ],
    instructions: [
      'Aqueça o leite em uma panela',
      'Adicione a aveia e cozinhe por 3-5 minutos mexendo',
      'Corte o mamão em cubos',
      'Sirva a aveia com o mamão e as castanhas por cima',
    ],
    tags: ['café da manhã', 'fibras', 'energia', 'cálcio'],
    suitableForSymptoms: ['nausea'],
    nutrition: {
      calories: 420,
      protein: 15,
      carbs: 55,
      fat: 15,
      fiber: 8,
      iron: 2.5,
      folicAcid: 50,
      calcium: 350,
      vitaminC: 65,
    },
  },
  {
    id: '4',
    name: 'Sopa de Lentilha',
    description: 'Rica em ferro e ácido fólico, ideal para combater anemia',
    prepTime: 15,
    cookTime: 40,
    servings: 4,
    ingredients: [
      { foodId: '13', quantity: 200, unit: 'g' }, // Lentilha
      { foodId: '30', quantity: 100, unit: 'g' }, // Cenoura
      { foodId: '29', quantity: 100, unit: 'g' }, // Tomate
      { foodId: '1', quantity: 50, unit: 'g' }, // Arroz (opcional)
    ],
    instructions: [
      'Lave e deixe a lentilha de molho por 30 minutos',
      'Corte os vegetais em cubos pequenos',
      'Refogue os vegetais em uma panela',
      'Adicione a lentilha e água suficiente',
      'Cozinhe por 30-40 minutos até a lentilha ficar macia',
      'Tempere a gosto e sirva quente',
    ],
    tags: ['almoço', 'jantar', 'rico em ferro', 'proteína vegetal'],
    suitableForSymptoms: ['nausea', 'heartburn'],
    nutrition: {
      calories: 280,
      protein: 18,
      carbs: 45,
      fat: 2,
      fiber: 16,
      iron: 6.5,
      folicAcid: 360,
      calcium: 50,
      vitaminC: 8,
    },
  },
  {
    id: '5',
    name: 'Omelete com Espinafre e Queijo',
    description: 'Rica em proteína, ferro e cálcio - perfeita para qualquer refeição',
    prepTime: 5,
    cookTime: 10,
    servings: 1,
    ingredients: [
      { foodId: '8', quantity: 2, unit: 'unidades' }, // Ovos
      { foodId: '4', quantity: 50, unit: 'g' }, // Espinafre
      { foodId: '11', quantity: 30, unit: 'g' }, // Queijo minas
    ],
    instructions: [
      'Bata os ovos em uma tigela',
      'Refogue o espinafre rapidamente',
      'Adicione os ovos batidos à frigideira',
      'Quando começar a firmar, adicione o queijo',
      'Dobre a omelete e sirva',
    ],
    tags: ['café da manhã', 'almoço', 'jantar', 'proteína', 'ferro', 'cálcio'],
    suitableForSymptoms: ['nausea'],
    nutrition: {
      calories: 280,
      protein: 20,
      carbs: 4,
      fat: 20,
      iron: 3.5,
      folicAcid: 90,
      calcium: 250,
      vitaminD: 2.2,
      vitaminC: 4,
    },
  },
  {
    id: '6',
    name: 'Abacate com Ovos Cozidos',
    description: 'Lanche nutritivo rico em gorduras boas e proteína',
    prepTime: 5,
    cookTime: 10,
    servings: 1,
    ingredients: [
      { foodId: '14', quantity: 100, unit: 'g' }, // Abacate
      { foodId: '8', quantity: 2, unit: 'unidades' }, // Ovos
    ],
    instructions: [
      'Cozinhe os ovos por 8-10 minutos',
      'Corte o abacate ao meio',
      'Retire o caroço e faça pequenos cortes na polpa',
      'Descasque os ovos e corte em rodelas',
      'Coloque os ovos sobre o abacate',
      'Tempere com sal e pimenta a gosto',
    ],
    tags: ['lanche', 'snack', 'gorduras boas', 'proteína'],
    suitableForSymptoms: ['nausea', 'cravings'],
    nutrition: {
      calories: 350,
      protein: 14,
      carbs: 10,
      fat: 28,
      fiber: 7,
      iron: 2.5,
      folicAcid: 125,
      calcium: 50,
      vitaminC: 10,
    },
  },
  {
    id: '7',
    name: 'Batata Doce Assada com Frango',
    description: 'Refeição completa rica em carboidratos complexos e proteína',
    prepTime: 10,
    cookTime: 45,
    servings: 2,
    ingredients: [
      { foodId: '15', quantity: 300, unit: 'g' }, // Batata doce
      { foodId: '3', quantity: 200, unit: 'g' }, // Frango
      { foodId: '19', quantity: 100, unit: 'g' }, // Couve
    ],
    instructions: [
      'Pré-aqueça o forno a 200°C',
      'Lave e fure a batata doce com um garfo',
      'Asse a batata por 40 minutos',
      'Grelhe o frango temperado',
      'Refogue a couve rapidamente',
      'Sirva tudo junto',
    ],
    tags: ['almoço', 'jantar', 'completo', 'energia'],
    suitableForSymptoms: [],
    nutrition: {
      calories: 520,
      protein: 45,
      carbs: 65,
      fat: 8,
      fiber: 10,
      iron: 3.5,
      folicAcid: 200,
      calcium: 180,
      vitaminC: 115,
    },
  },
  {
    id: '8',
    name: 'Iogurte com Granola e Frutas',
    description: 'Café da manhã leve e nutritivo',
    prepTime: 3,
    cookTime: 0,
    servings: 1,
    ingredients: [
      { foodId: '10', quantity: 200, unit: 'ml' }, // Iogurte
      { foodId: '25', quantity: 30, unit: 'g' }, // Granola
      { foodId: '23', quantity: 100, unit: 'g' }, // Manga
    ],
    instructions: [
      'Coloque o iogurte em uma tigela',
      'Adicione a granola por cima',
      'Corte a manga em cubos',
      'Coloque a manga sobre a granola',
      'Sirva imediatamente',
    ],
    tags: ['café da manhã', 'rápido', 'cálcio', 'fibras'],
    suitableForSymptoms: ['nausea'],
    nutrition: {
      calories: 320,
      protein: 12,
      carbs: 55,
      fat: 8,
      fiber: 5,
      iron: 2,
      folicAcid: 30,
      calcium: 280,
      vitaminC: 40,
    },
  },
];

/**
 * Busca receitas por nome ou tag
 */
export async function searchRecipes(query: string): Promise<Recipe[]> {
  if (!query.trim()) return MOCK_RECIPES;

  const lowerQuery = query.toLowerCase();
  return MOCK_RECIPES.filter(
    (recipe) =>
      recipe.name.toLowerCase().includes(lowerQuery) ||
      recipe.description.toLowerCase().includes(lowerQuery) ||
      recipe.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Busca receitas por sintoma (receitas adequadas para sintomas específicos)
 */
export async function getRecipesBySymptom(symptom: SymptomType): Promise<Recipe[]> {
  return MOCK_RECIPES.filter((recipe) =>
    recipe.suitableForSymptoms.includes(symptom)
  );
}

/**
 * Busca receitas por tag
 */
export async function getRecipesByTag(tag: string): Promise<Recipe[]> {
  return MOCK_RECIPES.filter((recipe) =>
    recipe.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
  );
}

/**
 * Busca uma receita por ID
 */
export async function getRecipeById(id: string): Promise<Recipe | null> {
  return MOCK_RECIPES.find((recipe) => recipe.id === id) || null;
}

/**
 * Busca todas as receitas
 */
export async function getAllRecipes(): Promise<Recipe[]> {
  return MOCK_RECIPES;
}

/**
 * Converte ingredientes da receita para objetos Food completos
 */
export async function getRecipeIngredientsWithFoods(
  recipe: Recipe
): Promise<Array<{ ingredient: Recipe['ingredients'][0]; food: Food | null }>> {
  const ingredientsWithFoods = await Promise.all(
    recipe.ingredients.map(async (ingredient) => {
      const food = await searchFoods('').then((foods) =>
        foods.find((f) => f.id === ingredient.foodId)
      );
      return { ingredient, food: food || null };
    })
  );
  return ingredientsWithFoods;
}

