import type { FC } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, Sparkles, Layers, FileText } from "lucide-react";
import { NeoButton } from "../components/common/NeoButton";
import { useSiteContent } from "../context/siteContentContext";
import { NotFound } from "./NotFound";

/**
 * Komponen Halaman ProjectDetail (`/projects/:id`)
 *
 * Sesuai kebutuhan user:
 * 1. Menerima parameter `id` (atau slug jika cocok dengan title/id).
 * 2. Tampilan fokus dan elegan: Nama Project, Tech Stack (Tags).
 * 3. Bagian "About Project" (sebagai intermezo sebelum detail produk).
 * 4. Detail Product (Full breakdown dengan styling WYSIWYG rich text).
 * 5. Tautan live demo dan repositori GitHub.
 */

// Helper function untuk mendecode HTML entities jika konten ter-escape
const decodeHtml = (html: string): string => {
  if (!html) return "";
  // Jika konten mengandung entity seperti &lt;h2&gt; atau &lt;p&gt;, decode terlebih dahulu
  if (html.includes("&lt;") && html.includes("&gt;")) {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || html;
  }
  return html;
};

export const ProjectDetail: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { content } = useSiteContent();
  const { projects } = content;

  // Temukan proyek berdasarkan ID persis, atau slug match dari judul
  const project = projects.find((p) => {
    if (p.id === id) return true;
    const slug = p.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    return slug === id;
  });

  if (!project) {
    return <NotFound />;
  }

  return (
    <div className="w-full bg-white flex-1 flex flex-col">
      {/* Top Banner / Breadcrumb Bar */}
      <div className="border-b-2 border-black bg-neutral-50 px-6 sm:px-12 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <Link
            to="/projects"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold hover:underline select-none"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            <span>BACK TO ALL PROJECTS</span>
          </Link>

          {project.featured && (
            <span className="text-[10px] font-mono font-black bg-[#bef264] px-2.5 py-0.5 border border-black shadow-neo-sm uppercase">
              FEATURED PROJECT
            </span>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto w-full px-6 sm:px-12 py-8 sm:py-12 flex-1 flex flex-col space-y-10">
        {/* ================= HEADER SECTION: NAMA PROJECT & TECH STACK ================= */}
        <div className="pb-8 border-b-2 border-black space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 bg-[#fb7185] text-black text-xs font-black uppercase tracking-wider px-3 py-1 border-2 border-black shadow-neo-sm select-none">
              <Sparkles className="w-3.5 h-3.5" /> PROJECT SHOWCASE
            </div>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black">
              {project.title}
            </h1>
          </div>

          {/* Tech Stack Tags */}
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5 text-neutral-600">
              <Layers className="w-3.5 h-3.5 text-black" /> TECH STACK
            </span>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-mono font-bold bg-[#bef264] border-2 border-black shadow-neo-sm text-black"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Action Links (Live Demo & Source Code) */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {project.projectUrl && (
              <NeoButton href={project.projectUrl} variant="purple" size="md">
                <span>VIEW LIVE DEMO</span>
                <ExternalLink className="w-4 h-4 stroke-[2.5]" />
              </NeoButton>
            )}
            {project.githubUrl && (
              <NeoButton href={project.githubUrl} variant="white" size="md">
                <span>SOURCE CODE</span>
                <svg className="w-4 h-4 fill-current text-black" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </NeoButton>
            )}
          </div>
        </div>

        {/* Cover Preview Image */}
        {project.imageUrl && (
          <div className="border-2 border-black bg-[#fb7185] p-3 sm:p-4 shadow-neo">
            <div className="border-2 border-black bg-white overflow-hidden aspect-video">
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* ================= ABOUT PROJECT (INTERMEZO) ================= */}
        <section className="bg-neutral-50 border-2 border-black p-6 sm:p-8 shadow-neo space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#bef264] border border-black" />
            <h2 className="text-sm font-black uppercase tracking-wider text-black">
              ABOUT PROJECT
            </h2>
          </div>
          <p className="font-mono text-xs sm:text-sm text-neutral-800 leading-relaxed">
            {project.description}
          </p>
        </section>

        {/* ================= DETAIL PRODUCT (WYSIWYG RICH TEXT CONTENT) ================= */}
        {project.content ? (
          <section className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b-2 border-black">
              <FileText className="w-4 h-4 text-black" />
              <h2 className="text-base font-black uppercase tracking-wider text-black">
                PRODUCT DETAILS & ARCHITECTURE
              </h2>
            </div>

            {/* Area Render HTML dari WYSIWYG */}
            <div
              className="prose max-w-none font-mono text-xs sm:text-sm text-neutral-800 leading-relaxed bg-white border-2 border-black p-6 sm:p-8 shadow-neo
              [&_h1]:text-2xl [&_h1]:font-black [&_h1]:uppercase [&_h1]:mb-3 [&_h1]:border-b-2 [&_h1]:border-black [&_h1]:pb-1
              [&_h2]:text-xl [&_h2]:font-black [&_h2]:uppercase [&_h2]:mt-6 [&_h2]:mb-2
              [&_h3]:text-lg [&_h3]:font-black [&_h3]:uppercase [&_h3]:mt-4 [&_h3]:mb-1
              [&_p]:mb-3
              [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_ul]:space-y-1
              [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3 [&_ol]:space-y-1
              [&_blockquote]:border-l-4 [&_blockquote]:border-black [&_blockquote]:bg-neutral-50 [&_blockquote]:p-3 [&_blockquote]:italic [&_blockquote]:my-3
              [&_pre]:bg-neutral-900 [&_pre]:text-neutral-100 [&_pre]:p-4 [&_pre]:border-2 [&_pre]:border-black [&_pre]:shadow-neo-sm [&_pre]:overflow-x-auto [&_pre]:my-3
              [&_a]:font-bold [&_a]:underline [&_a]:text-[#6366f1]
              "
              dangerouslySetInnerHTML={{ __html: decodeHtml(project.content) }}
            />
          </section>
        ) : null}

        {/* Navigasi Balik */}
        <div className="pt-8 border-t-2 border-dashed border-neutral-300 flex items-center justify-between">
          <NeoButton to="/projects" variant="white" size="sm">
            <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>ALL PROJECTS ARCHIVE</span>
          </NeoButton>

          <NeoButton to="/contact" variant="lime" size="sm">
            <span>GET IN TOUCH</span>
          </NeoButton>
        </div>
      </div>
    </div>
  );
};

