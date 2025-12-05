// Tipos principais do NutriGest

export interface User {
  id: string;
  name: string;
  email: string;
  gestationalWeek: number;
  initialWeight: number;
  currentWeight: number;
  height: number;
  initialBMI: number;
  dueDate: Date;
  createdAt: Date;
}

export interface Food {
  id: string;
  name: string;
  brand?: string;
  barcode?: string;
  servingSize: number;
  servingUnit: string;
  calories: number;
  protein: number; // gramas
  carbs: number; // gramas
  fat: number; // gramas
  fiber: number; // gramas
  sugar?: number; // gramas (açúcar)
  iron: number; // mg
  folicAcid: number; // mcg
  calcium: number; // mg
  omega3: number; // mg
  vitaminD: number; // mcg
  vitaminC: number; // mg
  sodium: number; // mg
}

export interface MealEntry {
  id: string;
  userId: string;
  foodId: string;
  food: Food;
  quantity: number; // quantidade em unidades de servingSize
  mealType: MealType;
  date: Date;
  createdAt: Date;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface DailyNutrition {
  date: Date;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar?: number; // gramas (açúcar)
  iron: number;
  folicAcid: number;
  calcium: number;
  omega3: number;
  vitaminD: number;
  vitaminC: number;
  sodium: number;
  water: number; // ml
}

export interface NutritionTarget {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  iron: number; // mg
  folicAcid: number; // mcg
  calcium: number; // mg
  omega3: number; // mg
  vitaminD: number; // mcg
  vitaminC: number; // mg
  water: number; // ml
}

export interface Alert {
  id: string;
  userId: string;
  type: AlertType;
  nutrient: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  date: Date;
  read: boolean;
}

export type AlertType = 'nutrient_low' | 'weight_gain' | 'hydration' | 'reminder';

export interface WeightEntry {
  id: string;
  userId: string;
  weight: number;
  date: Date;
  notes?: string;
}

export interface SymptomEntry {
  id: string;
  userId: string;
  type: SymptomType;
  intensity: 1 | 2 | 3 | 4 | 5;
  date: Date;
  notes?: string;
}

export type SymptomType = 'nausea' | 'heartburn' | 'cravings' | 'aversions' | 'fatigue' | 'other';

export interface FavoriteMeal {
  id: string;
  userId: string;
  name: string;
  foods: Array<{
    foodId: string;
    quantity: number;
  }>;
  mealType: MealType;
}

export interface Report {
  id: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  type: ReportType;
  data: ReportData;
  createdAt: Date;
}

export type ReportType = 'weekly' | 'monthly' | 'trimester' | 'custom';

export interface ReportData {
  averageNutrition: DailyNutrition;
  weightEvolution: WeightEntry[];
  symptoms: SymptomEntry[];
  patterns: string[];
  recommendations: string[];
}

export interface ExamEntry {
  id: string;
  userId: string;
  name: string;
  type: ExamType;
  date: Date;
  doctor?: string;
  clinic?: string;
  notes?: string;
  fileUri?: string; // URI da imagem/PDF do exame
  results?: string; // Texto dos resultados
  createdAt: Date;
}

export type ExamType = 
  | 'blood' // Exame de sangue
  | 'urine' // Exame de urina
  | 'ultrasound' // Ultrassom
  | 'other'; // Outros

