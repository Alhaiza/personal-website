import { useState, type ChangeEvent, type FC, type FormEvent } from "react";
import { ArrowUp, ArrowDown, Plus, Trash2, Upload, Code2, CheckCircle2, Star } from "lucide-react";
import { useSiteContent } from "../../context/siteContentContext";
import { useToast } from "../common/toastContext";
import { ConfirmModal } from "../common/ConfirmModal";
import type { SkillItem } from "../../types";

/**
 * Komponen SkillsManager (tab `/dashboard/skills`)
 *
 * Mengelola daftar skill dengan 2 Opsi Input Ikon (Wajib SVG):
 * 1. OPSI A: Copas Raw SVG Code (<svg ...>...</svg>)
 * 2. OPSI B: Upload Berkas .svg (Wajib .svg, otomatis dibaca ke SVG)
 *
 * Mendukung status FEATURED dengan pembatasan kuota maksimal (FEATURED_LIMIT).
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

  // Handler saat admin memilih/upload file .svg dari laptop (Opsi 2)
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi ketat: Wajib format SVG
    const isSvg = file.name.toLowerCase().endsWith(".svg") || file.type === "image/svg+xml";
    if (!isSvg) {
      toast.error("Format berkas ditolak! Anda WAJIB mengunggah file berekstensi .svg", "GAGAL VALIDASI");
      e.target.value = "";
      return;
    }

    if (file.size > 200 * 1024) {
      toast.error("Ukuran berkas SVG terlalu besar (maksimal 200 KB).", "UKURAN DITOLAK");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text && text.includes("<svg")) {
        setSvgCode(text.trim());
        setUploadedFileName(file.name);
        toast.success(`Berkas SVG "${file.name}" berhasil diunggah!`);

        // Otomatis isi nama teknologi jika masih kosong
        if (!name.trim()) {
          const autoName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
          setName(autoName.toUpperCase());
        }
      } else {
        toast.error("Berkas yang diunggah tidak berisi elemen <svg> yang valid.", "KONTEN TIDAK VALID");
      }
    };

    reader.onerror = () => {
      toast.error("Gagal membaca berkas SVG lokal dari laptop.", "SERVER/FILE ERROR");
    };

    reader.readAsText(file);
  };

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Nama teknologi/skill wajib diisi, tidak boleh kosong.", "GAGAL VALIDASI");
      return;
    }

    const cleanSvg = svgCode.trim();
    if (!cleanSvg || !cleanSvg.includes("<svg") || !cleanSvg.includes("</svg>")) {
      toast.error(
        inputMode === "upload"
          ? "Silakan pilih berkas .svg terlebih dahulu!"
          : "Format SVG tidak valid! Pastikan diawali <svg> dan diakhiri </svg>",
        "GAGAL VALIDASI"
      );
      return;
    }

    if (featured && isLimitReached) {
      toast.error(
        `Batas maksimal skill featured (${FEATURED_LIMIT}) sudah tercapai! Hapus centang featured pada skill lain terlebih dahulu.`,
        "LIMIT FEATURED TERCAPAI"
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
      toast.success(`Skill "${newSkill.name}" berhasil disimpan ke Cloud Firestore!`);
    } catch (err: unknown) {
      const errorMsg = (err as Error)?.message || "Terjadi kesalahan saat menyimpan data ke Firestore.";
      if (errorMsg.includes("permission-denied") || errorMsg.includes("insufficient permissions")) {
        toast.error("Izin ditolak oleh Firestore Security Rules. Pastikan Anda telah login sebagai admin.", "PERMISSION DENIED");
      } else if (errorMsg.includes("unavailable") || errorMsg.includes("network")) {
        toast.error("Koneksi jaringan terputus atau server Firestore sedang sibuk.", "NETWORK ERROR");
      } else {
        toast.error(errorMsg, "SERVER ERROR");
      }
    } finally {
      setSaving(false);
    }
  };

  const promptDelete = (id: string, skillName: string) => {
    setConfirmModal({
      isOpen: true,
      skillId: id,
      skillName,
    });
  };

  const handleConfirmDelete = async () => {
    try {
      await updateContent({ skills: skills.filter((s) => s.id !== confirmModal.skillId) });
      toast.success(`Skill "${confirmModal.skillName}" berhasil dihapus.`);
    } catch (err: unknown) {
      toast.error((err as Error).message || "Gagal menghapus skill dari Firestore", "SERVER ERROR");
    } finally {
      setConfirmModal({ isOpen: false, skillId: "", skillName: "" });
    }
  };

  const handleMove = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= skills.length) return;
    try {
      const copy = [...skills];
      [copy[index], copy[target]] = [copy[target], copy[index]];
      await updateContent({ skills: copy });
      toast.info("Urutan keahlian diperbarui.", "URUTAN DIUBAH");
    } catch (err: unknown) {
      toast.error((err as Error).message || "Gagal mengubah urutan", "SERVER ERROR");
    }
  };

  const handleToggleFeatured = async (skill: SkillItem) => {
    const willBeFeatured = !skill.featured;

    // Jika ingin mencentang dan kuota sudah penuh, tolak
    if (willBeFeatured && isLimitReached) {
      toast.error(
        `Maksimal ${FEATURED_LIMIT} skill featured! Hilangkan status featured dari skill lain sebelum mencentang skill ini.`,
        "LIMIT TERCAPAI"
      );
      return;
    }

    try {
      const updated = skills.map((s) =>
        s.id === skill.id ? { ...s, featured: willBeFeatured } : s
      );
      await updateContent({ skills: updated });
      if (willBeFeatured) {
        toast.success(`Skill "${skill.name}" ditandai sebagai Featured (${skills.filter(s => s.id === skill.id || s.featured).length}/${FEATURED_LIMIT})!`);
      } else {
        toast.info(`Status Featured untuk "${skill.name}" dinonaktifkan.`);
      }
    } catch (err: unknown) {
      toast.error((err as Error).message || "Gagal memperbarui status featured", "SERVER ERROR");
    }
  };

  return (
    <div className="space-y-10">
      <div className="pb-6 border-b-2 border-black">
        <h2 className="text-2xl font-black uppercase tracking-tight text-black">SKILLS MANAGER</h2>
        <p className="font-mono text-xs text-neutral-600 mt-1">
          Kelola keahlian teknologi dengan 2 opsi input ikon: <strong>Copas Kode SVG</strong> atau <strong>Upload Berkas .SVG (Wajib SVG)</strong>.
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
            placeholder="contoh: LARAVEL, NUXT.JS, POSTGRESQL, DOCKER"
            className={inputClass}
          />
        </div>

        {/* Pilihan 2 Opsi Tab */}
        <div>
          <label className="block text-xs font-black uppercase tracking-wider mb-2">
            METODE INPUT IKON (WAJIB SVG)
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
              <span>OPSI 1: UPLOAD FILE .SVG</span>
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
              <span>OPSI 2: COPAS KODE SVG</span>
            </button>
          </div>
        </div>

        {/* Tampilan Sesuai Opsi yang Dipilih */}
        <div className="p-5 border-2 border-black bg-neutral-50 space-y-4">
          {inputMode === "upload" ? (
            /* OPSI 1: Upload File .svg (Wajib SVG) */
            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Upload className="w-4 h-4" /> PILIH BERKAS SVG DARI LAPTOP (WAJIB .SVG)
              </label>
              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-black bg-white hover:bg-neutral-100 cursor-pointer transition text-center group">
                <Upload className="w-8 h-8 mb-2 text-neutral-600 group-hover:scale-110 transition-transform" />
                <span className="font-mono text-xs font-black text-black">
                  {uploadedFileName ? `Berkas terpilih: ${uploadedFileName}` : "Klik untuk mencari berkas .svg"}
                </span>
                <span className="font-mono text-[10px] text-neutral-500 mt-1">
                  Hanya menerima file berekstensi .svg (format lain otomatis ditolak)
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
                  <Code2 className="w-4 h-4" /> TEMPEL (COPAS) KODE &lt;SVG&gt;...&lt;/SVG&gt;
                </label>
                {svgCode && (
                  <button
                    type="button"
                    onClick={() => setSvgCode("")}
                    className="text-[10px] font-mono text-rose-600 hover:underline uppercase font-bold"
                  >
                    Kosongkan
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
                <span>{name || "NAMA SKILL"}</span>
                {featured && (
                  <span className="px-1.5 py-0.5 bg-[#bef264] border border-black text-[9px] font-black uppercase">
                    FEATURED
                  </span>
                )}
              </div>
              <div className="text-[10px] font-mono flex items-center gap-1 text-neutral-600 mt-0.5">
                {svgCode && svgCode.includes("<svg") ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> SVG Valid & Siap Ditambahkan
                  </span>
                ) : (
                  <span>Belum ada SVG (Upload atau Copas kode SVG di atas)</span>
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
                    `Batas maksimal featured (${FEATURED_LIMIT}) sudah tercapai!`,
                    "LIMIT PENUH"
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
                  FEATURED SKILL (TAMPILKAN DI BANNER HOME)
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 border border-black font-black uppercase ${
                  isLimitReached ? "bg-[#fb7185] text-black" : "bg-[#bef264] text-black"
                }`}>
                  {featuredCount}/{FEATURED_LIMIT} TERPAKAI
                </span>
              </div>
              <p className="font-mono text-[11px] text-neutral-600 mt-0.5">
                {isLimitReached && !featured
                  ? `Limit maksimal ${FEATURED_LIMIT} featured skill telah tercapai. Hapus featured pada skill lain jika ingin menandai skill baru ini.`
                  : `Skill bertanda featured akan menjadi prioritas utama tampil di Banner Home (maksimal ${FEATURED_LIMIT} skill).`}
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
          <span>{saving ? "MENYIMPAN KE CLOUD..." : "TAMBAH SKILL KE WEBSITE"}</span>
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
              FEATURED DI BANNER:
            </span>
            <span className={`text-xs font-mono font-black px-2 py-0.5 border border-black ${
              isLimitReached ? "bg-[#fb7185] text-black" : "bg-[#bef264] text-black"
            }`}>
              {featuredCount} / {FEATURED_LIMIT} MAKSIMAL
            </span>
          </div>
        </div>

        {skills.length === 0 ? (
          <p className="font-mono text-xs text-neutral-600 font-bold uppercase bg-white border-2 border-black p-6 shadow-neo">
            BELUM ADA SKILL TERDAFTAR.
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
                        ? `Limit featured (${FEATURED_LIMIT}) sudah tercapai!`
                        : skill.featured
                        ? "Hapus dari Featured"
                        : "Jadikan Featured"
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
        title="HAPUS SKILL?"
        message={`Apakah Anda yakin ingin menghapus keahlian "${confirmModal.skillName}" dari banner dan portofolio?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmModal({ isOpen: false, skillId: "", skillName: "" })}
      />
    </div>
  );
};
