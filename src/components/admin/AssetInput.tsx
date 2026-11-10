import { useEffect, useRef, useState, type ChangeEvent, type FC } from "react";
import { AlertCircle, ExternalLink, FileText, ImageIcon, Upload, X } from "lucide-react";

/**
 * Komponen AssetInput
 *
 * Input untuk aset (gambar atau berkas) yang dipakai ulang di banyak form admin:
 * foto profil, resume, gambar proyek, dan gambar sertifikat.
 *
 * Isi komponen:
 * 1. Kolom URL        -> nilai yang BENAR-BENAR disimpan (string URL).
 * 2. Kotak pratinjau  -> menampilkan gambar jika URL valid, atau pesan jika kosong/salah.
 * 3. Tombol "Pilih File" -> SIMULASI. Berkas tidak diunggah ke mana pun; hanya untuk
 *    mencoba alur pemilihan berkas dan melihat pratinjau lokalnya.
 *
 * Konsep React yang dipelajari:
 * - Komponen "controlled" : nilai dimiliki induk (`value`), perubahan dilaporkan lewat `onChange`.
 * - useRef                : menyimpan nilai yang tidak perlu memicu render ulang (elemen input file, URL objek).
 * - useEffect (cleanup)   : membersihkan sumber daya saat komponen dilepas dari layar.
 */

interface AssetInputProps {
  id: string;
  label: string;
  // Keterangan singkat di bawah label (misal "Tampil di: Hero")
  hint?: string;
  value: string;
  // Dipanggil dengan string URL terbaru setiap pengguna mengetik
  onChange: (value: string) => void;
  placeholder?: string;
  // "image" menampilkan pratinjau gambar, "file" menampilkan kartu berkas (misal PDF)
  kind?: "image" | "file";
  // true = kotak pratinjau persegi (cocok untuk foto profil), false = 16:9
  square?: boolean;
  required?: boolean;
}

/**
 * Memeriksa apakah teks layak dianggap URL aset:
 * - diawali "/" (berkas milik situs sendiri, contoh: /resume.pdf), atau
 * - URL lengkap dengan protokol http/https.
 * Dibuat di luar komponen karena tidak bergantung pada state/props.
 */
