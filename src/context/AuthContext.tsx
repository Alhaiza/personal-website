import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
  type FC,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { auth } from "../lib/firebase";

/**
 * AuthContext Interface
 * 
 * Defines the contract for user authentication state across the application:
 * - `user`: Firebase User object when logged in, or null when logged out.
 * - `loading`: Boolean indicating whether the initial auth check with Firebase is still pending.
 * - `login`: Async function to authenticate using email and password.
 * - `logout`: Async function to sign out the user.
 */
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider Component
 * 
 * Wraps our application (or routes) to broadcast the authenticated user state.
 * It uses `onAuthStateChanged` from Firebase Auth:
 * - Firebase remembers the user's login state via IndexedDB / localStorage.
 * - When the page reloads, `onAuthStateChanged` fires automatically to restore the session.
 */
export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for authentication state changes (sign in, sign out, token refresh)
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup the listener when component unmounts to prevent memory leaks
    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom Hook: `useAuth`
 * 
 * Provides an easy, type-safe way for components to access `user`, `login`, and `logout`
 * without directly referencing Firebase Auth SDK details.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

