import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { AuthContextType, User } from "../types";
import {
  loginUserDirect,
  registerUserDirect,
  logoutUserDirect,
  getCurrentUserDirect,
} from "../services/authServiceDirect";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar sessão ativa ao carregar
    const checkSession = async () => {
      const { user: currentUser } = await getCurrentUserDirect();
      setUser(currentUser);
      setIsLoading(false);
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    const { user: authenticatedUser, error } = await loginUserDirect(
      email,
      password
    );

    if (error) {
      throw new Error(error);
    }

    if (!authenticatedUser) {
      throw new Error("Erro ao fazer login");
    }

    setUser(authenticatedUser);
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<void> => {
    const { user: newUser, error } = await registerUserDirect(
      name,
      email,
      password
    );

    if (error) {
      throw new Error(error);
    }

    if (!newUser) {
      throw new Error("Erro ao registrar usuário");
    }

    setUser(newUser);
  };

  const logout = async () => {
    await logoutUserDirect();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
