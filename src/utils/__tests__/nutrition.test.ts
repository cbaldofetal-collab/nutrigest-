// Testes para utilitários de nutrição

import {
  calculateNutritionFromMeals,
  calculateProgress,
  isNutrientLow,
  calculateBMI,
  getBMICategory,
  formatNutrient,
  calculateAverageNutrition,
} from '../nutrition';
import { MealEntry, Food, DailyNutrition } from '../../types';

describe('nutrition utils', () => {
  const mockFood: Food = {
    id: '1',
    name: 'Arroz branco cozido',
    servingSize: 100,
    servingUnit: 'g',
    calories: 130,
    protein: 2.7,
    carbs: 28,
    fat: 0.3,
    fiber: 0.4,
    iron: 0.8,
    folicAcid: 3,
    calcium: 10,
    omega3: 0,
    vitaminD: 0,
    vitaminC: 0,
    sodium: 1,
  };

  const mockMeal: MealEntry = {
    id: 'meal1',
    userId: 'user1',
    foodId: '1',
    food: mockFood,
    quantity: 1,
    mealType: 'lunch',
    date: new Date(),
    createdAt: new Date(),
  };

  describe('calculateNutritionFromMeals', () => {
    it('deve calcular corretamente a nutrição de uma refeição', () => {
      const result = calculateNutritionFromMeals([mockMeal]);

      expect(result.calories).toBe(130);
      expect(result.protein).toBe(2.7);
      expect(result.carbs).toBe(28);
      expect(result.fat).toBe(0.3);
      expect(result.iron).toBe(0.8);
    });

    it('deve calcular corretamente múltiplas refeições', () => {
      const meal2: MealEntry = {
        ...mockMeal,
        id: 'meal2',
        quantity: 2,
      };

      const result = calculateNutritionFromMeals([mockMeal, meal2]);

      expect(result.calories).toBe(390); // 130 + (130 * 2)
      expect(result.protein).toBe(8.1); // 2.7 + (2.7 * 2)
    });

    it('deve retornar valores zerados para lista vazia', () => {
      const result = calculateNutritionFromMeals([]);

      expect(result.calories).toBe(0);
      expect(result.protein).toBe(0);
      expect(result.carbs).toBe(0);
    });
  });

  describe('calculateProgress', () => {
    it('deve calcular progresso corretamente', () => {
      expect(calculateProgress(50, 100)).toBe(50);
      expect(calculateProgress(100, 100)).toBe(100);
      expect(calculateProgress(150, 100)).toBe(100); // Não excede 100%
    });

    it('deve retornar 0 quando target é 0', () => {
      expect(calculateProgress(50, 0)).toBe(0);
    });
  });

  describe('isNutrientLow', () => {
    it('deve identificar nutriente abaixo do threshold', () => {
      expect(isNutrientLow(70, 100, 0.8)).toBe(true); // 70 < 80
      expect(isNutrientLow(80, 100, 0.8)).toBe(false); // 80 = 80
      expect(isNutrientLow(90, 100, 0.8)).toBe(false); // 90 > 80
    });

    it('deve usar threshold padrão de 0.8', () => {
      expect(isNutrientLow(70, 100)).toBe(true);
      expect(isNutrientLow(80, 100)).toBe(false);
    });
  });

  describe('calculateBMI', () => {
    it('deve calcular IMC corretamente', () => {
      // Peso: 70kg, Altura: 170cm
      const bmi = calculateBMI(70, 170);
      expect(bmi).toBeCloseTo(24.22, 2);
    });

    it('deve calcular IMC para diferentes valores', () => {
      const bmi1 = calculateBMI(60, 160);
      expect(bmi1).toBeCloseTo(23.44, 2);

      const bmi2 = calculateBMI(80, 180);
      expect(bmi2).toBeCloseTo(24.69, 2);
    });
  });

  describe('getBMICategory', () => {
    it('deve categorizar IMC corretamente', () => {
      expect(getBMICategory(17)).toBe('underweight');
      expect(getBMICategory(20)).toBe('normal');
      expect(getBMICategory(26)).toBe('overweight');
      expect(getBMICategory(32)).toBe('obese');
    });
  });

  describe('formatNutrient', () => {
    it('deve formatar nutriente corretamente', () => {
      expect(formatNutrient(25.5, 'g')).toBe('25.5 g');
      expect(formatNutrient(100, 'mg', 0)).toBe('100 mg');
      expect(formatNutrient(12.345, 'g', 2)).toBe('12.35 g');
    });
  });

  describe('calculateAverageNutrition', () => {
    it('deve calcular média corretamente', () => {
      const day1: DailyNutrition = {
        date: new Date(),
        calories: 2000,
        protein: 100,
        carbs: 200,
        fat: 50,
        fiber: 25,
        iron: 15,
        folicAcid: 400,
        calcium: 1000,
        omega3: 200,
        vitaminD: 10,
        vitaminC: 80,
        sodium: 2000,
        water: 2000,
      };

      const day2: DailyNutrition = {
        ...day1,
        calories: 1800,
        protein: 80,
      };

      const result = calculateAverageNutrition([day1, day2]);

      expect(result.calories).toBe(1900); // (2000 + 1800) / 2
      expect(result.protein).toBe(90); // (100 + 80) / 2
    });

    it('deve retornar valores zerados para lista vazia', () => {
      const result = calculateAverageNutrition([]);

      expect(result.calories).toBe(0);
      expect(result.protein).toBe(0);
    });
  });
});

