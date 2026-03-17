interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <label className="flex items-center gap-2 rounded-xl border border-white/60 dark:border-white/20 bg-white/60 dark:bg-white/10 px-3 py-2">
      <span className="text-sm text-black/70 dark:text-white/70">Search</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="nama, arabic, nomor, arti"
        className="w-full bg-transparent text-sm text-black dark:text-white placeholder:text-black/50 dark:placeholder:text-white/50"
      />
    </label>
  );
};

export default SearchBar;
