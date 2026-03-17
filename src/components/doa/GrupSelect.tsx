interface GrupSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
}

const GrupSelect = ({ value, onChange, options }: GrupSelectProps) => {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-black/70 dark:text-white/70">
        Kategori
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-[#e2d9c5] bg-white px-3 py-2.5 text-sm text-black transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 dark:border-[#1e2d4a] dark:bg-[#0f1a30] dark:text-white"
      >
        <option value="">Semua Kategori</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
};

export default GrupSelect;
