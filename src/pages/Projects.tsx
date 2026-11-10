import type { FC } from "react";
import { ArrowRight, ExternalLink, Sparkles } from "lucide-react";
import { NeoButton } from "../components/common/NeoButton";
import { mockProjects } from "../data/mockData";

/**
 * Komponen Halaman Proyek (`/projects`)
 * 
 * Halaman mandiri yang menampilkan seluruh arsip proyek web dalam format grid responsif.
 * Memberikan rute URL tersendiri yang siap dibagikan ke pengunjung.
 */

export const Projects: FC = () => {
  return (
    <div className="w-full bg-white p-6 sm:p-12">
      {/* Banner Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 mb-10 border-b-2 border-black">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-[#bef264] text-black text-xs font-black uppercase tracking-wider px-3 py-1 border-2 border-black shadow-neo-sm mb-4 select-none">
            <Sparkles className="w-3.5 h-3.5" /> ARSIP PORTOFOLIO
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black">
            SEMUA PROYEK
          </h1>
          <p className="font-mono text-xs sm:text-sm text-neutral-700 mt-2 max-w-xl">
            Kumpulan aplikasi web, proyek open-source, dan karya komersial yang telah saya kembangkan.
          </p>
        </div>

        <NeoButton to="/contact" variant="purple" size="md">
          <span>MULAI PROYEK</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </NeoButton>
      </div>

      {/* Grid Responsif Daftar Proyek */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {mockProjects.map((project) => (
          <article
            key={project.id}
            className="border-2 border-black bg-white p-6 shadow-neo hover:-translate-x-1 hover:-translate-y-1 hover:shadow-neo-lg transition-all flex flex-col justify-between"
          >
            <div>
              {/* Wadah gambar ilustrasi dengan gaya Neo-Brutalist */}
              <div className="border-2 border-black bg-[#fb7185] p-3 mb-6">
                <div className="border-2 border-black bg-neutral-100 overflow-hidden aspect-video relative flex items-center justify-center">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-300"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Judul & Deskripsi Proyek */}
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-black uppercase tracking-tight text-black">
                  {project.title}
                </h2>
                <span className="text-[10px] font-mono font-bold bg-[#bef264] px-2 py-0.5 border border-black shadow-neo-sm">
                  AKTIF
                </span>
              </div>

              <p className="font-mono text-xs text-neutral-700 leading-relaxed mb-6">
                {project.description}
              </p>

              {/* Label Tag Teknologi */}
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 text-[11px] font-mono font-bold bg-neutral-100 border border-black shadow-neo-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Tombol Aksi di Bawah Kartu */}
            <div className="flex items-center justify-between pt-4 border-t-2 border-dashed border-neutral-200">
              <div className="flex items-center gap-3">
                <a
                  href={project.projectUrl || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 border border-black bg-white hover:bg-[#bef264] shadow-neo-sm transition"
                  aria-label="Lihat Proyek Langsung"
                >
                  <ExternalLink className="w-4 h-4 text-black" />
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 border border-black bg-white hover:bg-[#bef264] shadow-neo-sm transition"
                  aria-label="Lihat Kode Sumber"
                >
                  <svg className="w-4 h-4 fill-current text-black" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                </a>
              </div>

              <NeoButton size="sm" variant="white" to="/projects">
                <span>STUDI KASUS</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
              </NeoButton>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
