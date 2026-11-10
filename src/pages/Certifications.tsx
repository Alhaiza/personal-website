import type { FC } from "react";
import { Award, ExternalLink, CheckCircle2 } from "lucide-react";
import { NeoButton } from "../components/common/NeoButton";
import { useSiteContent } from "../context/siteContentContext";

/**
 * Komponen Halaman Sertifikasi (`/certifications`)
 * 
 * Dinamis membaca daftar sertifikasi dari `SiteContentContext`.
 * Menampilkan nama sertifikasi, penerbit, deskripsi dinamis, cover sertifikat,
 * serta tombol verifikasi badge bila credentialUrl disediakan.
 */

export const Certifications: FC = () => {
  const { content } = useSiteContent();
  const { certifications } = content;

  return (
    <div className="w-full bg-[#bef264] p-6 sm:p-12 flex-1">
      {/* Banner Judul */}
      <div className="bg-white border-2 border-black p-6 sm:p-8 shadow-neo mb-10">
        <div className="inline-flex items-center gap-1.5 bg-[#6366f1] text-white text-xs font-black uppercase tracking-wider px-3 py-1 border-2 border-black shadow-neo-sm mb-4 select-none">
          <Award className="w-4 h-4" /> CREDENTIALS &amp; CERTIFICATES
        </div>
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black">
          CERTIFICATIONS
        </h1>
        <p className="font-mono text-xs sm:text-sm text-neutral-700 mt-2 max-w-xl">
          Technical competence and industry-standard accreditations acquired throughout the career.
        </p>
      </div>

      {/* Grid Kartu Sertifikasi Dinamis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {certifications.map((cert) => (
          <div
            key={cert.id}
            className="bg-white border-2 border-black p-6 sm:p-8 shadow-neo hover:-translate-x-1 hover:-translate-y-1 hover:shadow-neo-lg transition-all flex flex-col justify-between"
          >
            <div>
              {cert.imageUrl ? (
                <img
                  src={cert.imageUrl}
                  alt={cert.title}
                  className="w-full h-32 object-cover border-2 border-black mb-4 bg-neutral-100"
                  loading="lazy"
                />
              ) : (
                <div className="w-12 h-12 bg-[#fb7185] border-2 border-black flex items-center justify-center mb-6 shadow-neo-sm">
                  <CheckCircle2 className="w-6 h-6 text-black stroke-[2.5]" />
                </div>
              )}

              <h2 className="text-2xl font-black uppercase tracking-tight text-black mb-2">
                {cert.title}
              </h2>

              <p className="font-mono text-xs font-bold text-neutral-600 uppercase mb-4">
                {cert.issuer || "Verified Credential"}
              </p>

              <p className="font-mono text-xs text-neutral-500 leading-relaxed mb-6">
                {cert.description || "Demonstrated competence and mastery of materials according to industry curriculum standards."}
              </p>
            </div>

            {cert.credentialUrl ? (
              <NeoButton size="sm" variant="lime" href={cert.credentialUrl}>
                <span>VERIFY BADGE</span>
                <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
              </NeoButton>
            ) : (
              <span className="font-mono text-xs text-neutral-400 font-bold uppercase text-center block">
                VERIFIED
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Tombol Kembali ke Beranda */}
      <div className="flex justify-center">
        <NeoButton to="/" variant="white" size="md">
          <span>← BACK TO HOME</span>
        </NeoButton>
      </div>
    </div>
  );
};