const isValidAssetUrl = (text: string): boolean => {
  if (!text) return false;
  if (text.startsWith("/")) return true;
  try {
    const { protocol } = new URL(text); // `new URL` melempar error jika format salah
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
};

export const AssetInput: FC<AssetInputProps> = ({
  id,
  label,
  hint,
  value,
  onChange,
  placeholder,
  kind = "image",
  square = false,
  required = false,
}) => {
  const trimmed = value.trim();
  const urlOk = isValidAssetUrl(trimmed);

  // Menyimpan URL gambar yang GAGAL dimuat. Gambar dianggap rusak jika URL-nya sama dengan yang gagal.
  // (Dengan cara ini tidak perlu mereset state lewat useEffect saat pengguna mengetik URL baru.)
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const imageBroken = failedUrl === trimmed;

  // Berkas yang dipilih lewat tombol simulasi (hanya untuk pratinjau lokal)
  const [picked, setPicked] = useState<{ name: string; url: string } | null>(null);

  // Referensi ke <input type="file"> yang disembunyikan, agar bisa "diklik" lewat tombol kita
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Menyimpan URL objek terakhir agar bisa dibebaskan dari memori (revoke)
  const objectUrlRef = useRef<string | null>(null);

  // Cleanup: saat komponen dilepas, bebaskan URL objek supaya tidak membocorkan memori.
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  const clearPicked = () => {
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = null;
    setPicked(null);
  };

  // Saat pengguna mengetik URL: lepas pratinjau berkas simulasi, lalu laporkan nilai ke induk
  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    clearPicked();
    onChange(e.target.value);
  };

  // Saat pengguna memilih berkas lewat dialog bawaan browser
  const handlePickFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // `?.` aman jika tidak ada berkas dipilih
    if (!file) return;
    clearPicked();
    const url = URL.createObjectURL(file); // URL sementara yang hanya hidup di browser ini
    objectUrlRef.current = url;
    setPicked({ name: file.name, url });
    e.target.value = ""; // reset agar berkas yang sama bisa dipilih lagi
  };

  // Sumber gambar untuk pratinjau: berkas simulasi diprioritaskan, lalu URL yang valid
  const imageSrc = picked?.url ?? (urlOk && !imageBroken ? trimmed : null);

  return (
    <div>
      <label htmlFor={id} className="block text-xs font-black uppercase tracking-wider mb-1">
        {label}
      </label>
      {hint && <p className="font-mono text-[11px] text-neutral-500 mb-2">{hint}</p>}

      {/* Mobile: tersusun ke bawah. Tablet ke atas: input di kiri, pratinjau di kanan. */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 min-w-0 space-y-3">
          <input
            id={id}
            type="text"
            required={required}
            value={value}
            onChange={handleTextChange}
            placeholder={placeholder}
            className="w-full border-2 border-black p-3 font-mono text-xs focus:bg-neutral-50 focus:outline-none shadow-neo-sm"
          />

          {/* Input file asli disembunyikan; tombol di bawah yang memicunya lewat ref */}
          <input
            ref={fileInputRef}
            type="file"
            accept={kind === "image" ? "image/*" : ".pdf,application/pdf"}
            onChange={handlePickFile}
            className="hidden"
            aria-hidden="true"
            tabIndex={-1}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-[#bef264] border-2 border-black shadow-neo-sm text-xs font-black uppercase tracking-wider cursor-pointer transition-all duration-100 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          >
            <Upload className="w-4 h-4 stroke-[2.5]" />
            <span>{kind === "image" ? "SELECT IMAGE" : "SELECT FILE"}</span>
          </button>

          {/* Keterangan simulasi: tampil setelah memilih berkas */}
          {picked && (
            <div className="flex items-start gap-2 p-3 border-2 border-black bg-[#fef08a] font-mono text-[11px] shadow-neo-sm">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="flex-1 min-w-0">
                <strong className="break-all">{picked.name}</strong> dipilih sebagai SIMULASI. Berkas
                belum diunggah, jadi isi kolom URL di atas agar tersimpan.
              </p>
              <button type="button" onClick={clearPicked} aria-label="Hapus pilihan berkas" className="cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Peringatan jika teks ada tetapi bukan URL yang valid */}
          {trimmed && !urlOk && !picked && (
            <p className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-red-700">
              <AlertCircle className="w-3.5 h-3.5" />
              Gunakan URL lengkap (https://...) atau path yang diawali "/".
            </p>
          )}
        </div>

        {/* Kotak pratinjau */}
        <div
          className={`w-full sm:w-44 shrink-0 border-2 border-black bg-neutral-100 shadow-neo-sm overflow-hidden flex items-center justify-center ${
            kind === "image" ? (square ? "aspect-square" : "aspect-video") : "min-h-24"
          }`}
          aria-label={`Pratinjau ${label}`}
        >
          {kind === "image" ? (
            imageSrc ? (
              <img
                src={imageSrc}
                alt={`Pratinjau ${label}`}
                // Jika gambar gagal dimuat, catat URL-nya agar pratinjau menampilkan pesan galat
                onError={() => !picked && setFailedUrl(trimmed)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="p-3 text-center font-mono text-[11px] font-bold uppercase text-neutral-500">
                <ImageIcon className="w-6 h-6 mx-auto mb-1" />
                {trimmed && urlOk && imageBroken ? "GAMBAR TIDAK DAPAT DIMUAT" : "BELUM ADA GAMBAR"}
              </div>
            )
          ) : (
            <div className="p-3 text-center font-mono text-[11px] font-bold w-full">
              <FileText className="w-7 h-7 mx-auto mb-1" />
              {picked ? (
                <span className="break-all">{picked.name}</span>
              ) : urlOk ? (
                <a
                  href={trimmed}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 underline break-all"
                >
                  <span>BUKA BERKAS</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              ) : (
                <span className="uppercase text-neutral-500">BELUM ADA BERKAS</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

