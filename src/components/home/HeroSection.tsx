import type { FC } from "react";
import { ArrowUpRight, ArrowDown } from "lucide-react";
import { NeoButton } from "../common/NeoButton";
import { SocialIcons } from "../common/SocialIcons";
import type { UserProfile } from "../../types";

/**
 * Komponen HeroSection
 * 
 * Memotong (slicing) tampilan bagian hero:
 * - Kolom Kiri (60% di desktop): Background berpola grid, lencana sapaan, judul besar tebal,
 *   teks bio, tombol aksi (VIEW MY WORK, DOWNLOAD RESUME), dan tautan media sosial.
 * - Kolom Kanan (40% di desktop): Background merah muda (#fb7185), foto profil berbingkai dengan
 *   bayangan hijau limau, serta kartu kode terminal berwarna ungu yang menimpa di sudut bawah.
 */

interface HeroSectionProps {
  profile: UserProfile;
}

export const HeroSection: FC<HeroSectionProps> = ({ profile }) => {
  return (
    <section className="w-full grid grid-cols-1 lg:grid-cols-12 border-b-2 border-black">
      {/* ================= KOLOM KIRI (BIO & INTRO) ================= */}
      <div className="lg:col-span-7 bg-white bg-grid-pattern p-6 sm:p-10 lg:p-14 flex flex-col justify-between border-b-2 lg:border-b-0 lg:border-r-2 border-black">
        <div>
          {/* Lencana Sapaan Ungu */}
          <div className="inline-flex items-center gap-1.5 bg-[#6366f1] text-white text-[11px] font-black uppercase tracking-wider px-3 py-1 border-2 border-black shadow-neo-sm mb-6 select-none">
            <span>HEY, I'M {profile.name.toUpperCase()}</span>
            <span role="img" aria-label="wave">👋</span>
          </div>

          {/* Judul Utama Bergaya Neo-Brutalist */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-black leading-none uppercase mb-6">
            SOFTWARE<br />DEVELOPER
          </h1>

          {/* Teks Deskripsi Singkat / Bio */}
          <p className="font-mono text-xs sm:text-sm text-neutral-800 max-w-md leading-relaxed mb-8">
            {profile.bio}
          </p>

          {/* Baris Tombol Aksi Utama */}
          <div className="flex flex-wrap items-center gap-4 mb-10">
            <NeoButton variant="lime" href="#projects">
              <span>VIEW MY WORK</span>
              <ArrowUpRight className="w-4 h-4 stroke-[3]" />
            </NeoButton>

            <NeoButton variant="white" href="/resume.pdf">
              <span>DOWNLOAD RESUME</span>
              <ArrowDown className="w-4 h-4 stroke-[3]" />
            </NeoButton>
          </div>
        </div>

        {/* Bagian Media Sosial "CONNECT WITH ME" */}
        <div className="pt-6 border-t-2 border-dashed border-neutral-300">
          <p className="text-[10px] font-black tracking-widest uppercase text-black mb-3">
            CONNECT WITH ME
          </p>
          <SocialIcons />
        </div>
      </div>

      {/* ================= KOLOM KANAN (FOTO & KARTU KODE) ================= */}
      <div className="lg:col-span-5 bg-[#fb7185] p-6 sm:p-10 lg:p-12 flex items-center justify-center relative overflow-hidden">
        <div className="relative w-full max-w-[340px] sm:max-w-[380px]">
          {/* Kartu Foto Utama dengan Bayangan Bingkai Hijau Limau */}
          <div className="relative bg-[#bef264] border-2 border-black p-2 shadow-neo-lg">
            <div className="border-2 border-black overflow-hidden aspect-[4/5] bg-black">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80"
                alt="Foto Profil"
                className="w-full h-full object-cover grayscale contrast-125"
                loading="eager"
              />
            </div>
          </div>

          {/* Kartu Kode Ungu Menimpa di Sudut Kanan Bawah */}
          <div className="absolute -bottom-6 -right-3 sm:-bottom-8 sm:-right-6 w-[85%] bg-[#6366f1] text-white border-2 border-black shadow-neo p-3 sm:p-4 font-mono text-[10px] sm:text-[11px] leading-relaxed">
            <pre className="whitespace-pre-wrap select-none font-semibold">
              <code>{profile.codeSnippet.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
};
