import { supabase } from '../lib/supabase';
import { User } from '../types';

export interface AuthResponse {
  user: User | null;
  error: string | null;
}

/**
 * Realiza login do usuário
 */
export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { user: null, error: error.message };
    }

    if (!data.user) {
      return { user: null, error: 'Falha ao autenticar usuário' };
    }

    // Buscar dados completos do usuário na tabela users
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (userError || !userData) {
      return { user: null, error: 'Erro ao carregar dados do usuário' };
    }

    const user: User = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      avatarUrl: userData.avatar_url,
    };

    return { user, error: null };
  } catch {
    return { user: null, error: 'Erro ao fazer login. Tente novamente.' };
  }
}

/**
 * Registra um novo usuário
 */
export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  try {
    // Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return { user: null, error: authError.message };
    }

    if (!authData.user) {
      return { user: null, error: 'Falha ao criar usuário' };
    }

    // Inserir dados adicionais na tabela users
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([
        {
          id: authData.user.id,
          name,
          email,
          avatar_url: null,
        },
      ])
      .select()
      .single();

    if (userError || !userData) {
      // Se falhar ao inserir, tentar fazer logout
      await supabase.auth.signOut();
      return { user: null, error: 'Erro ao criar perfil do usuário' };
    }

    const user: User = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      avatarUrl: userData.avatar_url,
    };

    return { user, error: null };
  } catch {
    return { user: null, error: 'Erro ao registrar usuário. Tente novamente.' };
  }
}

/**
 * Faz logout do usuário
 */
export async function logoutUser(): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return { error: error.message };
    }

    return { error: null };
  } catch {
    return { error: 'Erro ao fazer logout' };
  }
}

/**
 * Verifica se há uma sessão ativa e retorna o usuário
 */
export async function getCurrentUser(): Promise<AuthResponse> {
  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return { user: null, error: null };
    }

    // Buscar dados completos do usuário
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (userError || !userData) {
      return { user: null, error: 'Erro ao carregar dados do usuário' };
    }

    const user: User = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      avatarUrl: userData.avatar_url,
    };

    return { user, error: null };
  } catch {
    return { user: null, error: 'Erro ao verificar sessão' };
  }
}

/**
 * Observa mudanças na autenticação
 */
export function onAuthStateChange(callback: (user: User | null) => void) {
  const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      const { user } = await getCurrentUser();
      callback(user);
    } else {
      callback(null);
    }
  });

  // Retorna função para cancelar a subscription
  return () => {
    data.subscription.unsubscribe();
  };
}
