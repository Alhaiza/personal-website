import type { FC } from "react";
import {
  LayoutDashboard,
  Wrench,
  FolderGit2,
  Award,
  Briefcase,
  Link2,
  Settings,
  Mail,
  type LucideIcon,
} from "lucide-react";
import type { AdminTab } from "./adminTabs";

/**
 * Komponen AdminSidebar
 *
 * Menggambar menu samping dashboard yang DIKELOMPOKKAN menjadi 3 bagian:
 * KONTEN, HALAMAN, dan KOTAK MASUK.
 *
 * Konsep React: daripada menulis 8 tombol yang hampir sama (copy-paste),
 * kita buat DATA menu berupa array lalu merendernya dengan `.map()`.
 * Jika ingin menambah menu, cukup tambah satu baris di array `groups`.
 */

interface NavItem {
  tab: AdminTab;
  label: string;
  icon: LucideIcon;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

// Data menu. Dibuat di luar komponen agar tidak dibuat ulang setiap render.
const groups: NavGroup[] = [
  {
    title: "KONTEN",
    items: [
      { tab: "profile", label: "PROFILE & HERO", icon: LayoutDashboard },
      { tab: "skills", label: "SKILLS", icon: Wrench },
      { tab: "projects", label: "PROJECTS", icon: FolderGit2 },
      { tab: "certifications", label: "CERTIFICATIONS", icon: Award },
      { tab: "experiences", label: "EXPERIENCE", icon: Briefcase },
    ],
  },
  {
    title: "PAGES",
    items: [
      { tab: "contact", label: "CONTACT & SOCIAL", icon: Link2 },
      { tab: "settings", label: "GENERAL SETTINGS", icon: Settings },
    ],
  },
  {
    title: "INBOX",
    items: [{ tab: "messages", label: "MESSAGES", icon: Mail }],
  },
];

interface AdminSidebarProps {
  activeTab: AdminTab;
  // Fungsi yang dipanggil saat menu diklik (dikirim dari Dashboard lewat props)
  onSelect: (tab: AdminTab) => void;
  // Jumlah data per tab untuk lencana angka, contoh: { projects: 3 }
  counts: Partial<Record<AdminTab, number>>;
  // Kelas tambahan dari induk, dipakai untuk menyembunyikan/menampilkan di mobile
  className?: string;
}

export const AdminSidebar: FC<AdminSidebarProps> = ({ activeTab, onSelect, counts, className = "" }) => {
  return (
    <aside
      className={`w-full md:w-64 border-b-2 md:border-b-0 md:border-r-2 border-black bg-white p-4 sm:p-6 shrink-0 ${className}`}
    >
      <nav className="space-y-6 font-mono text-xs font-black uppercase tracking-wider" aria-label="Menu admin">
        {groups.map((group) => (
          <div key={group.title}>
            {/* Judul grup */}
            <p className="text-[10px] tracking-widest text-neutral-500 mb-2 pb-1 border-b-2 border-dashed border-neutral-300">
              {group.title}
            </p>

            <div className="space-y-2">
              {group.items.map(({ tab, label, icon: Icon }) => {
                const isActive = activeTab === tab;
                const count = counts[tab];
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => onSelect(tab)}
                    aria-current={isActive ? "page" : undefined}
                    className={`w-full flex items-center gap-3 p-3 border-2 border-black transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#bef264] shadow-neo translate-x-1"
                        : "bg-white hover:bg-neutral-50 shadow-neo-sm"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="flex-1 text-left">{label}</span>
                    {/* Lencana jumlah: hanya tampil jika ada angkanya */}
                    {count !== undefined && (
                      <span className="px-1.5 py-0.5 bg-black text-white text-[10px] leading-none">
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
};

