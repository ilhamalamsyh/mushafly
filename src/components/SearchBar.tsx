interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <label className="flex items-center gap-2 rounded-xl border border-white/60 bg-white/60 px-3 py-2">
      <span className="text-sm text-ink/70">Search</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="nama, arabic, nomor, arti"
        className="w-full bg-transparent text-sm placeholder:text-ink/50"
      />
    </label>
  );
};

export default SearchBar;
