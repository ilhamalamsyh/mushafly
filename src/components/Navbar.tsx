import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "../constants";
import { useQuranStore } from "../stores/quran.store";

const Navbar = () => {
  const bookmarks = useQuranStore((state) => state.bookmarks.length);
  const theme = useQuranStore((s) => s.theme);
  const toggleTheme = useQuranStore((s) => s.toggleTheme);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const location = useLocation();
  const isHomeActive = location.pathname === ROUTES.home;
  const isImsakiyahActive = location.pathname === ROUTES.imsakiyah;
  const isShalatActive = location.pathname === ROUTES.shalat;

  useEffect(() => {
    setIsDrawerOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-4 z-30 px-4">
      <nav className="glass-card mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full items-center justify-between">
          <Link
            to={ROUTES.home}
            className="text-lg font-semibold tracking-tight text-black dark:text-white"
          >
            Musahfly
          </Link>
          <div className="sm:hidden">
            <button
              onClick={() => setIsDrawerOpen((prev) => !prev)}
              className="rounded-lg bg-white/60 p-2 text-sm"
              aria-label="Toggle menu"
              aria-expanded={isDrawerOpen}
              aria-controls="mobile-nav-drawer"
            >
              {isDrawerOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        <div className="hidden items-center gap-3 sm:flex">
          <Link
            to={ROUTES.imsakiyah}
            className="rounded-xl bg-amber-600 px-3 py-1 text-xs font-semibold text-white hover:bg-amber-700"
          >
            Imsakiyah
          </Link>
          <Link
            to={ROUTES.shalat}
            className="rounded-xl bg-cyan-600 px-3 py-1 text-xs font-semibold text-white hover:bg-cyan-700"
          >
            Shalat
          </Link>
          <div className="rounded-xl bg-black/10 dark:bg-white/10 px-3 py-1 text-xs font-medium text-black dark:text-white">
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

      {isDrawerOpen ? (
        <div className="sm:hidden">
          <button
            type="button"
            aria-label="Close menu backdrop"
            className="fixed inset-0 z-30 bg-black/40"
            onClick={() => setIsDrawerOpen(false)}
          />

          <aside
            id="mobile-nav-drawer"
            className="fixed right-0 top-0 z-40 h-full w-72 border-l border-[#e2d9c5] bg-white p-4 shadow-xl transition-colors dark:border-[#1e2d4a] dark:bg-[#0f1a30]"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-black dark:text-white">
                Menu
              </p>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="rounded-lg bg-black/10 px-2 py-1 text-xs text-black dark:bg-white/10 dark:text-white"
                aria-label="Close menu"
              >
                Tutup
              </button>
            </div>

            <div className="space-y-2">
              <Link
                to={ROUTES.home}
                className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isHomeActive
                    ? "bg-amber-600 text-white hover:bg-amber-700"
                    : "text-black hover:bg-[#f6ebd5] dark:text-white dark:hover:bg-[#1a2a48]"
                }`}
              >
                Home
              </Link>
              <Link
                to={ROUTES.imsakiyah}
                className={`block rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                  isImsakiyahActive
                    ? "bg-amber-600 text-white hover:bg-amber-700"
                    : "text-black hover:bg-[#f6ebd5] dark:text-white dark:hover:bg-[#1a2a48]"
                }`}
              >
                Jadwal Imsakiyah
              </Link>
              <Link
                to={ROUTES.shalat}
                className={`block rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                  isShalatActive
                    ? "bg-cyan-600 text-white hover:bg-cyan-700"
                    : "text-black hover:bg-[#f6ebd5] dark:text-white dark:hover:bg-[#1a2a48]"
                }`}
              >
                Jadwal Shalat
              </Link>
            </div>

            <div className="mt-4 rounded-xl bg-black/10 px-3 py-2 text-xs font-medium text-black dark:bg-white/10 dark:text-white">
              Bookmarks: {bookmarks}
            </div>

            <button
              type="button"
              onClick={() => toggleTheme()}
              className="mt-3 w-full rounded-xl bg-white/70 px-3 py-2 text-sm font-medium text-black dark:bg-[#14223d] dark:text-white"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>
          </aside>
        </div>
      ) : null}
    </header>
  );
};

export default Navbar;
