// Testes para utilitários de data

import {
  formatDate,
  formatDateTime,
  isSameDate,
  getTrimester,
  getTrimesterLabel,
} from '../date';

describe('date utils', () => {
  describe('formatDate', () => {
    it('deve formatar data no formato padrão', () => {
      const date = new Date('2024-01-15');
      const formatted = formatDate(date);
      expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });

    it('deve formatar data com formato customizado', () => {
      const date = new Date('2024-01-15');
      const formatted = formatDate(date, 'dd-MM-yyyy');
      expect(formatted).toMatch(/\d{2}-\d{2}-\d{4}/);
    });
  });

  describe('formatDateTime', () => {
    it('deve formatar data e hora corretamente', () => {
      const date = new Date('2024-01-15T14:30:00');
      const formatted = formatDateTime(date);
      expect(formatted).toContain('15/01/2024');
      expect(formatted).toContain('às');
    });
  });

  describe('isSameDate', () => {
    it('deve identificar datas do mesmo dia', () => {
      const date1 = new Date('2024-01-15T10:00:00');
      const date2 = new Date('2024-01-15T20:00:00');
      expect(isSameDate(date1, date2)).toBe(true);
    });

    it('deve identificar datas diferentes', () => {
      const date1 = new Date('2024-01-15');
      const date2 = new Date('2024-01-16');
      expect(isSameDate(date1, date2)).toBe(false);
    });
  });

  describe('getTrimester', () => {
    it('deve retornar primeiro trimestre para semanas 1-13', () => {
      expect(getTrimester(1)).toBe(1);
      expect(getTrimester(13)).toBe(1);
    });

    it('deve retornar segundo trimestre para semanas 14-27', () => {
      expect(getTrimester(14)).toBe(2);
      expect(getTrimester(27)).toBe(2);
    });

    it('deve retornar terceiro trimestre para semanas 28-40', () => {
      expect(getTrimester(28)).toBe(3);
      expect(getTrimester(40)).toBe(3);
    });
  });

  describe('getTrimesterLabel', () => {
    it('deve retornar label correto para cada trimestre', () => {
      expect(getTrimesterLabel(5)).toBe('Primeiro Trimestre');
      expect(getTrimesterLabel(20)).toBe('Segundo Trimestre');
      expect(getTrimesterLabel(35)).toBe('Terceiro Trimestre');
    });
  });
});

