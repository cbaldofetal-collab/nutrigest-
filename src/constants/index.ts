// Constantes do NutriGest

import { NutritionTarget } from '../types';

// Metas nutricionais padrão por trimestre (valores aproximados)
export const NUTRITION_TARGETS: Record<number, NutritionTarget> = {
  // Primeiro trimestre (semanas 1-13)
  1: {
    calories: 2200,
    protein: 75,
    carbs: 275,
    fat: 73,
    fiber: 28,
    iron: 27,
    folicAcid: 600,
    calcium: 1000,
    omega3: 200,
    vitaminD: 15,
    vitaminC: 85,
    water: 2500,
  },
  // Segundo trimestre (semanas 14-27)
  2: {
    calories: 2400,
    protein: 85,
    carbs: 300,
    fat: 80,
    fiber: 28,
    iron: 27,
    folicAcid: 600,
    calcium: 1000,
    omega3: 200,
    vitaminD: 15,
    vitaminC: 85,
    water: 2500,
  },
  // Terceiro trimestre (semanas 28-40)
  3: {
    calories: 2600,
    protein: 95,
    carbs: 325,
    fat: 87,
    fiber: 28,
    iron: 27,
    folicAcid: 600,
    calcium: 1000,
    omega3: 200,
    vitaminD: 15,
    vitaminC: 85,
    water: 2500,
  },
};

// Ganho de peso recomendado por IMC inicial
export const WEIGHT_GAIN_RECOMMENDATIONS = {
  underweight: { min: 12.5, max: 18 }, // IMC < 18.5
  normal: { min: 11.5, max: 16 }, // IMC 18.5-24.9
  overweight: { min: 7, max: 11.5 }, // IMC 25-29.9
  obese: { min: 5, max: 9 }, // IMC >= 30
};

// Cores do tema
export const COLORS = {
  primary: '#81C784',
  primaryDark: '#66BB6A',
  primaryLight: '#A5D6A7',
  secondary: '#64B5F6',
  secondaryDark: '#42A5F5',
  secondaryLight: '#90CAF9',
  accent: '#F48FB1',
  background: '#FAFAFA',
  surface: '#FFFFFF',
  text: '#212121',
  textSecondary: '#757575',
  error: '#E57373',
  warning: '#FFB74D',
  success: '#81C784',
  divider: '#E0E0E0',
};

// Tipos de refeição
export const MEAL_TYPES = {
  breakfast: { label: 'Café da Manhã', icon: '🌅' },
  lunch: { label: 'Almoço', icon: '🍽️' },
  dinner: { label: 'Jantar', icon: '🌙' },
  snack: { label: 'Lanche', icon: '🍎' },
};

// Tipos de sintomas
export const SYMPTOM_TYPES = {
  nausea: { label: 'Náusea', icon: '🤢' },
  heartburn: { label: 'Azia', icon: '🔥' },
  cravings: { label: 'Desejos', icon: '🍫' },
  aversions: { label: 'Aversões', icon: '❌' },
  fatigue: { label: 'Cansaço', icon: '😴' },
  other: { label: 'Outro', icon: '📝' },
};

// Níveis de intensidade
export const INTENSITY_LEVELS = {
  1: { label: 'Muito Leve', color: COLORS.success },
  2: { label: 'Leve', color: COLORS.primary },
  3: { label: 'Moderado', color: COLORS.warning },
  4: { label: 'Forte', color: COLORS.error },
  5: { label: 'Muito Forte', color: '#C62828' },
};

// Nutrientes críticos para gestantes
export const CRITICAL_NUTRIENTS = [
  { key: 'iron', label: 'Ferro', unit: 'mg', threshold: 0.8 },
  { key: 'folicAcid', label: 'Ácido Fólico', unit: 'mcg', threshold: 0.8 },
  { key: 'calcium', label: 'Cálcio', unit: 'mg', threshold: 0.8 },
  { key: 'omega3', label: 'Ômega-3', unit: 'mg', threshold: 0.7 },
  { key: 'vitaminD', label: 'Vitamina D', unit: 'mcg', threshold: 0.8 },
];

// Configurações de alertas
export const ALERT_CONFIG = {
  checkInterval: 60 * 60 * 1000, // 1 hora em milissegundos
  reminderTime: '09:00', // Horário padrão para lembretes
};

// Configurações de sincronização
export const SYNC_CONFIG = {
  interval: 5 * 60 * 1000, // 5 minutos
  retryAttempts: 3,
  retryDelay: 1000, // 1 segundo
};

