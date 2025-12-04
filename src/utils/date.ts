// Utilitários para manipulação de datas

import { format, startOfDay, endOfDay, isSameDay, addDays, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Formata uma data para exibição
 */
export function formatDate(date: Date, formatStr: string = 'dd/MM/yyyy'): string {
  return format(date, formatStr, { locale: ptBR });
}

/**
 * Formata uma data e hora para exibição
 */
export function formatDateTime(date: Date): string {
  return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
}

/**
 * Retorna o início do dia
 */
export function getStartOfDay(date: Date): Date {
  return startOfDay(date);
}

/**
 * Retorna o fim do dia
 */
export function getEndOfDay(date: Date): Date {
  return endOfDay(date);
}

/**
 * Verifica se duas datas são do mesmo dia
 */
export function isSameDate(date1: Date, date2: Date): boolean {
  return isSameDay(date1, date2);
}

/**
 * Adiciona dias a uma data
 */
export function addDaysToDate(date: Date, days: number): Date {
  return addDays(date, days);
}

/**
 * Subtrai dias de uma data
 */
export function subtractDaysFromDate(date: Date, days: number): Date {
  return subDays(date, days);
}

/**
 * Calcula a semana gestacional baseada na data de início da gestação
 */
export function calculateGestationalWeek(dueDate: Date): number {
  const today = new Date();
  const weeksSinceStart = Math.floor(
    (today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24 * 7)
  );
  // Assumindo que a gestação dura 40 semanas
  return Math.max(1, Math.min(40, 40 - weeksSinceStart));
}

/**
 * Retorna o trimestre gestacional baseado na semana
 */
export function getTrimester(gestationalWeek: number): 1 | 2 | 3 {
  if (gestationalWeek <= 13) return 1;
  if (gestationalWeek <= 27) return 2;
  return 3;
}

/**
 * Retorna o label do trimestre
 */
export function getTrimesterLabel(gestationalWeek: number): string {
  const trimester = getTrimester(gestationalWeek);
  const labels = {
    1: 'Primeiro Trimestre',
    2: 'Segundo Trimestre',
    3: 'Terceiro Trimestre',
  };
  return labels[trimester];
}

