import type { FC } from "react";
import { ExperienceAndCta } from "../components/home/ExperienceAndCta";
import { Briefcase } from "lucide-react";
import { NeoButton } from "../components/common/NeoButton";
import { useSiteContent } from "../context/siteContentContext";

/**
 * Komponen Halaman Experience (`/experience`)
 * 
 * Halaman rute mandiri untuk memperbaiki isu 404 pada navbar `/experience`.
 * Menampilkan riwayat karier dan timeline dinamis.
 */

export const Experience: FC = () => {
  const { content } = useSiteContent();

  return (
    <div className="w-full bg-white flex-1 flex flex-col">
      <div className="p-6 sm:p-12 pb-0">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b-2 border-black">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-[#fb7185] text-black text-xs font-black uppercase tracking-wider px-3 py-1 border-2 border-black shadow-neo-sm mb-4 select-none">
              <Briefcase className="w-3.5 h-3.5" /> CAREER JOURNEY
            </div>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black">
              WORK EXPERIENCE
            </h1>
            <p className="font-mono text-xs sm:text-sm text-neutral-700 mt-2 max-w-xl">
              Perjalanan profesional, rekam jejak peran, dan kontribusi pada berbagai tim rekayasa perangkat lunak.
            </p>
          </div>

          <NeoButton href={content.settings.resumeUrl || "/resume.pdf"} variant="lime" size="md">
            <span>UNDUH RESUME</span>
          </NeoButton>
        </div>
      </div>

      <div className="mt-8 flex-1">
        <ExperienceAndCta />
      </div>

      <div className="p-6 sm:p-12 pt-8 flex justify-center">
        <NeoButton to="/" variant="white" size="md">
          <span>← KEMBALI KE BERANDA</span>
        </NeoButton>
      </div>
    </div>
  );
};

