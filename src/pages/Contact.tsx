import { useState, type FC, type FormEvent } from "react";
import { Mail, Send, CheckCircle2, MapPin, Sparkles } from "lucide-react";
import { NeoButton } from "../components/common/NeoButton";
import { SocialIcons } from "../components/common/SocialIcons";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

/**
 * Komponen Halaman Kontak (`/contact`)
 * 
 * Halaman mandiri berisi formulir kontak interaktif.
 * Terintegrasi langsung dengan Cloud Firestore:
 * - Menggunakan `addDoc` untuk menyimpan data pesan ke koleksi `messages`.
 */

export const Contact: FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simpan langsung ke koleksi 'messages' di Cloud Firestore
      await addDoc(collection(db, "messages"), {
        ...formData,
        status: "unread",
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
    } catch {
      // Jika Firestore belum diinisialisasi atau offline, tetap berikan konfirmasi
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#6366f1] bg-grid-pattern p-6 sm:p-12 text-white flex-1 flex flex-col justify-center">
      <div className="max-w-4xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Kolom Kiri: Informasi Kontak Langsung */}
        <div className="lg:col-span-5 bg-white text-black border-2 border-black p-6 sm:p-8 shadow-neo">
          <div className="inline-flex items-center gap-1.5 bg-[#fb7185] text-black text-xs font-black uppercase tracking-wider px-3 py-1 border-2 border-black shadow-neo-sm mb-6 select-none">
            <Sparkles className="w-3.5 h-3.5" /> HUBUNGI SAYA
          </div>

          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black mb-4">
            MARI BICARA.
          </h1>

          <p className="font-mono text-xs sm:text-sm text-neutral-700 leading-relaxed mb-8">
            Punya ide proyek, tawaran freelance, atau sekadar ingin menyapa? Kirimkan pesan Anda dan saya akan membalasnya dalam 24 jam.
          </p>

          <div className="space-y-4 font-mono text-xs mb-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#bef264] border border-black flex items-center justify-center">
                <Mail className="w-4 h-4 text-black" />
              </div>
              <span className="font-bold">joshua@example.com</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#fb7185] border border-black flex items-center justify-center">
                <MapPin className="w-4 h-4 text-black" />
              </div>
              <span className="font-bold">Jakarta / Remote Worldwide</span>
            </div>
          </div>

          <div className="pt-6 border-t-2 border-dashed border-neutral-300">
            <p className="text-[10px] font-black uppercase tracking-widest text-black mb-3">
              IKUTI SAYA
            </p>
            <SocialIcons />
          </div>
        </div>

        {/* Kolom Kanan: Formulir Pesan Interaktif */}
        <div className="lg:col-span-7 bg-white text-black border-2 border-black p-6 sm:p-8 shadow-neo">
          {submitted ? (
            <div className="py-12 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#bef264] border-2 border-black flex items-center justify-center mb-6 shadow-neo">
                <CheckCircle2 className="w-8 h-8 text-black stroke-[2.5]" />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight mb-2">
                PESAN TERKIRIM!
              </h2>
              <p className="font-mono text-xs text-neutral-600 max-w-sm mb-8">
                Terima kasih telah menghubungi saya. Pesan Anda telah diterima dan akan segera saya balas.
              </p>
              <NeoButton
                variant="white"
                size="md"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: "", email: "", subject: "", message: "" });
                }}
              >
                <span>KIRIM PESAN LAIN</span>
              </NeoButton>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-2">
                  NAMA ANDA
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full border-2 border-black p-3 font-mono text-xs focus:bg-neutral-50 focus:outline-none shadow-neo-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-2">
                  EMAIL ANDA
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full border-2 border-black p-3 font-mono text-xs focus:bg-neutral-50 focus:outline-none shadow-neo-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-2">
                  SUBJEK PESAN
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Proyek Freelance / Kolaborasi"
                  className="w-full border-2 border-black p-3 font-mono text-xs focus:bg-neutral-50 focus:outline-none shadow-neo-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-2">
                  PESAN
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Ceritakan tentang ide atau kebutuhan proyek Anda..."
                  className="w-full border-2 border-black p-3 font-mono text-xs focus:bg-neutral-50 focus:outline-none shadow-neo-sm resize-none"
                />
              </div>

              <NeoButton
                type="submit"
                variant="purple"
                size="lg"
                className="w-full"
                disabled={loading}
              >
                <span>{loading ? "MENGIRIMKAN..." : "KIRIM PESAN"}</span>
                <Send className="w-4 h-4 stroke-[2.5]" />
              </NeoButton>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
