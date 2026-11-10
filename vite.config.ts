import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import fs from "node:fs";
import path from "node:path";

/**
 * Plugin Vite: Local File Upload & Auto-Cleanup Handler
 *
 * Mengizinkan admin dashboard mengunggah berkas fisik langsung ke folder
 * `public/uploads/` selama proses development tanpa memerlukan Firebase Blaze Plan.
 * 
 * Fitur Manajemen File Bersih:
 * 1. Upload Berkas Baru (`POST /api/upload`)
 * 2. Hapus Berkas Lama / Timpa (`DELETE /api/upload` atau payload `previousUrl`)
 *    sehingga folder `public/uploads/` tidak menumpuk berkas sampah (*orphaned files*).
 */
function localUploadPlugin(): Plugin {
  return {
    name: "vite-plugin-local-upload",
    configureServer(server) {
      const uploadDir = path.resolve(process.cwd(), "public/uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Handler untuk menghapus berkas fisik yang tidak terpakai
      const deletePhysicalFile = (fileUrl: string) => {
        if (!fileUrl || !fileUrl.startsWith("/uploads/")) return;
        const fileName = path.basename(fileUrl);
        // Jangan pernah hapus berkas .gitkeep
        if (fileName === ".gitkeep") return;

        const targetPath = path.join(uploadDir, fileName);
        if (fs.existsSync(targetPath)) {
          try {
            fs.unlinkSync(targetPath);
            console.log(`[Upload Cleaner] Berkas lama berhasil dihapus: ${fileName}`);
          } catch (err) {
            console.error(`[Upload Cleaner] Gagal menghapus berkas ${fileName}:`, err);
          }
        }
      };

      server.middlewares.use("/api/upload", (req, res) => {
        // ENDPOINT 1: DELETE FILE (Saat item dihapus atau berkas dibatalkan)
        if (req.method === "DELETE") {
          let body = "";
          req.on("data", (chunk) => (body += chunk));
          req.on("end", () => {
            try {
              const data = JSON.parse(body || "{}") as { fileUrl?: string };
              if (data.fileUrl) {
                deletePhysicalFile(data.fileUrl);
              }
              res.setHeader("Content-Type", "application/json");
              res.statusCode = 200;
              res.end(JSON.stringify({ success: true }));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: String(err) }));
            }
          });
          return;
        }

        // ENDPOINT 2: POST UPLOAD (Dengan opsi auto-cleanup file lama jika ditimpa)
        if (req.method === "POST") {
          const chunks: Buffer[] = [];
          req.on("data", (chunk) => chunks.push(chunk));
          req.on("end", () => {
            try {
              const body = Buffer.concat(chunks);
              const contentType = req.headers["content-type"] || "";
              const boundaryMatch = contentType.match(/boundary=(.+)/);

              if (!boundaryMatch) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: "No boundary found" }));
                return;
              }

              const boundary = boundaryMatch[1];
              const parts = body.toString("binary").split(`--${boundary}`);

              let savedFileName = "";
              let oldFileToDelete = "";

              for (const part of parts) {
                // Periksa apakah ada informasi berkas lama yang dikirim untuk ditimpa/dibersihkan
                if (part.includes('name="previousUrl"')) {
                  const valMatch = part.split("\r\n\r\n")[1];
                  if (valMatch) {
                    oldFileToDelete = valMatch.replace(/\r\n$/, "").trim();
                  }
                }

                const filenameMatch = part.match(/filename="(.+?)"/);
                if (filenameMatch) {
                  const originalName = filenameMatch[1];
                  savedFileName = originalName.replace(/[^a-zA-Z0-9._-]/g, "_");

                  const headerEndIndex = part.indexOf("\r\n\r\n");
                  if (headerEndIndex !== -1) {
                    const fileDataBinary = part.substring(
                      headerEndIndex + 4,
                      part.lastIndexOf("\r\n")
                    );
                    const fileBuffer = Buffer.from(fileDataBinary, "binary");
                    const filePath = path.join(uploadDir, savedFileName);

                    fs.writeFileSync(filePath, fileBuffer);
                  }
                }
              }

              if (!savedFileName) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: "No file content parsed" }));
                return;
              }

              // Jika ada berkas lama yang ditimpa dan berbeda dari yang baru, hapus berkas fisik lamanya
              if (oldFileToDelete && oldFileToDelete !== `/uploads/${savedFileName}`) {
                deletePhysicalFile(oldFileToDelete);
              }

              const publicUrl = `/uploads/${savedFileName}`;
              res.setHeader("Content-Type", "application/json");
              res.statusCode = 200;
              res.end(JSON.stringify({ url: publicUrl, success: true }));
            } catch (err) {
              console.error("Gagal memproses berkas upload:", err);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: "Internal server error" }));
            }
          });
          return;
        }

        res.statusCode = 405;
        res.end(JSON.stringify({ error: "Method not allowed" }));
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), localUploadPlugin()],
});
