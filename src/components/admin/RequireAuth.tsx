import type { FC, ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/authContext";

/**
 * RequireAuth (Protected Route Guard)
 * 
 * How this works:
 * 1. Checks `loading`: If Firebase is still verifying the auth cookie/token,
 *    we display a clean Neo-Brutalist loader so we don't prematurely redirect the user.
 * 2. Checks `user`: If no user is logged in, it redirects them to the secret `/login` route.
 * 3. `state={{ from: location }}`: Remembers which URL the user was trying to access so we can
 *    redirect them back right after a successful login.
 */

interface RequireAuthProps {
  children: ReactNode;
}

export const RequireAuth: FC<RequireAuthProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#bef264] flex flex-col items-center justify-center p-6 text-black select-none font-mono">
        <div className="border-2 border-black bg-white p-8 shadow-neo-lg flex flex-col items-center gap-4 text-center">
          <div className="w-10 h-10 border-4 border-black border-t-[#6366f1] rounded-full animate-spin" />
          <p className="text-sm font-black uppercase tracking-wider">
            AUTHENTICATING ACCESS...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect unauthenticated users to the hidden /login route
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
