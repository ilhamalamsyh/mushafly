import type { JadwalShalatData } from "../../types/shalat";

interface TodayShalatCardProps {
  jadwal: JadwalShalatData | null;
}

export default function TodayShalatCard({ jadwal }: TodayShalatCardProps) {
  if (!jadwal) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-gray-500 dark:text-gray-400">
        <span className="text-4xl mb-4">⏰</span>
        <p>Tidak ada jadwal untuk hari ini</p>
      </div>
    );
  }

  const today = new Date().toISOString().split("T")[0];
  const todayEntry = jadwal.jadwal.find(
    (entry: (typeof jadwal.jadwal)[0]) => entry.tanggal_lengkap === today,
  );

  if (!todayEntry) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-gray-500 dark:text-gray-400">
        <span className="text-4xl mb-4">⏰</span>
        <p>Tidak ada jadwal untuk hari ini</p>
      </div>
    );
  }

  const prayerTimes = [
    { label: "Imsak", time: todayEntry.imsak, icon: "🌘" },
    { label: "Subuh", time: todayEntry.subuh, icon: "🌄" },
    { label: "Terbit", time: todayEntry.terbit, icon: "🌅" },
    { label: "Dhuha", time: todayEntry.dhuha, icon: "☀️" },
    { label: "Dzuhur", time: todayEntry.dzuhur, icon: "☀️" },
    { label: "Ashar", time: todayEntry.ashar, icon: "🌤️" },
    { label: "Maghrib", time: todayEntry.maghrib, icon: "🌆" },
    { label: "Isya", time: todayEntry.isya, icon: "🌙" },
  ];

  // Simple logic: current time compared to prayer time
  const getCurrentPrayerIndex = () => {
    const now = new Date();
    const currentTimeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    let nextIndex = 0;
    for (let i = 0; i < prayerTimes.length; i++) {
      if (currentTimeStr < prayerTimes[i].time) {
        nextIndex = i;
        break;
      }
      nextIndex = i + 1;
    }
    return nextIndex % prayerTimes.length;
  };

  const activePrayerIndex = getCurrentPrayerIndex();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {prayerTimes.map((prayer, idx) => {
        const isActive = idx === activePrayerIndex;
        return (
          <div
            key={prayer.label}
            className={`p-4 rounded-lg border-2 transition-all ${
              isActive
                ? "border-cyan-500 bg-cyan-500/10"
                : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
            }`}
          >
            <div className={`flex flex-col items-center text-center gap-2`}>
              <span className="text-3xl">{prayer.icon}</span>
              <p
                className={`text-xs font-semibold uppercase tracking-wide ${
                  isActive
                    ? "text-cyan-600 dark:text-cyan-400"
                    : "text-black dark:text-white"
                }`}
              >
                {prayer.label}
              </p>
              <p
                className={`text-sm font-mono font-semibold ${
                  isActive
                    ? "text-cyan-600 dark:text-cyan-400"
                    : "text-black dark:text-white"
                }`}
              >
                {prayer.time}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
