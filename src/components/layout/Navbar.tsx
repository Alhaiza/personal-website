import type { FC } from "react";
import { ArrowRight } from "lucide-react";

/**
 * Komponen Navbar
 * 
 * Tata letak navigasi atas (header) dengan karakteristik Neo-Brutalism:
 * - Lencana logo hijau dengan tulisan `</> JOSHUA DEV`
 * - Menu navigasi di bagian tengah
 * - Tombol aksi ungu "CONTACT ME ->"
 * - Border hitam 2px di bagian bawah
 */

export const Navbar: FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b-2 border-black">
      <div className="w-full flex items-stretch justify-between">
        {/* Lencana Logo Sisi Kiri */}
        <div className="bg-[#bef264] border-r-2 border-black px-4 sm:px-6 py-3.5 flex items-center gap-2 font-mono text-xs sm:text-sm font-black tracking-wider uppercase select-none">
          <span>&lt;/&gt;</span>
          <span>JOSHUA DEV</span>
        </div>

        {/* Tautan Navigasi Tengah - Tersembunyi di layar HP kecil, muncul di layar tablet ke atas */}
        <nav className="hidden md:flex items-center justify-center gap-6 lg:gap-10 text-[11px] font-black uppercase tracking-wider text-black">
          <a href="#skills" className="hover:underline decoration-2 underline-offset-4">
            SKILLS
          </a>
          <a href="#projects" className="hover:underline decoration-2 underline-offset-4">
            PROJECTS
          </a>
          <a href="#experience" className="hover:underline decoration-2 underline-offset-4">
            EXPERIENCE
          </a>
          <a href="#certifications" className="hover:underline decoration-2 underline-offset-4">
            CERTIFICATIONS
          </a>
          <a href="#blog" className="hover:underline decoration-2 underline-offset-4">
            BLOG
          </a>
        </nav>

        {/* Tombol Aksi Kanan (Call To Action) */}
        <a
          href="#contact"
          className="bg-[#6366f1] hover:bg-[#4f46e5] text-white border-l-2 border-black px-4 sm:px-6 py-3.5 flex items-center gap-2 text-xs font-black tracking-wider uppercase transition-colors select-none"
        >
          <span>CONTACT ME</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </header>
  );
};
