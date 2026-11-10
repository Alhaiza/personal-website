import type { FC } from "react";
import { ArrowRight } from "lucide-react";
import { NeoButton } from "../common/NeoButton";
import type { ExperienceItem } from "../../types";

/**
 * ExperienceAndCta Component
 * 
 * Slices the bottom interactive section:
 * - Left Pink Badge: "EXPERIENCE ->"
 * - Center Timeline: Chronological career list with solid black dot nodes, company, period, and description
 * - Right Purple Box: "LET'S BUILD SOMETHING AMAZING TOGETHER." with "GET IN TOUCH ->" button (routes to `/contact`)
 */

interface ExperienceAndCtaProps {
  experiences: ExperienceItem[];
}

export const ExperienceAndCta: FC<ExperienceAndCtaProps> = ({ experiences }) => {
  return (
    <section id="experience" className="w-full grid grid-cols-1 lg:grid-cols-12 border-b-2 border-black">
      {/* ================= LEFT PINK LABEL ================= */}
      <div className="lg:col-span-2 bg-[#fb7185] border-b-2 lg:border-b-0 lg:border-r-2 border-black p-6 flex flex-row lg:flex-col items-center justify-between lg:justify-start lg:items-start select-none">
        <h2 className="font-black text-sm sm:text-base uppercase tracking-wider text-black">
          EXPERIENCE
        </h2>
        <ArrowRight className="w-5 h-5 stroke-[3] text-black mt-0 lg:mt-4" />
      </div>

      {/* ================= CENTER TIMELINE ================= */}
      <div className="lg:col-span-7 bg-white p-6 sm:p-10 border-b-2 lg:border-b-0 lg:border-r-2 border-black flex flex-col justify-between">
        <div className="space-y-8 relative before:absolute before:left-[5px] before:top-2 before:bottom-2 before:w-[2px] before:bg-black">
          {experiences.map((exp) => (
            <div key={exp.id} className="relative pl-7 group">
              <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-black group-hover:bg-[#bef264] transition-colors" />

              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-2">
                <h3 className="text-xs sm:text-sm font-black tracking-tight text-black uppercase">
                  {exp.role} <span className="text-neutral-400">•</span> {exp.company}
                </h3>
                <span className="font-mono text-[11px] font-bold text-neutral-600 uppercase">
                  {exp.period}
                </span>
              </div>

              <p className="font-mono text-xs text-neutral-700 leading-relaxed max-w-xl">
                {exp.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t-2 border-dashed border-neutral-200">
          <NeoButton size="sm" variant="white" href="/resume.pdf">
            <span>VIEW FULL RESUME</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
          </NeoButton>
        </div>
      </div>

      {/* ================= RIGHT PURPLE CTA BOX ================= */}
      <div id="contact" className="lg:col-span-3 bg-[#6366f1] bg-grid-pattern p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden text-white select-none">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight leading-tight mb-8">
            LET'S BUILD<br />
            SOMETHING<br />
            AMAZING<br />
            TOGETHER.
          </h2>

          <NeoButton size="md" variant="white" to="/contact">
            <span>GET IN TOUCH</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </NeoButton>
        </div>

        <div className="absolute -bottom-6 -right-6 pointer-events-none opacity-90">
          <div className="w-24 h-24 bg-[#fb7185] border-2 border-black rotate-12 flex items-center justify-center shadow-neo">
            <span className="font-mono text-[10px] font-black uppercase text-black text-center leading-tight">
              AVAILABLE<br />NOW
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
