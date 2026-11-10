import { useState, type ChangeEvent, type FC, type FormEvent } from "react";
import { ArrowUp, ArrowDown, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { useSiteContent } from "../../context/siteContentContext";
import type { SkillIconType, SkillItem } from "../../types";

/**
 * Komponen SkillsManager (tab `/dashboard/skills`)
 *
 * Mengelola daftar skill yang tersimpan di `SiteContentContext` (dan dipersistensikan ke localStorage).
 * Urutan dan item di sini langsung merefleksikan banner Skills publik & halaman `/skills`.
 */

const iconOptions: { value: SkillIconType; label: string }[] = [
  { value: "react", label: "React" },
  { value: "typescript", label: "TypeScript" },
  { value: "nodejs", label: "Node.js" },
  { value: "tailwind", label: "Tailwind CSS" },
  { value: "mongodb", label: "MongoDB" },
  { value: "git", label: "Git" },
];

const inputClass =
  "w-full border-2 border-black p-3 font-mono text-xs focus:bg-neutral-50 focus:outline-none shadow-neo-sm";

export const SkillsManager: FC = () => {
  const { content, updateContent } = useSiteContent();
  const skills = content.skills;

  const [name, setName] = useState("");
  const [iconType, setIconType] = useState<SkillIconType>("react");
  const [notice, setNotice] = useState<string | null>(null);

  const showNotice = (text: string) => {
    setNotice(text);
    setTimeout(() => setNotice(null), 3000);
  };

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newSkill: SkillItem = {
      id: crypto.randomUUID(),
      name: name.trim(),
      iconType,
    };

    updateContent({ skills: [...skills, newSkill] });
    setName("");
    showNotice(`Skill "${newSkill.name}" berhasil ditambahkan!`);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Hapus skill ini?")) return;
    updateContent({ skills: skills.filter((s) => s.id !== id) });
    showNotice("Skill berhasil dihapus.");
  };

  const handleMove = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= skills.length) return;
    const copy = [...skills];
    [copy[index], copy[target]] = [copy[target], copy[index]];
    updateContent({ skills: copy });
  };

  const handleIconChange = (id: string, e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as SkillIconType;
    updateContent({
      skills: skills.map((s) => (s.id === id ? { ...s, iconType: value } : s)),
    });
  };

  return (
    <div className="space-y-10">
      <div className="pb-6 border-b-2 border-black">
        <h2 className="text-2xl font-black uppercase tracking-tight text-black">SKILLS MANAGER</h2>
        <p className="font-mono text-xs text-neutral-600 mt-1">
          Atur daftar teknologi yang tampil di banner Skills dan halaman /skills publik.
        </p>
      </div>

      {notice && (
        <div className="p-4 border-2 border-black shadow-neo bg-[#bef264] flex items-center gap-3 font-mono text-xs font-bold max-w-2xl">
          <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
          <span>{notice}</span>
        </div>
      )}

      {/* Form tambah skill */}
      <form onSubmit={handleAdd} className="bg-white border-2 border-black p-6 sm:p-8 shadow-neo max-w-2xl">
        <h3 className="text-sm font-black uppercase tracking-wider mb-6 flex items-center gap-2">
          <Plus className="w-4 h-4 stroke-[3]" /> ADD NEW SKILL
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
          <div>
            <label htmlFor="skill-name" className="block text-xs font-black uppercase tracking-wider mb-2">
              SKILL NAME
            </label>
            <input
              id="skill-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="contoh: TypeScript"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="skill-icon" className="block text-xs font-black uppercase tracking-wider mb-2">
              ICON
            </label>
            <select
              id="skill-icon"
              value={iconType}
              onChange={(e) => setIconType(e.target.value as SkillIconType)}
              className={`${inputClass} bg-white cursor-pointer`}
            >
              {iconOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#6366f1] text-white hover:bg-[#4f46e5] border-2 border-black shadow-neo text-xs font-black uppercase tracking-wider cursor-pointer transition-all duration-100 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>ADD SKILL</span>
        </button>
      </form>

      {/* Daftar kartu skill */}
      <div>
        <h3 className="text-sm font-black uppercase tracking-wider mb-4">
          EXISTING SKILLS ({skills.length})
        </h3>

        {skills.length === 0 ? (
          <p className="font-mono text-xs text-neutral-600 font-bold uppercase bg-white border-2 border-black p-6 shadow-neo">
            BELUM ADA SKILL.
          </p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {skills.map((skill, index) => (
              <li key={skill.id} className="bg-white border-2 border-black p-4 shadow-neo flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="w-7 h-7 bg-[#bef264] border-2 border-black flex items-center justify-center font-mono text-xs font-black">
                    {index + 1}
                  </span>
                  <h4 className="flex-1 font-black text-sm uppercase text-black truncate">{skill.name}</h4>
                </div>

                <select
                  aria-label={`Ikon untuk ${skill.name}`}
                  value={skill.iconType}
                  onChange={(e) => handleIconChange(skill.id, e)}
                  className="w-full border-2 border-black p-2 font-mono text-xs bg-white cursor-pointer"
                >
                  {iconOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>

                <div className="flex items-center justify-between pt-3 border-t-2 border-dashed border-neutral-300">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleMove(index, -1)}
                      disabled={index === 0}
                      aria-label={`Naikkan ${skill.name}`}
                      className="w-8 h-8 border-2 border-black bg-white hover:bg-[#bef264] shadow-neo-sm flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMove(index, 1)}
                      disabled={index === skills.length - 1}
                      aria-label={`Turunkan ${skill.name}`}
                      className="w-8 h-8 border-2 border-black bg-white hover:bg-[#bef264] shadow-neo-sm flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(skill.id)}
                    className="px-3 py-1.5 bg-[#fb7185] hover:bg-[#f43f5e] border-2 border-black text-xs font-black uppercase shadow-neo-sm flex items-center gap-1.5 cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>DELETE</span>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
