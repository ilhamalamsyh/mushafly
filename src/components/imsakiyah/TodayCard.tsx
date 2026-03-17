import type { ImsakiyahEntry } from "../../models/imsakiyah.model";

interface TodayCardProps {
  todayEntry: ImsakiyahEntry | null;
}

const items = [
  { key: "imsak", label: "Imsak", icon: "🌘" },
  { key: "subuh", label: "Subuh", icon: "🌄" },
  { key: "terbit", label: "Terbit", icon: "🌅" },
  { key: "dhuha", label: "Dhuha", icon: "🌤️" },
  { key: "dzuhur", label: "Dzuhur", icon: "☀️" },
  { key: "ashar", label: "Ashar", icon: "🌇" },
  { key: "maghrib", label: "Maghrib", icon: "🌆" },
  { key: "isya", label: "Isya", icon: "🌙" },
] as const;

const TodayCard = ({ todayEntry }: TodayCardProps) => {
  if (!todayEntry) {
    return (
      <div className="rounded-2xl border border-[#e2d9c5] bg-white px-6 py-8 text-center dark:border-[#1e2d4a] dark:bg-[#0f1a30]">
        <p className="text-sm text-black/70 dark:text-white/70">
          Jadwal hari ini tidak ditemukan untuk tanggal saat ini.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#e2d9c5] bg-white p-5 dark:border-[#1e2d4a] dark:bg-[#0f1a30]">
      <div className="mb-4">
        <p className="text-xs uppercase tracking-[0.2em] text-black/70 dark:text-white/70">
          Hari Ini
        </p>
        <h3 className="text-xl font-semibold text-black dark:text-white">
          Tanggal {todayEntry.tanggal} Ramadhan
        </h3>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.key}
            className="rounded-xl border border-[#efe4ce] bg-[#fffaf0] px-3 py-3 dark:border-[#1e2d4a] dark:bg-[#14223d]"
          >
            <p className="text-xs text-black/60 dark:text-white/60">
              {item.icon} {item.label}
            </p>
            <p className="mt-1 font-mono text-lg font-semibold text-amber-700 dark:text-amber-300">
              {todayEntry[item.key]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodayCard;
