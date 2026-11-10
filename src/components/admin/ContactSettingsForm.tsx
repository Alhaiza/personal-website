import { useState, type ChangeEvent, type FC, type FormEvent } from "react";
import { Mail, MapPin, Save, CheckCircle2, Link2 } from "lucide-react";
import { mockContactSettings } from "../../data/mockData";
import type { ContactSettings } from "../../types";

/**
 * Komponen ContactSettingsForm
 *
 * Form untuk mengelola informasi kontak & tautan sosial media.
 * Ini adalah SATU-SATUNYA tempat mengedit tautan sosial (menu Profile tidak lagi punya
 * input sosial), sehingga tidak ada dua sumber data yang bisa saling bertentangan.
 * Untuk sementara data hanya disimpan di STATE LOKAL (memori browser),
 * belum dikirim ke Firestore. Nanti bagian `handleSubmit` tinggal diganti
 * dengan pemanggilan fungsi service Firestore.
 *
 * Konsep React yang dipelajari di sini:
 * 1. useState        -> menyimpan nilai form (data yang sedang diedit).
 * 2. Controlled input -> value input diambil dari state, dan onChange memperbarui state.
 * 3. Satu handler untuk banyak input -> memakai atribut `name` pada input.
 * 4. onSubmit + preventDefault -> mencegah browser me-reload halaman saat form dikirim.
 */

// Daftar field tautan sosial media. Dibuat sebagai array agar JSX tidak berulang-ulang (prinsip DRY).
const socialFields: { name: keyof ContactSettings; label: string; placeholder: string }[] = [
  { name: "github", label: "GITHUB URL", placeholder: "https://github.com/username" },
  { name: "linkedin", label: "LINKEDIN URL", placeholder: "https://linkedin.com/in/username" },
  { name: "twitter", label: "TWITTER / X URL", placeholder: "https://x.com/username" },
  { name: "customEmailLink", label: "CUSTOM EMAIL LINK", placeholder: "mailto:nama@email.com" },
];

// Class Tailwind input dipakai berulang, jadi disimpan dalam satu konstanta.
const inputClass =
  "w-full border-2 border-black p-3 font-mono text-xs focus:bg-neutral-50 focus:outline-none shadow-neo-sm";

export const ContactSettingsForm: FC = () => {
  // State utama: berisi seluruh nilai form. Nilai awal diambil dari data tiruan.
  const [form, setForm] = useState<ContactSettings>(mockContactSettings);

  // State untuk menampilkan pesan sukses setelah tombol simpan ditekan.
  const [saved, setSaved] = useState(false);

  /**
   * Handler perubahan input (dipakai semua input).
   * - `e.target.name`  = nama field yang sedang diketik (misal "email").
   * - `e.target.value` = isi terbaru input.
   * - `[name]: value`  = "computed property", memperbarui hanya field yang berubah.
   * - `...prev`        = menyalin field lain agar tidak hilang (state tidak boleh diubah langsung/mutasi).
   */
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSaved(false); // Sembunyikan pesan sukses saat pengguna mengedit lagi
  };

  // Handler saat form dikirim (tombol "Save Changes" ditekan).
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault(); // Cegah reload halaman bawaan browser
    // TODO (Firestore): panggil fungsi service untuk menyimpan `form` ke database di sini.
    console.log("Data kontak (simulasi simpan):", form);
    setSaved(true);
  };

  return (
    <div>
      {/* Judul halaman */}
      <div className="pb-6 mb-8 border-b-2 border-black">
        <h2 className="text-2xl font-black uppercase tracking-tight text-black">
          CONTACT &amp; SOCIAL
        </h2>
        <p className="font-mono text-xs text-neutral-600 mt-1">
          Atur informasi kontak dan tautan sosial media yang tampil di halaman publik.
        </p>
      </div>

      {/* Notifikasi sukses: hanya dirender jika `saved` bernilai true (conditional rendering) */}
      {saved && (
        <div className="mb-6 p-4 border-2 border-black shadow-neo bg-[#bef264] flex items-center gap-3 font-mono text-xs font-bold max-w-3xl">
          <CheckCircle2 className="w-5 h-5 text-black stroke-[2.5]" />
          <span>Perubahan tersimpan (simulasi lokal, belum ke Firestore).</span>
        </div>
      )}

      {/* Grid responsif: 1 kolom di HP, 2 kolom di layar xl agar form dan preview berdampingan */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 items-start">
        <form
          onSubmit={handleSubmit}
          className="xl:col-span-3 bg-white border-2 border-black p-6 sm:p-8 shadow-neo space-y-8"
        >
          {/* Bagian 1: Kontak langsung */}
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

          {/* Bagian 2: Sosial media. Dirender dengan .map() dari array socialFields */}
          <fieldset className="space-y-5">
            <legend className="flex items-center gap-2 text-sm font-black uppercase tracking-wider mb-4">
              <span className="w-7 h-7 bg-[#bef264] border-2 border-black flex items-center justify-center">
                <Link2 className="w-4 h-4" />
              </span>
              SOCIAL MEDIA LINKS
            </legend>

            {/* Di tablet ke atas, input sosial dibagi 2 kolom */}
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

          {/* Tombol simpan dengan efek taktil neo-brutalism saat ditekan */}
          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#bef264] hover:bg-[#a3e635] border-2 border-black shadow-neo text-xs font-black uppercase tracking-wider cursor-pointer transition-all duration-100 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          >
            <Save className="w-4 h-4 stroke-[2.5]" />
            <span>SAVE CHANGES</span>
          </button>
        </form>

        {/* Kartu pratinjau langsung: otomatis berubah saat state `form` berubah */}
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
