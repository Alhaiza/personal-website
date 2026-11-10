import { useState, useEffect, type FC, type FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Lock, ArrowRight, AlertCircle, Sparkles } from "lucide-react";
import { useAuth } from "../context/authContext";
import { NeoButton } from "../components/common/NeoButton";

/**
 * Secret Admin Login Page (`/login`)
 * 
 * Features:
 * - Hidden entry point (not linked anywhere on public navbar or footer).
 * - Matches the high-contrast Neo-Brutalist design language.
 * - Authenticates against Firebase Auth with email & password.
 * - Auto-redirects to `/dashboard` if user is already authenticated.
 * - Handles authentication errors gracefully with alert boxes.
 * - Redirects seamlessly to destination upon successful login.
 */

export const Login: FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { user, loading: authLoading, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect destination after successful login (default to /dashboard)
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/dashboard";

  // Jika user sudah login, otomatis lempar langsung ke dashboard (tidak menampilkan form login lagi)
  useEffect(() => {
    if (!authLoading && user) {
      navigate(from, { replace: true });
    }
  }, [user, authLoading, navigate, from]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await login(email, password);
      // Navigate to dashboard upon success
      navigate(from, { replace: true });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to authenticate. Please check your credentials.");
      } else {
        setError("An unexpected authentication error occurred.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Jangan render form jika Firebase masih memverifikasi sesi atau user sudah login
  if (authLoading || user) {
    return (
      <div className="min-h-screen bg-[#bef264] flex flex-col items-center justify-center p-6 text-black select-none font-mono">
        <div className="border-2 border-black bg-white p-8 shadow-neo-lg flex flex-col items-center gap-4 text-center">
          <div className="w-10 h-10 border-4 border-black border-t-[#6366f1] rounded-full animate-spin" />
          <p className="text-sm font-black uppercase tracking-wider">
            {user ? "REDIRECTING TO DASHBOARD..." : "VERIFYING SESSION..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#6366f1] bg-grid-pattern p-6 flex flex-col items-center justify-center text-black font-sans selection:bg-[#bef264]">
      {/* Outer Card Container */}
      <div className="w-full max-w-md bg-white border-2 border-black p-6 sm:p-10 shadow-neo-lg relative">
        {/* Decorative Tag */}
        <div className="inline-flex items-center gap-1.5 bg-[#bef264] text-black text-[11px] font-black uppercase tracking-wider px-3 py-1 border-2 border-black shadow-neo-sm mb-6 select-none">
          <Sparkles className="w-3.5 h-3.5" /> SECURE GATEWAY
        </div>

        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-[#fb7185] border-2 border-black flex items-center justify-center shadow-neo-sm">
            <Lock className="w-5 h-5 text-black" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
            ADMIN PORTAL
          </h1>
        </div>

        <p className="font-mono text-xs text-neutral-600 mb-8 leading-relaxed">
          Restricted zone. Sign in with your administrative credentials to manage portfolio content.
        </p>

        {/* Error Alert Box */}
        {error && (
          <div className="mb-6 p-3 bg-[#fb7185] border-2 border-black shadow-neo-sm flex items-start gap-2.5 text-xs font-mono font-bold text-black">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-black stroke-[2.5]" />
            <p>{error}</p>
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider mb-2">
              ADMIN EMAIL
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full border-2 border-black p-3 font-mono text-xs focus:bg-neutral-50 focus:outline-none shadow-neo-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider mb-2">
              PASSWORD
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full border-2 border-black p-3 font-mono text-xs focus:bg-neutral-50 focus:outline-none shadow-neo-sm"
            />
          </div>

          <NeoButton
            type="submit"
            variant="lime"
            size="lg"
            className="w-full mt-4"
            disabled={submitting}
          >
            <span>{submitting ? "AUTHENTICATING..." : "ACCESS DASHBOARD"}</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </NeoButton>
        </form>

        {/* Footer Note */}
        <div className="mt-8 pt-4 border-t-2 border-dashed border-neutral-300 text-center">
          <a
            href="/"
            className="font-mono text-[11px] font-bold text-neutral-600 hover:text-black hover:underline"
          >
            ← Return to Public Portfolio
          </a>
        </div>
      </div>
    </div>
  );
};

