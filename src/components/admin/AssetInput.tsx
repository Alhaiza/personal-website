import { useEffect, useRef, useState, type ChangeEvent, type FC } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  FileText,
  ImageIcon,
  Loader2,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import {
  uploadFileLocally,
  deleteFileLocally,
  type StorageFolder,
} from "../../services/storageService";
import { ConfirmModal } from "../common/ConfirmModal";
import { useToast } from "../common/toastContext";

/**
 * Komponen AssetInput
 *
 * Input untuk aset berkas (gambar atau dokumen PDF) yang dipakai di form admin:
 * foto profil, resume PDF, thumbnail proyek, dan gambar sertifikat.
 *
 * Fitur Utama Alur Unggah Lokal (Tanpa Biaya / Tanpa Firebase Blaze Plan):
 * 1. Unggah Fisik ke `public/uploads/`:
 *    Saat berkas dipilih melalui dialog browser, berkas dikirimkan ke endpoint
 *    Vite Dev Server `/api/upload` yang secara otomatis menyimpannya ke folder fisik
 *    `public/uploads/nama-file.ext`.
 * 2. Path Relatif Bersih untuk Firestore:
 *    Setelah unggah selesai, URL yang disimpan ke state & Cloud Firestore adalah
 *    path relatif bersih seperti `/uploads/1741234567-foto.png`.
 * 3. Kompatibel Penuh:
 *    Browser dan Vite dapat langsung membaca file dari `/uploads/...` baik di
 *    dashboard admin maupun di seluruh halaman publik (Hero, Projects, Certifications).
 * 4. Aturan Penguncian Form ("Upload First, Save Later"):
 *    Mengirimkan sinyal status unggah (`onUploadingChange`) ke form induk sehingga
 *    tombol "Save / Submit" dinonaktifkan selama proses upload berlangsung.
 */

export interface AssetInputProps {
  id: string;
  label: string;
  // Keterangan singkat di bawah label (misal "Tampil di: Hero")
  hint?: string;
  value: string;
  // Dipanggil dengan string URL terbaru setiap kali URL berubah atau unggah selesai
  onChange: (value: string) => void;
  // Callback opsional saat berkas dihapus (berguna untuk auto-sync penghapusan record ke Firestore)
  onDeleteAsset?: () => void;
  // Callback opsional ke induk untuk mengunci tombol Submit selama proses unggah
  onUploadingChange?: (isUploading: boolean) => void;
  placeholder?: string;
  // "image" menampilkan pratinjau gambar, "file" menampilkan kartu berkas dokumen
  kind?: "image" | "file";
  // Folder penyimpanan di Firebase Storage
  folder?: StorageFolder;
  // true = kotak pratinjau persegi (cocok untuk foto profil), false = 16:9
  square?: boolean;
  required?: boolean;
}

/**
 * Memeriksa apakah teks layak dianggap URL aset:
 * - diawali "/" (berkas lokal direktori public, contoh: /resume.pdf), atau
 * - URL lengkap dengan protokol http/https (termasuk secure URL Firebase Storage).
 */
