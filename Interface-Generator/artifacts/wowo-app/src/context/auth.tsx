import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

interface AuthContextValue {
  isAuthenticated: boolean;
  userEmail: string;
  login: (email: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("wowo-user-email");
    if (storedEmail) {
      setUserEmail(storedEmail);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string) => {
    setUserEmail(email);
    setIsAuthenticated(true);
    localStorage.setItem("wowo-user-email", email);
  };

  const logout = () => {
    setUserEmail("");
    setIsAuthenticated(false);
    localStorage.removeItem("wowo-user-email");
  };

  const value = useMemo(
    () => ({ isAuthenticated, userEmail, login, logout }),
    [isAuthenticated, userEmail],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
