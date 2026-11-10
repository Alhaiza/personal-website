import { useState, type ChangeEvent, type FC, type FormEvent } from "react";
import { ArrowUp, ArrowDown, Plus, Trash2, Upload, Code2, CheckCircle2, Star } from "lucide-react";
import { useSiteContent } from "../../context/siteContentContext";
import { useToast } from "../common/toastContext";
import { ConfirmModal } from "../common/ConfirmModal";
import { deleteSkill } from "../../services/firestoreService";
import type { SkillItem } from "../../types";

/**
 * Komponen SkillsManager (tab `/dashboard/skills`)
 *
 * CHEATSHEET & MEDIA PEMBELAJARAN PENGEMBANGAN FITUR SKILLS:
 * 1. DUA OPSI INPUT IKON (WAJIB FORMAT SVG):
 *    - Opsi A (Paste/Copas): Pengguna menyalin markup mentah `<svg>...</svg>`. Cocok untuk ikon dari SimpleIcons / Lucide / BoxIcons.
 *    - Opsi B (Upload File): Menggunakan `FileReader` (`readAsText`) di sisi browser (klien) untuk mengekstrak string XML SVG,
 *      sehingga tidak perlu mengunggah berkas fisik biner ke bucket storage (menghemat kuota Firebase Storage).
 * 2. FITUR FEATURED DENGAN LIMIT KETAT (FEATURED_LIMIT = 6):
 *    - Membatasi kuota skill yang berhak tampil di banner halaman utama (Home) sesuai jumlah kolom grid (6 kolom).
 *    - Terdapat indikator real-time kuota ({featuredCount}/{FEATURED_LIMIT}) serta validasi anti double-check.
 * 3. ARSITEKTUR INTEGRASI CLOUD FIRESTORE:
 *    - Create/Update: Memanggil `updateContent({ skills: [...] })` yang memicu `saveSkill` ke Firestore.
 *    - Delete: WAJIB memanggil `deleteSkill(id)` secara langsung agar dokumen pada koleksi Firestore terhapus tuntas,
 *      bukan hanya memfilter array di state lokal/cache.
 * 4. FEEDBACK LENGKAP NEO-BRUTALISME:
 *    - Menangani validasi ukuran berkas (<200KB), deteksi tag SVG, handling offline/network error, hingga status permission-denied.
 */

type SvgInputMode = "paste" | "upload";

const FEATURED_LIMIT = 6;

const inputClass =
  "w-full border-2 border-black p-3 font-mono text-xs focus:bg-neutral-50 focus:outline-none shadow-neo-sm";