const isValidAssetUrl = (text: string): boolean => {
  if (!text) return false;
  if (text.startsWith("/")) return true;
  try {
    const { protocol } = new URL(text);
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
  onDeleteAsset,
  onUploadingChange,
  placeholder,
  kind = "image",
  folder = "assets",
  square = false,
  required = false,
}) => {
  const toast = useToast();
  const trimmed = value.trim();
  const urlOk = isValidAssetUrl(trimmed);

  // Status error pemuatan pratinjau gambar
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const imageBroken = failedUrl === trimmed;

  // State untuk proses pengunggahan ke Firebase Storage
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<{
    fileName: string;
    isSuccess: boolean;
    localPreviewUrl?: string;
  } | null>(null);

  // State untuk Custom Neo-Brutalism Confirm Modal (pengganti window.confirm)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Referensi ke <input type="file"> yang disembunyikan
  const fileInputRef = useRef<HTMLInputElement>(null);
  const localPreviewUrlRef = useRef<string | null>(null);

  // Informasikan form induk setiap kali status `isUploading` berubah
  useEffect(() => {
    if (onUploadingChange) {
      onUploadingChange(isUploading);
    }
  }, [isUploading, onUploadingChange]);

  // Bersihkan object URL lokal saat komponen di-unmount agar tidak membocorkan memori
  useEffect(() => {
    return () => {
      if (localPreviewUrlRef.current) {
        URL.revokeObjectURL(localPreviewUrlRef.current);
      }
    };
  }, []);

  const clearUploadStatus = () => {
    if (localPreviewUrlRef.current) {
      URL.revokeObjectURL(localPreviewUrlRef.current);
      localPreviewUrlRef.current = null;
    }
    setUploadStatus(null);
    setUploadProgress(0);
  };

  // Saat pengguna mengetik langsung di input teks URL
  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    clearUploadStatus();
    onChange(e.target.value);
  };

  // Hapus berkas fisik yang ada di /uploads/ (misal untuk gambar hero atau resume)
  const handleRemoveExistingFile = () => {
    if (!trimmed) return;

    if (trimmed.startsWith("/uploads/")) {
      // Buka modal konfirmasi Neo-Brutalism kustom
      setIsConfirmOpen(true);
    } else {
      // Jika hanya URL eksternal biasa, langsung bersihkan tanpa konfirmasi file fisik
      clearUploadStatus();
      onChange("");
    }
  };

  // Konfirmasi hapus berkas fisik lokal setelah disetujui di modal kustom
  const handleConfirmDelete = async () => {
    setIsConfirmOpen(false);

    if (trimmed.startsWith("/uploads/")) {
      try {
        await deleteFileLocally(trimmed);
        toast.success("Physical file in public/uploads/ deleted successfully.");
      } catch (err) {
        console.warn("Failed to delete physical file:", err);
      }
    }

    clearUploadStatus();
    onChange("");

    // Panggil callback onDeleteAsset jika disediakan (misal untuk langsung sync perubahan ke Firestore)
    if (onDeleteAsset) {
      onDeleteAsset();
    }
  };

  // Saat pengguna memilih berkas dari dialog komputer/perangkat
  const handlePickFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Bersihkan pratinjau sebelumnya
    clearUploadStatus();

    // Buat URL pratinjau lokal sementara untuk visual instan saat mengunggah
    const localUrl = URL.createObjectURL(file);
    localPreviewUrlRef.current = localUrl;

    // Batasan ukuran berkas di frontend (maks 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Maximum file size is 10MB.", "FILE TOO LARGE");
      e.target.value = "";
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadStatus({
      fileName: file.name,
      isSuccess: false,
      localPreviewUrl: localUrl,
    });

    try {
      // Unggah berkas secara fisik ke folder lokal public/uploads/
      // Sertakan value lama (trimmed) agar jika ada berkas lama di /uploads/, berkas lama otomatis terhapus
      const localRelativeUrl = await uploadFileLocally({
        file,
        previousUrl: trimmed,
        onProgress: (percent) => {
          setUploadProgress(percent);
        },
      });

      // Berhasil: perbarui input form dengan path relatif lokal (/uploads/nama-file.ext)
      onChange(localRelativeUrl);
      setUploadStatus({
        fileName: file.name,
        isSuccess: true,
        localPreviewUrl: localRelativeUrl,
      });

      toast.success(
        `File "${file.name}" saved to public/uploads/!`,
        "UPLOAD SUCCESS"
      );
    } catch (err: unknown) {
      console.error("Failed to upload local file:", err);
      toast.error(
        (err as Error).message || "Failed to upload file to local storage",
        "UPLOAD FAILED"
      );
      clearUploadStatus();
    } finally {
      setIsUploading(false);
      e.target.value = ""; // Reset input file agar dapat memilih berkas yang sama jika diinginkan
    }
  };

  // Tentukan sumber gambar pratinjau
  const imageSrc =
    uploadStatus?.localPreviewUrl ||
    (urlOk && !imageBroken ? trimmed : null);

  return (
    <div>
      <label htmlFor={id} className="block text-xs font-black uppercase tracking-wider mb-1">
        {label}
      </label>
      {hint && <p className="font-mono text-[11px] text-neutral-500 mb-2">{hint}</p>}

      {/* Tampilan responsif: Input di kiri, kotak pratinjau di kanan */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 min-w-0 space-y-3">
          <input
            id={id}
            type="text"
            required={required}
            value={value}
            disabled={isUploading}
            onChange={handleTextChange}
            placeholder={placeholder}
            className="w-full border-2 border-black p-3 font-mono text-xs focus:bg-neutral-50 focus:outline-none shadow-neo-sm disabled:opacity-60 disabled:cursor-not-allowed"
          />

          {/* Input type file asli (disembunyikan) */}
          <input
            ref={fileInputRef}
            type="file"
            accept={kind === "image" ? "image/*" : ".pdf,application/pdf"}
            onChange={handlePickFile}
            disabled={isUploading}
            className="hidden"
            aria-hidden="true"
            tabIndex={-1}
          />

          {/* Tombol Pemilih Berkas & Tombol Hapus Berkas Fisik */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-[#bef264] border-2 border-black shadow-neo-sm text-xs font-black uppercase tracking-wider cursor-pointer transition-all duration-100 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin stroke-[2.5]" />
                  <span>UPLOADING ({uploadProgress}%)</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 stroke-[2.5]" />
                  <span>{kind === "image" ? "UPLOAD IMAGE" : "UPLOAD FILE"}</span>
                </>
              )}
            </button>

            {/* Tombol Hapus Berkas Fisik jika ada file yang sedang terpasang */}
            {trimmed && !isUploading && (
              <button
                type="button"
                onClick={handleRemoveExistingFile}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#fb7185] hover:bg-[#f43f5e] border-2 border-black shadow-neo-sm text-xs font-black uppercase tracking-wider cursor-pointer transition-all duration-100 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                title="Delete attached physical file"
              >
                <Trash2 className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>DELETE FILE</span>
              </button>
            )}

            {/* Badge Lokasi Penyimpanan */}
            <span className="font-mono text-[10px] text-neutral-500 border border-black/40 px-2 py-0.5 bg-neutral-100 uppercase">
              Target: /uploads/ ({folder})
            </span>
          </div>

          {/* Progress Bar Neo-Brutalism Saat Mengunggah */}
          {isUploading && (
            <div className="p-3 border-2 border-black bg-white shadow-neo-sm space-y-2">
              <div className="flex items-center justify-between font-mono text-[11px] font-bold">
                <span className="truncate max-w-[200px]">{uploadStatus?.fileName}</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-3 border-2 border-black bg-neutral-200 overflow-hidden">
                <div
                  className="h-full bg-[#bef264] transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Status Berhasil Diunggah */}
          {!isUploading && uploadStatus?.isSuccess && (
            <div className="flex items-center justify-between gap-2 p-3 border-2 border-black bg-[#bef264] font-mono text-[11px] font-bold shadow-neo-sm">
              <div className="flex items-center gap-2 min-w-0">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-black stroke-[2.5]" />
                <span className="truncate">
                  <strong>{uploadStatus.fileName}</strong> saved in <code>/uploads/</code>!
                </span>
              </div>
              <button
                type="button"
                onClick={clearUploadStatus}
                aria-label="Close file notification"
                className="p-1 border border-black bg-white hover:bg-neutral-100 cursor-pointer shadow-neo-sm"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Peringatan jika format URL tidak valid */}
          {trimmed && !urlOk && !isUploading && (
            <p className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-red-700">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Use complete URL (https://...) or local path starting with "/".</span>
            </p>
          )}
        </div>

        {/* Kotak Pratinjau Neo-Brutalism */}
        <div
          className={`w-full sm:w-44 shrink-0 border-2 border-black bg-neutral-100 shadow-neo-sm overflow-hidden flex items-center justify-center relative ${
            kind === "image" ? (square ? "aspect-square" : "aspect-video") : "min-h-24"
          }`}
          aria-label={`Preview ${label}`}
        >
          {isUploading && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex flex-col items-center justify-center text-white p-2 text-center">
              <Loader2 className="w-6 h-6 animate-spin mb-1 text-[#bef264]" />
              <span className="font-mono text-[10px] font-black">{uploadProgress}%</span>
            </div>
          )}

          {kind === "image" ? (
            imageSrc ? (
              <img
                src={imageSrc}
                alt={`Preview ${label}`}
                onError={() => !uploadStatus?.localPreviewUrl && setFailedUrl(trimmed)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="p-3 text-center font-mono text-[11px] font-bold uppercase text-neutral-500">
                <ImageIcon className="w-6 h-6 mx-auto mb-1 stroke-1" />
                {trimmed && urlOk && imageBroken ? "BROKEN IMAGE" : "NO IMAGE YET"}
              </div>
            )
          ) : (
            <div className="p-3 text-center font-mono text-[11px] font-bold w-full">
              <FileText className="w-7 h-7 mx-auto mb-1 stroke-1 text-black" />
              {uploadStatus?.fileName ? (
                <span className="break-all text-[10px] leading-tight block">
                  {uploadStatus.fileName}
                </span>
              ) : urlOk ? (
                <a
                  href={trimmed}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 underline break-all text-black hover:text-neutral-600"
                >
                  <span>VIEW FILE</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              ) : (
                <span className="uppercase text-neutral-500">NO FILE YET</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Neo-Brutalism Modal Konfirmasi Hapus Berkas Fisik Kustom */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        title="DELETE PHYSICAL FILE?"
        message={`Are you sure you want to permanently delete "${trimmed.replace("/uploads/", "")}" from public/uploads/? This action cannot be undone.`}
        confirmLabel="YES, DELETE FILE"
        cancelLabel="CANCEL"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
};
