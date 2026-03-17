import type { ImsakiyahEntry } from "../../models/imsakiyah.model";

interface JadwalTableProps {
  rows: ImsakiyahEntry[];
  highlightDay: number;
}

const columns: Array<keyof ImsakiyahEntry | "no"> = [
  "no",
  "tanggal",
  "imsak",
  "subuh",
  "terbit",
  "dhuha",
  "dzuhur",
  "ashar",
  "maghrib",
  "isya",
];

const columnLabel: Record<(typeof columns)[number], string> = {
  no: "No",
  tanggal: "Tanggal",
  imsak: "Imsak",
  subuh: "Subuh",
  terbit: "Terbit",
  dhuha: "Dhuha",
  dzuhur: "Dzuhur",
  ashar: "Ashar",
  maghrib: "Maghrib",
  isya: "Isya",
};

const JadwalTable = ({ rows, highlightDay }: JadwalTableProps) => {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[#e2d9c5] bg-white dark:border-[#1e2d4a] dark:bg-[#0f1a30]">
      <table className="min-w-[920px] w-full border-collapse text-sm">
        <thead>
          <tr className="sticky top-0 z-10 bg-[#fdf6e3] dark:bg-[#14223d]">
            {columns.map((column) => (
              <th
                key={column}
                className="whitespace-nowrap border-b border-[#e2d9c5] px-3 py-2 text-left font-semibold text-black dark:border-[#1e2d4a] dark:text-white"
              >
                {columnLabel[column]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, 30).map((row, index) => {
            const isToday = row.tanggal === highlightDay;

            return (
              <tr
                key={`${row.tanggal}-${index}`}
                className={
                  isToday ? "bg-amber-100/80 dark:bg-amber-500/20" : ""
                }
              >
                <td className="border-b border-[#f0e8d8] px-3 py-2 text-black dark:border-[#1e2d4a] dark:text-white">
                  {index + 1}
                </td>
                <td className="border-b border-[#f0e8d8] px-3 py-2 text-black dark:border-[#1e2d4a] dark:text-white">
                  {row.tanggal}
                </td>
                <td className="border-b border-[#f0e8d8] px-3 py-2 font-mono text-black dark:border-[#1e2d4a] dark:text-white">
                  {row.imsak}
                </td>
                <td className="border-b border-[#f0e8d8] px-3 py-2 font-mono text-black dark:border-[#1e2d4a] dark:text-white">
                  {row.subuh}
                </td>
                <td className="border-b border-[#f0e8d8] px-3 py-2 font-mono text-black dark:border-[#1e2d4a] dark:text-white">
                  {row.terbit}
                </td>
                <td className="border-b border-[#f0e8d8] px-3 py-2 font-mono text-black dark:border-[#1e2d4a] dark:text-white">
                  {row.dhuha}
                </td>
                <td className="border-b border-[#f0e8d8] px-3 py-2 font-mono text-black dark:border-[#1e2d4a] dark:text-white">
                  {row.dzuhur}
                </td>
                <td className="border-b border-[#f0e8d8] px-3 py-2 font-mono text-black dark:border-[#1e2d4a] dark:text-white">
                  {row.ashar}
                </td>
                <td className="border-b border-[#f0e8d8] px-3 py-2 font-mono font-semibold text-amber-700 dark:border-[#1e2d4a] dark:text-amber-300">
                  {row.maghrib}
                </td>
                <td className="border-b border-[#f0e8d8] px-3 py-2 font-mono text-black dark:border-[#1e2d4a] dark:text-white">
                  {row.isya}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default JadwalTable;
