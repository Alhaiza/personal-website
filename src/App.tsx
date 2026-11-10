import type { FC } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RootLayout } from "./components/layout/RootLayout";

// Halaman-halaman rute mandiri
import { Home } from "./pages/Home";
import { Projects } from "./pages/Projects";
import { Certifications } from "./pages/Certifications";
import { Contact } from "./pages/Contact";
import { NotFound } from "./pages/NotFound";

/**
 * Komponen Utama Aplikasi dengan Multi-Page Routing
 * 
 * Cara kerja React Router DOM di sini:
 * 1. `<BrowserRouter>`: Membungkus seluruh pohon aplikasi untuk mengaktifkan routing HTML5 History API
 *    (URL bersih seperti `/projects` tanpa tanda pagar `#`).
 * 2. `<Routes>`: Mengevaluasi seluruh deklarasi `<Route>` anak dan memilih komponen yang cocok dengan URL saat ini.
 * 3. `<Route path="/" element={<RootLayout />}>`: Menetapkan tata letak induk (parent layout).
 *    Semua rute bersarang di dalamnya akan dirender ke dalam slot `<Outlet />` pada `RootLayout`.
 * 4. `<Route index element={<Home />}>`: Rute anak bawaan saat membuka halaman utama (`/`).
 * 5. `<Route path="*" element={<NotFound />}>`: Rute penangkap semua URL yang tidak terdaftar (halaman 404).
 */

const App: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rute Induk dengan pembungkus RootLayout (Navbar + Footer persisten) */}
        <Route path="/" element={<RootLayout />}>
          {/* Rute Index (Halaman Beranda: "/") */}
          <Route index element={<Home />} />

          {/* Sub-halaman Mandiri */}
          <Route path="projects" element={<Projects />} />
          <Route path="certifications" element={<Certifications />} />
          <Route path="contact" element={<Contact />} />

          {/* Rute Wildcard untuk menangani 404 */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
