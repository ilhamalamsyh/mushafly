import { useEffect, useRef, useState } from "react";

interface KabkotaSelectProps {
  kabkotaList: string[];
  selectedKabkota: string;
  selectedProvinsi: string;
  isLoading: boolean;
  onChange: (value: string) => void;
}

const KabkotaSelect = ({
  kabkotaList,
  selectedKabkota,
  selectedProvinsi,
  isLoading,
  onChange,
}: KabkotaSelectProps) => {
  const isDisabled = !selectedProvinsi || isLoading || kabkotaList.length === 0;
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    if (isDisabled) {
      setIsOpen(false);
    }
  }, [isDisabled]);

  const selectedLabel = selectedKabkota
    ? selectedKabkota
    : isLoading
      ? "Memuat..."
      : !selectedProvinsi
        ? "Pilih provinsi dulu"
        : "Pilih kabupaten/kota";

  return (
    <div ref={containerRef} className="relative block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-black/70 dark:text-white/70">
        Kabupaten / Kota
      </span>

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        disabled={isDisabled}
        className="flex w-full items-center justify-between rounded-xl border border-[#e2d9c5] bg-white px-3 py-2.5 text-left text-sm text-black transition-colors disabled:cursor-not-allowed disabled:opacity-60 dark:border-[#1e2d4a] dark:bg-[#0f1a30] dark:text-white"
      >
        <span
          className={selectedKabkota ? "" : "text-black/60 dark:text-white/60"}
        >
          {selectedLabel}
        </span>
        <span className="text-xs">▾</span>
      </button>

      {isOpen ? (
        <div className="absolute left-0 top-full z-30 mt-2 max-h-64 w-full overflow-auto rounded-xl border border-[#e2d9c5] bg-white p-1 shadow-lg dark:border-[#1e2d4a] dark:bg-[#0f1a30]">
          {kabkotaList.map((kabkota) => (
            <button
              key={kabkota}
              type="button"
              onClick={() => {
                onChange(kabkota);
                setIsOpen(false);
              }}
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                selectedKabkota === kabkota
                  ? "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-200"
                  : "text-black hover:bg-[#f6ebd5] dark:text-white dark:hover:bg-[#1a2a48]"
              }`}
            >
              {kabkota}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default KabkotaSelect;
