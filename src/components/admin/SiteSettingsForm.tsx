import { useState, type ChangeEvent, type FC, type FormEvent } from "react";
import { Save, Globe, Loader2 } from "lucide-react";
import { useSiteContent } from "../../context/siteContentContext";
import { useToast } from "../common/toastContext";
import { AssetInput } from "./AssetInput";
import type { SiteSettings } from "../../types";

/**
 * Komponen SiteSettingsForm (tab `/dashboard/settings`)
 *
 * Mengelola teks & aset global yang disimpan ke `SiteContentContext`.
 * Setiap perubahan langsung memicu pembaruan pada Navbar, Footer, Hero, dan Experience.
 */

const fields: {
  name: keyof SiteSettings;
  label: string;
  hint: string;
  placeholder: string;
  multiline?: boolean;
}[] = [
  { name: "brandName", label: "BRAND NAME", hint: "Tampil di: Navbar & Footer", placeholder: "JOSHUA DEV" },
  { name: "footerText", label: "FOOTER COPYRIGHT TEXT", hint: "Tampil di: Footer", placeholder: "© 2026 Nama Anda. All rights reserved." },
  { name: "ctaHeadline", label: "CTA HEADLINE", hint: "Tampil di: kotak ungu di bagian bawah Home", placeholder: "LET'S BUILD SOMETHING AMAZING TOGETHER.", multiline: true },
  { name: "ctaBadge", label: "CTA BADGE", hint: "Tampil di: stiker di kotak CTA", placeholder: "AVAILABLE NOW" },
];

const inputClass =
  "w-full border-2 border-black p-3 font-mono text-xs focus:bg-neutral-50 focus:outline-none shadow-neo-sm";

export const SiteSettingsForm: FC = () => {
  const { content, updateContent } = useSiteContent();
  const toast = useToast();
  const [form, setForm] = useState<SiteSettings>(content.settings);

  // Status apakah ada aset yang sedang aktif diunggah ke Firebase Storage
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const isAnyUploading = uploadingProfile || uploadingResume;

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isAnyUploading) {
      toast.error("Harap tunggu hingga proses unggah berkas selesai.", "TUNGGU UNGGAHAN");
      return;
    }

    try {
      updateContent({ settings: form });
      toast.success("Pengaturan umum berhasil disimpan dan langsung aktif di seluruh website!");
    } catch (err: unknown) {
      toast.error((err as Error).message || "Gagal menyimpan pengaturan umum");
    }
  };

  return (
    <div>
      <div className="pb-6 mb-8 border-b-2 border-black">
        <h2 className="text-2xl font-black uppercase tracking-tight text-black">GENERAL SETTINGS</h2>
        <p className="font-mono text-xs text-neutral-600 mt-1">
          Teks dan aset global yang dipakai di banyak halaman publik (Brand, Footer, CTA, dan Aset Hero).
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 items-start">
        <form onSubmit={handleSubmit} className="xl:col-span-3 bg-white border-2 border-black p-6 sm:p-8 shadow-neo space-y-6">
          {/* Grup Aset Hero */}
          <fieldset className="space-y-6">
            <legend className="text-sm font-black uppercase tracking-wider mb-4">HERO ASSETS</legend>

            <AssetInput
              id="profileImageUrl"
              label="PROFILE PICTURE URL"
              hint="Tampil di: foto besar pada bagian Hero"
              kind="image"
              folder="profiles"
              square
              value={form.profileImageUrl}
              onChange={(value) => setForm((prev) => ({ ...prev, profileImageUrl: value }))}
              onDeleteAsset={() => {
                const nextSettings = { ...form, profileImageUrl: "" };
                setForm(nextSettings);
                updateContent({ settings: nextSettings });
                toast.success("Foto profil dihapus dari database & penyimpanan.");
              }}
              onUploadingChange={setUploadingProfile}
              placeholder="https://... atau /foto-profil.jpg"
            />

            <AssetInput
              id="resumeUrl"
              label="RESUME FILE URL"
              hint="Tampil di: tombol Download Resume (Hero) & View Full Resume (Experience)"
              kind="file"
              folder="resumes"
              value={form.resumeUrl}
              onChange={(value) => setForm((prev) => ({ ...prev, resumeUrl: value }))}
              onDeleteAsset={() => {
                const nextSettings = { ...form, resumeUrl: "" };
                setForm(nextSettings);
                updateContent({ settings: nextSettings });
                toast.success("File resume dihapus dari database & penyimpanan.");
              }}
              onUploadingChange={setUploadingResume}
              placeholder="/resume.pdf"
            />
          </fieldset>

          {/* Kolom Teks Pengaturan */}
          {fields.map((f) => (
            <div key={f.name}>
              <label htmlFor={f.name} className="block text-xs font-black uppercase tracking-wider mb-1">
                {f.label}
              </label>
              <p className="font-mono text-[11px] text-neutral-500 mb-2">{f.hint}</p>
              {f.multiline ? (
                <textarea
                  id={f.name}
                  name={f.name}
                  rows={3}
                  required
                  value={form[f.name]}
                  onChange={handleChange}
                  placeholder={f.placeholder}
                  className={`${inputClass} resize-none`}
                />
              ) : (
                <input
                  id={f.name}
                  name={f.name}
                  type="text"
                  required
                  value={form[f.name]}
                  onChange={handleChange}
                  placeholder={f.placeholder}
                  className={inputClass}
                />
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={isAnyUploading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#bef264] hover:bg-[#a3e635] border-2 border-black shadow-neo text-xs font-black uppercase tracking-wider cursor-pointer transition-all duration-100 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnyUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin stroke-[2.5]" />
                <span>MENGUNGGAH BERKAS...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 stroke-[2.5]" />
                <span>SAVE CHANGES</span>
              </>
            )}
          </button>
        </form>

        {/* Pratinjau Mini */}
        <aside className="xl:col-span-2 space-y-4" aria-label="Pratinjau">
          <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
            <Globe className="w-3.5 h-3.5" /> LIVE PREVIEW
          </p>

          <div className="border-2 border-black bg-white shadow-neo-sm">
            <div className="bg-[#bef264] border-b-2 border-black px-4 py-2 font-mono text-xs font-black uppercase">
              &lt;/&gt; {form.brandName || "-"}
            </div>

            <div className="relative overflow-hidden bg-[#6366f1] p-5 text-white">
              <p className="text-lg font-black uppercase leading-tight break-words whitespace-pre-line">{form.ctaHeadline || "-"}</p>
              <span className="inline-block mt-4 px-2 py-1 bg-[#fb7185] text-black border-2 border-black font-mono text-[10px] font-black uppercase rotate-3">
                {form.ctaBadge || "-"}
              </span>
            </div>

            <div className="px-4 py-2 border-t-2 border-black font-mono text-[11px] break-words">
              {form.footerText || "-"}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
