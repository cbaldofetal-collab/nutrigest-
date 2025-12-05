// Serviço de autenticação usando Supabase

import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configurações do Supabase (devem ser definidas como variáveis de ambiente)
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Verificar se as credenciais estão configuradas
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    '⚠️ Supabase não configurado! Crie um arquivo .env com EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY'
  );
}

// Criar cliente Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  name: string;
}

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: any;
}

/**
 * Realiza login com email e senha
 */
export async function login(credentials: LoginCredentials): Promise<AuthResult> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      return {
        success: false,
        error: error.message || 'Erro ao fazer login',
      };
    }

    return {
      success: true,
      user: data.user,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido ao fazer login',
    };
  }
}

/**
 * Registra um novo usuário
 */
export async function signUp(credentials: SignUpCredentials): Promise<AuthResult> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: {
          name: credentials.name,
        },
      },
    });

    if (error) {
      return {
        success: false,
        error: error.message || 'Erro ao criar conta',
      };
    }

    return {
      success: true,
      user: data.user,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido ao criar conta',
    };
  }
}

/**
 * Envia email de recuperação de senha
 */
export async function resetPassword(email: string): Promise<AuthResult> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'nutrigest://reset-password', // Deep link para o app
    });

    if (error) {
      return {
        success: false,
        error: error.message || 'Erro ao enviar email de recuperação',
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido ao recuperar senha',
    };
  }
}

/**
 * Atualiza a senha do usuário
 */
export async function updatePassword(newPassword: string): Promise<AuthResult> {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return {
        success: false,
        error: error.message || 'Erro ao atualizar senha',
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido ao atualizar senha',
    };
  }
}

/**
 * Faz logout do usuário
 */
export async function logout(): Promise<void> {
  await supabase.auth.signOut();
}

/**
 * Obtém o usuário atual autenticado
 */
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Verifica se há uma sessão ativa
 */
export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

/**
 * Observa mudanças no estado de autenticação
 */
export function onAuthStateChange(callback: (event: string, session: any) => void) {
  return supabase.auth.onAuthStateChange(callback);
}

