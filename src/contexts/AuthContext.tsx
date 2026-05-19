import { createContext, useContext, useState, ReactNode } from "react";

export type Role = "suporte" | "professor" | "coordenacao" | "direcao" | "administracao" | "aluno";

interface User {
  username: string;
  name: string;
  role: Role;
  turma?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const accounts: Record<string, User> = {
  stepforma: { username: "stepforma", name: "Bruno Maravilha", role: "suporte" },
  professor: { username: "professor", name: "Ana Silva", role: "professor" },
  coord: { username: "coord", name: "Ana Paula Coordenadora", role: "coordenacao" },
  direcao: { username: "direcao", name: "Carlos Mendes", role: "direcao" },
  admin: { username: "admin", name: "Fernanda Alves", role: "administracao" },
  aluno: { username: "aluno", name: "João Pedro", role: "aluno", turma: "7º A" },
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = (username: string, password: string): boolean => {
    const acc = accounts[username.toLowerCase()];
    if (acc && password === "12345678") {
      setUser(acc);
      localStorage.setItem("user", JSON.stringify(acc));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
