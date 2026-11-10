import type { FC } from "react";
import { SocialIcons } from "../common/SocialIcons";

/**
 * Komponen Footer
 * 
 * Terletak di bagian paling bawah halaman sesuai desain:
 * - Sisi Kiri: Lencana nama `</> JOSHUA DEV`
 * - Tengah: Teks hak cipta
 * - Sisi Kanan: Baris ikon media sosial
 */

export const Footer: FC = () => {
  return (
    <footer className="w-full bg-white border-t-2 border-black flex flex-col sm:flex-row items-stretch justify-between">
      {/* Lencana Logo Sisi Kiri */}
      <div className="bg-[#bef264] border-b-2 sm:border-b-0 sm:border-r-2 border-black px-6 py-3.5 flex items-center justify-center sm:justify-start gap-2 font-mono text-xs font-black tracking-wider uppercase select-none">
        <span>&lt;/&gt;</span>
        <span>JOSHUA DEV</span>
      </div>

      {/* Teks Hak Cipta di Tengah */}
      <div className="px-6 py-3.5 flex items-center justify-center text-center text-xs font-mono font-medium text-neutral-800">
        © 2026 Joshua Lapitan. All rights reserved.
      </div>

      {/* Tombol Ikon Media Sosial di Kanan */}
      <div className="border-t-2 sm:border-t-0 sm:border-l-2 border-black px-4 py-2.5 flex items-center justify-center bg-white">
        <SocialIcons />
      </div>
    </footer>
  );
};
