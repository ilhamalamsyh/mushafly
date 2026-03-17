import type { JadwalShalatEntry } from "../../types/shalat";

interface JadwalShalatTableProps {
  rows: JadwalShalatEntry[];
  highlightTanggalLengkap?: string;
}

export default function JadwalShalatTable({
  rows,
  highlightTanggalLengkap,
}: JadwalShalatTableProps) {
  const today = new Date().toISOString().split("T")[0];
  const highlight = highlightTanggalLengkap || today;

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <tr>
            <th className="px-3 py-3 text-left font-semibold text-black dark:text-white min-w-[50px]">
              No
            </th>
            <th className="px-3 py-3 text-left font-semibold text-black dark:text-white min-w-[80px]">
              Hari
            </th>
            <th className="px-3 py-3 text-left font-semibold text-black dark:text-white min-w-[80px]">
              Tanggal
            </th>
            <th className="px-3 py-3 text-center font-semibold text-black dark:text-white min-w-[70px]">
              Imsak
            </th>
            <th className="px-3 py-3 text-center font-semibold text-black dark:text-white min-w-[70px]">
              Subuh
            </th>
            <th className="px-3 py-3 text-center font-semibold text-black dark:text-white min-w-[70px]">
              Terbit
            </th>
            <th className="px-3 py-3 text-center font-semibold text-black dark:text-white min-w-[70px]">
              Dhuha
            </th>
            <th className="px-3 py-3 text-center font-semibold text-black dark:text-white min-w-[70px]">
              Dzuhur
            </th>
            <th className="px-3 py-3 text-center font-semibold text-black dark:text-white min-w-[70px]">
              Ashar
            </th>
            <th className="px-3 py-3 text-center font-semibold text-black dark:text-white min-w-[70px]">
              Maghrib
            </th>
            <th className="px-3 py-3 text-center font-semibold text-black dark:text-white min-w-[70px]">
              Isya
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((entry, idx) => {
            const isToday = entry.tanggal_lengkap === highlight;
            return (
              <tr
                key={idx}
                className={`border-b border-gray-200 dark:border-gray-700 transition-colors ${
                  isToday
                    ? "bg-cyan-500/20"
                    : idx % 2 === 0
                      ? "bg-white dark:bg-gray-900"
                      : "bg-gray-50 dark:bg-gray-800"
                }`}
              >
                <td
                  className={`px-3 py-2 font-medium ${
                    isToday
                      ? "text-cyan-600 dark:text-cyan-400"
                      : "text-black dark:text-white"
                  }`}
                >
                  {entry.tanggal}
                </td>
                <td
                  className={`px-3 py-2 ${
                    isToday
                      ? "text-cyan-600 dark:text-cyan-400"
                      : "text-black dark:text-white"
                  }`}
                >
                  {entry.hari}
                </td>
                <td
                  className={`px-3 py-2 ${
                    isToday
                      ? "text-cyan-600 dark:text-cyan-400"
                      : "text-black dark:text-white"
                  }`}
                >
                  {entry.tanggal_lengkap}
                </td>
                <td
                  className={`px-3 py-2 text-center font-mono ${
                    isToday
                      ? "text-cyan-600 dark:text-cyan-400"
                      : "text-black dark:text-white"
                  }`}
                >
                  {entry.imsak}
                </td>
                <td
                  className={`px-3 py-2 text-center font-mono ${
                    isToday
                      ? "text-cyan-600 dark:text-cyan-400"
                      : "text-black dark:text-white"
                  }`}
                >
                  {entry.subuh}
                </td>
                <td
                  className={`px-3 py-2 text-center font-mono ${
                    isToday
                      ? "text-cyan-600 dark:text-cyan-400"
                      : "text-black dark:text-white"
                  }`}
                >
                  {entry.terbit}
                </td>
                <td
                  className={`px-3 py-2 text-center font-mono ${
                    isToday
                      ? "text-cyan-600 dark:text-cyan-400"
                      : "text-black dark:text-white"
                  }`}
                >
                  {entry.dhuha}
                </td>
                <td
                  className={`px-3 py-2 text-center font-mono ${
                    isToday
                      ? "text-cyan-600 dark:text-cyan-400"
                      : "text-black dark:text-white"
                  }`}
                >
                  {entry.dzuhur}
                </td>
                <td
                  className={`px-3 py-2 text-center font-mono ${
                    isToday
                      ? "text-cyan-600 dark:text-cyan-400"
                      : "text-black dark:text-white"
                  }`}
                >
                  {entry.ashar}
                </td>
                <td
                  className={`px-3 py-2 text-center font-mono ${
                    isToday
                      ? "text-cyan-600 dark:text-cyan-400"
                      : "text-black dark:text-white"
                  }`}
                >
                  {entry.maghrib}
                </td>
                <td
                  className={`px-3 py-2 text-center font-mono ${
                    isToday
                      ? "text-cyan-600 dark:text-cyan-400"
                      : "text-black dark:text-white"
                  }`}
                >
                  {entry.isya}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
