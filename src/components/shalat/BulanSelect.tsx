import { useState, useRef, useEffect } from "react";

interface BulanSelectProps {
  value: number;
  onChange: (month: number) => void;
}

const BULAN_NAMES = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export default function BulanSelect({ value, onChange }: BulanSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <label className="block text-xs font-semibold uppercase tracking-wide text-black dark:text-white mb-2">
        <div className="flex items-center gap-2">📅 Bulan</div>
      </label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 text-left text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors flex items-center justify-between"
      >
        <span>{BULAN_NAMES[value - 1]}</span>
        <span className={`transition-transform ${isOpen ? "rotate-180" : ""}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-40">
          <div className="max-h-64 overflow-auto">
            {BULAN_NAMES.map((bulan, index) => (
              <button
                key={index}
                onClick={() => {
                  onChange(index + 1);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                  value === index + 1
                    ? "bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-semibold"
                    : "text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {bulan}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
