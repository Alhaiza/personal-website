import type { FC } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

/**
 * Komponen Navbar dengan React Router DOM
 * 
 * Konsep Penting Routing:
 * 1. `<Link to="...">`: Menggantikan tag <a> biasa. Mencegah reload halaman penuh dan menukar komponen secara instan di memori browser.
 * 2. `<NavLink to="...">`: Mirip dengan <Link>, namun menyediakan boolean `isActive` untuk menandai halaman yang sedang aktif.
 * 3. `useNavigate()`: Hook dari React Router untuk melakukan navigasi secara terprogram lewat kode JavaScript (misal: redirect setelah klik tombol).
 */

export const Navbar: FC = () => {
  // Hook useNavigate untuk berpindah rute secara terprogram
  const navigate = useNavigate();

  // Fungsi pembantu untuk memberi gaya visual pada menu yang sedang aktif (active link)
  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `transition-colors hover:underline decoration-2 underline-offset-4 ${
      isActive ? "underline font-black text-black bg-[#bef264] px-2 py-1 border border-black shadow-neo-sm" : "text-black"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white border-b-2 border-black">
      <div className="w-full flex items-stretch justify-between">
        {/* Lencana Logo - Berpindah kembali ke Beranda ("/") */}
        <Link
          to="/"
          className="bg-[#bef264] border-r-2 border-black px-4 sm:px-6 py-3.5 flex items-center gap-2 font-mono text-xs sm:text-sm font-black tracking-wider uppercase select-none hover:bg-[#a3e635] transition-colors"
        >
          <span>&lt;/&gt;</span>
          <span>JOSHUA DEV</span>
        </Link>

        {/* Menu Navigasi Multi-Halaman di Bagian Tengah */}
        <nav className="hidden md:flex items-center justify-center gap-6 lg:gap-8 text-[11px] font-black uppercase tracking-wider">
          <NavLink to="/" end className={getNavLinkClass}>
            HOME
          </NavLink>
          <NavLink to="/projects" className={getNavLinkClass}>
            PROJECTS
          </NavLink>
          <NavLink to="/certifications" className={getNavLinkClass}>
            CERTIFICATIONS
          </NavLink>
          <NavLink to="/skills" className={getNavLinkClass}>
            SKILLS
          </NavLink>
          <NavLink to="/experience" className={getNavLinkClass}>
            EXPERIENCE
          </NavLink>
        </nav>

        {/* Tombol Aksi Kanan menggunakan navigasi terprogram useNavigate() */}
        <button
          type="button"
          onClick={() => navigate("/contact")}
          className="bg-[#6366f1] hover:bg-[#4f46e5] text-white border-l-2 border-black px-4 sm:px-6 py-3.5 flex items-center gap-2 text-xs font-black tracking-wider uppercase transition-colors select-none cursor-pointer"
        >
          <span>CONTACT ME</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
