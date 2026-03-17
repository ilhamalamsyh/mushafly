import { useEffect, useState } from "react";

interface DoaSearchBarProps {
  searchQuery: string;
  onSearch: (query: string) => void;
}

const DoaSearchBar = ({ searchQuery, onSearch }: DoaSearchBarProps) => {
  const [value, setValue] = useState(searchQuery);

  useEffect(() => {
    setValue(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      onSearch(value);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [onSearch, value]);

  return (
    <div className="relative w-full">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-black/50 dark:text-white/50">
        Cari
      </span>
      <input
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Cari doa berdasarkan nama, isi, atau kategori..."
        className="w-full rounded-xl border border-[#e2d9c5] bg-white py-3 pl-14 pr-10 text-sm text-black placeholder:text-black/50 focus-visible:ring-2 focus-visible:ring-emerald-500 dark:border-[#1e2d4a] dark:bg-[#0f1a30] dark:text-white dark:placeholder:text-white/50"
      />
      {value ? (
        <button
          type="button"
          onClick={() => setValue("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs text-black/70 hover:bg-black/10 dark:text-white/70 dark:hover:bg-white/10"
          aria-label="Hapus pencarian"
        >
          x
        </button>
      ) : null}
    </div>
  );
};

export default DoaSearchBar;