export const SkillsManager: FC = () => {
  const { content, updateContent } = useSiteContent();
  const toast = useToast();
  const skills = content.skills;

  const [name, setName] = useState("");
  const [inputMode, setInputMode] = useState<SvgInputMode>("upload");
  const [svgCode, setSvgCode] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [featured, setFeatured] = useState(false);

  // Hitung jumlah skill yang sedang di-featured
  const featuredCount = skills.filter((s) => s.featured).length;
  const isLimitReached = featuredCount >= FEATURED_LIMIT;

  // State untuk Custom Neo-Brutalism Confirm Modal
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    skillId: string;
    skillName: string;
  }>({
    isOpen: false,
    skillId: "",
    skillName: "",
  });

  const [saving, setSaving] = useState(false);

  // =========================================================================
  // CHEATSHEET 1: FILE READER UNTUK EKSTRAKSI MARKUP SVG DARI FILE LOKAL
  // =========================================================================
  // Handler saat admin memilih/upload file .svg dari laptop (Opsi 2)
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // VALIDASI KETAT 1: Format wajib berekstensi .svg atau MIME image/svg+xml
    const isSvg = file.name.toLowerCase().endsWith(".svg") || file.type === "image/svg+xml";
    if (!isSvg) {
      toast.error("File rejected! You MUST upload an .svg file", "VALIDATION ERROR");
      e.target.value = "";
      return;
    }

    // VALIDASI KETAT 2: Ukuran berkas maksimal 200 KB agar hemat storage & bandwidth
    if (file.size > 200 * 1024) {
      toast.error("SVG file size is too large (max 200 KB).", "SIZE EXCEEDED");
      e.target.value = "";
      return;
    }

    // TEKNIK: Membaca teks XML SVG di browser tanpa upload berkas fisik ke cloud
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text && text.includes("<svg")) {
        setSvgCode(text.trim());
        setUploadedFileName(file.name);
        toast.success(`SVG file "${file.name}" uploaded successfully!`);

        // Otomatis isi nama teknologi dari nama berkas jika input nama masih kosong
        if (!name.trim()) {
          const autoName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
          setName(autoName.toUpperCase());
        }
      } else {
        toast.error("The uploaded file does not contain valid <svg> markup.", "INVALID SVG");
      }
    };

    reader.onerror = () => {
      toast.error("Failed to read local SVG file.", "FILE ERROR");
    };

    reader.readAsText(file);
  };

  // =========================================================================
  // CHEATSHEET 2: PENAMBAHAN SKILL BARU KE CLOUD FIRESTORE
  // =========================================================================
  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Skill / Technology name is required.", "VALIDATION ERROR");
      return;
    }

    const cleanSvg = svgCode.trim();
    if (!cleanSvg || !cleanSvg.includes("<svg") || !cleanSvg.includes("</svg>")) {
      toast.error(
        inputMode === "upload"
          ? "Please choose an .svg file first!"
          : "Invalid SVG format! Ensure it starts with <svg> and ends with </svg>",
        "VALIDATION ERROR"
      );
      return;
    }

    // VALIDASI KUOTA LIMIT: Mencegah featured melebihi batas (FEATURED_LIMIT = 6)
    if (featured && isLimitReached) {
      toast.error(
        `Maximum featured skills limit (${FEATURED_LIMIT}) reached! Please unfeature another skill first.`,
        "LIMIT REACHED"
      );
      return;
    }

    setSaving(true);
    try {
      const newSkill: SkillItem = {
        id: crypto.randomUUID(),
        name: name.trim(),
        iconType: "custom",
        svgCode: cleanSvg,
        featured,
      };

      await updateContent({ skills: [...skills, newSkill] });
      setName("");
      setSvgCode("");
      setUploadedFileName(null);
      setFeatured(false);
      toast.success(`Skill "${newSkill.name}" saved to Cloud Firestore!`);
    } catch (err: unknown) {
      // FEEDBACK ERROR KOMPREHENSIF: Membedakan Permission Denied, Network, dan Server Error
      const errorMsg = (err as Error)?.message || "An error occurred while saving skill to Firestore.";
      if (errorMsg.includes("permission-denied") || errorMsg.includes("insufficient permissions")) {
        toast.error("Permission denied by Firestore Security Rules. Ensure you are signed in as admin.", "PERMISSION DENIED");
      } else if (errorMsg.includes("unavailable") || errorMsg.includes("network")) {
        toast.error("Network connection error or Firestore server unavailable.", "NETWORK ERROR");
      } else {
        toast.error(errorMsg, "SERVER ERROR");
      }
    } finally {
      setSaving(false);
    }
  };

  // =========================================================================
  // CHEATSHEET 3: DIALOG KONFIRMASI HAPUS (NEO-BRUTALISM MODAL)
  // =========================================================================
  const promptDelete = (id: string, skillName: string) => {
    setConfirmModal({
      isOpen: true,
      skillId: id,
      skillName,
    });
  };

  // =========================================================================
  // CHEATSHEET 4: EKSEKUSI PENGHAPUSAN LANGSUNG DARI DOKUMEN FIRESTORE
  // =========================================================================
  const handleConfirmDelete = async () => {
    const { skillId, skillName } = confirmModal;
    setConfirmModal({ isOpen: false, skillId: "", skillName: "" });
    try {
      // WAJIB: Hapus dokumen langsung dari koleksi 'skills' di Firestore
      await deleteSkill(skillId);
      // Sinkronkan state lokal dan update cache
      await updateContent({ skills: skills.filter((s) => s.id !== skillId) });
      toast.success(`Skill "${skillName}" deleted from Cloud Firestore.`);
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to delete skill from Firestore", "SERVER ERROR");
    }
  };

  // =========================================================================
  // CHEATSHEET 5: RE-ORDERING ITEM (SWAP ATAS/BAWAH DALAM ARRAY)
  // =========================================================================
  const handleMove = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= skills.length) return;
    try {
      const copy = [...skills];
      [copy[index], copy[target]] = [copy[target], copy[index]];
      await updateContent({ skills: copy });
      toast.info("Skill order updated.", "ORDER CHANGED");
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to change order", "SERVER ERROR");
    }
  };

  // =========================================================================
  // CHEATSHEET 6: TOGGLE FEATURED DENGAN STRICT LIMIT VALIDATION
  // =========================================================================
  const handleToggleFeatured = async (skill: SkillItem) => {
    const willBeFeatured = !skill.featured;

    // Jika ingin mencentang dan kuota sudah penuh, tolak
    if (willBeFeatured && isLimitReached) {
      toast.error(
        `Maximum ${FEATURED_LIMIT} featured skills allowed! Please unfeature another skill before featuring this one.`,
        "LIMIT REACHED"
      );
      return;
    }

    try {
      const updated = skills.map((s) =>
        s.id === skill.id ? { ...s, featured: willBeFeatured } : s
      );
      await updateContent({ skills: updated });
      if (willBeFeatured) {
        toast.success(`Skill "${skill.name}" marked as Featured (${skills.filter(s => s.id === skill.id || s.featured).length}/${FEATURED_LIMIT})!`);
      } else {
        toast.info(`Featured status for "${skill.name}" disabled.`);
      }
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to update featured status", "SERVER ERROR");
    }
  };

  return (
    <div className="space-y-10">
      <div className="pb-6 border-b-2 border-black">
        <h2 className="text-2xl font-black uppercase tracking-tight text-black">SKILLS MANAGER</h2>
        <p className="font-mono text-xs text-neutral-600 mt-1">
          Manage tech skills with 2 icon input options: <strong>Paste SVG Code</strong> or <strong>Upload .SVG File (SVG Required)</strong>.
        </p>
      </div>

      {/* Form tambah skill baru */}
      <form onSubmit={handleAdd} className="bg-white border-2 border-black p-6 sm:p-8 shadow-neo max-w-3xl space-y-6">
        <h3 className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
          <Plus className="w-4 h-4 stroke-[3]" /> ADD NEW SKILL
        </h3>

        {/* Input Nama Skill */}
        <div>
          <label htmlFor="skill-name" className="block text-xs font-black uppercase tracking-wider mb-2">
            SKILL / TECHNOLOGY NAME
          </label>
          <input
            id="skill-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. LARAVEL, NUXT.JS, POSTGRESQL, DOCKER"
            className={inputClass}
          />
        </div>

        {/* Pilihan 2 Opsi Tab */}
        <div>
          <label className="block text-xs font-black uppercase tracking-wider mb-2">
            ICON INPUT METHOD (SVG REQUIRED)
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setInputMode("upload")}
              className={`p-3 border-2 border-black font-mono text-xs font-black uppercase flex items-center justify-center gap-2 transition cursor-pointer ${
                inputMode === "upload"
                  ? "bg-[#bef264] text-black shadow-neo-sm translate-x-0.5 translate-y-0.5"
                  : "bg-white text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>OPTION 1: UPLOAD .SVG FILE</span>
            </button>

            <button
              type="button"
              onClick={() => setInputMode("paste")}
              className={`p-3 border-2 border-black font-mono text-xs font-black uppercase flex items-center justify-center gap-2 transition cursor-pointer ${
                inputMode === "paste"
                  ? "bg-[#bef264] text-black shadow-neo-sm translate-x-0.5 translate-y-0.5"
                  : "bg-white text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>OPTION 2: PASTE SVG CODE</span>
            </button>
          </div>
        </div>

        {/* Tampilan Sesuai Opsi yang Dipilih */}
        <div className="p-5 border-2 border-black bg-neutral-50 space-y-4">
          {inputMode === "upload" ? (
            /* OPSI 1: Upload File .svg (Wajib SVG) */
            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Upload className="w-4 h-4" /> CHOOSE SVG FILE (.SVG REQUIRED)
              </label>
              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-black bg-white hover:bg-neutral-100 cursor-pointer transition text-center group">
                <Upload className="w-8 h-8 mb-2 text-neutral-600 group-hover:scale-110 transition-transform" />
                <span className="font-mono text-xs font-black text-black">
                  {uploadedFileName ? `Selected file: ${uploadedFileName}` : "Click to browse .svg file"}
                </span>
                <span className="font-mono text-[10px] text-neutral-500 mt-1">
                  Accepts .svg files only (other formats will be rejected)
                </span>
                <input
                  type="file"
                  accept=".svg,image/svg+xml"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            /* OPSI 2: Copas Raw SVG Code */
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="skill-svg-paste" className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                  <Code2 className="w-4 h-4" /> PASTE &lt;SVG&gt;...&lt;/SVG&gt; CODE
                </label>
                {svgCode && (
                  <button
                    type="button"
                    onClick={() => setSvgCode("")}
                    className="text-[10px] font-mono text-rose-600 hover:underline uppercase font-bold"
                  >
                    Clear
                  </button>
                )}
              </div>
              <textarea
                id="skill-svg-paste"
                rows={5}
                required
                value={svgCode}
                onChange={(e) => setSvgCode(e.target.value)}
                placeholder="<svg viewBox='0 0 24 24' fill='currentColor'>...</svg>"
                className={`${inputClass} font-mono text-[11px] resize-y bg-white`}
              />
            </div>
          )}

          {/* Kotak Live Preview Ikon SVG */}
          <div className="p-3 bg-white border-2 border-black flex items-center gap-4 shadow-neo-sm">
            <div className="w-12 h-12 bg-neutral-100 border-2 border-black flex items-center justify-center p-1.5 text-black">
              {svgCode && svgCode.includes("<svg") ? (
                <div
                  className="w-8 h-8 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:fill-current [&>svg]:stroke-current"
                  dangerouslySetInnerHTML={{ __html: svgCode }}
                />
              ) : (
                <span className="font-mono text-[9px] text-neutral-400 font-bold text-center">NO SVG</span>
              )}
            </div>
            <div className="flex-1">
              <div className="text-xs font-black uppercase flex items-center gap-2">
                <span>{name || "SKILL NAME"}</span>
                {featured && (
                  <span className="px-1.5 py-0.5 bg-[#bef264] border border-black text-[9px] font-black uppercase">
                    FEATURED
                  </span>
                )}
              </div>
              <div className="text-[10px] font-mono flex items-center gap-1 text-neutral-600 mt-0.5">
                {svgCode && svgCode.includes("<svg") ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> SVG Valid &amp; Ready to Add
                  </span>
                ) : (
                  <span>No SVG provided yet (Upload or paste SVG code above)</span>
                )}
              </div>
            </div>
          </div>

          {/* Opsi Featured Skill dengan Batasan Limit */}
          <label
            htmlFor="skill-featured"
            className={`flex items-start gap-3 p-3.5 border-2 border-black shadow-neo-sm select-none transition-colors ${
              isLimitReached && !featured
                ? "bg-neutral-100 opacity-60 cursor-not-allowed"
                : "bg-neutral-50 hover:bg-[#bef264]/20 cursor-pointer"
            }`}
          >
            <input
              id="skill-featured"
              type="checkbox"
              checked={featured}
              disabled={isLimitReached && !featured}
              onChange={(e) => {
                if (e.target.checked && isLimitReached) {
                  toast.error(
                    `Maximum featured limit (${FEATURED_LIMIT}) reached!`,
                    "LIMIT FULL"
                  );
                  return;
                }
                setFeatured(e.target.checked);
              }}
              className="w-5 h-5 accent-black cursor-pointer disabled:cursor-not-allowed mt-0.5"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider">
                  FEATURED SKILL (DISPLAY ON HOME BANNER)
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 border border-black font-black uppercase ${
                  isLimitReached ? "bg-[#fb7185] text-black" : "bg-[#bef264] text-black"
                }`}>
                  {featuredCount}/{FEATURED_LIMIT} USED
                </span>
              </div>
              <p className="font-mono text-[11px] text-neutral-600 mt-0.5">
                {isLimitReached && !featured
                  ? `Maximum ${FEATURED_LIMIT} featured skills limit reached. Unfeature another skill to feature this new one.`
                  : `Featured skills will be prioritized on the Home banner (maximum ${FEATURED_LIMIT} skills).`}
              </p>
            </div>
          </label>
        </div>

        {/* Tombol Submit Tambah Skill */}
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#6366f1] text-white hover:bg-[#4f46e5] disabled:opacity-50 border-2 border-black shadow-neo text-xs font-black uppercase tracking-wider cursor-pointer transition-all duration-100 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{saving ? "SAVING TO CLOUD..." : "ADD SKILL TO WEBSITE"}</span>
        </button>
      </form>

      {/* Daftar kartu skill yang sudah ada */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <h3 className="text-sm font-black uppercase tracking-wider">
            EXISTING SKILLS ({skills.length})
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold uppercase text-neutral-600">
              FEATURED IN BANNER:
            </span>
            <span className={`text-xs font-mono font-black px-2 py-0.5 border border-black ${
              isLimitReached ? "bg-[#fb7185] text-black" : "bg-[#bef264] text-black"
            }`}>
              {featuredCount} / {FEATURED_LIMIT} MAX
            </span>
          </div>
        </div>

        {skills.length === 0 ? (
          <p className="font-mono text-xs text-neutral-600 font-bold uppercase bg-white border-2 border-black p-6 shadow-neo">
            NO SKILLS REGISTERED YET.
          </p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {skills.map((skill, index) => (
              <li key={skill.id} className="bg-white border-2 border-black p-4 shadow-neo flex flex-col justify-between gap-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="w-7 h-7 bg-[#bef264] border-2 border-black flex items-center justify-center font-mono text-xs font-black shrink-0">
                    {index + 1}
                  </span>
                  
                  {/* Preview Icon */}
                  <div className="w-8 h-8 bg-neutral-100 border border-black flex items-center justify-center p-1 text-black shrink-0">
                    {skill.svgCode ? (
                      <div
                        className="w-6 h-6 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:fill-current [&>svg]:stroke-current"
                        dangerouslySetInnerHTML={{ __html: skill.svgCode }}
                      />
                    ) : (
                      <span className="font-mono text-[9px] font-black">{skill.name.slice(0, 2)}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-sm uppercase text-black truncate">{skill.name}</h4>
                  </div>

                  {/* Tombol Toggle Featured Per Item */}
                  <button
                    type="button"
                    onClick={() => handleToggleFeatured(skill)}
                    disabled={isLimitReached && !skill.featured}
                    title={
                      isLimitReached && !skill.featured
                        ? `Featured limit (${FEATURED_LIMIT}) reached!`
                        : skill.featured
                        ? "Remove from Featured"
                        : "Mark as Featured"
                    }
                    className={`shrink-0 px-2 py-1 border border-black text-[10px] font-black uppercase flex items-center gap-1 transition-all ${
                      skill.featured
                        ? "bg-[#bef264] text-black hover:bg-neutral-200"
                        : isLimitReached
                        ? "bg-neutral-100 text-neutral-400 opacity-50 cursor-not-allowed border-neutral-300"
                        : "bg-white text-neutral-600 hover:bg-[#bef264] hover:text-black cursor-pointer shadow-neo-sm"
                    }`}
                  >
                    <Star className={`w-3 h-3 ${skill.featured ? "fill-black" : ""}`} />
                    <span>{skill.featured ? "FEATURED" : "+ FEATURE"}</span>
                  </button>
                </div>

                <div className="flex items-center justify-between pt-3 border-t-2 border-dashed border-neutral-300">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleMove(index, -1)}
                      disabled={index === 0}
                      aria-label={`Move up ${skill.name}`}
                      className="w-8 h-8 border-2 border-black bg-white hover:bg-[#bef264] shadow-neo-sm flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMove(index, 1)}
                      disabled={index === skills.length - 1}
                      aria-label={`Move down ${skill.name}`}
                      className="w-8 h-8 border-2 border-black bg-white hover:bg-[#bef264] shadow-neo-sm flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => promptDelete(skill.id, skill.name)}
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

      {/* Neo-Brutalism Modal Konfirmasi Hapus Skill */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="DELETE SKILL?"
        message={`Are you sure you want to delete skill "${confirmModal.skillName}" from the banner and portfolio?`}
        confirmLabel="YES, DELETE NOW"
        cancelLabel="CANCEL"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmModal({ isOpen: false, skillId: "", skillName: "" })}
      />
    </div>
  );
};
