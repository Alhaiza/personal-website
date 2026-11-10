import type { FC } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { SiteContentProvider } from "./context/SiteContentProvider";
import { RootLayout } from "./components/layout/RootLayout";
import { RequireAuth } from "./components/admin/RequireAuth";

// Halaman Publik Dedikasi
import { Home } from "./pages/Home";
import { Projects } from "./pages/Projects";
import { Certifications } from "./pages/Certifications";
import { Skills } from "./pages/Skills";
import { Experience } from "./pages/Experience";
import { Contact } from "./pages/Contact";
import { NotFound } from "./pages/NotFound";

// Halaman Rahasia Admin
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";

/**
 * Komponen Utama Aplikasi (App)
 * 
 * Arsitektur State & Routing:
 * 1. `<AuthProvider>`: Menyediakan status autentikasi Firebase.
 * 2. `<SiteContentProvider>`: Menyediakan data konten dinamis terpusat
 *    (Settings, Profile, Contact, Skills, Projects, Certifications, Experience)
 *    yang disinkronkan secara mulus via context & localStorage sebelum Firestore.
 * 3. Rute Publik: Termasuk perbaikan rute `/skills` dan `/experience` agar tidak 404.
 * 4. Rute Admin: Terlindungi `<RequireAuth>` di `/dashboard` dan `/dashboard/:tab`.
 */

const App: FC = () => {
  return (
    <AuthProvider>
      <SiteContentProvider>
        <BrowserRouter>
          <Routes>
            {/* Halaman Publik (Shared RootLayout: Navbar + Outlet + Footer) */}
            <Route path="/" element={<RootLayout />}>
              <Route index element={<Home />} />
              <Route path="projects" element={<Projects />} />
              <Route path="certifications" element={<Certifications />} />
              <Route path="skills" element={<Skills />} />
              <Route path="experience" element={<Experience />} />
              <Route path="contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Gerbang Rahasia Login Admin */}
            <Route path="/login" element={<Login />} />

            {/* Dashboard Terproteksi CMS Admin */}
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
      </SiteContentProvider>
    </AuthProvider>
  );
};

export default App;
