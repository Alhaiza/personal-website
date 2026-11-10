import { useState, type FC } from "react";
import { ArrowUpRight, ArrowDown } from "lucide-react";
import { NeoButton } from "../common/NeoButton";
import { SocialIcons } from "../common/SocialIcons";
import { useSiteContent } from "../../context/siteContentContext";
import type { UserProfile } from "../../types";

/**
 * Komponen HeroSection Dinamis
 * 
 * Slicing Hero Banner:
 * - Menampilkan sapaan nama (`profile.name`)
 * - Menampilkan peran/jabatan besar (`profile.role`) yang terikat dinamis
 * - Menampilkan bio ringkas (`profile.bio`)
 * - Menampilkan tombol Download Resume dengan tautan dinamis (`settings.resumeUrl`)
 * - Menampilkan foto profil dinamis (`settings.profileImageUrl`) dengan fallback "NO PHOTO"
 * - Menampilkan kartu kode (`profile.codeSnippet.code`)
 */

interface HeroSectionProps {
  profile?: UserProfile;
}

export const HeroSection: FC<HeroSectionProps> = ({ profile: propProfile }) => {
  const { content } = useSiteContent();
  const profile = propProfile || content.profile;
  const { settings } = content;

  const [failedImage, setFailedImage] = useState<string | null>(null);
  const photoBroken = failedImage === settings.profileImageUrl;

  // Render role teks baris per baris bila dipisahkan spasi atau newline
  const roleLines = profile.role ? profile.role.split("\n") : ["SOFTWARE", "DEVELOPER"];

  return (
    <section className="w-full grid grid-cols-1 lg:grid-cols-12 border-b-2 border-black">
      {/* ================= KOLOM KIRI (BIO & INTRO) ================= */}
      <div className="lg:col-span-7 bg-white bg-grid-pattern p-6 sm:p-10 lg:p-14 flex flex-col justify-between border-b-2 lg:border-b-0 lg:border-r-2 border-black">
        <div>
          {/* Lencana Sapaan Ungu */}
          <div className="inline-flex items-center gap-1.5 bg-[#6366f1] text-white text-[11px] font-black uppercase tracking-wider px-3 py-1 border-2 border-black shadow-neo-sm mb-6 select-none">
            <span>HEY, I'M {profile.name ? profile.name.toUpperCase() : "DEVELOPER"}</span>
            <span role="img" aria-label="wave">👋</span>
          </div>

          {/* Judul Utama Terikat Dinamis ke profile.role */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-black leading-none uppercase mb-6">
            {roleLines.map((line, idx) => (
              <span key={idx} className="block">
                {line}
              </span>
            ))}
          </h1>

          {/* Teks Deskripsi Singkat / Bio */}
          <p className="font-mono text-xs sm:text-sm text-neutral-800 max-w-md leading-relaxed mb-8">
            {profile.bio}
          </p>

          {/* Baris Tombol Aksi Utama */}
          <div className="flex flex-wrap items-center gap-4 mb-10">
            <NeoButton variant="lime" to="/projects">
              <span>VIEW MY WORK</span>
              <ArrowUpRight className="w-4 h-4 stroke-[3]" />
            </NeoButton>

            <NeoButton variant="white" href={settings.resumeUrl || "/resume.pdf"}>
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
              {settings.profileImageUrl && !photoBroken ? (
                <img
                  src={settings.profileImageUrl}
                  alt={profile.name || "Foto Profil"}
                  onError={() => setFailedImage(settings.profileImageUrl)}
                  className="w-full h-full object-cover grayscale contrast-125"
                  loading="eager"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-neutral-200 font-mono text-xs font-black uppercase text-neutral-600">
                  NO PHOTO
                </div>
              )}
            </div>
          </div>

          {/* Kartu Kode Ungu Menimpa di Sudut Kanan Bawah */}
          <div className="absolute -bottom-6 -right-3 sm:-bottom-8 sm:-right-6 w-[85%] bg-[#6366f1] text-white border-2 border-black shadow-neo p-3 sm:p-4 font-mono text-[10px] sm:text-[11px] leading-relaxed">
            <pre className="whitespace-pre-wrap select-none font-semibold">
              <code>{profile.codeSnippet?.code || ""}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
};
