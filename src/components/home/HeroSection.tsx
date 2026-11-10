import type { FC } from "react";
import { ArrowUpRight, ArrowDown } from "lucide-react";
import { NeoButton } from "../common/NeoButton";
import { SocialIcons } from "../common/SocialIcons";
import type { UserProfile } from "../../types";

/**
 * HeroSection Component
 * 
 * Slices the hero banner:
 * - Left Column (60% on desktop): Grid-pattern background, greeting tag, huge bold title,
 *   bio text, action buttons (VIEW MY WORK, DOWNLOAD RESUME), and social icon links.
 * - Right Column (40% on desktop): Pink background (#fb7185), framed portrait photo with
 *   lime shadow border, and an overlaid purple terminal code snippet.
 */

interface HeroSectionProps {
  profile: UserProfile;
}

export const HeroSection: FC<HeroSectionProps> = ({ profile }) => {
  return (
    <section className="w-full grid grid-cols-1 lg:grid-cols-12 border-b-2 border-black">
      {/* ================= LEFT COLUMN ================= */}
      <div className="lg:col-span-7 bg-white bg-grid-pattern p-6 sm:p-10 lg:p-14 flex flex-col justify-between border-b-2 lg:border-b-0 lg:border-r-2 border-black">
        <div>
          {/* Greeting Tag */}
          <div className="inline-flex items-center gap-1.5 bg-[#6366f1] text-white text-[11px] font-black uppercase tracking-wider px-3 py-1 border-2 border-black shadow-neo-sm mb-6 select-none">
            <span>HEY, I'M {profile.name.toUpperCase()}</span>
            <span role="img" aria-label="wave">👋</span>
          </div>

          {/* Huge Neo-Brutalist Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-black leading-none uppercase mb-6">
            SOFTWARE<br />DEVELOPER
          </h1>

          {/* Bio text */}
          <p className="font-mono text-xs sm:text-sm text-neutral-800 max-w-md leading-relaxed mb-8">
            {profile.bio}
          </p>

          {/* Action Buttons */}
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

        {/* Connect With Me Socials */}
        <div className="pt-6 border-t-2 border-dashed border-neutral-300">
          <p className="text-[10px] font-black tracking-widest uppercase text-black mb-3">
            CONNECT WITH ME
          </p>
          <SocialIcons />
        </div>
      </div>

      {/* ================= RIGHT COLUMN (PORTRAIT & CODE) ================= */}
      <div className="lg:col-span-5 bg-[#fb7185] p-6 sm:p-10 lg:p-12 flex items-center justify-center relative overflow-hidden">
        <div className="relative w-full max-w-[340px] sm:max-w-[380px]">
          {/* Main Photo Card with Green Offset Border Shadow */}
          <div className="relative bg-[#bef264] border-2 border-black p-2 shadow-neo-lg">
            <div className="border-2 border-black overflow-hidden aspect-[4/5] bg-black">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80"
                alt="Portrait"
                className="w-full h-full object-cover grayscale contrast-125"
                loading="eager"
              />
            </div>
          </div>

          {/* Overlaid Code Card (Purple Box on Bottom Right) */}
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

