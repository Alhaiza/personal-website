import { useState, type FC, type FormEvent } from "react";
import { X, Save, Edit3 } from "lucide-react";
import { NeoButton } from "../common/NeoButton";
import { useToast } from "../common/toastContext";
import type { ExperienceItem } from "../../types";

/**
 * Komponen EditExperienceModal (Neo-Brutalism Dialog Edit Riwayat Karier)
 */

interface EditExperienceModalProps {
  experience: ExperienceItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: ExperienceItem) => Promise<void> | void;
}

export const EditExperienceModal: FC<EditExperienceModalProps> = ({
  experience,
  isOpen,
  onClose,
  onSave,
}) => {
  const toast = useToast();

  if (!isOpen || !experience) return null;

  return (
    <EditExperienceModalContent
      key={experience.id}
      experience={experience}
      onClose={onClose}
      onSave={onSave}
      toast={toast}
    />
  );
};

interface ContentProps extends Omit<EditExperienceModalProps, "isOpen"> {
  experience: ExperienceItem;
  toast: ReturnType<typeof useToast>;
}

const EditExperienceModalContent: FC<ContentProps> = ({
  experience,
  onClose,
  onSave,
  toast,
}) => {
  const [form, setForm] = useState<ExperienceItem>({ ...experience });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.role.trim() || !form.company.trim()) {
      toast.error("Role and company cannot be empty.", "VALIDATION ERROR");
      return;
    }

    setSaving(true);
    try {
      await onSave(form);
      toast.success(`Position "${form.role}" updated successfully!`);
      onClose();
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to update experience");
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
            <h3 className="text-xl font-black uppercase tracking-tight">EDIT EXPERIENCE</h3>
            <p className="font-mono text-xs text-neutral-600">
              Update career role, company, period, and responsibilities.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider mb-1">
              ROLE / TITLE
            </label>
            <input
              type="text"
              required
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full border-2 border-black p-2.5 font-mono text-xs shadow-neo-sm focus:bg-neutral-50 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider mb-1">
              COMPANY
            </label>
            <input
              type="text"
              required
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              className="w-full border-2 border-black p-2.5 font-mono text-xs shadow-neo-sm focus:bg-neutral-50 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider mb-1">
              PERIOD
            </label>
            <input
              type="text"
              required
              value={form.period}
              onChange={(e) => setForm({ ...form, period: e.target.value })}
              className="w-full border-2 border-black p-2.5 font-mono text-xs shadow-neo-sm focus:bg-neutral-50 focus:outline-none"
            />
          </div>

          <label
            className="flex items-start gap-3 p-3.5 border-2 border-black shadow-neo-sm bg-neutral-50 hover:bg-[#bef264]/20 cursor-pointer select-none transition-colors"
          >
            <input
              type="checkbox"
              checked={Boolean(form.current)}
              onChange={(e) => {
                const isCurrent = e.target.checked;
                let nextPeriod = form.period;
                if (isCurrent && !form.period.toUpperCase().includes("PRESENT")) {
                  const parts = form.period.split("-");
                  const startYear = parts[0]?.trim() || "2025";
                  nextPeriod = `${startYear} - PRESENT`;
                }
                setForm({ ...form, current: isCurrent, period: nextPeriod });
              }}
              className="w-5 h-5 accent-black cursor-pointer mt-0.5"
            />
            <div className="flex-1">
              <span className="text-xs font-black uppercase tracking-wider">
                CURRENT POSITION (PRESENT JOB)
              </span>
              <p className="font-mono text-[11px] text-neutral-600 mt-0.5">
                Check this if you are currently working in this role. It will display a "PRESENT" badge on your timeline.
              </p>
            </div>
          </label>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider mb-1">
              DESCRIPTION
            </label>
            <textarea
              rows={3}
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border-2 border-black p-2.5 font-mono text-xs shadow-neo-sm resize-none focus:bg-neutral-50 focus:outline-none"
            />
          </div>

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
