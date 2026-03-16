import { Link } from "react-router-dom";
import { ROUTES } from "../constants";
import { useQuranStore } from "../stores/quran.store";

const Navbar = () => {
  const bookmarks = useQuranStore((state) => state.bookmarks.length);
  const theme = useQuranStore((s) => s.theme);
  const toggleTheme = useQuranStore((s) => s.toggleTheme);

  return (
    <header className="sticky top-4 z-20 px-4">
      <nav className="glass-card mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full items-center justify-between">
          <Link
            to={ROUTES.home}
            className="text-lg font-semibold tracking-tight text-ink"
          >
            Musahfly
          </Link>
          <div className="sm:hidden">
            <button
              onClick={() => toggleTheme()}
              className="rounded-lg bg-white/60 p-2 text-sm"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? "🌙" : "☀️"}
            </button>
          </div>
        </div>

        <div className="hidden items-center gap-3 sm:flex">
          <div className="rounded-xl bg-ink/10 px-3 py-1 text-xs font-medium text-ink">
            Bookmarks: {bookmarks}
          </div>
          <button
            onClick={() => toggleTheme()}
            className="rounded-xl bg-white/60 px-3 py-1 text-xs font-medium"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? "🌙" : "☀️"}
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
