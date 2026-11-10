import type { FC } from "react";
import { SocialIcons } from "../common/SocialIcons";
import { useSiteContent } from "../../context/siteContentContext";

/**
 * Komponen Footer Dinamis
 * 
 * Mengambil nama brand (`settings.brandName`) dan teks copyright (`settings.footerText`)
 * secara dinamis dari `SiteContentContext`.
 */

export const Footer: FC = () => {
  const { content } = useSiteContent();
  const { settings } = content;

  return (
    <footer className="w-full bg-white border-t-2 border-black flex flex-col sm:flex-row items-stretch justify-between">
      {/* Lencana Logo Sisi Kiri */}
      <div className="bg-[#bef264] border-b-2 sm:border-b-0 sm:border-r-2 border-black px-6 py-3.5 flex items-center justify-center sm:justify-start gap-2 font-mono text-xs font-black tracking-wider uppercase select-none">
        <span>&lt;/&gt;</span>
        <span>{settings.brandName || "PORTFOLIO"}</span>
      </div>

      {/* Teks Hak Cipta di Tengah */}
      <div className="px-6 py-3.5 flex items-center justify-center text-center text-xs font-mono font-medium text-neutral-800">
        {settings.footerText || `© ${new Date().getFullYear()} All rights reserved.`}
      </div>

      {/* Tombol Ikon Media Sosial di Kanan */}
      <div className="border-t-2 sm:border-t-0 sm:border-l-2 border-black px-4 py-2.5 flex items-center justify-center bg-white">
        <SocialIcons />
      </div>
    </footer>
  );
};
