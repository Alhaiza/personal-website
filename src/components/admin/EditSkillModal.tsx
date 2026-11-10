import { useState, type ChangeEvent, type FC, type FormEvent } from "react";
import { X, Save, Edit3, Code2, Upload, CheckCircle2 } from "lucide-react";
import { NeoButton } from "../common/NeoButton";
import { useToast } from "../common/toastContext";
import type { SkillItem } from "../../types";

/**
 * Komponen EditSkillModal (Neo-Brutalism Dialog Edit Skill)
 * 
 * Mengizinkan admin memperbarui nama teknologi, mengganti file SVG, atau mengedit kode markup SVG.
 */

interface EditSkillModalProps {
  skill: SkillItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: SkillItem) => Promise<void> | void;
  featuredLimit: number;
  currentFeaturedCount: number;
}

export const EditSkillModal: FC<EditSkillModalProps> = ({
  skill,
  isOpen,
  onClose,
  onSave,
  featuredLimit,
  currentFeaturedCount,
}) => {
  const toast = useToast();

  if (!isOpen || !skill) return null;

  return (
    <EditSkillModalContent
      key={skill.id}
      skill={skill}
      onClose={onClose}
      onSave={onSave}
      toast={toast}
      featuredLimit={featuredLimit}
      currentFeaturedCount={currentFeaturedCount}
    />
  );
};

interface ContentProps extends Omit<EditSkillModalProps, "isOpen"> {
  skill: SkillItem;
  toast: ReturnType<typeof useToast>;
}

