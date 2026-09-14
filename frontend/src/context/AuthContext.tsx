import {createContext,useContext,useEffect,useState,type ReactNode,} from "react";
import { apiFetch } from "../api/client";
import type { User } from "../types/user";

interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

interface MeResponse {
  user: User;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

//Contexto de autenticación esté disponible en toda la aplicación, permitiendo a los componentes acceder al estado de autenticación y a las funciones de inicio/cierre de sesión.

export function AuthProvider({ children }: AuthProviderProps) {   
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await apiFetch<MeResponse>("/users/me", {
          token,
        });

        setUser(data.user);
      } catch {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, [token]);

  async function login(email: string, password: string) {
    const data = await apiFetch<LoginResponse>("/users/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    });

    localStorage.setItem("token", data.token);

    setToken(data.token);
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe utilizarse dentro de AuthProvider");
  }

  return context;
}