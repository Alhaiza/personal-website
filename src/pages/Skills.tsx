import type { FC } from "react";
import { SkillsBanner } from "../components/home/SkillsBanner";
import { Sparkles } from "lucide-react";
import { NeoButton } from "../components/common/NeoButton";
import { useSiteContent } from "../context/siteContentContext";

/**
 * Komponen Halaman Skills (`/skills`)
 * 
 * Halaman rute mandiri untuk memperbaiki isu 404 pada navbar `/skills`.
 * Menampilkan ringkasan teknologi lengkap yang dikelola secara dinamis.
 */

export const Skills: FC = () => {
  const { content } = useSiteContent();
  const { skills } = content;

  return (
    <div className="w-full bg-white p-6 sm:p-12 flex-1">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 mb-10 border-b-2 border-black">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-[#bef264] text-black text-xs font-black uppercase tracking-wider px-3 py-1 border-2 border-black shadow-neo-sm mb-4 select-none">
            <Sparkles className="w-3.5 h-3.5" /> TECH ARSENAL
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black">
            TECHNICAL SKILLS
          </h1>
          <p className="font-mono text-xs sm:text-sm text-neutral-700 mt-2 max-w-xl">
            A comprehensive collection of modern web development technologies, frameworks, and tools.
          </p>
        </div>

        <NeoButton to="/projects" variant="purple" size="md">
          <span>VIEW PROJECTS</span>
        </NeoButton>
      </div>

      <div className="border-2 border-black shadow-neo mb-10">
        <SkillsBanner skills={skills} />
      </div>

      <div className="flex justify-center">
        <NeoButton to="/" variant="white" size="md">
          <span>← BACK TO HOME</span>
        </NeoButton>
      </div>
    </div>
  );
};

