import { createContext, useContext } from "react";
import type { User } from "firebase/auth";

/**
 * Antarmuka AuthContext
 * 
 * Dipisahkan ke berkas non-komponen agar mematuhi aturan ESLint
 * `react-refresh/only-export-components`.
 */
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

