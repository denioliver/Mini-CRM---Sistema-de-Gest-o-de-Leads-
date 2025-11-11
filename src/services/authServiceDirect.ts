import { supabase } from '../lib/supabase';
import { User } from '../types';

export interface AuthResponse {
  user: User | null;
  error: string | null;
}

// Função simples para hash de senha (apenas para demo - use bcrypt em produção)
function simpleHash(password: string): string {
  // Em produção, use uma biblioteca como bcrypt
  return btoa(password + 'mini-crm-salt');
}

/**
 * Realiza login do usuário verificando diretamente na tabela users
 */
export async function loginUserDirect(email: string, password: string): Promise<AuthResponse> {
  try {
    const hashedPassword = simpleHash(password);

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('password_hash', hashedPassword)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return { user: null, error: 'Email ou senha incorretos' };
      }
      return { user: null, error: 'Erro ao fazer login' };
    }

    if (!data) {
      return { user: null, error: 'Email ou senha incorretos' };
    }

    const user: User = {
      id: data.id,
      name: data.name,
      email: data.email,
      avatarUrl: data.avatar_url,
    };

    // Salvar sessão no localStorage
    localStorage.setItem('mini-crm-session', JSON.stringify(user));

    return { user, error: null };
  } catch {
    return { user: null, error: 'Erro ao fazer login. Tente novamente.' };
  }
}

/**
 * Registra um novo usuário diretamente na tabela users
 */
export async function registerUserDirect(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  try {
    // Verificar se o email já existe
    const { data: existingUser } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();

    if (existingUser) {
      return { user: null, error: 'Este email já está cadastrado' };
    }

    const hashedPassword = simpleHash(password);

    // Inserir novo usuário
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          name,
          email,
          password_hash: hashedPassword,
          avatar_url: null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Erro ao registrar:', error);
      return { user: null, error: 'Erro ao criar conta. Tente novamente.' };
    }

    if (!data) {
      return { user: null, error: 'Erro ao criar conta' };
    }

    const user: User = {
      id: data.id,
      name: data.name,
      email: data.email,
      avatarUrl: data.avatar_url,
    };

    // Salvar sessão no localStorage
    localStorage.setItem('mini-crm-session', JSON.stringify(user));

    return { user, error: null };
  } catch (err) {
    console.error('Erro ao registrar usuário:', err);
    return { user: null, error: 'Erro ao registrar usuário. Tente novamente.' };
  }
}

/**
 * Faz logout do usuário
 */
export async function logoutUserDirect(): Promise<{ error: string | null }> {
  try {
    localStorage.removeItem('mini-crm-session');
    return { error: null };
  } catch {
    return { error: 'Erro ao fazer logout' };
  }
}

/**
 * Verifica se há uma sessão ativa e retorna o usuário
 */
export async function getCurrentUserDirect(): Promise<AuthResponse> {
  try {
    const session = localStorage.getItem('mini-crm-session');
    
    if (!session) {
      return { user: null, error: null };
    }

    const user = JSON.parse(session) as User;

    // Verificar se o usuário ainda existe no banco
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error || !data) {
      localStorage.removeItem('mini-crm-session');
      return { user: null, error: null };
    }

    return { user, error: null };
  } catch {
    localStorage.removeItem('mini-crm-session');
    return { user: null, error: null };
  }
}
