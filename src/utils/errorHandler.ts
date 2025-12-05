// Utilitário para tratamento de erros

export interface AppError {
  code: string;
  message: string;
  userMessage: string;
}

/**
 * Converte erros em mensagens amigáveis para o usuário
 */
export function handleError(error: unknown): AppError {
  console.error('Erro capturado:', error);

  // Se já for um AppError, retorna direto
  if (error && typeof error === 'object' && 'code' in error && 'userMessage' in error) {
    return error as AppError;
  }

  // Erros de rede
  if (error instanceof Error) {
    if (error.message.includes('Network') || error.message.includes('network')) {
      return {
        code: 'NETWORK_ERROR',
        message: error.message,
        userMessage: 'Erro de conexão. Verifique sua internet e tente novamente.',
      };
    }

    if (error.message.includes('timeout')) {
      return {
        code: 'TIMEOUT_ERROR',
        message: error.message,
        userMessage: 'A operação demorou muito. Tente novamente.',
      };
    }

    if (error.message.includes('permission') || error.message.includes('Permission')) {
      return {
        code: 'PERMISSION_ERROR',
        message: error.message,
        userMessage: 'Permissão necessária. Verifique as configurações do app.',
      };
    }
  }

  // Erro genérico
  return {
    code: 'UNKNOWN_ERROR',
    message: error instanceof Error ? error.message : 'Erro desconhecido',
    userMessage: 'Algo deu errado. Por favor, tente novamente.',
  };
}

/**
 * Mensagens de erro específicas por contexto
 */
export const ERROR_MESSAGES = {
  USER_NOT_FOUND: 'Usuário não encontrado. Por favor, complete o onboarding.',
  MEAL_NOT_FOUND: 'Refeição não encontrada.',
  FOOD_NOT_FOUND: 'Alimento não encontrado.',
  INVALID_DATA: 'Dados inválidos. Verifique as informações e tente novamente.',
  SAVE_FAILED: 'Não foi possível salvar os dados. Tente novamente.',
  LOAD_FAILED: 'Não foi possível carregar os dados. Tente novamente.',
  DELETE_FAILED: 'Não foi possível remover o item. Tente novamente.',
  GENERATE_REPORT_FAILED: 'Não foi possível gerar o relatório. Tente novamente.',
  SHARE_FAILED: 'Não foi possível compartilhar. Verifique se o compartilhamento está disponível.',
};