const EditSkillModalContent: FC<ContentProps> = ({
  skill,
  onClose,
  onSave,
  toast,
  featuredLimit,
  currentFeaturedCount,
}) => {
  const [form, setForm] = useState<SkillItem>({ ...skill });
  const [inputMode, setInputMode] = useState<"upload" | "paste">("upload");
  const [saving, setSaving] = useState(false);

  // Batasan limit featured
  const isLimitReached = currentFeaturedCount >= featuredLimit && !skill.featured;

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isSvg = file.name.toLowerCase().endsWith(".svg") || file.type === "image/svg+xml";
    if (!isSvg) {
      toast.error("File rejected! You MUST upload an .svg file", "VALIDATION ERROR");
      e.target.value = "";
      return;
    }

    if (file.size > 200 * 1024) {
      toast.error("SVG file size is too large (max 200 KB).", "SIZE EXCEEDED");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text && text.includes("<svg")) {
        setForm((prev) => ({ ...prev, svgCode: text.trim() }));
        toast.success(`SVG file "${file.name}" loaded successfully!`);
      } else {
        toast.error("Invalid SVG file! No <svg> tag detected.", "PARSING FAILED");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Skill name cannot be empty.", "VALIDATION ERROR");
      return;
    }
    if (!form.svgCode.trim() || !form.svgCode.includes("<svg")) {
      toast.error("Please provide valid SVG code or upload an SVG file.", "VALIDATION ERROR");
      return;
    }

    if (form.featured && isLimitReached) {
      toast.error(
        `Maximum limit of ${featuredLimit} featured skills reached!`,
        "LIMIT REACHED"
      );
      return;
    }

    setSaving(true);
    try {
      await onSave(form);
      toast.success(`Skill "${form.name}" updated successfully!`);
      onClose();
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to update skill");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white border-2 border-black p-6 sm:p-8 shadow-neo-lg text-black font-sans my-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 border-2 border-black bg-white hover:bg-neutral-100 shadow-neo-sm active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
          aria-label="Close edit modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 pb-4 mb-6 border-b-2 border-black">
          <div className="w-10 h-10 bg-[#bef264] border-2 border-black flex items-center justify-center shadow-neo-sm shrink-0">
            <Edit3 className="w-5 h-5 text-black stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-xl font-black uppercase tracking-tight">EDIT SKILL</h3>
            <p className="font-mono text-xs text-neutral-600">
              Update skill name, replace SVG icon, or change banner featured status.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider mb-1">
              SKILL / TECHNOLOGY NAME
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border-2 border-black p-2.5 font-mono text-xs shadow-neo-sm focus:bg-neutral-50 focus:outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-black uppercase tracking-wider">
                SVG ICON
              </label>
              <div className="flex border border-black bg-neutral-100 p-0.5 text-[10px] font-mono font-black">
                <button
                  type="button"
                  onClick={() => setInputMode("upload")}
                  className={`px-2 py-0.5 transition cursor-pointer ${
                    inputMode === "upload" ? "bg-black text-white" : "text-neutral-700 hover:text-black"
                  }`}
                >
                  UPLOAD FILE
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode("paste")}
                  className={`px-2 py-0.5 transition cursor-pointer ${
                    inputMode === "paste" ? "bg-black text-white" : "text-neutral-700 hover:text-black"
                  }`}
                >
                  EDIT SVG RAW
                </button>
              </div>
            </div>

            {inputMode === "upload" ? (
              <label className="border-2 border-dashed border-black bg-neutral-50 hover:bg-[#bef264]/10 p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer shadow-neo-sm transition">
                <Upload className="w-5 h-5 text-black" />
                <span className="font-mono text-xs font-bold uppercase">CLICK TO REPLACE SVG FILE</span>
                <span className="font-mono text-[10px] text-neutral-500">Max size: 200 KB</span>
                <input
                  type="file"
                  accept=".svg,image/svg+xml"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            ) : (
              <textarea
                rows={4}
                value={form.svgCode}
                onChange={(e) => setForm({ ...form, svgCode: e.target.value })}
                placeholder="<svg ...>...</svg>"
                className="w-full border-2 border-black p-2.5 font-mono text-[11px] bg-neutral-900 text-green-400 focus:outline-none shadow-neo-sm resize-none"
              />
            )}
          </div>

          {/* Preview Skill Icon */}
          <div className="p-3 bg-neutral-50 border-2 border-black flex items-center gap-3">
            <div className="w-9 h-9 bg-white border border-black flex items-center justify-center p-1.5 shrink-0 shadow-neo-sm">
              {form.svgCode && form.svgCode.includes("<svg") ? (
                <div
                  className="w-6 h-6 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:fill-current [&>svg]:stroke-current text-black"
                  dangerouslySetInnerHTML={{ __html: form.svgCode }}
                />
              ) : (
                <Code2 className="w-5 h-5 text-neutral-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-black text-xs uppercase block truncate">{form.name || "PREVIEW"}</span>
              <span className="font-mono text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Ready
              </span>
            </div>
          </div>

          <label
            className={`flex items-start gap-3 p-3.5 border-2 border-black shadow-neo-sm select-none transition-colors ${
              isLimitReached && !form.featured
                ? "bg-neutral-100 opacity-60 cursor-not-allowed"
                : "bg-neutral-50 hover:bg-[#bef264]/20 cursor-pointer"
            }`}
          >
            <input
              type="checkbox"
              checked={Boolean(form.featured)}
              disabled={isLimitReached && !form.featured}
              onChange={(e) => {
                if (e.target.checked && isLimitReached) {
                  toast.error(
                    `Maximum limit of ${featuredLimit} featured skills reached!`,
                    "LIMIT REACHED"
                  );
                  return;
                }
                setForm({ ...form, featured: e.target.checked });
              }}
              className="w-5 h-5 accent-black cursor-pointer disabled:cursor-not-allowed mt-0.5"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider">
                  FEATURED SKILL (DISPLAY ON HOME BANNER)
                </span>
              </div>
              <p className="font-mono text-[11px] text-neutral-600 mt-0.5">
                Prioritize this skill in the 6-slot Home marquee/banner.
              </p>
            </div>
          </label>

          <div className="flex items-center justify-end gap-3 pt-4 border-t-2 border-black">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 border-2 border-black bg-white hover:bg-neutral-100 text-xs font-black uppercase shadow-neo-sm cursor-pointer"
            >
              CANCEL
            </button>
            <NeoButton
              type="submit"
              variant="lime"
              size="sm"
              disabled={saving}
            >
              <Save className="w-4 h-4 stroke-[2.5]" />
              <span>{saving ? "SAVING..." : "SAVE CHANGES"}</span>
            </NeoButton>
          </div>
        </form>
      </div>
    </div>
  );
};
