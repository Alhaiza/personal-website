import type { FC } from "react";
import { Mail } from "lucide-react";

/**
 * Komponen SocialIcons
 * 
 * Menampilkan baris tombol media sosial berbentuk kotak (GitHub, LinkedIn, Twitter/X, Email):
 * Digunakan pada bagian Hero dan Footer.
 * Menerapkan gaya Neo-Brutalism: border hitam 2px, hard shadow, dan efek klik taktil.
 */

interface SocialIconsProps {
  className?: string;
}

export const SocialIcons: FC<SocialIconsProps> = ({ className = "" }) => {
  // Class Tailwind dasar untuk setiap tombol ikon kotak
  const iconBaseClass = `
    w-9 h-9 sm:w-10 sm:h-10
    bg-white
    border-2 border-black
    shadow-neo-sm
    flex items-center justify-center
    text-black
    hover:bg-[#bef264]
    hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo
    active:translate-x-0.5 active:translate-y-0.5 active:shadow-none
    transition-all duration-100
  `.trim();

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Tautan Ikon GitHub */}
      <a
        href="https://github.com"
        target="_blank"
        rel="noreferrer"
        className={iconBaseClass}
        aria-label="Profil GitHub"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
        </svg>
      </a>

      {/* Tautan Ikon LinkedIn */}
      <a
        href="https://linkedin.com"
        target="_blank"
        rel="noreferrer"
        className={iconBaseClass}
        aria-label="Profil LinkedIn"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      </a>

      {/* Tautan Ikon Twitter / X */}
      <a
        href="https://twitter.com"
        target="_blank"
        rel="noreferrer"
        className={iconBaseClass}
        aria-label="Profil Twitter"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </a>

      {/* Tautan Ikon Email */}
      <a
        href="mailto:joshua@example.com"
        className={iconBaseClass}
        aria-label="Kirim email"
      >
        <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-black" strokeWidth={2.5} />
      </a>
    </div>
  );
};
