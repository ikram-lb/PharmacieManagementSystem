
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { login as loginApi, decodeToken, type AuthUser } from "@/api/authApi";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isDoctorAdmin: boolean;
  isCaissier: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate user from stored token on page load / refresh
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        setUser(decodeToken(token));
      } catch {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const { access, refresh } = await loginApi(username, password);
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
    setUser(decodeToken(access));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isDoctorAdmin: user?.role === "DoctorAdmin",
        isCaissier: user?.role === "Caissier",
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}