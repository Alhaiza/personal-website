import { useState, type FC, type FormEvent } from "react";
import { X, Save, Edit3 } from "lucide-react";
import { AssetInput } from "./AssetInput";
import { NeoButton } from "../common/NeoButton";
import { useToast } from "../common/toastContext";
import type { CertificationItem } from "../../types";

/**
 * Komponen EditCertificationModal (Neo-Brutalism Dialog Edit Sertifikasi)
 * 
 * Mengizinkan admin mengedit nama sertifikat, penerbit, deskripsi, credential URL,
 * dan URL/path thumbnail gambar sertifikat.
 */

interface EditCertificationModalProps {
  certification: CertificationItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: CertificationItem) => Promise<void> | void;
  featuredLimit: number;
  currentFeaturedCount: number;
}

export const EditCertificationModal: FC<EditCertificationModalProps> = ({
  certification,
  isOpen,
  onClose,
  onSave,
  featuredLimit,
  currentFeaturedCount,
}) => {
  const toast = useToast();

  if (!isOpen || !certification) return null;

  return (
    <EditCertificationModalContent
      key={certification.id}
      certification={certification}
      onClose={onClose}
      onSave={onSave}
      toast={toast}
      featuredLimit={featuredLimit}
      currentFeaturedCount={currentFeaturedCount}
    />
  );
};

interface ContentProps extends Omit<EditCertificationModalProps, "isOpen"> {
  certification: CertificationItem;
  toast: ReturnType<typeof useToast>;
}

const EditCertificationModalContent: FC<ContentProps> = ({
  certification,
  onClose,
  onSave,
  toast,
  featuredLimit,
  currentFeaturedCount,
}) => {
  const [form, setForm] = useState<CertificationItem>({ ...certification });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);

  // Batasan featured
  const isLimitReached = currentFeaturedCount >= featuredLimit && !certification.featured;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (uploadingImage) {
      toast.error("Please wait until certificate image finishes uploading.", "UPLOADING");
      return;
    }
    if (!form.title.trim()) {
      toast.error("Certificate name cannot be empty.", "VALIDATION ERROR");
      return;
    }

    if (form.featured && isLimitReached) {
      toast.error(
        `Maximum limit of ${featuredLimit} featured certifications reached!`,
        "LIMIT REACHED"
      );
      return;
    }

    setSaving(true);
    try {
      await onSave(form);
      toast.success(`Certification "${form.title}" updated successfully!`);
      onClose();
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to update certification");
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
            <h3 className="text-xl font-black uppercase tracking-tight">EDIT CERTIFICATION</h3>
            <p className="font-mono text-xs text-neutral-600">
              Update certificate details, verification links, and image thumbnail path.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider mb-1">
              CERTIFICATE NAME
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
              ISSUER
            </label>
            <input
              type="text"
              required
              value={form.issuer || ""}
              onChange={(e) => setForm({ ...form, issuer: e.target.value })}
              className="w-full border-2 border-black p-2.5 font-mono text-xs shadow-neo-sm focus:bg-neutral-50 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider mb-1">
              DESCRIPTION
            </label>
            <textarea
              rows={2}
              value={form.description || ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border-2 border-black p-2.5 font-mono text-xs shadow-neo-sm resize-none focus:bg-neutral-50 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider mb-1">
              CREDENTIAL VERIFICATION URL
            </label>
            <input
              type="url"
              value={form.credentialUrl || ""}
              onChange={(e) => setForm({ ...form, credentialUrl: e.target.value })}
              placeholder="https://verify.example.com/..."
              className="w-full border-2 border-black p-2.5 font-mono text-xs shadow-neo-sm focus:bg-neutral-50 focus:outline-none"
            />
          </div>

          <AssetInput
            id="edit-cert-image"
            label="CERTIFICATE IMAGE URL"
            hint="Enter public path (e.g. /uploads/cert.png) or choose a new file."
            kind="image"
            folder="certifications"
            value={form.imageUrl || ""}
            onChange={(val) => setForm({ ...form, imageUrl: val })}
            onUploadingChange={setUploadingImage}
            placeholder="/uploads/... or https://..."
          />

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
                    `Maximum limit of ${featuredLimit} featured certifications reached!`,
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
                  FEATURED CERTIFICATION (DISPLAY ON HOME)
                </span>
              </div>
              <p className="font-mono text-[11px] text-neutral-600 mt-0.5">
                Prioritize this certificate in the Home certifications section.
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
