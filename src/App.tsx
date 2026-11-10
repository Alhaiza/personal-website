import type { FC } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { RootLayout } from "./components/layout/RootLayout";
import { RequireAuth } from "./components/admin/RequireAuth";

// Dedicated Public Pages
import { Home } from "./pages/Home";
import { Projects } from "./pages/Projects";
import { Certifications } from "./pages/Certifications";
import { Contact } from "./pages/Contact";
import { NotFound } from "./pages/NotFound";

// Secret Admin Pages
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";

/**
 * App Root Component with Authentication & Multi-Page Routing
 * 
 * Architectural Flow:
 * 1. `<AuthProvider>`: Wraps the entire routing tree to broadcast user session state.
 * 2. Public Pages: Rendered inside `<RootLayout />` with persistent Navbar & Footer.
 * 3. Secret `/login`: Standalone minimal authentication screen (no public navigation links).
 * 4. Protected `/dashboard`: Wrapped with `<RequireAuth>`. Unauthenticated visitors are
 *    automatically deflected to `/login`.
 */

const App: FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Portal (Shared RootLayout: Navbar + Outlet + Footer) */}
          <Route path="/" element={<RootLayout />}>
            <Route index element={<Home />} />
            <Route path="projects" element={<Projects />} />
            <Route path="certifications" element={<Certifications />} />
            <Route path="contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Hidden Admin Access (No links in public navbar/footer) */}
          <Route path="/login" element={<Login />} />

          {/* Protected Admin CMS Dashboard */}
          {/* `:tab` adalah parameter dinamis, contoh: /dashboard/contact atau /dashboard/projects */}
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/dashboard/:tab"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
