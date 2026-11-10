import type { FC } from "react";
import { Award, ExternalLink, CheckCircle2 } from "lucide-react";
import { NeoButton } from "../components/common/NeoButton";
import { mockCertifications } from "../data/mockData";

/**
 * Komponen Halaman Sertifikasi (`/certifications`)
 * 
 * Halaman mandiri untuk menampilkan lisensi, sertifikat keahlian, dan ujian kelulusan resmi.
 */

export const Certifications: FC = () => {
  return (
    <div className="w-full bg-[#bef264] p-6 sm:p-12 flex-1">
      {/* Banner Judul */}
      <div className="bg-white border-2 border-black p-6 sm:p-8 shadow-neo mb-10">
        <div className="inline-flex items-center gap-1.5 bg-[#6366f1] text-white text-xs font-black uppercase tracking-wider px-3 py-1 border-2 border-black shadow-neo-sm mb-4 select-none">
          <Award className="w-4 h-4" /> KREDENSIAL & SERTIFIKAT
        </div>
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black">
          SERTIFIKASI
        </h1>
        <p className="font-mono text-xs sm:text-sm text-neutral-700 mt-2 max-w-xl">
          Kompetensi teknis dan akreditasi standar industri yang telah diraih sepanjang karier.
        </p>
      </div>

      {/* Grid Kartu Sertifikasi */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {mockCertifications.map((cert) => (
          <div
            key={cert.id}
            className="bg-white border-2 border-black p-6 sm:p-8 shadow-neo hover:-translate-x-1 hover:-translate-y-1 hover:shadow-neo-lg transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 bg-[#fb7185] border-2 border-black flex items-center justify-center mb-6 shadow-neo-sm">
                <CheckCircle2 className="w-6 h-6 text-black stroke-[2.5]" />
              </div>

              <h2 className="text-2xl font-black uppercase tracking-tight text-black mb-2">
                {cert.title}
              </h2>

              <p className="font-mono text-xs font-bold text-neutral-600 uppercase mb-4">
                {cert.issuer || "Kredensial Terverifikasi"}
              </p>

              <p className="font-mono text-xs text-neutral-500 leading-relaxed mb-6">
                Menunjukkan keahlian dalam prinsip rekayasa perangkat lunak modern, pengujian kode, dan integrasi berkelanjutan.
              </p>
            </div>

            <NeoButton size="sm" variant="lime" href={cert.credentialUrl || "#"}>
              <span>VERIFIKASI</span>
              <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
            </NeoButton>
          </div>
        ))}
      </div>

      {/* Tombol Kembali ke Beranda */}
      <div className="flex justify-center">
        <NeoButton to="/" variant="white" size="md">
          <span>← KEMBALI KE BERANDA</span>
        </NeoButton>
      </div>
    </div>
  );
};
