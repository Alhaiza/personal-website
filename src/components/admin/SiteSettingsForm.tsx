import { useState, type ChangeEvent, type FC, type FormEvent } from "react";
import { Save, CheckCircle2, Globe } from "lucide-react";
import { mockSiteSettings } from "../../data/mockData";
import type { SiteSettings } from "../../types";

/**
 * Komponen SiteSettingsForm (tab `/dashboard/settings`)
 *
 * Mengelola teks & aset global yang sebelumnya TERTULIS LANGSUNG di kode (hardcode):
 * nama brand, teks footer, judul CTA, badge, dan URL resume.
 * Data masih di STATE LOKAL; nanti diganti pemanggilan Firestore.
 *
 * Konsep React yang dipelajari:
 * - Satu objek state untuk seluruh form (`form`) + satu handler `handleChange`.
 * - Atribut `name` pada input = nama properti di objek state.
 * - Field di bawah diberi label "Tampil di" supaya jelas efeknya di halaman publik.
 */

// Definisi field dibuat sebagai data agar JSX tidak berulang (prinsip DRY).
// `multiline: true` -> dirender sebagai <textarea>, selain itu <input>.
const fields: {
  name: keyof SiteSettings;
  label: string;
  hint: string; // keterangan "tampil di mana"
  placeholder: string;
  multiline?: boolean;
}[] = [
  { name: "brandName", label: "BRAND NAME", hint: "Tampil di: Navbar & Footer", placeholder: "JOSHUA DEV" },
  { name: "footerText", label: "FOOTER COPYRIGHT TEXT", hint: "Tampil di: Footer", placeholder: "© 2026 Nama Anda. All rights reserved." },
  { name: "ctaHeadline", label: "CTA HEADLINE", hint: "Tampil di: kotak ungu di bagian bawah Home", placeholder: "LET'S BUILD SOMETHING AMAZING TOGETHER.", multiline: true },
  { name: "ctaBadge", label: "CTA BADGE", hint: "Tampil di: stiker di kotak CTA", placeholder: "AVAILABLE NOW" },
  { name: "resumeUrl", label: "RESUME PDF URL", hint: "Tampil di: tombol Download Resume & View Full Resume", placeholder: "/resume.pdf" },
];

const inputClass =
  "w-full border-2 border-black p-3 font-mono text-xs focus:bg-neutral-50 focus:outline-none shadow-neo-sm";

export const SiteSettingsForm: FC = () => {
  const [form, setForm] = useState<SiteSettings>(mockSiteSettings);
  const [saved, setSaved] = useState(false);

  // Handler umum untuk <input> maupun <textarea>
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value })); // perbarui hanya field yang berubah
    setSaved(false);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO (Firestore): simpan `form` ke dokumen pengaturan di sini.
    console.log("Pengaturan umum (simulasi simpan):", form);
    setSaved(true);
  };

  return (
    <div>
      <div className="pb-6 mb-8 border-b-2 border-black">
        <h2 className="text-2xl font-black uppercase tracking-tight text-black">GENERAL SETTINGS</h2>
        <p className="font-mono text-xs text-neutral-600 mt-1">
          Teks dan aset global yang dipakai di banyak halaman publik.
        </p>
      </div>

      {saved && (
        <div className="mb-6 p-4 border-2 border-black shadow-neo bg-[#bef264] flex items-center gap-3 font-mono text-xs font-bold max-w-3xl">
          <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
          <span>Perubahan tersimpan (simulasi lokal, belum ke Firestore).</span>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 items-start">
        <form onSubmit={handleSubmit} className="xl:col-span-3 bg-white border-2 border-black p-6 sm:p-8 shadow-neo space-y-6">
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
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#bef264] hover:bg-[#a3e635] border-2 border-black shadow-neo text-xs font-black uppercase tracking-wider cursor-pointer transition-all duration-100 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          >
            <Save className="w-4 h-4 stroke-[2.5]" />
            <span>SAVE CHANGES</span>
          </button>
        </form>

        {/* Pratinjau mini: meniru Navbar, CTA, dan Footer dari nilai form yang sedang diketik */}
        <aside className="xl:col-span-2 space-y-4" aria-label="Pratinjau">
          <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
            <Globe className="w-3.5 h-3.5" /> LIVE PREVIEW
          </p>

          <div className="border-2 border-black bg-white shadow-neo-sm">
            <div className="bg-[#bef264] border-b-2 border-black px-4 py-2 font-mono text-xs font-black uppercase">
              &lt;/&gt; {form.brandName || "-"}
            </div>

            <div className="relative overflow-hidden bg-[#6366f1] p-5 text-white">
              <p className="text-lg font-black uppercase leading-tight break-words">{form.ctaHeadline || "-"}</p>
              <span className="inline-block mt-4 px-2 py-1 bg-[#fb7185] text-black border-2 border-black font-mono text-[10px] font-black uppercase rotate-3">
                {form.ctaBadge || "-"}
              </span>
            </div>

            <div className="px-4 py-2 border-t-2 border-black font-mono text-[11px] break-words">
              {form.footerText || "-"}
            </div>
          </div>

          <p className="font-mono text-[11px] text-neutral-600 break-all">
            Resume: <span className="font-bold">{form.resumeUrl || "-"}</span>
          </p>
        </aside>
      </div>
    </div>
  );
};

