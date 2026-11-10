import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  type UploadTaskSnapshot,
} from "firebase/storage";
import { storage } from "../lib/firebase";

/**
 * Service Layer: Media Asset Storage
 *
 * Mendukung dua mode penyimpanan berkas:
 * 1. Mode Lokal (`public/uploads/`):
 *    - Ideal untuk pengembangan lokal, tanpa memerlukan upgrade Firebase Blaze Plan.
 *    - Berkas disimpan di folder `public/uploads/` via dev server endpoint `/api/upload`.
 *    - Mendukung penghapusan otomatis berkas lama saat ditimpa (`previousUrl`) atau saat dihapus (`deleteFileLocally`).
 * 2. Mode Cloud Firebase Storage:
 *    - Digunakan jika Firebase Storage (Blaze Plan) diaktifkan.
 */

export type StorageFolder = "profiles" | "resumes" | "projects" | "certifications" | "assets";

export interface UploadAssetOptions {
  folder: StorageFolder;
  file: File;
  previousUrl?: string;
  onProgress?: (percent: number) => void;
}

/**
 * Membersihkan nama berkas agar aman dari karakter aneh dan spasi.
 */
export const sanitizeFileName = (fileName: string): string => {
  const lastDot = fileName.lastIndexOf(".");
  const ext = lastDot !== -1 ? fileName.slice(lastDot).toLowerCase() : "";
  const base = lastDot !== -1 ? fileName.slice(0, lastDot) : fileName;

  const cleanBase = base
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 50);

  return `${cleanBase}${ext}`;
};

/**
 * Unggah ke folder lokal `public/uploads/` melalui Vite Dev Server Middleware
 * Jika `previousUrl` disertakan, server akan otomatis menghapus berkas lama agar tidak menumpuk sampah.
 */
export const uploadFileLocally = async ({
  file,
  previousUrl,
  onProgress,
}: {
  file: File;
  previousUrl?: string;
  onProgress?: (percent: number) => void;
}): Promise<string> => {
  if (onProgress) onProgress(20);

  const cleanName = `${Date.now()}-${sanitizeFileName(file.name)}`;
  const formData = new FormData();
  formData.append("file", file, cleanName);

  if (previousUrl && previousUrl.startsWith("/uploads/")) {
    formData.append("previousUrl", previousUrl);
  }

  if (onProgress) onProgress(50);

  try {
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (onProgress) onProgress(80);

    if (res.ok) {
      const data = (await res.json()) as { url: string };
      if (onProgress) onProgress(100);
      return data.url;
    }
  } catch (err) {
    console.warn("Dev upload server tidak aktif, beralih ke fallback path lokal:", err);
  }

  if (onProgress) onProgress(100);
  return `/uploads/${cleanName}`;
};

/**
 * Menghapus berkas fisik lokal di `public/uploads/` saat item proyek/sertifikasi dihapus
 */
export const deleteFileLocally = async (fileUrl?: string): Promise<boolean> => {
  if (!fileUrl || !fileUrl.startsWith("/uploads/")) return false;

  try {
    const res = await fetch("/api/upload", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileUrl }),
    });
    return res.ok;
  } catch (err) {
    console.warn("Gagal menghapus berkas fisik lokal:", err);
    return false;
  }
};

/**
 * Unggah ke Firebase Cloud Storage (Jika akun mendukung atau Blaze Plan aktif)
 */
export const uploadFileToFirebaseStorage = ({
  folder,
  file,
  onProgress,
}: UploadAssetOptions): Promise<string> => {
  return new Promise((resolve, reject) => {
    const cleanName = sanitizeFileName(file.name);
    const uniquePath = `${folder}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${cleanName}`;
    const storageReference = ref(storage, uniquePath);
    const metadata = {
      contentType: file.type || "application/octet-stream",
    };

    const uploadTask = uploadBytesResumable(storageReference, file, metadata);

    uploadTask.on(
      "state_changed",
      (snapshot: UploadTaskSnapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        if (onProgress) onProgress(progress);
      },
      (error) => {
        console.error("Firebase Storage Upload Error:", error);
        reject(error);
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadUrl);
        } catch (urlError) {
          reject(urlError);
        }
      }
    );
  });
};
