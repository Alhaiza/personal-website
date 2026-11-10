import { useState, type ChangeEvent, type FC, type FormEvent } from "react";
import { Mail, MapPin, Save, CheckCircle2, Link2 } from "lucide-react";
import { useSiteContent } from "../../context/siteContentContext";
import type { ContactSettings } from "../../types";

/**
 * Komponen ContactSettingsForm
 *
 * Mengelola informasi kontak & tautan sosial media yang tersimpan langsung
 * di `SiteContentContext` (dan dipersistensikan ke localStorage).
 * 
 * Begitu tombol "SAVE CHANGES" ditekan, perubahan langsung aktif secara realtime
 * di seluruh halaman publik (Navbar, Footer, Hero, dan Contact).
 */

const socialFields: { name: keyof ContactSettings; label: string; placeholder: string }[] = [
  { name: "github", label: "GITHUB URL", placeholder: "https://github.com/username" },
  { name: "linkedin", label: "LINKEDIN URL", placeholder: "https://linkedin.com/in/username" },
  { name: "twitter", label: "TWITTER / X URL", placeholder: "https://x.com/username" },
  { name: "customEmailLink", label: "CUSTOM EMAIL LINK", placeholder: "mailto:nama@email.com" },
];

const inputClass =
  "w-full border-2 border-black p-3 font-mono text-xs focus:bg-neutral-50 focus:outline-none shadow-neo-sm";

export const ContactSettingsForm: FC = () => {
  const { content, updateContent } = useSiteContent();
  const [form, setForm] = useState<ContactSettings>(content.contact);
  const [saved, setSaved] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    updateContent({ contact: form });
    setSaved(true);
  };

  return (
    <div>
      <div className="pb-6 mb-8 border-b-2 border-black">
        <h2 className="text-2xl font-black uppercase tracking-tight text-black">
          CONTACT &amp; SOCIAL
        </h2>
        <p className="font-mono text-xs text-neutral-600 mt-1">
          Atur informasi kontak dan tautan sosial media terpusat yang tampil di halaman publik (Hero, Footer, dan Halaman Kontak).
        </p>
      </div>

      {saved && (
        <div className="mb-6 p-4 border-2 border-black shadow-neo bg-[#bef264] flex items-center gap-3 font-mono text-xs font-bold max-w-3xl">
          <CheckCircle2 className="w-5 h-5 text-black stroke-[2.5]" />
          <span>Pengaturan kontak berhasil disimpan dan langsung aktif di seluruh website!</span>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 items-start">
        <form
          onSubmit={handleSubmit}
          className="xl:col-span-3 bg-white border-2 border-black p-6 sm:p-8 shadow-neo space-y-8"
        >
          {/* Bagian 1: Kontak Langsung */}
          <fieldset className="space-y-5">
            <legend className="flex items-center gap-2 text-sm font-black uppercase tracking-wider mb-4">
              <span className="w-7 h-7 bg-[#fb7185] border-2 border-black flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </span>
              DIRECT CONTACT
            </legend>

            <div>
              <label htmlFor="email" className="block text-xs font-black uppercase tracking-wider mb-2">
                EMAIL ADDRESS
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="nama@email.com"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="location" className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider mb-2">
                <MapPin className="w-3.5 h-3.5" />
                LOCATION / ADDRESS
              </label>
              <input
                id="location"
                name="location"
                type="text"
                required
                value={form.location}
                onChange={handleChange}
                placeholder="Jakarta, Indonesia"
                className={inputClass}
              />
            </div>
          </fieldset>

          {/* Bagian 2: Tautan Sosial */}
          <fieldset className="space-y-5">
            <legend className="flex items-center gap-2 text-sm font-black uppercase tracking-wider mb-4">
              <span className="w-7 h-7 bg-[#bef264] border-2 border-black flex items-center justify-center">
                <Link2 className="w-4 h-4" />
              </span>
              SOCIAL MEDIA LINKS
            </legend>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {socialFields.map((field) => (
                <div key={field.name}>
                  <label
                    htmlFor={field.name}
                    className="block text-xs font-black uppercase tracking-wider mb-2"
                  >
                    {field.label}
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    type="text"
                    value={form[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className={inputClass}
                  />
                </div>
              ))}
            </div>
          </fieldset>

          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#bef264] hover:bg-[#a3e635] border-2 border-black shadow-neo text-xs font-black uppercase tracking-wider cursor-pointer transition-all duration-100 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          >
            <Save className="w-4 h-4 stroke-[2.5]" />
            <span>SAVE CHANGES</span>
          </button>
        </form>

        {/* Kartu Live Preview */}
        <aside className="xl:col-span-2 bg-[#6366f1] bg-grid-pattern border-2 border-black p-6 shadow-neo text-black">
          <p className="text-[10px] font-black uppercase tracking-widest text-white mb-3">
            LIVE PREVIEW
          </p>
          <div className="bg-white border-2 border-black p-5 shadow-neo-sm font-mono text-xs space-y-3 break-words">
            <p className="font-bold">{form.email || "-"}</p>
            <p className="font-bold">{form.location || "-"}</p>
            <hr className="border-t-2 border-dashed border-neutral-300" />
            {socialFields.map((field) => (
              <p key={field.name} className="text-neutral-700">
                <span className="font-black">{field.label.split(" ")[0]}:</span>{" "}
                {form[field.name] || "-"}
              </p>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};
