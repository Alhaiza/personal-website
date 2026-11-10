import type { FC } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useSiteContent } from "../../context/siteContentContext";

/**
 * Komponen Navbar Dinamis
 * 
 * Mengambil nama brand (`settings.brandName`) secara dinamis dari context.
 * Memastikan semua tautan menu navigasi mengarah ke rute yang valid.
 */

export const Navbar: FC = () => {
  const { content } = useSiteContent();
  const { settings } = content;
  const navigate = useNavigate();

  // Helper function untuk styling rute yang sedang aktif
  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `transition-colors hover:underline decoration-2 underline-offset-4 ${
      isActive ? "underline font-black text-black bg-[#bef264] px-2 py-1 border border-black shadow-neo-sm" : "text-black"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white border-b-2 border-black">
      <div className="w-full flex items-stretch justify-between">
        {/* Brand Logo - Menggunakan brandName dinamis */}
        <Link
          to="/"
          className="bg-[#bef264] border-r-2 border-black px-4 sm:px-6 py-3.5 flex items-center gap-2 font-mono text-xs sm:text-sm font-black tracking-wider uppercase select-none hover:bg-[#a3e635] transition-colors"
        >
          <span>&lt;/&gt;</span>
          <span>{settings.brandName || "PORTFOLIO"}</span>
        </Link>

        {/* Tautan Navigasi Antar Halaman */}
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

        {/* Tombol Kontak CTA */}
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
