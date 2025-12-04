// Testes para useMealsStore

import { useMealsStore } from '../useMealsStore';
import { MealEntry, Food } from '../../types';
import { storage } from '../../services/storage';

// Mock do storage
jest.mock('../../services/storage', () => ({
  storage: {
    saveMeals: jest.fn().mockResolvedValue(undefined),
    getMeals: jest.fn().mockResolvedValue([]),
  },
}));

describe('useMealsStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Resetar o store
    useMealsStore.setState({
      meals: [],
      isLoading: false,
      error: null,
    });
  });

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

  const mockMealData = {
    userId: 'user1',
    foodId: '1',
    food: mockFood,
    quantity: 1,
    mealType: 'lunch' as const,
    date: new Date('2024-01-15'),
  };

  describe('addMeal', () => {
    it('deve adicionar uma refeição com sucesso', async () => {
      await useMealsStore.getState().addMeal(mockMealData);

      const meals = useMealsStore.getState().meals;
      expect(meals).toHaveLength(1);
      expect(meals[0].foodId).toBe('1');
      expect(meals[0].quantity).toBe(1);
      expect(storage.saveMeals).toHaveBeenCalled();
    });

    it('deve validar dados antes de adicionar', async () => {
      try {
        await useMealsStore.getState().addMeal({
          ...mockMealData,
          quantity: -1, // Quantidade inválida
        });
      } catch (error) {
        // Esperado
      }

      const meals = useMealsStore.getState().meals;
      const error = useMealsStore.getState().error;
      expect(meals).toHaveLength(0);
      expect(error).toBeTruthy();
    });
  });

  describe('removeMeal', () => {
    it('deve remover uma refeição com sucesso', async () => {
      // Adicionar uma refeição primeiro
      await useMealsStore.getState().addMeal(mockMealData);

      const mealId = useMealsStore.getState().meals[0].id;

      await useMealsStore.getState().removeMeal(mealId);

      const meals = useMealsStore.getState().meals;
      expect(meals).toHaveLength(0);
    });
  });

  describe('getMealsByDate', () => {
    it('deve retornar refeições do dia correto', async () => {
      const date1 = new Date('2024-01-15');
      const date2 = new Date('2024-01-16');

      await useMealsStore.getState().addMeal({ ...mockMealData, date: date1 });
      await useMealsStore.getState().addMeal({ ...mockMealData, date: date2 });

      const mealsDate1 = useMealsStore.getState().getMealsByDate(date1);
      expect(mealsDate1).toHaveLength(1);
    });
  });

  describe('loadMeals', () => {
    it('deve carregar refeições do storage', async () => {
      const mockMeals = [
        {
          ...mockMealData,
          id: 'meal1',
          createdAt: new Date('2024-01-15'),
        },
      ];

      (storage.getMeals as jest.Mock).mockResolvedValue(mockMeals);

      await useMealsStore.getState().loadMeals();

      const meals = useMealsStore.getState().meals;
      expect(meals).toHaveLength(1);
      expect(storage.getMeals).toHaveBeenCalledTimes(1);
    });
  });
});

