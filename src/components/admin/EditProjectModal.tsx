import { useState, type FC, type FormEvent } from "react";
import { X, Save, Edit3 } from "lucide-react";
import { AssetInput } from "./AssetInput";
import { RichTextEditor } from "../common/RichTextEditor";
import { NeoButton } from "../common/NeoButton";
import { useToast } from "../common/toastContext";
import type { ProjectItem } from "../../types";

/**
 * Komponen EditProjectModal (Neo-Brutalism Dialog Edit Proyek)
 * 
 * Mengizinkan admin memperbarui judul, deskripsi, tag, dan tautan URL gambar
 * (misalnya mengarahkan ke path gambar lokal /uploads/... yang sudah di-deploy).
 */

interface EditProjectModalProps {
  project: ProjectItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: ProjectItem) => Promise<void> | void;
  featuredLimit: number;
  currentFeaturedCount: number;
}

export const EditProjectModal: FC<EditProjectModalProps> = ({
  project,
  isOpen,
  onClose,
  onSave,
  featuredLimit,
  currentFeaturedCount,
}) => {
  const toast = useToast();

  if (!isOpen || !project) return null;

  return (
    <EditProjectModalContent
      key={project.id}
      project={project}
      onClose={onClose}
      onSave={onSave}
      toast={toast}
      featuredLimit={featuredLimit}
      currentFeaturedCount={currentFeaturedCount}
    />
  );
};

interface ContentProps extends Omit<EditProjectModalProps, "isOpen"> {
  project: ProjectItem;
  toast: ReturnType<typeof useToast>;
}

const EditProjectModalContent: FC<ContentProps> = ({
  project,
  onClose,
  onSave,
  toast,
  featuredLimit,
  currentFeaturedCount,
}) => {
  const [form, setForm] = useState<ProjectItem>({ ...project });
  const [tagsText, setTagsText] = useState<string>(project.tags.join(", "));
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);

  // Periksa apakah kuota featured penuh dan proyek ini belum di-featured
  const isLimitReached = currentFeaturedCount >= featuredLimit && !project.featured;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (uploadingImage) {
      toast.error("Please wait until thumbnail image finishes uploading.", "UPLOADING");
      return;
    }
    if (!form.title.trim()) {
      toast.error("Project title cannot be empty.", "VALIDATION ERROR");
      return;
    }

    if (form.featured && isLimitReached) {
      toast.error(
        `Maximum limit of ${featuredLimit} featured projects reached!`,
        "LIMIT REACHED"
      );
      return;
    }

    const parsedTags = tagsText
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    setSaving(true);
    try {
      await onSave({
        ...form,
        tags: parsedTags,
      });
      toast.success(`Project "${form.title}" updated successfully!`);
      onClose();
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to update project");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border-2 border-black p-6 sm:p-8 shadow-neo-lg text-black font-sans my-8">
        {/* Tombol Tutup Silang di Kanan Atas */}
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
            <h3 className="text-xl font-black uppercase tracking-tight">EDIT PROJECT</h3>
            <p className="font-mono text-xs text-neutral-600">
              Update project details, live links, and cover image path.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider mb-1">
              PROJECT TITLE
            </label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border-2 border-black p-2.5 font-mono text-xs shadow-neo-sm focus:bg-neutral-50 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider mb-1">
              ABOUT PROJECT (SHORT SUMMARY)
            </label>
            <textarea
              rows={3}
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Short introductory summary before detailed product breakdown..."
              className="w-full border-2 border-black p-2.5 font-mono text-xs shadow-neo-sm resize-none focus:bg-neutral-50 focus:outline-none"
            />
          </div>

          <RichTextEditor
            id="edit-project-content"
            label="PRODUCT DETAILS & ARCHITECTURE (WYSIWYG CONTENT)"
            value={form.content || ""}
            onChange={(html) => setForm({ ...form, content: html })}
            placeholder="Write rich formatted product overview, system architecture, engineering challenges, screenshots, lists..."
            minHeight="220px"
          />

          <div>
            <label className="block text-xs font-black uppercase tracking-wider mb-1">
              TAGS (COMMA SEPARATED)
            </label>
            <input
              type="text"
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              className="w-full border-2 border-black p-2.5 font-mono text-xs shadow-neo-sm focus:bg-neutral-50 focus:outline-none"
            />
          </div>

          <AssetInput
            id="edit-project-image"
            label="COVER IMAGE URL"
            hint="Enter public path (e.g. /uploads/your-image.png) or choose a new file."
            kind="image"
            folder="projects"
            required
            value={form.imageUrl}
            onChange={(val) => setForm({ ...form, imageUrl: val })}
            onUploadingChange={setUploadingImage}
            placeholder="/uploads/... or https://..."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-1">
                LIVE DEMO URL
              </label>
              <input
                type="url"
                value={form.projectUrl || ""}
                onChange={(e) => setForm({ ...form, projectUrl: e.target.value })}
                placeholder="https://your-project.com"
                className="w-full border-2 border-black p-2.5 font-mono text-xs shadow-neo-sm focus:bg-neutral-50 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-1">
                GITHUB REPO URL
              </label>
              <input
                type="url"
                value={form.githubUrl || ""}
                onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                placeholder="https://github.com/user/repo"
                className="w-full border-2 border-black p-2.5 font-mono text-xs shadow-neo-sm focus:bg-neutral-50 focus:outline-none"
              />
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
                    `Maximum limit of ${featuredLimit} featured projects reached!`,
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
                  FEATURED PROJECT (DISPLAY IN HOME CAROUSEL)
                </span>
              </div>
              <p className="font-mono text-[11px] text-neutral-600 mt-0.5">
                Prioritize this project card in the Home section carousel.
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
              disabled={saving || uploadingImage}
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
